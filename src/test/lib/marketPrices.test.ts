import { describe, it, expect } from "vitest";
import { MARKET_PRICES, trendClass, trendSymbol, getPricesByProvince } from "../../lib/marketPrices";

describe("market prices module", () => {
  it("contains common Pakistani crop and livestock commodities", () => {
    const ids = MARKET_PRICES.map((p) => p.id);
    expect(ids).toContain("wheat-grain");
    expect(ids).toContain("cotton-seed");
    expect(ids).toContain("rice-basmati");
    expect(ids).toContain("milk");
  });

  it("returns province-specific prices", () => {
    const punjab = getPricesByProvince("punjab");
    const sindh = getPricesByProvince("sindh");
    expect(punjab.length).toBeGreaterThan(0);
    expect(sindh.length).toBeGreaterThan(0);
    expect(punjab.some((p) => p.province !== "punjab")).toBe(false);
  });

  it("includes prices for all provinces", () => {
    const provinces = ["punjab", "sindh", "kpk", "balochistan", "gb", "ajk"] as const;
    provinces.forEach((province) => {
      expect(getPricesByProvince(province).length).toBeGreaterThan(0);
    });
  });

  it("provides positive average prices", () => {
    MARKET_PRICES.forEach((item) => {
      expect(item.avgPrice).toBeGreaterThan(0);
      expect(item.minPrice).toBeLessThanOrEqual(item.maxPrice);
    });
  });

  it("returns trend symbols", () => {
    expect(trendSymbol("up")).toBe("↑");
    expect(trendSymbol("down")).toBe("↓");
    expect(trendSymbol("stable")).toBe("→");
  });

  it("returns valid CSS color classes", () => {
    expect(trendClass("up")).toContain("green");
    expect(trendClass("down")).toContain("red");
    expect(trendClass("stable")).toContain("gray");
  });
});
