import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { REMEDY_DATABASE, CROP_LIST, LIVESTOCK_LIST, RemedyInfo } from "../lib/remedyData";
import {
  BookOpen, Calculator, Presentation, Phone, Leaf, Search,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info,
  FlaskConical, ShieldCheck, TrendingDown,
  Wheat, Beef, PhoneCall, HeartPulse, CloudSun, TrendingUp, Minus,
  Landmark, Video, Star, Stethoscope,
  Droplets, Thermometer, Wind, ChevronRight, MapPin, CalendarDays, Sprout,
  Users, Wallet,
} from "lucide-react";
import { getMockForecast, fetchForecast, fetchCurrentWeather, computeDiseaseRisk, riskColor, type WeatherSnapshot, detectNearestCity } from "../lib/weather";
import { getPricesByProvince, fetchLiveMarketRates, trendSymbol, trendClass, type CommodityPrice } from "../lib/marketPrices";
import { SCHEME_CATEGORIES, getSchemesByProvince, type SchemeCategory } from "../lib/schemes";
import { EXPERTS, EXPERT_TYPES, CONSULTATION_TYPES, type ConsultationType, type ExpertType } from "../lib/televet";
import { PROVINCES, PAKISTAN_CITIES, type ProvinceId, type City } from "../lib/pakistanLocations";
import { getSelectedCity, setSelectedCity as persistSelectedCity, getProvinceCities } from "../lib/farmProfile";
import { getCurrentMonthEvents, formatMonthRange, getActivityLabel } from "../lib/cropCalendar";
import { calculateSoilHealth, type SoilTestInput } from "../lib/soilHealth";
import { calculateIrrigation, type IrrigationInput } from "../lib/irrigation";
import { estimateYield, CROP_YIELD_DATA } from "../lib/yieldEstimator";
import { getReportsByCity, severityColor, severityLabel } from "../lib/communityReports";
import { calculateSeedRequirement } from "../lib/seedRate";


