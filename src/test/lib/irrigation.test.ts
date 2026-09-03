import { describe, it, expect } from "vitest";
import { calculateIrrigation } from "../../lib/irrigation";

describe("irrigation scheduler", () => {
  it("flags urgent irrigation after many days without water", () => {
    const result = calculateIrrigation({
      crop: "wheat",
      areaAcres: 1,
      growthStage: "vegetative",
      soilTexture: "loamy",
      temperatureC: 30,
      daysSinceIrrigation: 12,
    });
    expect(result.needed).toBe(true);
    expect(result.waterAcreInches).toBeGreaterThan(0);
    expect(result.waterLitres).toBeGreaterThan(0);
  });

  it("does not require irrigation after a recent irrigation", () => {
    const result = calculateIrrigation({
      crop: "wheat",
      areaAcres: 2,
      growthStage: "vegetative",
      soilTexture: "clay",
      temperatureC: 25,
      daysSinceIrrigation: 1,
    });
    expect(result.urgency).toBe("not_needed");
  });

  it("increases water need for higher temperatures", () => {
    const hot = calculateIrrigation({ crop: "cotton", areaAcres: 1, growthStage: "flowering", soilTexture: "loamy", temperatureC: 38, daysSinceIrrigation: 7 });
    const mild = calculateIrrigation({ crop: "cotton", areaAcres: 1, growthStage: "flowering", soilTexture: "loamy", temperatureC: 28, daysSinceIrrigation: 7 });
    expect(hot.waterAcreInches).toBeGreaterThan(mild.waterAcreInches);
  });
});
