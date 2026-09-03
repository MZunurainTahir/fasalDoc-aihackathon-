import { describe, it, expect } from "vitest";
import { PROVINCES, getCitiesByProvince, getCityById, DEFAULT_CITY } from "../../lib/pakistanLocations";

describe("Pakistan locations module", () => {
  it("covers all six provinces/regions", () => {
    const ids = PROVINCES.map((p) => p.id);
    expect(ids).toEqual(["punjab", "sindh", "kpk", "balochistan", "gb", "ajk"]);
  });

  it("has cities for every province", () => {
    PROVINCES.forEach((province) => {
      expect(getCitiesByProvince(province.id).length).toBeGreaterThan(0);
    });
  });

  it(" Lahore is the default city", () => {
    expect(DEFAULT_CITY.id).toBe("lahore");
  });

  it("can retrieve a city by id", () => {
    expect(getCityById("karachi")?.province).toBe("sindh");
    expect(getCityById("quetta")?.province).toBe("balochistan");
    expect(getCityById("gilgit")?.province).toBe("gb");
  });
});
