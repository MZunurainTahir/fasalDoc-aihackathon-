/**
 * Weather-based agricultural risk engine for FasalDoc.
 * Uses OpenWeatherMap API when VITE_OPENWEATHER_API_KEY is configured,
 * otherwise falls back to realistic mock snapshots keyed by Pakistani city.
 */

import type { City } from "./pakistanLocations";
import { DEFAULT_CITY, PAKISTAN_CITIES } from "./pakistanLocations";

export type DiseaseRiskLevel = "low" | "moderate" | "high" | "severe";

export interface WeatherSnapshot {
  tempC: number;
  humidity: number; // 0-100
  rainfallMm: number; // last 24h
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
  location: string;
  forecastDay: string;
  windKph?: number;
  pressureHpa?: number;
  uvIndex?: number;
}

export interface RiskAdvisory {
  level: DiseaseRiskLevel;
  score: number; // 0-100
  title: string;
  titleUrdu: string;
  message: string;
  messageUrdu: string;
  affectedCrops: string[];
  action: string;
  actionUrdu: string;
}

const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";

function getApiKey(): string | undefined {
  return import.meta.env.VITE_OPENWEATHER_API_KEY || import.meta.env.OPENWEATHER_API_KEY || undefined;
}

const RISK_THRESHOLDS: Record<DiseaseRiskLevel, number> = {
  low: 30,
  moderate: 55,
  high: 75,
  severe: 90,
};

function riskLevelFromScore(score: number): DiseaseRiskLevel {
  if (score >= RISK_THRESHOLDS.severe) return "severe";
  if (score >= RISK_THRESHOLDS.high) return "high";
  if (score >= RISK_THRESHOLDS.moderate) return "moderate";
  return "low";
}

function riskColor(level: DiseaseRiskLevel): string {
  switch (level) {
    case "low":
      return "#16A34A"; // green-600
    case "moderate":
      return "#CA8A04"; // yellow-600
    case "high":
      return "#EA580C"; // orange-600
    case "severe":
      return "#DC2626"; // red-600
  }
}

function mapCondition(code?: string, icon?: string): WeatherSnapshot["condition"] {
  if (!code) return "sunny";
  const group = code.slice(0, 2);
  if (code === "800") return "sunny";
  if (icon?.includes("n") && code === "800") return "cloudy";
  if (["02", "03", "04"].includes(group)) return "cloudy";
  if (["09", "10"].includes(group)) return "rainy";
  if (["11", "13", "50"].includes(group)) return "stormy";
  return "cloudy";
}

/**
 * Fetch current weather for a given Pakistani city from OpenWeatherMap.
 * Returns undefined on failure so the caller can fall back to mock data.
 */
export async function fetchCurrentWeather(city: City): Promise<WeatherSnapshot | undefined> {
  const key = getApiKey();
  if (!key) return undefined;

  try {
    const url = `${OPENWEATHER_BASE}/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    return {
      tempC: Math.round(data.main.temp),
      humidity: Math.round(data.main.humidity),
      rainfallMm: data.rain?.["1h"] ? Math.round(data.rain["1h"] * 24) : data.rain?.["3h"] ? Math.round(data.rain["3h"] * 8) : 0,
      condition: mapCondition(data.weather?.[0]?.id?.toString(), data.weather?.[0]?.icon),
      location: `${city.nameEn}, ${city.province.charAt(0).toUpperCase() + city.province.slice(1)}`,
      forecastDay: "Today",
      windKph: Math.round((data.wind?.speed || 0) * 3.6),
      pressureHpa: data.main.pressure,
    };
  } catch {
    return undefined;
  }
}

/**
 * Fetch a 5-day forecast for a given city from OpenWeatherMap.
 */
export async function fetchForecast(city: City): Promise<WeatherSnapshot[] | undefined> {
  const key = getApiKey();
  if (!key) return undefined;

  try {
    const url = `${OPENWEATHER_BASE}/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    const list = data.list as Array<{
      dt_txt: string;
      main: { temp: number; humidity: number; pressure: number };
      weather: { id: number; icon: string }[];
      wind: { speed: number };
      rain?: { "3h": number };
    }>;

    // Pick one snapshot per day around midday
    const daily: Record<string, WeatherSnapshot> = {};
    for (const item of list) {
      const date = item.dt_txt.split(" ")[0];
      const hour = Number(item.dt_txt.split(" ")[1]?.split(":")[0]);
      if (!(date in daily) || Math.abs(hour - 12) < Math.abs(Number(daily[date].forecastDay.split(":")[0]) - 12)) {
        daily[date] = {
          tempC: Math.round(item.main.temp),
          humidity: Math.round(item.main.humidity),
          rainfallMm: item.rain ? Math.round(item.rain["3h"] * 8) : 0,
          condition: mapCondition(item.weather[0].id.toString(), item.weather[0].icon),
          location: `${city.nameEn}, ${city.province.charAt(0).toUpperCase() + city.province.slice(1)}`,
          forecastDay: date,
          windKph: Math.round((item.wind.speed || 0) * 3.6),
          pressureHpa: item.main.pressure,
        };
      }
    }
    const days = Object.values(daily).slice(0, 5);
    const labels = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];
    return days.map((d, i) => ({ ...d, forecastDay: labels[i] ?? d.forecastDay }));
  } catch {
    return undefined;
  }
}

