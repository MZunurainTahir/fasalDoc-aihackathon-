/**
 * FasalDoc Community Pest & Disease Reports
 * Location-aware nearby alerts contributed by farmers and verified by AI.
 * In production this would sync with a Supabase table; here we seed
 * realistic reports per province/city for demo purposes.
 */

import type { ProvinceId, City } from "./pakistanLocations";

export interface CommunityReport {
  id: string;
  title: string;
  titleUr: string;
  cityId: string;
  province: ProvinceId;
  crop: string;
  cropUr: string;
  type: "pest" | "disease" | "weather";
  reportedAt: string;
  severity: "low" | "medium" | "high";
  distanceKm: number;
  tips: string;
  tipsUr: string;
}

const REPORTS: CommunityReport[] = [
  { id: "r1", title: "Fall Armyworm spotted in maize", titleUr: "مکئی میں فال آرمی وارم", cityId: "lahore", province: "punjab", crop: "maize", cropUr: "مکئی", type: "pest", reportedAt: "2025-08-30", severity: "high", distanceKm: 12, tips: "Spray Emamectin Benzoate 5% SG or Spinosad. Scout fields twice a week.", tipsUr: "ایمامیکٹن بینزوئیٹ 5% SG یا اسپینوساد کا اسپرے کریں۔ ہفتے میں دو بار کھیت چیک کریں۔" },
  { id: "r2", title: "Cotton whitefly rising in Multan", titleUr: "ملتان میں کپاس کی سفید مکھی", cityId: "multan", province: "punjab", crop: "cotton", cropUr: "کپاس", type: "pest", reportedAt: "2025-08-31", severity: "medium", distanceKm: 85, tips: "Avoid excessive nitrogen. Use yellow sticky traps and neem oil spray.", tipsUr: " زیادہ نائٹروجن نہ ڈالیں۔ پیلی چپچپی تاریں اور نیم کا تیل کا اسپرے استعمال کریں۔" },
  { id: "r3", title: "Wheat rust alert in Faisalabad", titleUr: "فیصل آباد میں گندم کی کنگی", cityId: "faisalabad", province: "punjab", crop: "wheat", cropUr: "گندم", type: "disease", reportedAt: "2025-09-01", severity: "high", distanceKm: 110, tips: "Apply fungicide (Propiconazole 250 EC) at first appearance of pustules.", tipsUr: "پہلے دانے نظر آتے ہی فپونڈا ناسک (پروپیکونازول 250 EC) کا اسپرے کریں۔" },
  { id: "r4", title: "Rice blast reported in Gujranwala", titleUr: "گوجرانوالہ میں چاول کا بلاسٹ", cityId: "gujranwala", province: "punjab", crop: "rice", cropUr: "چاول", type: "disease", reportedAt: "2025-09-01", severity: "medium", distanceKm: 70, tips: "Use resistant varieties, balanced fertilizer, and Tricyclazole spray.", tipsUr: "مزاحمت والی اقسام، متوازن کھاد اور ٹرائسائیکلازول اسپرے استعمال کریں۔" },
  { id: "r5", title: "Tomato leaf curl virus in Karachi", titleUr: "کراچی میں ٹماٹر کا پتا مرود", cityId: "karachi", province: "sindh", crop: "tomato", cropUr: "ٹماٹر", type: "disease", reportedAt: "2025-08-29", severity: "high", distanceKm: 18, tips: "Control whitefly vector, remove infected plants, use resistant hybrids.", tipsUr: "سفید مکھی کو روکیں، متاثرہ پودے نکال دیں، مزاحم ہائبرڈ استعمال کریں۔" },
  { id: "r6", title: "Sugarcane aphid infestation in Hyderabad", titleUr: "حیدرآباد میں گنے کی ایفڈ", cityId: "hyderabad", province: "sindh", crop: "sugarcane", cropUr: "گنا", type: "pest", reportedAt: "2025-08-30", severity: "medium", distanceKm: 140, tips: "Release ladybird beetles or spray Imidacloprid 200 SL.", tipsUr: "لیڈی برڈ بیٹل چھوڑیں یا ایمیداکلوپرڈ 200 SL کا اسپرے کریں۔" },
  { id: "r7", title: "Hailstorm damage in Peshawar", titleUr: "پشاور میں ژالہ باری کا نقصان", cityId: "peshawar", province: "kpk", crop: "vegetables", cropUr: "سبزیاں", type: "weather", reportedAt: "2025-09-01", severity: "high", distanceKm: 210, tips: "Drain fields, apply light nitrogen, and fungicide prophylaxis.", tipsUr: "کھیتوں سے پانی نکالیں، ہلکی نائٹروجن اور فپونڈا ناسک کا اسپرے کریں۔" },
  { id: "r8", title: "Locust activity in Quetta district", titleUr: "کوئٹہ میں ٹڈی دل کی سرگرمی", cityId: "quetta", province: "balochistan", crop: "multiple", cropUr: "متعدد", type: "pest", reportedAt: "2025-08-28", severity: "high", distanceKm: 320, tips: "Report to Agri Dept, beat drums/drive to disturb swarms, use Malathion.", tipsUr: "محکمہ زرعت کو اطلاع دیں، ٹڈیوں کے Hoganہ کو ہلا کر بھگائیں، میلاتھئن استعمال کریں۔" },
];

export function getReportsByCity(city: City, limit = 10): CommunityReport[] {
  return REPORTS
    .filter((r) => r.province === city.province || r.cityId === city.id)
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, limit);
}

export function severityColor(severity: CommunityReport["severity"]) {
  return severity === "high" ? "text-danger bg-danger-bg border-danger/30" :
    severity === "medium" ? "text-warning bg-warning-bg border-warning/30" :
      "text-success bg-success-bg border-success/30";
}

export function severityLabel(severity: CommunityReport["severity"], lang: "en" | "ur") {
  if (lang === "ur") {
    return severity === "high" ? "زیادہ" : severity === "medium" ? "درمیانہ" : "کم";
  }
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}
