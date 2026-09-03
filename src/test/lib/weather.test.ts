import { describe, it, expect } from "vitest";
import { computeDiseaseRisk, getCurrentMockWeather, getMockForecast, riskColor } from "../../lib/weather";

describe("weather disease risk engine", () => {
  it("returns low risk for dry, low-humidity weather", () => {
    const advisory = computeDiseaseRisk({
      tempC: 25,
      humidity: 40,
      rainfallMm: 0,
      condition: "sunny",
      location: "Test",
      forecastDay: "Today",
    });
    expect(advisory.level).toBe("low");
    expect(advisory.score).toBeLessThan(55);
  });

  it("returns severe risk for hot, humid and rainy conditions", () => {
    const advisory = computeDiseaseRisk({
      tempC: 27,
      humidity: 90,
      rainfallMm: 30,
      condition: "stormy",
      location: "Test",
      forecastDay: "Today",
    });
    expect(advisory.level).toBe("severe");
    expect(advisory.score).toBeGreaterThanOrEqual(90);
  });

  it("returns bilingual titles and messages", () => {
    const advisory = computeDiseaseRisk(getCurrentMockWeather());
    expect(advisory.title).toBeTruthy();
    expect(advisory.titleUrdu).toBeTruthy();
    expect(advisory.message).toBeTruthy();
    expect(advisory.messageUrdu).toBeTruthy();
  });

  it("provides a 5-day forecast", () => {
    const forecast = getMockForecast();
    expect(forecast).toHaveLength(5);
    expect(forecast[0].forecastDay).toBe("Today");
  });

  it("returns a color for each risk level", () => {
    expect(riskColor("low")).toMatch(/^#/);
    expect(riskColor("moderate")).toMatch(/^#/);
    expect(riskColor("high")).toMatch(/^#/);
    expect(riskColor("severe")).toMatch(/^#/);
  });
});