/**
 * Compute a disease-risk score from weather parameters.
 * High humidity + warm temps + recent rainfall strongly favours fungal/blight outbreaks.
 */
export function computeDiseaseRisk(weather: WeatherSnapshot): RiskAdvisory {
  let score = 0;

  // Humidity contribution (most important for fungal diseases)
  if (weather.humidity >= 85) score += 40;
  else if (weather.humidity >= 70) score += 28;
  else if (weather.humidity >= 55) score += 15;

  // Temperature contribution
  if (weather.tempC >= 22 && weather.tempC <= 30) score += 25;
  else if (weather.tempC >= 18 && weather.tempC <= 32) score += 15;

  // Rainfall / leaf wetness contribution
  if (weather.rainfallMm >= 20) score += 30;
  else if (weather.rainfallMm >= 5) score += 18;
  else if (weather.rainfallMm > 0) score += 8;

  // Weather condition override
  if (weather.condition === "stormy") score += 10;
  if (weather.condition === "rainy" && weather.humidity > 75) score += 5;

  score = Math.min(100, Math.round(score));
  const level = riskLevelFromScore(score);

  const levelMeta: Record<
    DiseaseRiskLevel,
    { title: string; titleUrdu: string; message: string; messageUrdu: string; action: string; actionUrdu: string }
  > = {
    low: {
      title: "Low Disease Risk",
      titleUrdu: "بیماری کا خطرہ کم",
      message: "Weather conditions are unfavourable for fungal and bacterial disease outbreaks.",
      messageUrdu: "موسمی حالات پھپھوندی اور بیکٹیریائی بیماریوں کے پھیلاؤ کے لیے سازگار نہیں۔",
      action: "Continue regular scouting and preventive spraying as per crop calendar.",
      actionUrdu: "فصل کیلنڈر کے مطابق معمولی نگرانی اور حفاظتی اسپرے جاری رکھیں۔",
    },
    moderate: {
      title: "Moderate Disease Risk",
      titleUrdu: "درمیانہ بیماری کا خطرہ",
      message: "Humidity and temperature are rising; early blight, rust and leaf spot may appear.",
      messageUrdu: "نمی اور درجہ حرارت بڑھ رہا ہے؛ ابتدائی جھلساؤ، کنگی اور پتے کے دھبے ظاہر ہو سکتے ہیں۔",
      action: "Inspect lower leaves every 2 days. Apply preventive fungicide if forecast stays wet.",
      actionUrdu: "ہر 2 دن بعد نچلے پتے چیک کریں۔ اگر موسم گیلا رہے تو حفاظتی پھپھوند کش اسپرے کریں۔",
    },
    high: {
      title: "High Disease Risk",
      titleUrdu: "زیادہ بیماری کا خطرہ",
      message: "Warm, humid and wet conditions strongly favour late blight, rust and mastitis-causing pathogens.",
      messageUrdu: "گرم، مرطوب اور گیلے موسم میں پچھیتا جھلساؤ، کنگی اور ماسٹائیس کے جراثیم تیزی سے پھیلتے ہیں۔",
      action: "Spray recommended fungicide immediately. Ensure field drainage and teat hygiene for livestock.",
      actionUrdu: "تجویز کردہ پھپھوند کش فوری اسپرے کریں۔ نکاسی آب اور مویشیوں کی تھن کی صفائی یقینی بنائیں۔",
    },
    severe: {
      title: "Severe Outbreak Alert",
      titleUrdu: "سنگین وبا الرٹ",
      message: "Conditions are ideal for rapid spread of blight, rust and vector-borne diseases. Immediate action required.",
      messageUrdu: "پھپھوندی، کنگی اور کیڑوں سے پھیلنے والی بیماریوں کے پھیلاؤ کے لیے حالات انتہائی سازگار ہیں۔ فوری اقدام ضروری ہے۔",
      action: "Alert neighbouring farms, apply curative spray today, and contact nearest extension officer or vet.",
      actionUrdu: "ہمسایہ کھیتوں کو آگاہ کریں، آج ہی علاجی اسپرے کریں اور قریب ترین ایگری ایکسٹینشن آفیسر یا ویٹرنری سے رابطہ کریں۔",
    },
  };

  const meta = levelMeta[level];

  return {
    level,
    score,
    title: meta.title,
    titleUrdu: meta.titleUrdu,
    message: meta.message,
    messageUrdu: meta.messageUrdu,
    affectedCrops: level === "low" ? [] : ["Tomato", "Potato", "Wheat", "Cotton", "Rice"],
    action: meta.action,
    actionUrdu: meta.actionUrdu,
  };
}

