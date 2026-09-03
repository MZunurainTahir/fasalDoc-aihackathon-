import { describe, it, expect } from "vitest";
import { calculateSoilHealth } from "../../lib/soilHealth";

describe("soil health module", () => {
  it("scores loamy, neutral, high-organic soil as excellent", () => {
    const result = calculateSoilHealth({ ph: 6.8, texture: "loamy", organicMatter: "high", salinity: "none" });
    expect(result.status).toBe("excellent");
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("scores sandy, saline, low-organic soil as poor", () => {
    const result = calculateSoilHealth({ ph: 8.5, texture: "sandy", organicMatter: "low", salinity: "severe" });
    expect(result.status).toBe("poor");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("recommends lime for acidic soil", () => {
    const result = calculateSoilHealth({ ph: 5.0, texture: "loamy", organicMatter: "medium", salinity: "none" });
    const text = result.recommendations.join(" ").toLowerCase();
    expect(text).toContain("lime");
  });

  it("recommends gypsum for alkaline/sodic soil", () => {
    const result = calculateSoilHealth({ ph: 8.5, texture: "clay", organicMatter: "medium", salinity: "moderate" });
    const text = result.recommendations.join(" ").toLowerCase();
    expect(text).toContain("gypsum");
  });
});
