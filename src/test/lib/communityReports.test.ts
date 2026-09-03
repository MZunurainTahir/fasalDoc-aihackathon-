import { describe, it, expect } from "vitest";
import { getReportsByCity, severityColor, severityLabel } from "../../lib/communityReports";
import { PAKISTAN_CITIES } from "../../lib/pakistanLocations";

const lahore = PAKISTAN_CITIES.find((c) => c.id === "lahore")!;
const karachi = PAKISTAN_CITIES.find((c) => c.id === "karachi")!;

describe("communityReports", () => {
  it("returns reports for Punjab cities", () => {
    const reports = getReportsByCity(lahore);
    expect(reports.length).toBeGreaterThan(0);
    expect(reports.every((r) => r.province === "punjab")).toBe(true);
  });

  it("returns reports for Sindh cities", () => {
    const reports = getReportsByCity(karachi);
    expect(reports.length).toBeGreaterThan(0);
    expect(reports.some((r) => r.id === "r5")).toBe(true);
  });

  it("sorts reports by newest first", () => {
    const reports = getReportsByCity(lahore);
    for (let i = 1; i < reports.length; i++) {
      expect(new Date(reports[i - 1].reportedAt).getTime())
        .toBeGreaterThanOrEqual(new Date(reports[i].reportedAt).getTime());
    }
  });

  it("maps severity to color classes", () => {
    expect(severityColor("high")).toContain("text-danger");
    expect(severityColor("medium")).toContain("text-warning");
    expect(severityColor("low")).toContain("text-success");
  });

  it("provides bilingual severity labels", () => {
    expect(severityLabel("high", "en")).toBe("High");
    expect(severityLabel("high", "ur")).toBe("زیادہ");
  });
});
