import { describe, it, expect } from "vitest";
import { FARMER_SCHEMES, SCHEME_CATEGORIES, getSchemesByProvince } from "../../lib/schemes";

describe("government schemes module", () => {
  it("includes representative Pakistani farmer support schemes", () => {
    const ids = FARMER_SCHEMES.map((s) => s.id);
    expect(ids).toContain("pm-kisan");
    expect(ids).toContain("crop-insurance");
    expect(ids).toContain("wheat-subsidy-pb");
    expect(ids).toContain("sindh-sla");
    expect(ids).toContain("kp-tenant-support");
  });

  it("returns province-specific schemes including federal ones", () => {
    const punjabSchemes = getSchemesByProvince("punjab");
    const ids = punjabSchemes.map((s) => s.id);
    expect(ids).toContain("pm-kisan"); // federal
    expect(ids).toContain("wheat-subsidy-pb"); // provincial
    expect(ids).not.toContain("sindh-sla"); // other province
  });

  it("provides bilingual content for every scheme", () => {
    FARMER_SCHEMES.forEach((scheme) => {
      expect(scheme.title).toBeTruthy();
      expect(scheme.titleUrdu).toBeTruthy();
      expect(scheme.summary).toBeTruthy();
      expect(scheme.summaryUrdu).toBeTruthy();
    });
  });

  it("has matching scheme categories", () => {
    const categoryIds = SCHEME_CATEGORIES.map((c) => c.id);
    FARMER_SCHEMES.forEach((scheme) => {
      expect(categoryIds).toContain(scheme.category);
    });
  });

  it("marks all listed schemes as active", () => {
    FARMER_SCHEMES.forEach((scheme) => {
      expect(scheme.active).toBe(true);
    });
  });
});
