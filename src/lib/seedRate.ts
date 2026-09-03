/**
 * FasalDoc Seed Rate Calculator
 * Calculates seed quantity (kg/acre) for major Pakistani crops
 * based on recommended sowing densities.
 */

export interface SeedRate {
  crop: string;
  cropUr: string;
  seedRateKgPerAcre: number; // kg per acre
  spacingCm: string;
  spacingCmUr: string;
  season: string;
  seasonUr: string;
}

export const SEED_RATES: SeedRate[] = [
  { crop: "wheat", cropUr: "گندم", seedRateKgPerAcre: 50, spacingCm: "15–20 cm row", spacingCmUr: "15–20 سینٹی میٹر قطار", season: "Rabi (Nov–Dec)", seasonUr: "ربیع (نومبر–دسمبر)" },
  { crop: "rice", cropUr: "چاول", seedRateKgPerAcre: 5, spacingCm: "20 × 15 cm", spacingCmUr: "20 × 15 سینٹی میٹر", season: "Kharif (Jun–Jul)", seasonUr: "خریف (جون–جولائی)" },
  { crop: "cotton", cropUr: "کپاس", seedRateKgPerAcre: 4, spacingCm: "75 × 30 cm", spacingCmUr: "75 × 30 سینٹی میٹر", season: "Kharif (Apr–May)", seasonUr: "خریف (اپریل–مئی)" },
  { crop: "maize", cropUr: "مکئی", seedRateKgPerAcre: 10, spacingCm: "75 × 20 cm", spacingCmUr: "75 × 20 سینٹی میٹر", season: "Kharif (Jun–Jul)", seasonUr: "خریف (جون–جولائی)" },
  { crop: "sugarcane", cropUr: "گنا", seedRateKgPerAcre: 8000, spacingCm: "90 cm row", spacingCmUr: "90 سینٹی میٹر قطار", season: "Feb–Mar / Sep–Oct", seasonUr: "فروری–مارچ / ستمبر–اکتوبر" },
  { crop: "tomato", cropUr: "ٹماٹر", seedRateKgPerAcre: 0.25, spacingCm: "75 × 45 cm", spacingCmUr: "75 × 45 سینٹی میٹر", season: "Year-round", seasonUr: "سال بھر" },
  { crop: "potato", cropUr: "آلو", seedRateKgPerAcre: 1200, spacingCm: "75 × 20 cm", spacingCmUr: "75 × 20 سینٹی میٹر", season: "Oct–Nov", seasonUr: "اکتوبر–نومبر" },
];

export function getSeedRate(cropId: string): SeedRate {
  return SEED_RATES.find((s) => s.crop === cropId) ?? SEED_RATES[0];
}

export function calculateSeedRequirement(cropId: string, acres: number): { totalKg: number; rate: SeedRate } {
  const rate = getSeedRate(cropId);
  return { totalKg: Math.round(rate.seedRateKgPerAcre * acres * 10) / 10, rate };
}
