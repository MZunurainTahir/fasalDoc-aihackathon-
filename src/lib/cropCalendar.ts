/**
 * Crop calendar module: sowing, irrigation, fertiliser and harvest windows
 * for major Pakistani crops across different provinces.
 */

import type { ProvinceId } from "./pakistanLocations";

export type CalendarActivity = "sowing" | "irrigation" | "fertilizer" | "pest" | "harvest";

export interface CropCalendarEvent {
  id: string;
  cropId: string;
  cropNameEn: string;
  cropNameUr: string;
  activity: CalendarActivity;
  activityNameEn: string;
  activityNameUr: string;
  startMonth: number; // 0-11
  endMonth: number; // 0-11
  provinces: ProvinceId[];
  noteEn: string;
  noteUr: string;
}

const ACTIVITY_LABELS: Record<CalendarActivity, { en: string; ur: string; color: string }> = {
  sowing: { en: "Sowing", ur: "کاشت", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  irrigation: { en: "Irrigation", ur: "پانی", color: "bg-blue-100 text-blue-700 border-blue-200" },
  fertilizer: { en: "Fertilizer", ur: "کھاد", color: "bg-amber-100 text-amber-700 border-amber-200" },
  pest: { en: "Pest Watch", ur: "کیڑوں کی نگرانی", color: "bg-red-100 text-red-700 border-red-200" },
  harvest: { en: "Harvest", ur: "کٹائی", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

export function getActivityLabel(activity: CalendarActivity) {
  return ACTIVITY_LABELS[activity];
}

export const CROP_CALENDAR: CropCalendarEvent[] = [
  // Wheat (Rabi)
  { id: "wheat-sowing", cropId: "wheat", cropNameEn: "Wheat", cropNameUr: "گندم", activity: "sowing", activityNameEn: "Sowing", activityNameUr: "کاشت", startMonth: 10, endMonth: 11, provinces: ["punjab", "sindh", "kpk", "balochistan", "gb", "ajk"], noteEn: "Sow certified varieties at 100-125 kg/acre after monsoon.", noteUr: "مون سون کے بعد 100 تا 125 کلو بیج فی ایکڑ سے کاشت کریں۔" },
  { id: "wheat-1st-irrigation", cropId: "wheat", cropNameEn: "Wheat", cropNameUr: "گندم", activity: "irrigation", activityNameEn: "1st Irrigation", activityNameUr: "پہلا پانی", startMonth: 0, endMonth: 0, provinces: ["punjab", "sindh", "kpk"], noteEn: "Apply first irrigation 20-25 days after sowing (crown root stage).", noteUr: "کاشت کے 20 تا 25 دن بعد پہلا پانی دیں۔" },
  { id: "wheat-fertilizer", cropId: "wheat", cropNameEn: "Wheat", cropNameUr: "گندم", activity: "fertilizer", activityNameEn: "Urea Top-dress", activityNameUr: "یوریا کا استعمال", startMonth: 1, endMonth: 1, provinces: ["punjab", "sindh", "kpk", "balochistan"], noteEn: "Split urea: half at 1st irrigation, half at booting.", noteUr: "یوریا دو اقساط میں: آدھا پہلے پانی پر، آدھا بال نکلنے پر۔" },
  { id: "wheat-harvest", cropId: "wheat", cropNameEn: "Wheat", cropNameUr: "گندم", activity: "harvest", activityNameEn: "Harvest", activityNameUr: "کٹائی", startMonth: 3, endMonth: 4, provinces: ["punjab", "sindh", "kpk", "balochistan", "gb", "ajk"], noteEn: "Harvest when grain is hard and moisture below 14%.", noteUr: "جب دانہ سخت ہو اور نمی 14% سے کم ہو تو کٹائی کریں۔" },

  // Cotton (Kharif)
  { id: "cotton-sowing", cropId: "cotton", cropNameEn: "Cotton", cropNameUr: "کپاس", activity: "sowing", activityNameEn: "Sowing", activityNameUr: "کاشت", startMonth: 3, endMonth: 4, provinces: ["punjab", "sindh"], noteEn: "Sow Bt cotton after last frost; maintain 75 cm row spacing.", noteUr: "آخری ژالہ باری کے بعد بی ٹی کپاس کاشت کریں؛ 75 سینٹی میٹر قطار وقفہ رکھیں۔" },
  { id: "cotton-pest", cropId: "cotton", cropNameEn: "Cotton", cropNameUr: "کپاس", activity: "pest", activityNameEn: "Whitefly/Bollworm Watch", activityNameUr: "سفید مکھی/پنڈی کیڑا", startMonth: 6, endMonth: 8, provinces: ["punjab", "sindh"], noteEn: "Scout for whitefly, bollworm and mealybug weekly.", noteUr: "ہر ہفتے سفید مکھی، پنڈی کیڑے اور میلی بگ کے لیے نگرانی کریں۔" },
  { id: "cotton-harvest", cropId: "cotton", cropNameEn: "Cotton", cropNameUr: "کپاس", activity: "harvest", activityNameEn: "Picking", activityNameUr: "توئی", startMonth: 8, endMonth: 11, provinces: ["punjab", "sindh"], noteEn: "Pick fully open bolls every 15-20 days.", noteUr: "مکمل کھلنے والے پھٹی ہر 15-20 دن میں توئیں۔" },

  // Rice (Kharif)
  { id: "rice-nursery", cropId: "rice", cropNameEn: "Rice", cropNameUr: "چاول", activity: "sowing", activityNameEn: "Nursery Sowing", activityNameUr: "پنیاری کاشت", startMonth: 4, endMonth: 5, provinces: ["punjab", "sindh", "kpk", "ajk"], noteEn: "Prepare nursery 4-5 weeks before transplanting.", noteUr: "ٹرانسپلانٹنگ سے 4-5 ہفتے قبل پنیاری تیار کریں۔" },
  { id: "rice-transplant", cropId: "rice", cropNameEn: "Rice", cropNameUr: "چاول", activity: "sowing", activityNameEn: "Transplanting", activityNameUr: "منتقلی", startMonth: 5, endMonth: 6, provinces: ["punjab", "sindh", "kpk", "ajk"], noteEn: "Transplant 25-30 day old seedlings at 20x20 cm spacing.", noteUr: "25-30 دن کے پودے 20x20 سینٹی میٹر وقفے پر لگائیں۔" },
  { id: "rice-harvest", cropId: "rice", cropNameEn: "Rice", cropNameUr: "چاول", activity: "harvest", activityNameEn: "Harvest", activityNameUr: "کٹائی", startMonth: 9, endMonth: 10, provinces: ["punjab", "sindh", "kpk", "ajk"], noteEn: "Harvest at 20-22% grain moisture and sun-dry immediately.", noteUr: "20-22% نمی پر کٹائی کریں اور فوری دھوپ میں خشک کریں۔" },

  // Maize (Kharif + Spring)
  { id: "maize-spring", cropId: "maize", cropNameEn: "Maize", cropNameUr: "مکئی", activity: "sowing", activityNameEn: "Spring Sowing", activityNameUr: "بہار کاشت", startMonth: 1, endMonth: 2, provinces: ["punjab", "kpk", "ajk"], noteEn: "Spring maize needs reliable irrigation; use hybrid seed.", noteUr: "بہاری مکئی کے لیے پانی کی یقینی فراہمی؛ ہائبرڈ بیج استعمال کریں۔" },
  { id: "maize-kharif", cropId: "maize", cropNameEn: "Maize", cropNameUr: "مکئی", activity: "sowing", activityNameEn: "Kharif Sowing", activityNameUr: "خریف کاشت", startMonth: 5, endMonth: 6, provinces: ["punjab", "kpk", "sindh", "ajk"], noteEn: "Sow after pre-monsoon showers; control fall armyworm.", noteUr: "ماں سون بارشوں کے بعد کاشت کریں؛ فال آرمی ورم کا کنٹرول کریں۔" },
  { id: "maize-harvest", cropId: "maize", cropNameEn: "Maize", cropNameUr: "مکئی", activity: "harvest", activityNameEn: "Harvest", activityNameUr: "کٹائی", startMonth: 7, endMonth: 9, provinces: ["punjab", "kpk", "sindh", "ajk"], noteEn: "Harvest when cob sheath turns dry and grains are hard.", noteUr: "جب بھٹے کا غلاف خشک ہو اور دانے سخت ہوں تو کٹائی کریں۔" },

  // Sugarcane
  { id: "sugarcane-planting", cropId: "sugarcane", cropNameEn: "Sugarcane", cropNameUr: "گنا", activity: "sowing", activityNameEn: "Planting", activityNameUr: "کاشت", startMonth: 8, endMonth: 10, provinces: ["punjab", "sindh", "kpk"], noteEn: "Plant sets in trenches; treat seed with hot water for ratoon stunting.", noteUr: "گنے کے ٹکڑوں کو کھائیوں میں لگائیں؛ بیج کا گرم پانی سے علاج کریں۔" },
  { id: "sugarcane-harvest", cropId: "sugarcane", cropNameEn: "Sugarcane", cropNameUr: "گنا", activity: "harvest", activityNameEn: "Harvest", activityNameUr: "کٹائی", startMonth: 10, endMonth: 0, provinces: ["punjab", "sindh", "kpk"], noteEn: "Harvest at 12-14 months when brix is high.", noteUr: "12-14 مہینے میں جب بریکس زیادہ ہو تو کٹائی کریں۔" },
];

export function getCurrentMonthEvents(province: ProvinceId, month?: number): CropCalendarEvent[] {
  const m = month ?? new Date().getMonth();
  return CROP_CALENDAR.filter(
    (e) => e.provinces.includes(province) && m >= e.startMonth && m <= e.endMonth,
  );
}

export function getEventsByCrop(cropId: string, province: ProvinceId): CropCalendarEvent[] {
  return CROP_CALENDAR.filter((e) => e.cropId === cropId && e.provinces.includes(province));
}

const MONTH_NAMES_UR = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonthRange(start: number, end: number, lang: "en" | "ur"): string {
  const names = lang === "ur" ? MONTH_NAMES_UR : MONTH_NAMES_EN;
  if (start === end) return names[start];
  return `${names[start]} – ${names[end]}`;
}
