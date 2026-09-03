/**
 * FasalDoc Yield & Income Estimator
 * Provides conservative to optimistic yield ranges and estimated income
 * for major Pakistani crops based on per-acre averages.
 */

export interface YieldEstimate {
  crop: string;
  cropUr: string;
  unit: string;
  unitUr: string;
  lowYield: number;
  avgYield: number;
  highYield: number;
  avgPricePerUnit: number; // PKR
  lowIncome: number;
  avgIncome: number;
  highIncome: number;
}

export const CROP_YIELD_DATA: Record<string, {
  cropUr: string;
  unit: string;
  unitUr: string;
  lowPerAcre: number;
  avgPerAcre: number;
  highPerAcre: number;
  avgPrice: number;
}> = {
  wheat: { cropUr: "گندم", unit: "maunds", unitUr: "من", lowPerAcre: 28, avgPerAcre: 38, highPerAcre: 52, avgPrice: 3700 },
  rice: { cropUr: "چاول", unit: "maunds", unitUr: "من", lowPerAcre: 25, avgPerAcre: 40, highPerAcre: 60, avgPrice: 5200 },
  cotton: { cropUr: "کپاس", unit: "maunds", unitUr: "من", lowPerAcre: 12, avgPerAcre: 20, highPerAcre: 30, avgPrice: 8500 },
  sugarcane: { cropUr: "گنا", unit: "tons", unitUr: "ٹن", lowPerAcre: 32, avgPerAcre: 45, highPerAcre: 65, avgPrice: 380 },
  maize: { cropUr: "مکئی", unit: "maunds", unitUr: "من", lowPerAcre: 45, avgPerAcre: 70, highPerAcre: 100, avgPrice: 1900 },
  tomato: { cropUr: "ٹماٹر", unit: "crates (20kg)", unitUr: "پٹی (20 کلو)", lowPerAcre: 120, avgPerAcre: 180, highPerAcre: 260, avgPrice: 1100 },
  potato: { cropUr: "آلو", unit: "bags (50kg)", unitUr: "بوری (50 کلو)", lowPerAcre: 80, avgPerAcre: 120, highPerAcre: 180, avgPrice: 2300 },
};

export function estimateYield(cropId: string, acres: number): YieldEstimate {
  const data = CROP_YIELD_DATA[cropId] || CROP_YIELD_DATA.wheat;
  const lowYield = Math.round(data.lowPerAcre * acres);
  const avgYield = Math.round(data.avgPerAcre * acres);
  const highYield = Math.round(data.highPerAcre * acres);
  return {
    crop: cropId,
    cropUr: data.cropUr,
    unit: data.unit,
    unitUr: data.unitUr,
    lowYield,
    avgYield,
    highYield,
    avgPricePerUnit: data.avgPrice,
    lowIncome: lowYield * data.avgPrice,
    avgIncome: avgYield * data.avgPrice,
    highIncome: highYield * data.avgPrice,
  };
}

export function estimateFromKanal(cropId: string, kanals: number): YieldEstimate {
  return estimateYield(cropId, kanals / 8);
}
