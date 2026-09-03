import { describe, it, expect } from "vitest";
import { calculateSeedRequirement, getSeedRate, SEED_RATES } from "../../lib/seedRate";

describe("seedRate", () => {
  it("calculates wheat seed for 1 acre (50 kg)", () => {
    const { totalKg, rate } = calculateSeedRequirement("wheat", 1);
    expect(totalKg).toBe(50);
    expect(rate.seedRateKgPerAcre).toBe(50);
  });

  it("scales with area", () => {
    const { totalKg } = calculateSeedRequirement("wheat", 4);
    expect(totalKg).toBe(200);
  });

  it("handles fractional acres", () => {
    const { totalKg } = calculateSeedRequirement("maize", 1.5);
    expect(totalKg).toBe(15);
  });

  it("falls back to wheat for unknown crop", () => {
    const { rate } = calculateSeedRequirement("banana", 1);
    expect(rate.crop).toBe("wheat");
  });

  it("provides spacing and season info", () => {
    const rate = getSeedRate("cotton");
    expect(rate.spacingCm).toContain("cm");
    expect(rate.season).toContain("Kharif");
    expect(rate.cropUr).toBe("کپاس");
  });

  it("covers all major crops", () => {
    expect(SEED_RATES.length).toBeGreaterThanOrEqual(7);
    const ids = SEED_RATES.map((s) => s.crop);
    expect(ids).toEqual(expect.arrayContaining(["wheat", "rice", "cotton", "maize", "sugarcane", "tomato", "potato"]));
  });
});