/* ─────────────────────────── DISEASE LIBRARY ─────────────────────── */
function DiseaseCard({ disease, lang }: { disease: RemedyInfo; lang: string }) {
  const [expanded, setExpanded] = useState(false);

  const severityConfig = {
    low: { color: "bg-success-bg text-success border-success/30", label: "Low Risk", labelUr: "کم خطرہ" },
    medium: { color: "bg-warning-bg text-warning border-warning/30", label: "Moderate", labelUr: "درمیانہ" },
    high: { color: "bg-warning-bg text-warning border-warning/30", label: "High Risk", labelUr: "زیادہ خطرہ" },
    critical: { color: "bg-danger-bg text-danger border-danger/30", label: "Critical", labelUr: "انتہائی خطرناک" },
  };
  const sev = severityConfig[disease.severity];

  return (
    <div className="bg-bg-elevated rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-bg-secondary transition-colors text-left min-touch"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${disease.category === "crop" ? "bg-primary-bg" : "bg-warning-bg"}`}>
          <span className="text-xl">{disease.category === "crop" ? "🌾" : "🐄"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${sev.color}`}>
              {lang === "ur" ? sev.labelUr : sev.label}
            </span>
            <span className="text-[10px] text-text-muted">{disease.scientificName}</span>
          </div>
          <p className="font-bold text-sm text-text-primary">{lang === "ur" ? disease.nameUrdu : disease.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{lang === "ur" ? disease.cropOrAnimalUrdu : disease.cropOrAnimal}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border animate-fadeIn">
          {/* Symptoms */}
          <div className="mt-3">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              {lang === "ur" ? "علامات" : "Symptoms"}
            </h4>
            <ul className="space-y-1.5">
              {(lang === "ur" ? disease.symptomsUrdu : disease.symptoms).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Organic remedy */}
          <div className="mt-3 bg-success-bg rounded-xl p-3 border border-success/20">
            <h4 className="text-xs font-bold text-success mb-1.5 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              {lang === "ur" ? "قدرتی علاج" : "Organic Treatment"}
            </h4>
            <p className="text-xs text-success leading-relaxed">{lang === "ur" ? disease.organicUrdu : disease.organic}</p>
          </div>

          {/* Chemical remedy */}
          <div className="mt-2 bg-info-bg rounded-xl p-3 border border-info/20">
            <h4 className="text-xs font-bold text-info mb-1.5 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              {lang === "ur" ? "کیمیائی علاج" : "Chemical Treatment"}
            </h4>
            <p className="text-xs text-info leading-relaxed">{lang === "ur" ? disease.chemicalUrdu : disease.chemical}</p>
          </div>

          {/* Dosage & Cost */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-bg-secondary rounded-xl p-3 border border-border">
              <p className="text-[10px] text-text-muted mb-1 font-semibold uppercase tracking-wide">
                {lang === "ur" ? "خوراک" : "Dosage"}
              </p>
              <p className="text-xs text-text-primary font-medium">{lang === "ur" ? disease.dosageUrdu : disease.dosage}</p>
            </div>
            <div className="bg-warning-bg rounded-xl p-3 border border-warning/20">
              <p className="text-[10px] text-warning mb-1 font-semibold uppercase tracking-wide">
                {lang === "ur" ? "تخمینہ لاگت" : "Est. Cost"}
              </p>
              <p className="text-xs text-warning font-bold">{disease.estimatedCostPkr}</p>
            </div>
          </div>

          {/* Local products */}
          <div className="mt-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-1.5">
              {lang === "ur" ? "مقامی برانڈز" : "Local Brands Available"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {disease.localProducts.map((p) => (
                <span key={p} className="text-[10px] px-2.5 py-1 bg-primary-bg text-primary rounded-full font-semibold border border-primary/10">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Prevention */}
          <div className="mt-3 bg-info-bg rounded-xl p-3 border border-info/20">
            <h4 className="text-xs font-bold text-info mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === "ur" ? "احتیاطی تدابیر" : "Prevention"}
            </h4>
            <p className="text-xs text-info leading-relaxed">{lang === "ur" ? disease.preventionUrdu : disease.prevention}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DiseaseLibrary({ lang }: { lang: string }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "crop" | "livestock">("all");

  const allDiseases = Object.values(REMEDY_DATABASE);
  const filtered = allDiseases.filter((d) => {
    const matchesFilter = filter === "all" || d.category === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || d.name.toLowerCase().includes(q)
      || d.nameUrdu.includes(q)
      || d.cropOrAnimal.toLowerCase().includes(q)
      || d.cropOrAnimalUrdu.includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "ur" ? "بیماری یا فصل تلاش کریں..." : "Search disease or crop..."}
          className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "all" as const, label: lang === "ur" ? "سب" : "All" },
          { id: "crop" as const, label: lang === "ur" ? "فصلیں" : "Crops" },
          { id: "livestock" as const, label: lang === "ur" ? "مویشی" : "Livestock" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${filter === id
              ? "bg-primary text-white shadow-md"
              : "bg-bg-elevated text-text-muted border border-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Crop List Reference */}
      {filter !== "livestock" && (
        <div className="mb-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wide font-bold mb-2">
            {lang === "ur" ? "پاکستانی فصلیں" : "Pakistani Crops"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {CROP_LIST.map((c) => (
              <button
                key={c.id}
                onClick={() => setSearch(lang === "ur" ? c.nameUr : c.nameEn)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border rounded-full text-xs hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <span>{c.emoji}</span>
                <span className="text-text-primary font-medium">{lang === "ur" ? c.nameUr : c.nameEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Livestock List Reference */}
      {filter !== "crop" && (
        <div className="mb-4">
          <p className="text-[10px] text-text-muted uppercase tracking-wide font-bold mb-2">
            {lang === "ur" ? "مویشی" : "Livestock"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {LIVESTOCK_LIST.map((l) => (
              <button
                key={l.id}
                onClick={() => setSearch(lang === "ur" ? l.nameUr : l.nameEn)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border rounded-full text-xs hover:border-warning hover:shadow-sm transition-all"
              >
                <span>{l.emoji}</span>
                <span className="text-text-primary font-medium">{lang === "ur" ? l.nameUr : l.nameEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disease cards */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <Search className="w-10 h-10 text-border-strong mx-auto mb-2" />
            <p className="text-text-muted text-sm">{lang === "ur" ? "کوئی نتیجہ نہیں ملا" : "No results found"}</p>
          </div>
        ) : (
          filtered.map((d) => <DiseaseCard key={d.id} disease={d} lang={lang} />)
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── FERTILIZER CALCULATOR ─────────────────── */
function FertilizerCalculator({ lang }: { lang: string }) {
  const [crop, setCrop] = useState("wheat");
  const [area, setArea] = useState("1");
  const [unit, setUnit] = useState<"acre" | "kanal">("acre");
  const [calculated, setCalculated] = useState(false);

  const fertilizerRecs: Record<string, { urea: number; dap: number; potash: number; zinc: number; note: string; noteUr: string }> = {
    wheat: { urea: 50, dap: 25, potash: 12.5, zinc: 2.5, note: "Apply DAP at sowing, Urea in 2 splits (½ at sowing + ½ at 1st irrigation)", noteUr: "ڈی اے پی کاشت کے وقت، یوریا دو اقساط میں (آدھا کاشت + آدھا پہلے پانی پر)" },
    cotton: { urea: 65, dap: 30, potash: 25, zinc: 3, note: "Apply Potash at sowing; Urea in 3 splits. Extra Boron spray at flowering.", noteUr: "پوٹاش کاشت پر، یوریا تین اقساط میں۔ پھول آنے پر بوران کا اضافی اسپرے کریں۔" },
    rice: { urea: 55, dap: 20, potash: 12.5, zinc: 5, note: "Apply Zinc Sulphate before transplanting. Urea in 3 splits.", noteUr: "پنیری لگانے سے پہلے زنک سلفیٹ ڈالیں۔ یوریا تین اقساط میں۔" },
    tomato: { urea: 45, dap: 35, potash: 30, zinc: 2, note: "Apply 10-15 ton well-rotted FYM per acre before planting. Potassium crucial at fruit setting.", noteUr: "کاشت سے پہلے 10 تا 15 ٹن گوبر کھاد ڈالیں۔ پھل لگتے وقت پوٹاشیم بہت ضروری ہے۔" },
    potato: { urea: 50, dap: 40, potash: 50, zinc: 3, note: "High Potash requirement for tuber development. Apply 50% of Urea at hilling.", noteUr: "کند پیدا کرنے کے لیے پوٹاش کی زیادہ ضرورت ہے۔ مٹی چڑھانے کے وقت 50% یوریا دیں۔" },
    sugarcane: { urea: 75, dap: 30, potash: 30, zinc: 4, note: "Apply FYM (20-25 ton/acre) + Urea in 4 splits over the growing season.", noteUr: "گوبر کھاد (20 تا 25 ٹن/ایکڑ) + یوریا 4 اقساط میں۔" },
    maize: { urea: 60, dap: 30, potash: 20, zinc: 3, note: "Band-place DAP at sowing. Top dress Urea at knee-height and tasseling.", noteUr: "ڈی اے پی بیج کے ساتھ ڈالیں۔ یوریا گھٹنے بھر اور برق وقت پر دیں۔" },
  };

  const areaNum = parseFloat(area) || 1;
  const convFactor = unit === "kanal" ? areaNum / 8 : areaNum; // 8 kanals = 1 acre
  const rec = fertilizerRecs[crop] || fertilizerRecs.wheat;

  return (
    <div>
      <div className="bg-gradient-to-br from-primary-bg to-bg-secondary rounded-2xl p-4 border border-primary/10 mb-4">
        <p className="text-xs text-primary font-medium">
          {lang === "ur"
            ? "📌 یہ کیلکولیٹر پاکستانی زرعی تحقیقی اداروں (NARC / PARC / NIBGE) کی سفارشات پر مبنی ہے۔"
            : "📌 Recommendations based on NARC / PARC / NIBGE Pakistan guidelines."}
        </p>
      </div>

      {/* Crop selector */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
          {lang === "ur" ? "فصل منتخب کریں" : "Select Crop"}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {CROP_LIST.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCrop(c.id); setCalculated(false); }}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-center transition-all border ${crop === c.id
                ? "border-primary bg-primary-bg shadow-md"
                : "border-border bg-bg-elevated hover:border-border-strong"
              }`}
            >
              <span className="text-lg mb-0.5">{c.emoji}</span>
              <span className={`text-[10px] font-semibold leading-tight ${crop === c.id ? "text-primary" : "text-text-muted"}`}>
                {lang === "ur" ? c.nameUr : c.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Area input */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
          {lang === "ur" ? "رقبہ" : "Farm Area"}
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              value={area}
              onChange={(e) => { setArea(e.target.value); setCalculated(false); }}
              min="0.1"
              step="0.5"
              className="w-full pr-4 pl-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all font-bold text-text-primary"
              placeholder="1"
            />
          </div>
          <div className="flex bg-bg-elevated border border-border rounded-xl overflow-hidden">
            {(["acre", "kanal"] as const).map((u) => (
              <button
                key={u}
                onClick={() => { setUnit(u); setCalculated(false); }}
                className={`px-4 py-3 text-xs font-bold transition-colors ${unit === u ? "bg-primary text-white" : "text-text-muted hover:bg-bg-secondary"}`}
              >
                {lang === "ur" ? (u === "acre" ? "ایکڑ" : "کنال") : u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={() => setCalculated(true)}
        className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        {lang === "ur" ? "کھادوں کا حساب لگائیں" : "Calculate Fertilizer"}
      </button>

      {/* Results */}
      {calculated && (
        <div className="mt-4 animate-fadeIn">
          <div className="bg-bg-elevated rounded-2xl border border-border shadow-md p-4">
            <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              {lang === "ur" ? "تجویز کردہ کھادیں" : "Recommended Fertilizers"}
              <span className="ml-auto text-xs text-text-muted bg-border px-2 py-0.5 rounded-full">
                {area} {lang === "ur" ? (unit === "acre" ? "ایکڑ" : "کنال") : unit}
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Urea یوریا", value: rec.urea * convFactor, color: "bg-info-bg border-info/20 text-info", unit: "kg" },
                { label: "DAP ڈی اے پی", value: rec.dap * convFactor, color: "bg-warning-bg border-warning/20 text-warning", unit: "kg" },
                { label: "Potash پوٹاش", value: rec.potash * convFactor, color: "bg-info-bg border-info/20 text-info", unit: "kg" },
                { label: "Zinc Sulphate زنک", value: rec.zinc * convFactor, color: "bg-success-bg border-success/20 text-success", unit: "kg" },
              ].map(({ label, value, color, unit: u }) => (
                <div key={label} className={`${color} rounded-xl p-3 border`}>
                  <p className="text-[10px] font-semibold mb-1 leading-tight">{label}</p>
                  <p className="text-xl font-bold">{value.toFixed(1)}</p>
                  <p className="text-[10px] opacity-70">{u} / {lang === "ur" ? (unit === "acre" ? "ایکڑ" : "کنال") : unit}</p>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-3 bg-warning-bg rounded-xl p-3 border border-warning/20">
              <p className="text-xs text-warning flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                {lang === "ur" ? rec.noteUr : rec.note}
              </p>
            </div>

            <p className="text-[10px] text-text-muted mt-3 text-center">
              {lang === "ur"
                ? "⚠️ مٹی کا ٹیسٹ کروانا بہترین نتائج کے لیے ضروری ہے"
                : "⚠️ Soil testing is strongly recommended for best results"}
            </p>
          </div>

          {/* Spray Mix Calculator */}
          <div className="mt-4 bg-bg-elevated rounded-2xl border border-border shadow-md p-4">
            <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-info" />
              {lang === "ur" ? "اسپرے محلول کا حساب" : "Spray Mix Calculator"}
            </h3>
            <p className="text-xs text-text-muted mb-3">
              {lang === "ur"
                ? "100 لیٹر پانی کا ٹینک فی ایکڑ کے لیے معیاری خوراک:"
                : "Standard rate per 100L water tank per acre:"}
            </p>
            <div className="space-y-2">
              {[
                { name: "Fungicide (WP 80%)", rate: "200-300g", nameUr: "پھپھوند کش (WP 80%)" },
                { name: "Insecticide (EC)", rate: "150-200ml", nameUr: "کیڑے مار (EC)" },
                { name: "Weedicide (EC)", rate: "100-150ml", nameUr: "جڑی بوٹی مار (EC)" },
                { name: "Micro-nutrients / Foliar", rate: "250-500g", nameUr: "خوردبینی کھادیں" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-primary">{lang === "ur" ? item.nameUr : item.name}</span>
                  <span className="text-xs font-bold text-primary bg-primary-bg px-2.5 py-1 rounded-full">{item.rate}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-3 italic">
              {lang === "ur"
                ? "ہمیشہ لیبل پر درج خوراک کو ترجیح دیں اور مقامی زرعی ماہر سے مشورہ کریں۔"
                : "Always follow label rates and consult your local agriculture extension officer."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── PITCH DECK ─────────────────────────────── */
const PITCH_SLIDES = [
  {
    titleEn: "FasalDoc",
    titleUr: "فصل ڈاک",
    subtitleEn: "AI-Powered Agricultural Health Companion for Pakistan — BanoQabil AI Hackathon 2025",
    subtitleUr: "پاکستانی کسانوں کے لیے مصنوعی ذہانت سے لیس زرعی صحت ساتھی — BanoQabil AI Hackathon 2025",
    icon: "🌾",
    colorClass: "from-emerald-600 to-emerald-500",
    points: [],
    pointsUr: [],
  },
  {
    titleEn: "The Problem",
    titleUr: "مسئلہ کیا ہے؟",
    subtitleEn: "Pakistan's farmers lose 30-40% of crops annually to disease",
    subtitleUr: "پاکستان کے کاشتکار سالانہ 30-40% فصل بیماری سے ضائع کرتے ہیں",
    icon: "⚠️",
    colorClass: "from-red-600 to-orange-500",
    points: [
      "58M+ farming families with no instant diagnostic tool",
      "Delayed diagnosis leads to Rs. 800B+ annual losses",
      "Livestock sector loses 30% yield to preventable disease",
      "Extension officers: 1 per 2,000+ farmers — inaccessible",
    ],
    pointsUr: [
      "58 ملین سے زیادہ کاشتکار خاندانوں کے پاس فوری تشخیصی آلہ نہیں",
      "دیر سے تشخیص سے 800 ارب روپے سالانہ نقصان",
      "مویشی شعبہ قابل علاج بیماریوں سے 30% پیداوار ضائع کرتا ہے",
      "ایک زرعی توسیعی افسر 2000 سے زیادہ کاشتکاروں کے لیے",
    ],
  },
  {
    titleEn: "Our Solution",
    titleUr: "ہمارا حل",
    subtitleEn: "Instant AI diagnosis. Local remedies. Offline-first.",
    subtitleUr: "فوری AI تشخیص۔ مقامی علاج۔ آف لائن بھی کام کرے۔",
    icon: "🤖",
    colorClass: "from-primary to-emerald-600",
    points: [
      "📸 Snap a photo → AI diagnoses in <3 seconds",
      "🌦️ Weather-based disease risk alerts for your farm",
      "📊 Live mandi rates, subsidies & tele-vet booking",
      "🌐 Bilingual: Full Urdu + English support with voice",
      "📡 100% Offline-first — works without internet",
      "💊 Local brand remedies with PKR costs & dosages",
    ],
    pointsUr: [
      "📸 تصویر لیں → AI 3 سیکنڈ میں تشخیص کرے",
      "🌦️ کھیت کے لیے موسم پر مبنی بیماری الرٹ",
      "📊 منڈی ریٹ، سبسڈی اور ٹیلی ویٹ بکنگ",
      "🌐 اردو اور انگریزی دونوں زبانوں میں آواز کے ساتھ",
      "📡 مکمل آف لائن — بغیر انٹرنیٹ کے بھی کام کرے",
      "💊 مقامی برانڈ ادویات کے ساتھ قیمت اور خوراک",
    ],
  },
  {
    titleEn: "Market Opportunity",
    titleUr: "مارکیٹ کا موقع",
    subtitleEn: "Pakistan AgriTech: $12B untapped addressable market",
    subtitleUr: "پاکستان زرعی ٹیکنالوجی: 12 ارب ڈالر کا بازار",
    icon: "📈",
    colorClass: "from-blue-600 to-indigo-500",
    points: [
      "44M+ hectares of agricultural land in Pakistan",
      "67% rural population depends on agriculture",
      "Mobile penetration: 195M+ cellular subscribers",
      "Only 0.3% farmland uses precision agriculture",
    ],
    pointsUr: [
      "پاکستان میں 44 ملین ہیکٹر زرعی اراضی",
      "67 فیصد دیہی آبادی زراعت پر منحصر",
      "موبائل صارفین: 19.5 کروڑ سے زیادہ",
      "صرف 0.3 فیصد زمین پر جدید زراعت ہوتی ہے",
    ],
  },
  {
    titleEn: "Business Model",
    titleUr: "کاروباری ماڈل",
    subtitleEn: "Freemium SaaS + B2B partnerships",
    subtitleUr: "فریمیم اور بی ٹو بی شراکت داری",
    icon: "💰",
    colorClass: "from-amber-600 to-yellow-500",
    points: [
      "Free: 10 AI scans/month + basic disease library",
      "FasalDoc Pro (Rs. 199/month): Unlimited scans + recovery tracking",
      "B2B: ZTBL, PPCBL loan-linked crop health monitoring",
      "Agri-input ads & local retailer lead generation",
    ],
    pointsUr: [
      "مفت: 10 AI اسکین / ماہ + بنیادی بیماری کتب خانہ",
      "فصل ڈاک پرو (199 روپے/ماہ): لامحدود اسکین + صحت یابی ٹریکنگ",
      "بی ٹو بی: زرعی بینکوں کے ساتھ فصلی صحت نظارت",
      "زرعی آدانوں کی مقامی دکانوں کی لیڈ جنریشن",
    ],
  },
  {
    titleEn: "Traction & Roadmap",
    titleUr: "پیشرفت اور منصوبہ",
    subtitleEn: "Beta → Punjab → National → SAARC",
    subtitleUr: "بیٹا → پنجاب → قومی → سارک",
    icon: "🚀",
    colorClass: "from-purple-600 to-pink-500",
    points: [
      "Q3 2025: 500 beta farmers in Faisalabad district",
      "Q4 2025: Punjab Agriculture Dept. MOU + ZTBL integration",
      "Q1 2026: 50,000 users — 12 crops + 5 livestock categories",
      "Q2 2026: Agri-input marketplace + Bangladesh & India launch",
    ],
    pointsUr: [
      "Q3 2025: فیصل آباد ضلع میں 500 بیٹا کاشتکار",
      "Q4 2025: پنجاب زرعی محکمہ اور زرعی ترقیاتی بینک انضمام",
      "Q1 2026: 50,000 صارفین — 12 فصلیں + 5 مویشی زمرے",
      "Q2 2026: زرعی آدانوں کی مارکیٹ پلیس + بنگلہ دیش اور بھارت",
    ],
  },
  {
    titleEn: "The Team",
    titleUr: "ہماری ٹیم",
    subtitleEn: "Agri + Tech + Business — Built for Pakistan",
    subtitleUr: "زراعت + ٹیکنالوجی + کاروبار — پاکستان کے لیے",
    icon: "👥",
    colorClass: "from-teal-600 to-cyan-500",
    points: [
      "AI/ML Engineer — Computer Vision & TFLite specialist",
      "Full-Stack Developer — React Native + FastAPI",
      "Agriculture Expert — MSc Plant Pathology (UAF)",
      "Business Development — ex-SMEDA & startup ecosystem",
    ],
    pointsUr: [
      "AI/ML انجینئر — کمپیوٹر ویژن ماہر",
      "فل اسٹیک ڈیولپر — React Native + FastAPI",
      "زرعی ماہر — MSc نباتیات (UAF فیصل آباد)",
      "کاروباری ترقی — SMEDA تجربہ",
    ],
  },
  {
    titleEn: "Ask",
    titleUr: "ہماری درخواست",
    subtitleEn: "Seeking Rs. 50L seed funding from BanoQabil AI Hackathon",
    subtitleUr: "BanoQabil AI Hackathon سے 50 لاکھ روپے ابتدائی سرمایہ",
    icon: "🤝",
    colorClass: "from-emerald-700 to-primary",
    points: [
      "AI model training on 200,000+ Pakistan crop disease images",
      "Urdu conversational AI assistant fine-tuning",
      "Field trials: 5,000 farmers across 3 districts",
      "PSEB/SECP company registration + IP filing",
    ],
    pointsUr: [
      "AI ماڈل کی 2 لاکھ پاکستانی بیماری تصاویر پر تربیت",
      "اردو AI اسسٹنٹ کی بہتری",
      "3 اضلاع میں 5,000 کاشتکاروں کے ساتھ میدانی آزمائش",
      "PSEB / SECP کمپنی رجسٹریشن اور IP فائلنگ",
    ],
  },
];

function PitchDeck({ lang }: { lang: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = PITCH_SLIDES[currentSlide];

  return (
    <div>
      <div className={`bg-gradient-to-br ${slide.colorClass} rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[280px]`}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
              {currentSlide + 1} / {PITCH_SLIDES.length}
            </span>
            <span className="text-3xl">{slide.icon}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {lang === "ur" ? slide.titleUr : slide.titleEn}
          </h2>
          <p className="text-white/80 text-sm font-medium mb-5">
            {lang === "ur" ? slide.subtitleUr : slide.subtitleEn}
          </p>
          {slide.points.length > 0 && (
            <ul className="space-y-2.5">
              {(lang === "ur" ? slide.pointsUr : slide.points).map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white/90 text-sm">
                  <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
          disabled={currentSlide === 0}
          className="flex-1 py-3 bg-bg-elevated border border-border rounded-2xl text-sm font-bold text-text-primary hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← {lang === "ur" ? "پچھلا" : "Previous"}
        </button>
        <div className="flex gap-1.5">
          {PITCH_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? "bg-primary w-5" : "bg-gray-300 w-2"}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((s) => Math.min(PITCH_SLIDES.length - 1, s + 1))}
          disabled={currentSlide === PITCH_SLIDES.length - 1}
          className="flex-1 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "ur" ? "اگلا" : "Next"} →
        </button>
      </div>
      <p className="text-center text-xs text-text-muted mt-3 italic">
        {lang === "ur"
          ? "\"ڈیک آپ کی آواز کا ساتھی ہے، متبادل نہیں۔\""
          : '"The deck should support your voice, not replace it."'}
      </p>
    </div>
  );
}

/* ─────────────────────────── HELPLINES ─────────────────────────────── */
function HelplineCard({ icon, name, nameUr, number, hours, hoursUr, color }: {
  icon: React.ReactNode; name: string; nameUr: string;
  number: string; hours: string; hoursUr: string; color: string;
}) {
  const { lang } = useLanguage();
  return (
    <a
      href={`tel:${number}`}
      className={`flex items-center gap-4 p-4 bg-bg-elevated rounded-2xl border border-border hover:shadow-lg hover:border-${color.split('-')[1]}/30 transition-all duration-200 min-touch active:scale-[0.97]`}
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0 shadow-md`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-text-primary">{lang === "ur" ? nameUr : name}</p>
        <p className="text-lg font-black text-primary font-mono tracking-wide">{number}</p>
        <p className="text-[10px] text-text-muted">{lang === "ur" ? hoursUr : hours}</p>
      </div>
      <div className="w-9 h-9 bg-success-bg rounded-xl flex items-center justify-center">
        <PhoneCall className="w-4 h-4 text-success" />
      </div>
    </a>
  );
}

function Helplines() {
  const { lang } = useLanguage();
  return (
    <div>
      <div className="bg-warning-bg border border-warning/30 rounded-2xl p-3 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-warning">
          {lang === "ur"
            ? "ہنگامی صورت حال میں فوری ڈاکٹر یا ماہر سے رابطہ کریں۔"
            : "In case of emergency, contact a doctor or extension officer immediately."}
        </p>
      </div>
      <div className="space-y-3">
        <HelplineCard
          icon={<Wheat className="w-5 h-5 text-success" />}
          name="Punjab Agriculture Helpline" nameUr="پنجاب زراعت ہیلپ لائن"
          number="0800-15000"
          hours="Mon–Fri: 8AM–8PM" hoursUr="پیر–جمعہ: صبح 8 – رات 8"
          color="bg-success-bg"
        />
        <HelplineCard
          icon={<Beef className="w-5 h-5 text-warning" />}
          name="Livestock Disease Helpline" nameUr="مویشی بیماری ہیلپ لائن"
          number="0800-78685"
          hours="24/7 Emergency Line" hoursUr="24 گھنٹے، 7 دن ہنگامی سروس"
          color="bg-warning-bg"
        />
        <HelplineCard
          icon={<HeartPulse className="w-5 h-5 text-danger" />}
          name="Kisan SMS Service" nameUr="کسان ایس ایم ایس سروس"
          number="8001"
          hours="Send disease query via SMS (Free)" hoursUr="بیماری سوال SMS کریں (مفت)"
          color="bg-danger-bg"
        />
        <HelplineCard
          icon={<Info className="w-5 h-5 text-info" />}
          name="NARC Extension (Islamabad)" nameUr="NARC زرعی توسیع (اسلام آباد)"
          number="051-9255080"
          hours="Office hours" hoursUr="دفتری اوقات"
          color="bg-info-bg"
        />
        <HelplineCard
          icon={<TrendingDown className="w-5 h-5 text-info" />}
          name="ZTBL Kisan Card Support" nameUr="زرعی ترقیاتی بینک معاونت"
          number="0800-00682"
          hours="Mon–Sat: 9AM–5PM" hoursUr="پیر–ہفتہ: صبح 9 – شام 5"
          color="bg-info-bg"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── LOCATION SELECTOR ────────────────────── */
function LocationSelector({
  lang,
  selectedCity,
  onChange,
}: {
  lang: string;
  selectedCity: City;
  onChange: (city: City) => void;
}) {
  const [detecting, setDetecting] = useState(false);

  const handleDetect = async () => {
    setDetecting(true);
    const nearest = await detectNearestCity();
    if (nearest) onChange(nearest);
    setDetecting(false);
  };

  return (
    <div className="bg-bg-elevated rounded-2xl border border-border p-3 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-primary" />
        <p className="text-xs font-bold text-text-primary">{lang === "ur" ? "اپنا مقام منتخب کریں" : "Select your location"}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <select
          value={selectedCity.province}
          onChange={(e) => {
            const province = e.target.value as ProvinceId;
            const firstCity = getProvinceCities(province)[0] || PAKISTAN_CITIES[0];
            onChange(firstCity);
          }}
          className="w-full p-2.5 bg-bg-primary border border-border rounded-xl text-xs font-medium focus:border-primary focus:outline-none"
        >
          {PROVINCES.map((p) => (
            <option key={p.id} value={p.id}>{lang === "ur" ? p.nameUr : p.nameEn}</option>
          ))}
        </select>
        <select
          value={selectedCity.id}
          onChange={(e) => {
            const city = PAKISTAN_CITIES.find((c) => c.id === e.target.value) || selectedCity;
            onChange(city);
          }}
          className="w-full p-2.5 bg-bg-primary border border-border rounded-xl text-xs font-medium focus:border-primary focus:outline-none"
        >
          {getProvinceCities(selectedCity.province).map((c) => (
            <option key={c.id} value={c.id}>{lang === "ur" ? c.nameUr : c.nameEn}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleDetect}
        disabled={detecting}
        className="w-full py-2.5 bg-primary-bg text-primary rounded-xl text-xs font-bold hover:bg-primary/10 transition-colors disabled:opacity-50"
      >
        {detecting
          ? (lang === "ur" ? "دریافت ہورہا ہے..." : "Detecting...")
          : (lang === "ur" ? "📍 میرا موجودہ مقام استعمال کریں" : "📍 Use my current location")}
      </button>
    </div>
  );
}

/* ─────────────────────────── WEATHER FORECAST ─────────────────────── */
function WeatherForecast({ lang, selectedCity, onCityChange }: { lang: string; selectedCity: City; onCityChange: (city: City) => void }) {
  const [forecast, setForecast] = useState<WeatherSnapshot[]>(() => getMockForecast(selectedCity));
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchCurrentWeather(selectedCity), fetchForecast(selectedCity)]).then(([cur, fore]) => {
      if (!mounted) return;
      if (cur) setCurrent(cur);
      setForecast(fore && fore.length > 0 ? fore : getMockForecast(selectedCity));
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [selectedCity]);

  const display = current ?? forecast[0];

  return (
    <div>
      <LocationSelector lang={lang} selectedCity={selectedCity} onChange={onCityChange} />

      <div className="bg-gradient-to-br from-info to-info-bg rounded-2xl p-4 text-white shadow-lg mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "آج کا موسم" : "Today"}</p>
            <p className="text-2xl font-bold mt-1">{display.location}</p>
            <p className="text-white/80 text-xs">{lang === "ur" ? "5 دن کا موسمیاتی خطرہ" : "5-day disease risk forecast"}</p>
            {loading && <p className="text-[10px] text-white/70 mt-1">{lang === "ur" ? "لوڈ ہورہا ہے..." : "Loading..."}</p>}
          </div>
          <CloudSun className="w-10 h-10 text-white/90" />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-1 text-sm"><Thermometer className="w-4 h-4" /> {display.tempC}°C</span>
          <span className="flex items-center gap-1 text-sm"><Droplets className="w-4 h-4" /> {display.humidity}%</span>
          <span className="flex items-center gap-1 text-sm"><Wind className="w-4 h-4" /> {display.rainfallMm}mm</span>
        </div>
      </div>

      <div className="space-y-3">
        {forecast.map((day, idx) => {
          const risk = computeDiseaseRisk(day);
          const icons: Record<WeatherSnapshot["condition"], React.ReactNode> = {
            sunny: <CloudSun className="w-5 h-5 text-warning" />,
            cloudy: <CloudSun className="w-5 h-5 text-text-muted" />,
            rainy: <Droplets className="w-5 h-5 text-info" />,
            stormy: <Wind className="w-5 h-5 text-danger" />,
          };
          return (
            <div key={idx} className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 bg-bg-secondary rounded-xl flex items-center justify-center shrink-0">
                {icons[day.condition]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-text-primary">{idx === 0 ? (lang === "ur" ? "آج" : "Today") : day.forecastDay}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: riskColor(risk.level) }}>
                    {risk.score}% {lang === "ur" ? "خطرہ" : "risk"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {day.tempC}°C</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {day.humidity}%</span>
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {day.rainfallMm}mm</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1.5 leading-tight">
                  {lang === "ur" ? risk.messageUrdu : risk.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── MARKET RATES ─────────────────────────── */
function MarketRates({ lang, selectedCity, onCityChange }: { lang: string; selectedCity: City; onCityChange: (city: City) => void }) {
  const [prices, setPrices] = useState<CommodityPrice[]>(() => getPricesByProvince(selectedCity.province));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLiveMarketRates(selectedCity).then((data) => {
      setPrices(data);
      setLoading(false);
    });
  }, [selectedCity]);

  const filtered = prices.filter((p) => p.province === selectedCity.province);

  return (
    <div>
      <LocationSelector lang={lang} selectedCity={selectedCity} onChange={onCityChange} />
      <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "منڈی کے تازہ ترین ریٹ" : "Latest Mandi Rates"}</p>
        <p className="text-xl font-bold mt-1">{lang === "ur" ? `${selectedCity.nameUr} اور اطراف` : `${selectedCity.nameEn} & nearby`}</p>
        <p className="text-white/80 text-xs">{lang === "ur" ? "گندم، کپاس، چاول، سبزیاں اور دودھ" : "Wheat, cotton, rice, vegetables & milk"}</p>
        {loading && <p className="text-[10px] text-white/70 mt-1">{lang === "ur" ? "لوڈ ہورہا ہے..." : "Loading..."}</p>}
      </div>

      <div className="space-y-2">
        {filtered.map((item: CommodityPrice) => {
          const TrendIcon = item.trend === "up" ? TrendingUp : item.trend === "down" ? TrendingDown : Minus;
          return (
            <div key={item.id} className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-bg rounded-xl flex items-center justify-center shrink-0">
                <span className="text-lg">{item.id.includes("milk") ? "🥛" : item.id.includes("egg") ? "🥚" : item.id.includes("dates") ? "🌴" : item.id.includes("apple") ? "🍎" : "🌾"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-text-primary">{lang === "ur" ? item.nameUr : item.nameEn}</p>
                <p className="text-[10px] text-text-muted">{item.market} · {item.updatedAt}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-text-primary">Rs. {item.avgPrice.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-0.5 text-[10px] font-medium ${trendClass(item.trend)}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>{trendSymbol(item.trend)} {Math.abs(item.trendPercent)}%</span>
                </div>
                <p className="text-[10px] text-text-muted">per {lang === "ur" ? item.unitUr : item.unit}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── GOVERNMENT SCHEMES ───────────────────── */
function SchemesView({ lang, selectedCity, onCityChange }: { lang: string; selectedCity: City; onCityChange: (city: City) => void }) {
  const [filter, setFilter] = useState<SchemeCategory | "all">("all");

  const baseSchemes = getSchemesByProvince(selectedCity.province);
  const filtered = filter === "all" ? baseSchemes : baseSchemes.filter((s) => s.category === filter);

  return (
    <div>
      <LocationSelector lang={lang} selectedCity={selectedCity} onChange={onCityChange} />
      <div className="bg-gradient-to-br from-warning to-warning-bg rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "سرکاری اسکیمیں" : "Government Schemes"}</p>
        <p className="text-xl font-bold mt-1">{lang === "ur" ? `${selectedCity.province === "punjab" ? "پنجاب" : "صوبہ"} کے لیے اسکیمیں` : `Schemes for ${selectedCity.province.charAt(0).toUpperCase() + selectedCity.province.slice(1)}`}</p>
        <p className="text-white/80 text-xs">{lang === "ur" ? "کسان کارڈ، ویکسین، بیج اور سولر" : "Kisan Card, vaccines, seeds & solar"}</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-1 scrollbar-none">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${filter === "all" ? "bg-primary text-white" : "bg-bg-elevated text-text-muted border border-border"}`}
        >
          {lang === "ur" ? "سب" : "All"}
        </button>
        {SCHEME_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${filter === c.id ? "bg-primary text-white" : "bg-bg-elevated text-text-muted border border-border"}`}
          >
            {lang === "ur" ? c.labelUrdu : c.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((scheme) => (
          <div key={scheme.id} className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-warning-bg rounded-lg flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="font-bold text-sm text-text-primary leading-tight">{lang === "ur" ? scheme.titleUrdu : scheme.title}</p>
                  <p className="text-[10px] text-text-muted">{lang === "ur" ? scheme.ministryUrdu : scheme.ministry}</p>
                </div>
              </div>
              {scheme.active && (
                <span className="text-[9px] px-2 py-0.5 bg-success-bg text-success rounded-full font-bold">Active</span>
              )}
            </div>
            <p className="text-xs text-text-muted mb-3 leading-relaxed">{lang === "ur" ? scheme.summaryUrdu : scheme.summary}</p>
            <div className="bg-bg-secondary rounded-xl p-3 space-y-2 mb-3">
              <p className="text-[10px]"><span className="font-bold text-text-primary">{lang === "ur" ? "اہلیت:" : "Eligibility:"}</span> <span className="text-text-muted">{lang === "ur" ? scheme.eligibilityUrdu : scheme.eligibility}</span></p>
              <p className="text-[10px]"><span className="font-bold text-text-primary">{lang === "ur" ? "فائدہ:" : "Benefit:"}</span> <span className="text-text-muted">{lang === "ur" ? scheme.benefitUrdu : scheme.benefit}</span></p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-text-muted"><Phone className="w-3 h-3 inline mr-1" />{scheme.contact}</p>
              {scheme.deadline && <p className="text-[10px] text-warning font-medium">{scheme.deadline}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── TELE-VET BOOKING ─────────────────────── */
function TeleVetBooking({ lang }: { lang: string }) {
  const [selectedType, setSelectedType] = useState<ExpertType | "all">("all");
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ConsultationType | null>(null);
  const [booked, setBooked] = useState(false);

  const filtered = selectedType === "all" ? EXPERTS : EXPERTS.filter((e) => e.type === selectedType);
  const expert = EXPERTS.find((e) => e.id === selectedExpert);

  if (booked) {
    return (
      <div className="bg-bg-elevated rounded-2xl p-6 border border-border shadow-sm text-center">
        <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">{lang === "ur" ? "بکنگ کامیاب!" : "Booking Confirmed!"}</h3>
        <p className="text-sm text-text-muted mb-4">
          {lang === "ur" ? `آپ نے ${expert?.name} سے ${selectedSlot} پر ملاقات طے کر لی۔` : `You have booked ${expert?.name} at ${selectedSlot}.`}
        </p>
        <button
          onClick={() => { setBooked(false); setSelectedExpert(null); setSelectedSlot(null); setSelectedMode(null); }}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm"
        >
          {lang === "ur" ? "ایک اور بک کریں" : "Book another"}
        </button>
      </div>
    );
  }

  if (expert) {
    return (
      <div>
        <button onClick={() => setSelectedExpert(null)} className="text-primary text-xs font-bold mb-3 flex items-center gap-1">
          <ChevronRight className="w-3 h-3 rotate-180" /> {lang === "ur" ? "واپس" : "Back"}
        </button>
        <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-3">
            {expert.image ? (
              <img src={expert.image} alt={expert.name} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 bg-primary-bg rounded-xl flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
            )}
            <div>
              <p className="font-bold text-text-primary">{expert.name}</p>
              <p className="text-xs text-text-muted">{lang === "ur" ? expert.titleUrdu : expert.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] flex items-center gap-0.5 text-warning font-bold"><Star className="w-3 h-3 fill-current" /> {expert.rating}</span>
                <span className="text-[10px] text-text-muted">{expert.consultations} consults</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-text-muted mb-2 font-bold uppercase tracking-wide">{lang === "ur" ? "مہارت:" : "Specialties"}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {(lang === "ur" ? expert.specialtiesUrdu : expert.specialties).map((s) => (
              <span key={s} className="text-[10px] px-2 py-1 bg-primary-bg text-primary rounded-full font-medium">{s}</span>
            ))}
          </div>
          <p className="text-[10px] text-text-muted mb-2 font-bold uppercase tracking-wide">{lang === "ur" ? "قسم مشاورت:" : "Consultation Type"}</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CONSULTATION_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setSelectedMode(ct.id)}
                className={`p-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${selectedMode === ct.id ? "border-primary bg-primary-bg text-primary" : "border-border bg-bg-elevated text-text-muted"}`}
              >
                {ct.label} / {ct.labelUrdu}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-text-muted mb-2 font-bold uppercase tracking-wide">{lang === "ur" ? "دستیاب وقت:" : "Available Slots"}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {expert.availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selectedSlot === slot ? "bg-primary text-white" : "bg-bg-secondary text-text-muted border border-border"}`}
              >
                {slot}
              </button>
            ))}
          </div>
          <button
            onClick={() => setBooked(true)}
            disabled={!selectedSlot || !selectedMode}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {lang === "ur" ? "تصدیق کریں" : "Confirm Booking"} — Rs. {expert.feePkr || "Free"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "ٹیلی ویٹ / فصل مشیر" : "Tele-Vet & Crop Advisor"}</p>
        <p className="text-xl font-bold mt-1">{lang === "ur" ? "ماہر سے بات کریں" : "Talk to an Expert"}</p>
        <p className="text-white/80 text-xs">{lang === "ur" ? "ویڈیو، آڈیو یا کھیت کا دورہ بک کریں" : "Book video, audio or field visit"}</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-1 scrollbar-none">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${selectedType === "all" ? "bg-primary text-white" : "bg-bg-elevated text-text-muted border border-border"}`}
        >
          {lang === "ur" ? "سب" : "All"}
        </button>
        {EXPERT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${selectedType === t.id ? "bg-primary text-white" : "bg-bg-elevated text-text-muted border border-border"}`}
          >
            {lang === "ur" ? t.labelUrdu : t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((expert) => (
          <button
            key={expert.id}
            onClick={() => setSelectedExpert(expert.id)}
            className="w-full bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm text-left flex items-center gap-3 hover:border-primary/30 transition-all"
          >
            {expert.image ? (
              <img src={expert.image} alt={expert.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 bg-primary-bg rounded-xl flex items-center justify-center shrink-0">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-text-primary">{expert.name}</p>
              <p className="text-[10px] text-text-muted">{lang === "ur" ? expert.titleUrdu : expert.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] flex items-center gap-0.5 text-warning font-bold"><Star className="w-3 h-3 fill-current" /> {expert.rating}</span>
                <span className="text-[10px] text-text-muted">{expert.experienceYears} yrs</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-primary">Rs. {expert.feePkr || "Free"}</p>
              <p className="text-[10px] text-text-muted">{lang === "ur" ? "فی سیشن" : "per session"}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── CROP CALENDAR ────────────────────────── */
function CropCalendar({ lang, selectedCity }: { lang: string; selectedCity: City }) {
  const events = getCurrentMonthEvents(selectedCity.province);

  return (
    <div>
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "فصل کیلنڈر" : "Crop Calendar"}</p>
        <p className="text-xl font-bold mt-1">{lang === "ur" ? `${selectedCity.nameUr} کے لیے` : `For ${selectedCity.nameEn}`}</p>
        <p className="text-white/80 text-xs">{lang === "ur" ? "اس مہینے کی زرعی سرگرمیاں" : "Agricultural activities this month"}</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 text-border-strong" />
          <p className="text-sm">{lang === "ur" ? "اس مہینے کوئی خاص سرگرمی نہیں" : "No major activities this month"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const label = getActivityLabel(e.activity);
            return (
              <div key={e.id} className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${label.color}`}>
                    {lang === "ur" ? label.ur : label.en}
                  </span>
                  <span className="text-[10px] text-text-muted">{formatMonthRange(e.startMonth, e.endMonth, lang as "en" | "ur")}</span>
                </div>
                <p className="font-bold text-sm text-text-primary">{lang === "ur" ? e.cropNameUr : e.cropNameEn} — {lang === "ur" ? e.activityNameUr : e.activityNameEn}</p>
                <p className="text-xs text-text-muted mt-1">{lang === "ur" ? e.noteUr : e.noteEn}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── SOIL HEALTH ──────────────────────────── */
function SoilHealth({ lang }: { lang: string }) {
  const [input, setInput] = useState<SoilTestInput>({
    ph: 7.0,
    texture: "loamy",
    organicMatter: "medium",
    salinity: "none",
  });
  const [result, setResult] = useState<ReturnType<typeof calculateSoilHealth> | null>(null);

  return (
    <div>
      <div className="bg-gradient-to-br from-amber-700 to-amber-500 rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "مٹی کی صحت" : "Soil Health"}</p>
        <p className="text-xl font-bold mt-1">{lang === "ur" ? "مٹی کا اسکور" : "Soil Score"}</p>
        <p className="text-white/80 text-xs">{lang === "ur" ? "pH، نمی اور نمکیت کا جائزہ" : "pH, texture & salinity check"}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "pH" : "pH"} <span className="font-normal normal-case">({input.ph})</span></label>
          <input
            type="range"
            min="4"
            max="10"
            step="0.1"
            value={input.ph}
            onChange={(e) => setInput({ ...input, ph: parseFloat(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        {[ 
          { key: "texture", label: lang === "ur" ? "مٹی کی قسم" : "Soil Texture", options: [["sandy", lang === "ur" ? "ریتلی" : "Sandy"], ["loamy", lang === "ur" ? "دومٹ" : "Loamy"], ["clay", lang === "ur" ? "چکنی" : "Clay"], ["silty", lang === "ur" ? "گیلی" : "Silty"]] },
          { key: "organicMatter", label: lang === "ur" ? "نامیاتی مواد" : "Organic Matter", options: [["low", lang === "ur" ? "کم" : "Low"], ["medium", lang === "ur" ? "درمیانہ" : "Medium"], ["high", lang === "ur" ? "زیادہ" : "High"]] },
          { key: "salinity", label: lang === "ur" ? "نمکیت" : "Salinity", options: [["none", lang === "ur" ? "نہیں" : "None"], ["mild", lang === "ur" ? "ہلکی" : "Mild"], ["moderate", lang === "ur" ? "درمیانی" : "Moderate"], ["severe", lang === "ur" ? "شدید" : "Severe"]] },
        ].map(({ key, label, options }) => (
          <div key={key} className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">{label}</label>
            <div className="flex flex-wrap gap-2">
              {options.map(([value, text]) => (
                <button
                  key={value}
                  onClick={() => setInput({ ...input, [key]: value } as SoilTestInput)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${(input as any)[key] === value ? "bg-primary text-white" : "bg-bg-secondary text-text-muted border border-border"}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setResult(calculateSoilHealth(input))}
        className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20"
      >
        {lang === "ur" ? "مٹی کا اسکور نکالیں" : "Calculate Soil Score"}
      </button>

      {result && (
        <div className="mt-4 bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm text-text-primary">{lang === "ur" ? "مٹی کی صحت" : "Soil Health"}</p>
            <span className="text-lg font-black" style={{ color: result.color }}>{result.score}/100</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full" style={{ width: `${result.score}%`, background: result.color }} />
          </div>
          <p className="text-xs font-bold mb-2" style={{ color: result.color }}>{lang === "ur" ? result.statusUr : result.status}</p>
          <ul className="space-y-1.5">
            {(lang === "ur" ? result.recommendationsUr : result.recommendations).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── IRRIGATION SCHEDULER ─────────────────── */
function IrrigationScheduler({ lang, selectedCity }: { lang: string; selectedCity: City }) {
  const [input, setInput] = useState<IrrigationInput>({
    crop: "wheat",
    areaAcres: 1,
    growthStage: "vegetative",
    soilTexture: "loamy",
    temperatureC: selectedCity.province === "sindh" || selectedCity.province === "balochistan" ? 35 : 28,
    daysSinceIrrigation: 5,
  });
  const [result, setResult] = useState<ReturnType<typeof calculateIrrigation> | null>(null);

  const crops = [
    { id: "wheat", name: "Wheat", nameUr: "گندم" },
    { id: "cotton", name: "Cotton", nameUr: "کپاس" },
    { id: "rice", name: "Rice", nameUr: "چاول" },
    { id: "maize", name: "Maize", nameUr: "مکئی" },
    { id: "sugarcane", name: "Sugarcane", nameUr: "گنا" },
    { id: "tomato", name: "Tomato", nameUr: "ٹماٹر" },
    { id: "potato", name: "Potato", nameUr: "آلو" },
  ];

  return (
    <div>
      <div className="bg-gradient-to-br from-cyan-600 to-blue-500 rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{lang === "ur" ? "آبیاری کی منصوبہ بندی" : "Irrigation Planner"}</p>
        <p className="text-xl font-bold mt-1">{lang === "ur" ? "کب اور کتنا پانی دیں" : "When & how much to irrigate"}</p>
        <p className="text-white/80 text-xs">{lang === "ur" ? "فصل، مرحلہ اور مٹی کے حساب سے" : "Based on crop, stage & soil"}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "فصل" : "Crop"}</label>
          <div className="grid grid-cols-4 gap-2">
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => setInput({ ...input, crop: c.id })}
                className={`py-2 rounded-xl text-[10px] font-bold transition-all ${input.crop === c.id ? "bg-primary text-white" : "bg-bg-secondary text-text-muted border border-border"}`}
              >
                {lang === "ur" ? c.nameUr : c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "رقبہ (ایکڑ)" : "Area (acres)"}</label>
          <input
            type="number"
            min="0.1"
            step="0.5"
            value={input.areaAcres}
            onChange={(e) => setInput({ ...input, areaAcres: parseFloat(e.target.value) || 1 })}
            className="w-full p-3 border border-border rounded-xl text-sm font-bold"
          />
        </div>

        <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "نمو کا مرحلہ" : "Growth Stage"}</label>
          <select
            value={input.growthStage}
            onChange={(e) => setInput({ ...input, growthStage: e.target.value as IrrigationInput["growthStage"] })}
            className="w-full p-3 border border-border rounded-xl text-sm font-bold"
          >
            <option value="establishment">{lang === "ur" ? "ابتدائی" : "Establishment"}</option>
            <option value="vegetative">{lang === "ur" ? "نمو" : "Vegetative"}</option>
            <option value="flowering">{lang === "ur" ? "پھول" : "Flowering"}</option>
            <option value="fruiting">{lang === "ur" ? "پھل" : "Fruiting"}</option>
            <option value="maturity">{lang === "ur" ? "پختگی" : "Maturity"}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "مٹی" : "Soil"}</label>
            <select
              value={input.soilTexture}
              onChange={(e) => setInput({ ...input, soilTexture: e.target.value as IrrigationInput["soilTexture"] })}
              className="w-full p-3 border border-border rounded-xl text-sm font-bold"
            >
              <option value="sandy">{lang === "ur" ? "ریتلی" : "Sandy"}</option>
              <option value="loamy">{lang === "ur" ? "دومٹ" : "Loamy"}</option>
              <option value="clay">{lang === "ur" ? "چکنی" : "Clay"}</option>
            </select>
          </div>
          <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "درجہ حرارت °C" : "Temp °C"}</label>
            <input
              type="number"
              value={input.temperatureC}
              onChange={(e) => setInput({ ...input, temperatureC: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 border border-border rounded-xl text-sm font-bold"
            />
          </div>
        </div>

        <div className="bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <label className="block text-xs font-bold text-text-muted uppercase mb-2">{lang === "ur" ? "آخری پانی کو کتنے دن ہوئے" : "Days Since Last Irrigation"}</label>
          <input
            type="number"
            min="0"
            value={input.daysSinceIrrigation}
            onChange={(e) => setInput({ ...input, daysSinceIrrigation: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border border-border rounded-xl text-sm font-bold"
          />
        </div>
      </div>

      <button
        onClick={() => setResult(calculateIrrigation(input))}
        className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20"
      >
        {lang === "ur" ? "آبیاری کا جائزہ" : "Check Irrigation Need"}
      </button>

      {result && (
        <div className="mt-4 bg-bg-elevated rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-sm text-text-primary">{lang === "ur" ? "ضرورت" : "Need"}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${result.urgency === "now" ? "bg-red-600" : result.urgency === "soon" ? "bg-warning-bg0" : result.urgency === "optional" ? "bg-info-bg0" : "bg-green-600"}`}>
              {lang === "ur" ? result.urgencyUr : result.urgency.replace("_", " ")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-info-bg rounded-xl p-2 text-center">
              <p className="text-[10px] text-text-muted">{lang === "ur" ? "ایکڑ انچ" : "Acre-in"}</p>
              <p className="text-lg font-bold text-info">{result.waterAcreInches}</p>
            </div>
            <div className="bg-info-bg rounded-xl p-2 text-center">
              <p className="text-[10px] text-text-muted">{lang === "ur" ? "لیٹر" : "Litres"}</p>
              <p className="text-sm font-bold text-info">{(result.waterLitres / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-info-bg rounded-xl p-2 text-center">
              <p className="text-[10px] text-text-muted">{lang === "ur" ? "گھنٹے" : "Hours"}</p>
              <p className="text-lg font-bold text-info">{result.durationHours}</p>
            </div>
          </div>
          <p className="text-xs text-text-muted">{lang === "ur" ? result.noteUr : result.noteEn}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── YIELD & INCOME ESTIMATOR ─────────────── */
function YieldEstimator({ lang }: { lang: string }) {
  const [crop, setCrop] = useState("wheat");
  const [area, setArea] = useState("1");
  const [unit, setUnit] = useState<"acre" | "kanal">("acre");

  const areaNum = parseFloat(area) || 1;
  const acres = unit === "kanal" ? areaNum / 8 : areaNum;
  const estimate = estimateYield(crop, acres);
  const crops = Object.keys(CROP_YIELD_DATA);

  const formatPKR = (n: number) => n.toLocaleString();

  return (
    <div>
      <div className="bg-gradient-to-br from-success to-success-bg rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
          <Wallet className="w-4 h-4" />
          {lang === "ur" ? "پیداوار اور آمدنی کا تخمینہ" : "Yield & Income Estimator"}
        </p>
        <p className="text-xs text-white/80 mt-1">
          {lang === "ur" ? "فصل اور رقبہ منتخب کریں — متوقع پیداوار اور آمدنی دیکھیں" : "Pick a crop and area — see expected harvest & income"}
        </p>
      </div>

      {/* Crop selector */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {crops.map((c) => {
          const data = CROP_YIELD_DATA[c];
          return (
            <button
              key={c}
              onClick={() => setCrop(c)}
              className={`py-2.5 px-1 rounded-xl text-center text-[10px] font-bold transition-all border ${crop === c
                ? "border-primary bg-primary-bg text-primary shadow-md"
                : "border-border bg-bg-elevated text-text-muted hover:border-border-strong"
              }`}
            >
              {lang === "ur" ? data.cropUr : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Area input */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          min="0.1"
          step="0.5"
          className="flex-1 px-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm font-bold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
          placeholder="1"
        />
        <div className="flex bg-bg-elevated border border-border rounded-xl overflow-hidden">
          {(["acre", "kanal"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-3 text-xs font-bold transition-colors ${unit === u ? "bg-primary text-white" : "text-text-muted hover:bg-bg-secondary"}`}
            >
              {lang === "ur" ? (u === "acre" ? "ایکڑ" : "کنال") : u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="bg-bg-elevated rounded-2xl border border-border shadow-md p-4 animate-fadeIn">
        <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2">
          <Wheat className="w-4 h-4 text-warning" />
          {lang === "ur" ? `تخمینہ پیداوار — ${area} ${unit === "acre" ? "ایکڑ" : "کنال"}` : `Estimated Harvest — ${area} ${unit}`}
        </h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-danger-bg border border-danger/20 rounded-xl p-3 text-center">
            <p className="text-[10px] text-text-muted mb-1">{lang === "ur" ? "کم" : "Low"}</p>
            <p className="text-lg font-bold text-danger">{estimate.lowYield}</p>
            <p className="text-[9px] text-text-muted">{lang === "ur" ? estimate.unitUr : estimate.unit}</p>
          </div>
          <div className="bg-warning-bg border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-[10px] text-text-muted mb-1">{lang === "ur" ? "اوسط" : "Average"}</p>
            <p className="text-lg font-bold text-warning">{estimate.avgYield}</p>
            <p className="text-[9px] text-text-muted">{lang === "ur" ? estimate.unitUr : estimate.unit}</p>
          </div>
          <div className="bg-success-bg border border-success/20 rounded-xl p-3 text-center">
            <p className="text-[10px] text-text-muted mb-1">{lang === "ur" ? "زیادہ" : "High"}</p>
            <p className="text-lg font-bold text-success">{estimate.highYield}</p>
            <p className="text-[9px] text-text-muted">{lang === "ur" ? estimate.unitUr : estimate.unit}</p>
          </div>
        </div>

        <h3 className="font-bold text-sm text-text-primary mb-2 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-success" />
          {lang === "ur" ? "متوقع آمدنی (روپے)" : "Estimated Income (PKR)"}
        </h3>
        <div className="space-y-1.5">
          {[
            { label: lang === "ur" ? "کم پیداوار" : "Low yield", value: estimate.lowIncome, cls: "text-danger" },
            { label: lang === "ur" ? "اوسط پیداوار" : "Average yield", value: estimate.avgIncome, cls: "text-warning" },
            { label: lang === "ur" ? "بہترین پیداوار" : "Best yield", value: estimate.highIncome, cls: "text-success" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between bg-bg-secondary rounded-xl px-3 py-2">
              <span className="text-xs text-text-muted">{row.label}</span>
              <span className={`text-sm font-bold ${row.cls}`}>Rs. {formatPKR(row.value)}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted mt-3 text-center">
          {lang === "ur" ? "📊 اوسط منڈی ریٹ پر مبنی تخمینہ — اصل ریٹ بدل سکتے ہیں" : "📊 Based on average mandi rates — actual prices may vary"}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── COMMUNITY REPORTS ───────────────────── */
function CommunityReports({ lang, selectedCity }: { lang: string; selectedCity: City }) {
  const reports = getReportsByCity(selectedCity);

  const typeIcon = (t: "pest" | "disease" | "weather") =>
    t === "pest" ? "🐛" : t === "disease" ? "🦠" : "⛈️";

  return (
    <div>
      <div className="bg-gradient-to-br from-info to-info-bg rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {lang === "ur" ? "کسان رپورٹس — قریبی الرٹس" : "Farmer Reports — Nearby Alerts"}
        </p>
        <p className="text-xs text-white/80 mt-1">
          {lang === "ur"
            ? `${selectedCity.nameUr} اور آس پاس کے علاقوں سے حقیقی اطلاعات`
            : `Real alerts from ${selectedCity.nameEn} & surrounding districts`}
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-bg-elevated rounded-2xl p-6 border border-border text-center">
          <Users className="w-10 h-10 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">
            {lang === "ur" ? "اس علاقے سے ابھی کوئی رپورٹ نہیں" : "No reports from this area yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-bg-elevated rounded-2xl border border-border shadow-sm p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg shrink-0">{typeIcon(r.type)}</span>
                  <p className="font-bold text-sm text-text-primary leading-tight">
                    {lang === "ur" ? r.titleUr : r.title}
                  </p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${severityColor(r.severity)}`}>
                  {severityLabel(r.severity, lang === "ur" ? "ur" : "en")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-text-muted mb-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.distanceKm} km</span>
                <span>🌾 {lang === "ur" ? r.cropUr : r.crop}</span>
                <span>{new Date(r.reportedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </div>
              <div className="bg-primary-bg border border-primary/10 rounded-xl p-2.5">
                <p className="text-xs text-primary leading-relaxed flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {lang === "ur" ? r.tipsUr : r.tips}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-text-muted mt-3 text-center">
        {lang === "ur" ? "🤝 کسانوں کی مشترکہ رپورٹس — AI سے تصدیق شدہ" : "🤝 Crowdsourced by farmers — AI verified"}
      </p>
    </div>
  );
}

/* ─────────────────────────── SEED CALCULATOR ──────────────────────── */
function SeedCalculator({ lang }: { lang: string }) {
  const [crop, setCrop] = useState("wheat");
  const [area, setArea] = useState("1");
  const [unit, setUnit] = useState<"acre" | "kanal">("acre");

  const areaNum = parseFloat(area) || 1;
  const acres = unit === "kanal" ? areaNum / 8 : areaNum;
  const { totalKg, rate } = calculateSeedRequirement(crop, acres);

  return (
    <div>
      <div className="bg-gradient-to-br from-warning to-warning-bg rounded-2xl p-4 text-white shadow-lg mb-4">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
          <Sprout className="w-4 h-4" />
          {lang === "ur" ? "بیج کی مقدار کا حساب" : "Seed Rate Calculator"}
        </p>
        <p className="text-xs text-white/80 mt-1">
          {lang === "ur" ? "درست بیج کی مقدار سے بہتر اگاؤ" : "Right seed rate for optimal germination"}
        </p>
      </div>

      {/* Crop grid */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {["wheat", "rice", "cotton", "maize", "sugarcane", "tomato", "potato"].map((c) => {
          const data = CROP_YIELD_DATA[c];
          return (
            <button
              key={c}
              onClick={() => setCrop(c)}
              className={`py-2.5 px-1 rounded-xl text-[10px] font-bold transition-all border ${crop === c
                ? "border-primary bg-primary-bg text-primary shadow-md"
                : "border-border bg-bg-elevated text-text-muted hover:border-border-strong"
              }`}
            >
              {data ? (lang === "ur" ? data.cropUr : c.charAt(0).toUpperCase() + c.slice(1)) : c}
            </button>
          );
        })}
      </div>

      {/* Area */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          min="0.1"
          step="0.5"
          className="flex-1 px-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm font-bold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
          placeholder="1"
        />
        <div className="flex bg-bg-elevated border border-border rounded-xl overflow-hidden">
          {(["acre", "kanal"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-3 text-xs font-bold transition-colors ${unit === u ? "bg-primary text-white" : "text-text-muted hover:bg-bg-secondary"}`}
            >
              {lang === "ur" ? (u === "acre" ? "ایکڑ" : "کنال") : u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="bg-bg-elevated rounded-2xl border border-border shadow-md p-4 animate-fadeIn">
        <div className="bg-primary-bg border border-primary/20 rounded-2xl p-5 text-center mb-4">
          <p className="text-xs text-text-muted mb-1 font-semibold uppercase tracking-wide">
            {lang === "ur" ? "کل بیج درکار" : "Total Seed Required"}
          </p>
          <p className="text-3xl font-black text-primary">{totalKg.toLocaleString()}</p>
          <p className="text-xs text-text-muted">kg</p>
        </div>
        <div className="space-y-1.5">
          {[
            { l: lang === "ur" ? "فی ایکڑ شرح" : "Rate per acre", v: `${rate.seedRateKgPerAcre} kg` },
            { l: lang === "ur" ? "فاصلہ" : "Spacing", v: lang === "ur" ? rate.spacingCmUr : rate.spacingCm },
            { l: lang === "ur" ? "سیزن" : "Season", v: lang === "ur" ? rate.seasonUr : rate.season },
          ].map((row) => (
            <div key={row.l} className="flex items-center justify-between bg-bg-secondary rounded-xl px-3 py-2">
              <span className="text-xs text-text-muted">{row.l}</span>
              <span className="text-xs font-bold text-text-primary">{row.v}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted mt-3 text-center">
          {lang === "ur" ? "🌱 تصدیق شدہ بیج استعمال کریں بہتر پیداوار کے لیے" : "🌱 Use certified seed for best germination"}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN SCREEN ────────────────────────────── */
const TABS = [
  { id: "library", icon: BookOpen, labelEn: "Disease Library", labelUr: "بیماری کتب خانہ" },
  { id: "weather", icon: CloudSun, labelEn: "Weather", labelUr: "موسم" },
  { id: "calculator", icon: Calculator, labelEn: "Fertilizer", labelUr: "کھاد" },
  { id: "yield", icon: Wheat, labelEn: "Yield", labelUr: "پیداوار" },
  { id: "seed", icon: Sprout, labelEn: "Seed Rate", labelUr: "بیج" },
  { id: "market", icon: TrendingUp, labelEn: "Mandi Rates", labelUr: "منڈی ریٹ" },
  { id: "calendar", icon: CalendarDays, labelEn: "Calendar", labelUr: "کیلنڈر" },
  { id: "soil", icon: Sprout, labelEn: "Soil", labelUr: "مٹی" },
  { id: "irrigation", icon: Droplets, labelEn: "Irrigation", labelUr: "آبیاری" },
  { id: "community", icon: Users, labelEn: "Reports", labelUr: "رپورٹس" },
  { id: "schemes", icon: Landmark, labelEn: "Schemes", labelUr: "اسکیمیں" },
  { id: "televet", icon: Video, labelEn: "Tele-Vet", labelUr: "ٹیلی ویٹ" },
  { id: "pitch", icon: Presentation, labelEn: "Startup Deck", labelUr: "اسٹارٹ اپ ڈیک" },
  { id: "helplines", icon: Phone, labelEn: "Helplines", labelUr: "ہیلپ لائنز" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function ToolsScreen() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("library");
  const [selectedCity, setSelectedCity] = useState<City>(getSelectedCity);

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    persistSelectedCity(city);
  };

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-heading font-bold text-text-primary">
          {lang === "ur" ? "کسان ہب 🌾" : "Farmer Hub 🌾"}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          {lang === "ur" ? "علم، حساب، ہیلپ لائن، ریٹ — سب ایک جگہ" : "Knowledge, Tools, Rates & Helplines — all in one place"}
        </p>
      </div>

      {/* Tab bar — horizontally scrollable for 14 tabs */}
      <div className="px-5 mb-4">
        <div className="bg-bg-elevated border border-border rounded-2xl p-1.5 flex overflow-x-auto scrollbar-none gap-1.5">
          {TABS.map(({ id, icon: Icon, labelEn, labelUr }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-center transition-all duration-200 min-w-[68px] shrink-0 ${activeTab === id
                ? "bg-primary text-white shadow-md"
                : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-bold leading-tight whitespace-nowrap">{lang === "ur" ? labelUr : labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-5 overflow-y-auto">
        {activeTab === "library" && <DiseaseLibrary lang={lang} />}
        {activeTab === "weather" && <WeatherForecast lang={lang} selectedCity={selectedCity} onCityChange={handleCityChange} />}
        {activeTab === "calculator" && <FertilizerCalculator lang={lang} />}
        {activeTab === "yield" && <YieldEstimator lang={lang} />}
        {activeTab === "seed" && <SeedCalculator lang={lang} />}
        {activeTab === "market" && <MarketRates lang={lang} selectedCity={selectedCity} onCityChange={handleCityChange} />}
        {activeTab === "calendar" && <CropCalendar lang={lang} selectedCity={selectedCity} />}
        {activeTab === "soil" && <SoilHealth lang={lang} />}
        {activeTab === "irrigation" && <IrrigationScheduler lang={lang} selectedCity={selectedCity} />}
        {activeTab === "community" && <CommunityReports lang={lang} selectedCity={selectedCity} />}
        {activeTab === "schemes" && <SchemesView lang={lang} selectedCity={selectedCity} onCityChange={handleCityChange} />}
        {activeTab === "televet" && <TeleVetBooking lang={lang} />}
        {activeTab === "pitch" && <PitchDeck lang={lang} />}
        {activeTab === "helplines" && <Helplines />}
      </div>
    </div>
  );
}