/**
 * Deterministic pseudo-random generator seeded by city name and day offset.
 * Makes mock forecasts feel realistic and consistent for the same city.
 */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

function mockSnapshotForCity(city: City, dayOffset: number): WeatherSnapshot {
  const baseTemp =
    city.province === "sindh" || city.province === "balochistan"
      ? 32
      : city.province === "gb" || city.province === "ajk"
        ? 20
        : 28;
  const seed = `${city.id}-${dayOffset}-${new Date().toISOString().split("T")[0]}`;
  const r = seededRandom(seed);
  const conditions: WeatherSnapshot["condition"][] = ["sunny", "cloudy", "rainy", "stormy", "cloudy"];
  const condition = conditions[Math.floor(r * conditions.length)];
  const temp = baseTemp + Math.round((r - 0.5) * 8) - dayOffset * 1;
  const humidity = 50 + Math.round(r * 45) + (condition === "rainy" ? 15 : 0);
  const rainfall = condition === "rainy" ? 5 + Math.round(r * 25) : condition === "stormy" ? 15 + Math.round(r * 20) : 0;
  return {
    tempC: temp,
    humidity: Math.min(98, humidity),
    rainfallMm: rainfall,
    condition,
    location: `${city.nameEn}, ${city.province.charAt(0).toUpperCase() + city.province.slice(1)}`,
    forecastDay: ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"][dayOffset] ?? `Day ${dayOffset + 1}`,
    windKph: Math.round(5 + r * 20),
    pressureHpa: 1000 + Math.round(r * 30),
  };
}

export function getMockForecast(city: City = DEFAULT_CITY): WeatherSnapshot[] {
  return Array.from({ length: 5 }, (_, i) => mockSnapshotForCity(city, i));
}

export function getCurrentMockWeather(city: City = DEFAULT_CITY): WeatherSnapshot {
  return mockSnapshotForCity(city, 0);
}

/**
 * Detect user location using browser geolocation and find the nearest Pakistani city.
 */
export async function detectNearestCity(): Promise<City | undefined> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest: City | undefined;
        let minDist = Infinity;
        for (const city of PAKISTAN_CITIES) {
          const d = Math.hypot(latitude - city.lat, longitude - city.lon);
          if (d < minDist) {
            minDist = d;
            nearest = city;
          }
        }
        resolve(nearest);
      },
      () => resolve(undefined),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  });
}

export { riskColor, RISK_THRESHOLDS };
