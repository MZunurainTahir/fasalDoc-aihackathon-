import { describe, it, expect } from "vitest";
import { getCurrentMonthEvents, getEventsByCrop, formatMonthRange, CROP_CALENDAR } from "../../lib/cropCalendar";

describe("crop calendar module", () => {
  it("contains events for major Pakistani crops", () => {
    const cropIds = [...new Set(CROP_CALENDAR.map((e) => e.cropId))];
    expect(cropIds).toContain("wheat");
    expect(cropIds).toContain("cotton");
    expect(cropIds).toContain("rice");
    expect(cropIds).toContain("maize");
  });

  it("returns current month events for a province", () => {
    const janEvents = getCurrentMonthEvents("punjab", 0); // January
    expect(janEvents.length).toBeGreaterThan(0);
    expect(janEvents.some((e) => e.cropId === "wheat")).toBe(true);
  });

  it("returns crop-specific events", () => {
    const wheatEvents = getEventsByCrop("wheat", "punjab");
    expect(wheatEvents.length).toBeGreaterThan(0);
    expect(wheatEvents.every((e) => e.cropId === "wheat")).toBe(true);
  });

  it("formats month ranges bilingually", () => {
    expect(formatMonthRange(0, 0, "en")).toBe("Jan");
    expect(formatMonthRange(10, 11, "en")).toContain("Nov");
  });
});
