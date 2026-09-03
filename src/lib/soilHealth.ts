/**
 * Soil health scoring and amendment recommendations for Pakistani soils.
 * Simplified advisory based on pH, texture, organic matter and salinity inputs.
 */

export interface SoilTestInput {
  ph: number;
  texture: "sandy" | "loamy" | "clay" | "silty";
  organicMatter: "low" | "medium" | "high";
  salinity: "none" | "mild" | "moderate" | "severe";
}

export interface SoilHealthResult {
  score: number;
  status: "poor" | "fair" | "good" | "excellent";
  statusUr: string;
  color: string;
  recommendations: string[];
  recommendationsUr: string[];
}

export function calculateSoilHealth(input: SoilTestInput): SoilHealthResult {
  let score = 0;

  // pH score (optimal 6.0-7.5)
  if (input.ph >= 6.0 && input.ph <= 7.5) score += 30;
  else if (input.ph >= 5.5 && input.ph <= 8.0) score += 18;
  else score += 8;

  // Texture score
  if (input.texture === "loamy") score += 25;
  else if (input.texture === "silty") score += 22;
  else if (input.texture === "clay") score += 18;
  else score += 12; // sandy

  // Organic matter
  if (input.organicMatter === "high") score += 25;
  else if (input.organicMatter === "medium") score += 18;
  else score += 8;

  // Salinity
  if (input.salinity === "none") score += 20;
  else if (input.salinity === "mild") score += 14;
  else if (input.salinity === "moderate") score += 6;
  else score += 0;

  score = Math.min(100, score);

  let status: SoilHealthResult["status"];
  let statusUr: string;
  let color: string;

  if (score >= 80) {
    status = "excellent";
    statusUr = "بہترین";
    color = "#16A34A";
  } else if (score >= 60) {
    status = "good";
    statusUr = "اچھی";
    color = "#65A30D";
  } else if (score >= 40) {
    status = "fair";
    statusUr = "درمیانہ";
    color = "#CA8A04";
  } else {
    status = "poor";
    statusUr = "کمزور";
    color = "#DC2626";
  }

  const recs: string[] = [];
  const recsUr: string[] = [];

  if (input.ph < 6.0) {
    recs.push("Apply agricultural lime (1-2 t/acre) to raise pH.");
    recsUr.push("pH بڑھانے کے لیے زرعی چونا 1-2 ٹن فی ایکڑ ڈالیں۔");
  } else if (input.ph > 8.0) {
    recs.push("Apply gypsum (1-2 t/acre) or sulphur to lower pH / sodicity.");
    recsUr.push("pH کم کرنے کے لیے جیپسم 1-2 ٹن فی ایکڑ یا گندھک استعمال کریں۔");
  }

  if (input.texture === "sandy") {
    recs.push("Add farmyard manure/compost and use mulching to improve water holding.");
    recsUr.push("پانی رکھنے کی صلاحیت بڑھانے کے لیے گوبر کھاد/کمپوسٹ اور ملچنگ کریں۔");
  } else if (input.texture === "clay") {
    recs.push("Add organic matter and gypsum to improve drainage and structure.");
    recsUr.push("نکاسی اور ساخت بہتر بنانے کے لیے نامیاتی مواد اور جیپسم ڈالیں۔");
  }

  if (input.organicMatter !== "high") {
    recs.push("Incorporate 5-10 tons/acre of well-decomposed FYM or compost annually.");
    recsUr.push("سالانہ 5-10 ٹن فی ایکڑ گل سڑی گوبر کھاد یا کمپوسٹ مکس کریں۔");
  }

  if (input.salinity !== "none") {
    recs.push("Improve drainage, apply gypsum, and use saline-tolerant crop varieties.");
    recsUr.push("نکاسی بہتر بنائیں، جیپسم ڈالیں اور نمکینی برداشت کرنے والی فصلیں اگائیں۔");
  }

  if (recs.length === 0) {
    recs.push("Maintain current practices and test soil annually.");
    recsUr.push("موجودہ طریقے جاری رکھیں اور سالانہ مٹی کا ٹیسٹ کروائیں۔");
  }

  return { score, status, statusUr, color, recommendations: recs, recommendationsUr: recsUr };
}
