import { describe, it, expect } from "vitest";
import { estimateYield, estimateFromKanal, CROP_YIELD_DATA } from "../../lib/yieldEstimator";

describe("yieldEstimator", () => {
  it("estimates wheat yield for 1 acre", () => {
    const est = estimateYield("wheat", 1);
    expect(est.avgYield).toBe(38);
    expect(est.lowYield).toBe(28);
    expect(est.highYield).toBe(52);
    expect(est.avgIncome).toBe(38 * 3700);
  });

  it("scales yield with area", () => {
    const est = estimateYield("wheat", 2);
    expect(est.avgYield).toBe(76);
    expect(est.lowIncome).toBe(56 * 3700);
  });

  it("falls back to wheat for unknown crop", () => {
    const est = estimateYield("unknown-crop", 1);
    expect(est.avgYield).toBe(38);
  });

  it("converts kanal to acres (8 kanal = 1 acre)", () => {
    const est = estimateFromKanal("wheat", 8);
    expect(est.avgYield).toBe(38);
  });

  it("has data for all major crops", () => {
    const crops = Object.keys(CROP_YIELD_DATA);
    expect(crops).toContain("wheat");
    expect(crops).toContain("rice");
    expect(crops).toContain("cotton");
    expect(crops).toContain("sugarcane");
    expect(crops).toContain("maize");
    expect(crops.length).toBeGreaterThanOrEqual(7);
  });

  it("income grows with yield", () => {
    const est = estimateYield("rice", 1);
    expect(est.lowIncome).toBeLessThan(est.avgIncome);
    expect(est.avgIncome).toBeLessThan(est.highIncome);
  });
});
