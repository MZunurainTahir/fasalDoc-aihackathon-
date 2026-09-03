/**
 * Irrigation scheduling helper for Pakistani crops.
 * Estimates water requirement (acre-inches per irrigation) based on crop,
 * growth stage, soil type and weather.
 */

export interface IrrigationInput {
  crop: string;
  areaAcres: number;
  growthStage: "establishment" | "vegetative" | "flowering" | "fruiting" | "maturity";
  soilTexture: "sandy" | "loamy" | "clay";
  temperatureC: number;
  daysSinceIrrigation: number;
}

export interface IrrigationAdvice {
  needed: boolean;
  urgency: "now" | "soon" | "optional" | "not_needed";
  urgencyUr: string;
  waterAcreInches: number;
  waterLitres: number;
  durationHours: number; // assuming 1 cusec flow per 10 acres
  noteEn: string;
  noteUr: string;
}

const CROP_WATER: Record<string, Record<IrrigationInput["growthStage"], number>> = {
  wheat: { establishment: 1.5, vegetative: 2.0, flowering: 2.5, fruiting: 2.0, maturity: 0.5 },
  cotton: { establishment: 1.5, vegetative: 2.0, flowering: 2.5, fruiting: 2.5, maturity: 1.0 },
  rice: { establishment: 2.5, vegetative: 3.0, flowering: 3.5, fruiting: 3.0, maturity: 1.5 },
  maize: { establishment: 1.5, vegetative: 2.0, flowering: 2.5, fruiting: 2.0, maturity: 0.5 },
  sugarcane: { establishment: 2.0, vegetative: 2.5, flowering: 2.5, fruiting: 2.0, maturity: 1.0 },
  tomato: { establishment: 1.0, vegetative: 1.5, flowering: 2.0, fruiting: 2.0, maturity: 0.5 },
  potato: { establishment: 1.0, vegetative: 1.5, flowering: 2.0, fruiting: 1.5, maturity: 0.5 },
  default: { establishment: 1.5, vegetative: 2.0, flowering: 2.5, fruiting: 2.0, maturity: 0.5 },
};

const TEXTURE_MULTIPLIER: Record<IrrigationInput["soilTexture"], number> = {
  sandy: 0.85,
  loamy: 1.0,
  clay: 1.15,
};

export function calculateIrrigation(input: IrrigationInput): IrrigationAdvice {
  const cropTable = CROP_WATER[input.crop] ?? CROP_WATER.default;
  const baseAcreInches = cropTable[input.growthStage];
  const textureFactor = TEXTURE_MULTIPLIER[input.soilTexture];
  const tempFactor = input.temperatureC > 35 ? 1.2 : input.temperatureC > 30 ? 1.1 : 1.0;

  const waterAcreInches = Number((baseAcreInches * textureFactor * tempFactor).toFixed(1));
  const totalAcreInches = Number((waterAcreInches * input.areaAcres).toFixed(1));
  const waterLitres = Math.round(totalAcreInches * 102790); // 1 acre-inch ≈ 102,790 litres
  const durationHours = Math.round((totalAcreInches / 1.98) * 10) / 10; // 1 cusec ≈ 1.98 acre-inches per 24h

  let needed = false;
  let urgency: IrrigationAdvice["urgency"] = "not_needed";
  let urgencyUr = "ضرورت نہیں";
  let noteEn = "";
  let noteUr = "";

  if (input.daysSinceIrrigation >= 10 || input.temperatureC > 38) {
    needed = true;
    urgency = "now";
    urgencyUr = "ابھی";
    noteEn = "Crop is under water stress. Irrigate immediately, preferably early morning or evening.";
    noteUr = "فصل پانی کی کمی میں ہے۔ فوری طور پر صبح یا شام کو پانی دیں۔";
  } else if (input.daysSinceIrrigation >= 6) {
    needed = true;
    urgency = "soon";
    urgencyUr = "جلد";
    noteEn = "Plan irrigation within the next 1-2 days.";
    noteUr = "اگلے 1-2 دنوں میں پانی کا انتظام کریں۔";
  } else if (input.daysSinceIrrigation >= 3 && input.growthStage === "flowering") {
    needed = true;
    urgency = "optional";
    urgencyUr = "بہتر رہے گا";
    noteEn = "Flowering stage benefits from frequent moisture; consider light irrigation.";
    noteUr = "پھول کے مرحلے میں نمی فائدہ مند ہے؛ ہلکا پانی دیں۔";
  } else {
    noteEn = "Soil moisture appears adequate for now. Re-check in 2 days.";
    noteUr = "اس وقت مٹی میں نمی کافی ہے۔ 2 دن بعد دوبارہ چیک کریں۔";
  }

  return { needed, urgency, urgencyUr, waterAcreInches, waterLitres, durationHours, noteEn, noteUr };
}
