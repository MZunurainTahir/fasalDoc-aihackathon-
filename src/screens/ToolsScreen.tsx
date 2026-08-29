import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { REMEDY_DATABASE, CROP_LIST, LIVESTOCK_LIST, RemedyInfo } from "../lib/remedyData";
import {
  BookOpen, Calculator, Presentation, Phone, Leaf, Search,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info,
  FlaskConical, ShieldCheck, TrendingDown,
  Wheat, Beef, PhoneCall, HeartPulse,
} from "lucide-react";

/* ─────────────────────────── DISEASE LIBRARY ─────────────────────── */
function DiseaseCard({ disease, lang }: { disease: RemedyInfo; lang: string }) {
  const [expanded, setExpanded] = useState(false);

  const severityConfig = {
    low: { color: "bg-green-100 text-green-700 border-green-200", label: "Low Risk", labelUr: "کم خطرہ" },
    medium: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Moderate", labelUr: "درمیانہ" },
    high: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "High Risk", labelUr: "زیادہ خطرہ" },
    critical: { color: "bg-red-100 text-red-700 border-red-200", label: "Critical", labelUr: "انتہائی خطرناک" },
  };
  const sev = severityConfig[disease.severity];

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left min-touch"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${disease.category === "crop" ? "bg-primary-bg" : "bg-amber-50"}`}>
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
        <div className="px-4 pb-4 border-t border-gray-50 animate-fadeIn">
          {/* Symptoms */}
          <div className="mt-3">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {lang === "ur" ? "علامات" : "Symptoms"}
            </h4>
            <ul className="space-y-1.5">
              {(lang === "ur" ? disease.symptomsUrdu : disease.symptoms).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Organic remedy */}
          <div className="mt-3 bg-green-50 rounded-xl p-3 border border-green-100">
            <h4 className="text-xs font-bold text-green-700 mb-1.5 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              {lang === "ur" ? "قدرتی علاج" : "Organic Treatment"}
            </h4>
            <p className="text-xs text-green-800 leading-relaxed">{lang === "ur" ? disease.organicUrdu : disease.organic}</p>
          </div>

          {/* Chemical remedy */}
          <div className="mt-2 bg-blue-50 rounded-xl p-3 border border-blue-100">
            <h4 className="text-xs font-bold text-blue-700 mb-1.5 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              {lang === "ur" ? "کیمیائی علاج" : "Chemical Treatment"}
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">{lang === "ur" ? disease.chemicalUrdu : disease.chemical}</p>
          </div>

          {/* Dosage & Cost */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] text-text-muted mb-1 font-semibold uppercase tracking-wide">
                {lang === "ur" ? "خوراک" : "Dosage"}
              </p>
              <p className="text-xs text-text-primary font-medium">{lang === "ur" ? disease.dosageUrdu : disease.dosage}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-[10px] text-amber-600 mb-1 font-semibold uppercase tracking-wide">
                {lang === "ur" ? "تخمینہ لاگت" : "Est. Cost"}
              </p>
              <p className="text-xs text-amber-800 font-bold">{disease.estimatedCostPkr}</p>
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
          <div className="mt-3 bg-purple-50 rounded-xl p-3 border border-purple-100">
            <h4 className="text-xs font-bold text-purple-700 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === "ur" ? "احتیاطی تدابیر" : "Prevention"}
            </h4>
            <p className="text-xs text-purple-800 leading-relaxed">{lang === "ur" ? disease.preventionUrdu : disease.prevention}</p>
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
          className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
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
              : "bg-white text-text-muted border border-border"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-full text-xs hover:border-primary/30 hover:shadow-sm transition-all"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-full text-xs hover:border-amber-300 hover:shadow-sm transition-all"
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
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
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
      <div className="bg-gradient-to-br from-primary-bg to-white rounded-2xl p-4 border border-primary/10 mb-4">
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
                : "border-gray-100 bg-white hover:border-gray-200"
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
              className="w-full pr-4 pl-4 py-3 bg-white border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all font-bold text-text-primary"
              placeholder="1"
            />
          </div>
          <div className="flex bg-white border border-border rounded-xl overflow-hidden">
            {(["acre", "kanal"] as const).map((u) => (
              <button
                key={u}
                onClick={() => { setUnit(u); setCalculated(false); }}
                className={`px-4 py-3 text-xs font-bold transition-colors ${unit === u ? "bg-primary text-white" : "text-text-muted hover:bg-gray-50"}`}
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
          <div className="bg-white rounded-2xl border border-border shadow-md p-4">
            <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              {lang === "ur" ? "تجویز کردہ کھادیں" : "Recommended Fertilizers"}
              <span className="ml-auto text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                {area} {lang === "ur" ? (unit === "acre" ? "ایکڑ" : "کنال") : unit}
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Urea یوریا", value: rec.urea * convFactor, color: "bg-blue-50 border-blue-100 text-blue-700", unit: "kg" },
                { label: "DAP ڈی اے پی", value: rec.dap * convFactor, color: "bg-orange-50 border-orange-100 text-orange-700", unit: "kg" },
                { label: "Potash پوٹاش", value: rec.potash * convFactor, color: "bg-purple-50 border-purple-100 text-purple-700", unit: "kg" },
                { label: "Zinc Sulphate زنک", value: rec.zinc * convFactor, color: "bg-teal-50 border-teal-100 text-teal-700", unit: "kg" },
              ].map(({ label, value, color, unit: u }) => (
                <div key={label} className={`${color} rounded-xl p-3 border`}>
                  <p className="text-[10px] font-semibold mb-1 leading-tight">{label}</p>
                  <p className="text-xl font-bold">{value.toFixed(1)}</p>
                  <p className="text-[10px] opacity-70">{u} / {lang === "ur" ? (unit === "acre" ? "ایکڑ" : "کنال") : unit}</p>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
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
          <div className="mt-4 bg-white rounded-2xl border border-border shadow-md p-4">
            <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-600" />
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
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-50">
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
    subtitleEn: "AI-Powered Agricultural Health Companion for Pakistan",
    subtitleUr: "پاکستانی کسانوں کے لیے مصنوعی ذہانت سے لیس زرعی صحت ساتھی",
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
      "🌐 Bilingual: Full Urdu + English support with voice",
      "📡 100% Offline-first — works without internet",
      "💊 Local brand remedies with PKR costs & dosages",
    ],
    pointsUr: [
      "📸 تصویر لیں → AI 3 سیکنڈ میں تشخیص کرے",
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
      "Q4 2025: Punjab Agriculture Dept. MOU target",
      "Q1 2026: 50,000 registered users — 12 crops",
      "Q2 2026: Livestock module + Bangladesh & India launch",
    ],
    pointsUr: [
      "Q3 2025: فیصل آباد ضلع میں 500 بیٹا کاشتکار",
      "Q4 2025: پنجاب زرعی محکمہ سے یادداشت",
      "Q1 2026: 50,000 رجسٹرڈ صارفین — 12 فصلیں",
      "Q2 2026: مویشی ماڈیول + بنگلہ دیش اور بھارت",
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
    subtitleEn: "Seeking Rs. 50L seed funding from HATCH / NSTP",
    subtitleUr: "HATCH / NSTP سے 50 لاکھ روپے ابتدائی سرمایہ",
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
          className="flex-1 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-text-primary hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
      className={`flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:shadow-lg hover:border-${color.split('-')[1]}/30 transition-all duration-200 min-touch active:scale-[0.97]`}
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0 shadow-md`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-text-primary">{lang === "ur" ? nameUr : name}</p>
        <p className="text-lg font-black text-primary font-mono tracking-wide">{number}</p>
        <p className="text-[10px] text-text-muted">{lang === "ur" ? hoursUr : hours}</p>
      </div>
      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
        <PhoneCall className="w-4 h-4 text-green-700" />
      </div>
    </a>
  );
}

function Helplines() {
  const { lang } = useLanguage();
  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          {lang === "ur"
            ? "ہنگامی صورت حال میں فوری ڈاکٹر یا ماہر سے رابطہ کریں۔"
            : "In case of emergency, contact a doctor or extension officer immediately."}
        </p>
      </div>
      <div className="space-y-3">
        <HelplineCard
          icon={<Wheat className="w-5 h-5 text-green-700" />}
          name="Punjab Agriculture Helpline" nameUr="پنجاب زراعت ہیلپ لائن"
          number="0800-15000"
          hours="Mon–Fri: 8AM–8PM" hoursUr="پیر–جمعہ: صبح 8 – رات 8"
          color="bg-green-100"
        />
        <HelplineCard
          icon={<Beef className="w-5 h-5 text-amber-700" />}
          name="Livestock Disease Helpline" nameUr="مویشی بیماری ہیلپ لائن"
          number="0800-78685"
          hours="24/7 Emergency Line" hoursUr="24 گھنٹے، 7 دن ہنگامی سروس"
          color="bg-amber-100"
        />
        <HelplineCard
          icon={<HeartPulse className="w-5 h-5 text-red-700" />}
          name="Kisan SMS Service" nameUr="کسان ایس ایم ایس سروس"
          number="8001"
          hours="Send disease query via SMS (Free)" hoursUr="بیماری سوال SMS کریں (مفت)"
          color="bg-red-100"
        />
        <HelplineCard
          icon={<Info className="w-5 h-5 text-blue-700" />}
          name="NARC Extension (Islamabad)" nameUr="NARC زرعی توسیع (اسلام آباد)"
          number="051-9255080"
          hours="Office hours" hoursUr="دفتری اوقات"
          color="bg-blue-100"
        />
        <HelplineCard
          icon={<TrendingDown className="w-5 h-5 text-purple-700" />}
          name="ZTBL Kisan Card Support" nameUr="زرعی ترقیاتی بینک معاونت"
          number="0800-00682"
          hours="Mon–Sat: 9AM–5PM" hoursUr="پیر–ہفتہ: صبح 9 – شام 5"
          color="bg-purple-100"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN SCREEN ────────────────────────────── */
const TABS = [
  { id: "library", icon: BookOpen, labelEn: "Disease Library", labelUr: "بیماری کتب خانہ" },
  { id: "calculator", icon: Calculator, labelEn: "Fertilizer Calc", labelUr: "کھاد کیلکولیٹر" },
  { id: "pitch", icon: Presentation, labelEn: "Startup Deck", labelUr: "اسٹارٹ اپ ڈیک" },
  { id: "helplines", icon: Phone, labelEn: "Helplines", labelUr: "ہیلپ لائنز" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function ToolsScreen() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("library");

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-heading font-bold text-text-primary">
          {lang === "ur" ? "کسان ہب 🌾" : "Farmer Hub 🌾"}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          {lang === "ur" ? "علم، حساب، ہیلپ لائن — سب ایک جگہ" : "Knowledge, Tools & Helplines — all in one place"}
        </p>
      </div>

      {/* Tab bar */}
      <div className="px-5 mb-4">
        <div className="bg-white border border-border rounded-2xl p-1 grid grid-cols-4 gap-1">
          {TABS.map(({ id, icon: Icon, labelEn, labelUr }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-center transition-all duration-200 ${activeTab === id
                ? "bg-primary text-white shadow-md"
                : "text-text-muted hover:text-text-primary hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-bold leading-tight">{lang === "ur" ? labelUr : labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-5 overflow-y-auto">
        {activeTab === "library" && <DiseaseLibrary lang={lang} />}
        {activeTab === "calculator" && <FertilizerCalculator lang={lang} />}
        {activeTab === "pitch" && <PitchDeck lang={lang} />}
        {activeTab === "helplines" && <Helplines />}
      </div>
    </div>
  );
}
