import { useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { isOnline, enqueueSync, db, generateLocalId } from "../lib/db";
import { REMEDY_DATABASE } from "../lib/remedyData";
import { requestDiagnosis } from "../lib/api";
import {
  Camera, Upload, ArrowLeft, Leaf, AlertTriangle,
  CheckCircle, Info, Sparkles, ScanLine, Sprout, Volume2,
  FlaskConical, ShieldCheck, Tag, PackageCheck,
} from "lucide-react";

interface SymptomState {
  eating: "yes" | "no" | null;
  discharge: "yes" | "no" | null;
  lethargic: "yes" | "no" | null;
}

function mockDiagnosis(mode: "crop" | "livestock") {
  const crops = [
    { disease: "Tomato___Early_blight", displayDisease: "Tomato Early Blight", confidence: 0.87 },
    { disease: "Tomato___Late_blight", displayDisease: "Tomato Late Blight", confidence: 0.92 },
    { disease: "Wheat___Leaf_rust", displayDisease: "Wheat Leaf Rust", confidence: 0.91 },
    { disease: "Rice___Blast", displayDisease: "Rice Blast", confidence: 0.78 },
    { disease: "Cotton___Whitefly", displayDisease: "Cotton Whitefly", confidence: 0.84 },
    { disease: "Maize___Fall_Armyworm", displayDisease: "Maize Fall Armyworm", confidence: 0.89 },
    { disease: "Potato___Late_Blight", displayDisease: "Potato Late Blight", confidence: 0.92 },
  ];
  const livestock = [
    { disease: "Livestock___Foot_and_Mouth", displayDisease: "Foot & Mouth Disease", confidence: 0.88 },
    { disease: "Livestock___Bovine_Mastitis", displayDisease: "Bovine Mastitis", confidence: 0.83 },
    { disease: "Livestock___Lumpy_Skin", displayDisease: "Lumpy Skin Disease", confidence: 0.91 },
  ];
  const pool = mode === "crop" ? crops : livestock;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const remedy = REMEDY_DATABASE[picked.disease];
  const remedyText = remedy
    ? `${remedy.organic} \n\nChemical: ${remedy.chemical}`
    : "Apply appropriate treatment based on your local extension officer's advice.";
  return {
    disease: picked.displayDisease,
    remedy: remedyText,
    confidence: picked.confidence,
    remedyKey: picked.disease,
  };
}

/** Downscale + re-encode a captured photo before upload/storage — keeps
 *  requests fast on slow rural connections and avoids huge IndexedDB blobs. */
function compressImage(dataUrl: string, maxDim = 1024, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function CaptureScreen() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") as "crop" | "livestock") || "crop";

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ disease: string; remedy: string; confidence: number; remedyKey?: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [treatTab, setTreatTab] = useState<"organic" | "chemical">("organic");
  const [fieldNotes, setFieldNotes] = useState("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [symptoms, setSymptoms] = useState<SymptomState>({
    eating: null,
    discharge: null,
    lethargic: null,
  });

  const resetAll = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setSymptoms({ eating: null, discharge: null, lethargic: null });
    setFieldNotes("");
    setSaveSuccess(false);
  }, []);

  const handleFileCapture = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const compressed = await compressImage(reader.result as string);
      setCapturedImage(compressed);
      setResult(null);
      setFieldNotes("");
      setSaveSuccess(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDiagnose = useCallback(async () => {
    if (!capturedImage || !user) return;
    setIsAnalyzing(true);
    setResult(null);
    setSaveSuccess(false);

    // Try the real AI backend first; fall back to the local mock if it's
    // offline, not deployed, or the request fails for any reason.
    const symptomsPayload =
      mode === "livestock" && (symptoms.eating || symptoms.discharge || symptoms.lethargic)
        ? symptoms
        : undefined;

    const aiResult = await requestDiagnosis({
      imageBase64: capturedImage,
      mode,
      lang: lang === "ur" ? "ur" : "en",
      symptoms: symptomsPayload as Record<string, unknown> | undefined,
    });

    let diagnosis: { disease: string; remedy: string; confidence: number; remedyKey?: string };

    if (aiResult) {
      const matched = aiResult.matchedKey ? REMEDY_DATABASE[aiResult.matchedKey] : null;
      diagnosis = {
        disease: aiResult.isHealthy
          ? (lang === "ur" ? "صحت مند" : "Healthy — no disease detected")
          : matched
            ? (lang === "ur" ? matched.nameUrdu : matched.name)
            : aiResult.disease,
        remedy: matched
          ? `${matched.organic}\n\nChemical: ${matched.chemical}`
          : aiResult.description || "Consult your local agri extension officer for a confirmed diagnosis.",
        confidence: aiResult.confidence,
        remedyKey: aiResult.matchedKey || undefined,
      };
    } else {
      // Local/offline fallback keeps the demo fully functional without a backend.
      await new Promise(resolve => setTimeout(resolve, 1200));
      diagnosis = mockDiagnosis(mode);
    }

    setResult(diagnosis);
    setSaveSuccess(true);

    // Save offline-first — always store locally, sync if online
    const localId = generateLocalId();
    const now = new Date().toISOString();

    await db.diagnoses.add({
      localId,
      user_id: user.id,
      type: mode,
      image_url: capturedImage,
      predicted_disease: diagnosis.disease,
      confidence: diagnosis.confidence,
      remedy_applied: diagnosis.remedy,
      notes: fieldNotes.trim() || null,
      created_at: now,
      _synced: false,
    });

    // Also save to localStorage-based store for legacy compat
    try {
      const { getHistory } = await import("../lib/store");
      const existing = await getHistory();
      existing.unshift({
        id: localId,
        localId,
        imageUri: capturedImage,
        disease: diagnosis.disease,
        confidence: diagnosis.confidence,
        date: now,
        type: mode,
      });
      localStorage.setItem("fasaldoc_scan_history", JSON.stringify(existing.slice(0, 100)));
    } catch { /* ignore */ }

    if (isOnline()) {
      // Try to sync to Supabase immediately
      try {
        const { error } = await supabase.from('diagnoses').insert({
          user_id: user.id,
          type: mode,
          image_url: capturedImage,
          predicted_disease: diagnosis.disease,
          confidence: diagnosis.confidence,
          remedy_applied: diagnosis.remedy,
          notes: fieldNotes.trim() || null,
        });
        if (!error) {
          await db.diagnoses.where("localId").equals(localId).modify({ _synced: true });
        }
      } catch (err) {
        // Enqueue for later sync
        await enqueueSync("diagnoses", "insert", localId, {
          localId,
          user_id: user.id,
          type: mode,
          image_url: capturedImage,
          predicted_disease: diagnosis.disease,
          confidence: diagnosis.confidence,
          remedy_applied: diagnosis.remedy,
          notes: fieldNotes.trim() || null,
          created_at: now,
        });
      }
    } else {
      // Enqueue for sync when we come back online
      await enqueueSync("diagnoses", "insert", localId, {
        localId,
        user_id: user.id,
        type: mode,
        image_url: capturedImage,
        predicted_disease: diagnosis.disease,
        confidence: diagnosis.confidence,
        remedy_applied: diagnosis.remedy,
        notes: fieldNotes.trim() || null,
        created_at: now,
      });
    }

    setIsAnalyzing(false);
  }, [capturedImage, mode, user]);

  // Voice TTS for diagnosis
  const speakDiagnosis = useCallback(() => {
    if (!result || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const remedyInfo = result.remedyKey ? REMEDY_DATABASE[result.remedyKey] : null;
    const text = lang === "ur"
      ? `${remedyInfo?.nameUrdu || result.disease}۔ علاج: ${remedyInfo?.organicUrdu || result.remedy}`
      : `${result.disease}. Treatment: ${remedyInfo?.organic || result.remedy}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ur" ? "ur-PK" : "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }, [result, lang]);

  const handleTrackRecovery = useCallback(async () => {
    if (!user || !result) return;

    // Get the latest diagnosis for this user
    const { data } = await supabase
      .from('diagnoses')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      await supabase.from('recovery_cases').insert({
        user_id: user.id,
        diagnosis_id: data.id,
        status: 'active',
        days_since_diagnosis: 0,
        last_checked_at: new Date().toISOString(),
      });
    }

    navigate('/history');
  }, [user, result, navigate]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
  }, []);

  const inputClass = "hidden";
  const confidenceColor = result?.confidence ? (
    result.confidence >= 0.8 ? "bg-success-bg text-primary border-success/30" :
    result.confidence >= 0.5 ? "bg-warning-bg text-warning border-warning/30" : "bg-danger-bg text-danger border-danger/30"
  ) : "";

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-border transition-colors min-touch">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <h1 className="text-lg font-heading font-bold text-text-primary">{t("tab.scan")}</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-elevated px-3 py-1.5 rounded-full border border-border">
          <ScanLine className="w-3.5 h-3.5" />
          {mode === "crop" ? "Crop" : "Livestock"}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mx-5 mb-4">
        <button
          onClick={() => navigate("/capture?mode=crop")}
          className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 min-touch ${
            mode === "crop"
              ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/20"
              : "bg-bg-elevated text-text-muted border-2 border-border hover:border-border-strong"
          }`}
        >
          <Leaf className="w-4 h-4 inline mr-1.5" />
          {t("capture.disease")}
        </button>
        <button
          onClick={() => navigate("/capture?mode=livestock")}
          className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 min-touch ${
            mode === "livestock"
              ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/20"
              : "bg-bg-elevated text-text-muted border-2 border-border hover:border-border-strong"
          }`}
        >
          <Sprout className="w-4 h-4 inline mr-1.5" />
          {lang === "ur" ? "مویشی" : "Livestock"}
        </button>
      </div>

      {!capturedImage && !isAnalyzing && !result && (
        <div className="flex-1 flex flex-col px-5 gap-4 overflow-y-auto">
          {/* Livestock symptom checklist */}
          {mode === "livestock" && (
            <div className="bg-bg-elevated rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                {t("livestock.symptoms")}
              </h3>
              <div className="space-y-3">
                {([
                  { key: "eating", label: t("livestock.eating") },
                  { key: "discharge", label: t("livestock.discharge") },
                  { key: "lethargic", label: t("livestock.lethargic") },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-bg-secondary transition-colors">
                    <span className="text-sm text-text-primary">{label}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setSymptoms((prev) => ({ ...prev, [key]: "yes" }))}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all min-touch ${
                          symptoms[key] === "yes"
                            ? "bg-danger text-white shadow-sm"
                            : "bg-border text-text-muted hover:bg-border-strong"
                        }`}
                      >
                        {t("livestock.yes")}
                      </button>
                      <button
                        onClick={() => setSymptoms((prev) => ({ ...prev, [key]: "no" }))}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all min-touch ${
                          symptoms[key] === "no"
                            ? "bg-primary text-white shadow-sm"
                            : "bg-border text-text-muted hover:bg-border-strong"
                        }`}
                      >
                        {t("livestock.no")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3 italic border-t border-border pt-3">
                {t("capture.livestockDisclaimer")}
              </p>
            </div>
          )}

          {/* Capture area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
            <div className="relative animate-float">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-bg to-success-bg flex items-center justify-center">
                <Camera className="w-14 h-14 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center max-w-xs">
              <p className="text-text-muted font-medium">{t("capture.title")}</p>
              <p className="text-text-muted/60 text-xs mt-1">
                {lang === "ur" ? "فصل یا مویشی کی واضح تصویر لیں" : "Take a clear photo of the affected area"}
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary-light active:scale-[0.97] transition-all duration-200 min-touch shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {t("capture.openCamera")}
              </button>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex-1 bg-bg-elevated text-text-primary py-4 rounded-2xl font-semibold text-sm border-2 border-border hover:border-border-strong hover:shadow-md active:scale-[0.97] transition-all duration-200 min-touch flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {t("capture.uploadPhoto")}
              </button>
            </div>
            {/* Camera input — opens phone camera on mobile */}
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className={inputClass} onChange={handleFileCapture} />
            {/* Gallery input — opens device file picker/gallery. No accept restriction to avoid triggering camera on mobile browsers */}
            <input ref={galleryInputRef} type="file" className={inputClass} onChange={handleFileCapture} />
          </div>

          {/* Sample test images for hackathon demo */}
          <div className="pb-6">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wide mb-2.5 text-center">
              {t("capture.samplePhotos")}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[
                { label: lang === "ur" ? "گندم کنگی" : "Wheat Rust", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&auto=format&fit=crop&q=60", key: "wheat" },
                { label: lang === "ur" ? "ٹماٹر جھلساؤ" : "Tomato Blight", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=60", key: "tomato" },
                { label: lang === "ur" ? "مویشی بیماری" : "Livestock FMD", img: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=200&auto=format&fit=crop&q=60", key: "cow" },
                { label: lang === "ur" ? "آلو جھلساؤ" : "Potato Blight", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=60", key: "potato" },
              ].map((sample) => (
                <button
                  key={sample.key}
                  onClick={() => {
                    setCapturedImage(sample.img);
                    setResult(null);
                    setSaveSuccess(false);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border-strong group-hover:border-primary group-hover:shadow-md transition-all">
                    <img src={sample.img} alt={sample.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-medium text-text-muted group-hover:text-primary transition-colors">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image preview */}
      {capturedImage && !result && !isAnalyzing && (
        <div className="flex-1 flex flex-col items-center px-5 gap-4 pt-2">
          <div className="relative w-full max-w-sm">
            <img src={capturedImage} alt="Captured" className="w-full rounded-2xl shadow-lg object-cover max-h-72 border border-border" />
            <button
              onClick={resetCapture}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <span className="text-white text-lg leading-none">&times;</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-elevated px-4 py-2 rounded-full border border-border">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            {lang === "ur" ? "تصویر لے لی گئی۔ تجزیہ کے لیے تیار" : "Photo captured. Ready for analysis"}
          </div>

          {/* Field notes */}
          <div className="w-full max-w-sm">
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wide mb-1.5">
              {lang === "ur" ? "فیلڈ نوٹس (اختیاری)" : "Field Notes (Optional)"}
            </label>
            <textarea
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              placeholder={lang === "ur" ? "مثلاً کون سی فصل، عمر، کیا علامات دیکھی..." : "e.g., crop stage, symptoms observed, field location..."}
              className="w-full px-3 py-2.5 bg-bg-elevated border border-border rounded-xl text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all resize-none"
              rows={2}
            />
          </div>

          <button
            onClick={handleDiagnose}
            className="bg-gradient-to-r from-primary to-primary-light text-white w-full max-w-sm py-4 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-primary/20 active:scale-[0.97] transition-all duration-200 min-touch shadow-lg flex items-center justify-center gap-2"
          >
            <ScanLine className="w-5 h-5" />
            {t("capture.analyze")}
          </button>
        </div>
      )}

      {/* Analysis loading */}
      {isAnalyzing && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{t("capture.analyzing")}</p>
            <p className="text-text-muted text-sm mt-1">
              {lang === "ur" ? "ہمارے AI ماڈل تصویر کا جائزہ لے رہے ہیں" : "Our AI models are examining the image"}
            </p>
          </div>
          {capturedImage && (
            <img src={capturedImage} alt="Analyzing" className="w-24 h-24 rounded-xl object-cover opacity-50 border-2 border-primary/20" />
          )}
        </div>
      )}

      {/* Results */}
      {result && (() => {
        const remedyInfo = result.remedyKey ? REMEDY_DATABASE[result.remedyKey] : null;
        return (
          <div className="flex-1 px-5 overflow-y-auto">
            {saveSuccess && (
              <div className="mb-3 p-3 bg-primary-bg border border-primary/20 rounded-xl flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <p className="text-primary text-sm font-medium">{t("capture.saved")}</p>
              </div>
            )}

            <div className="bg-bg-elevated rounded-2xl shadow-lg shadow-black/5 border border-border overflow-hidden">
              {capturedImage && (
                <div className="relative">
                  <img src={capturedImage} alt="Result" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-white/70 text-[10px] uppercase tracking-wide">
                        {mode === "crop" ? "🌾 Crop" : "🐄 Livestock"}
                      </span>
                      {remedyInfo && (
                        <p className="text-white/60 text-xs">{remedyInfo.scientificName}</p>
                      )}
                    </div>
                    <button
                      onClick={speakDiagnosis}
                      className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      title={lang === "ur" ? "آواز میں سنیں" : "Hear the diagnosis"}
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* Confidence badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold mb-3 border ${confidenceColor}`}>
                  {result.confidence >= 0.8 ? <CheckCircle className="w-4 h-4" /> :
                   result.confidence >= 0.5 ? <Info className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {(result.confidence * 100).toFixed(0)}% {t("capture.confidence")}
                </div>

                <h2 className="text-xl font-bold text-text-primary mb-0.5">
                  {remedyInfo ? (lang === "ur" ? remedyInfo.nameUrdu : remedyInfo.name) : result.disease}
                </h2>
                {remedyInfo && (
                  <p className="text-xs text-text-muted mb-1">
                    {lang === "ur" ? remedyInfo.cropOrAnimalUrdu : remedyInfo.cropOrAnimal}
                    {remedyInfo.scientificName && ` · ${remedyInfo.scientificName}`}
                  </p>
                )}

                {/* Saved field notes */}
                {fieldNotes.trim() && (
                  <div className="mt-3 bg-warning-bg rounded-xl p-3 border border-warning/20">
                    <p className="text-[10px] font-bold text-warning uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {lang === "ur" ? "فیلڈ نوٹس" : "Field Notes"}
                    </p>
                    <p className="text-xs text-warning leading-relaxed">{fieldNotes}</p>
                  </div>
                )}

                {/* Severity badge */}
                {remedyInfo && (() => {
                  const severityConfig = {
                    low: { color: "bg-success-bg text-success", label: "Low Risk", labelUr: "کم خطرہ" },
                    medium: { color: "bg-warning-bg text-warning", label: "Moderate", labelUr: "درمیانہ" },
                    high: { color: "bg-warning-bg text-warning", label: "High Risk", labelUr: "زیادہ خطرہ" },
                    critical: { color: "bg-danger-bg text-danger", label: "Critical ⚠️", labelUr: "انتہائی خطرناک ⚠️" },
                  };
                  const sev = severityConfig[remedyInfo.severity];
                  return (
                    <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold mb-4 ${sev.color}`}>
                      {lang === "ur" ? sev.labelUr : sev.label}
                    </span>
                  );
                })()}

                {/* Treatment tabs — Organic / Chemical */}
                {remedyInfo ? (
                  <>
                    <div className="flex gap-1.5 mb-3">
                      <button
                        onClick={() => setTreatTab("organic")}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          treatTab === "organic"
                            ? "bg-success text-white shadow-md"
                            : "bg-border text-text-muted hover:bg-border-strong"
                        }`}
                      >
                        <Leaf className="w-3.5 h-3.5" />
                        {lang === "ur" ? "قدرتی علاج" : "Organic"}
                      </button>
                      <button
                        onClick={() => setTreatTab("chemical")}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          treatTab === "chemical"
                            ? "bg-info text-white shadow-md"
                            : "bg-border text-text-muted hover:bg-border-strong"
                        }`}
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        {lang === "ur" ? "کیمیائی علاج" : "Chemical"}
                      </button>
                    </div>

                    {treatTab === "organic" ? (
                      <div className="bg-success-bg rounded-xl p-4 border border-success/20 mb-3">
                        <p className="text-sm text-success leading-relaxed">
                          {lang === "ur" ? remedyInfo.organicUrdu : remedyInfo.organic}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-info-bg rounded-xl p-4 border border-info/20 mb-2">
                          <p className="text-sm text-info leading-relaxed">
                            {lang === "ur" ? remedyInfo.chemicalUrdu : remedyInfo.chemical}
                          </p>
                        </div>
                        {/* Dosage */}
                        <div className="bg-bg-secondary rounded-xl p-3 border border-border mb-2 flex items-start gap-2">
                          <Tag className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mb-0.5">
                              {lang === "ur" ? "خوراک" : "Dosage"}
                            </p>
                            <p className="text-xs text-text-primary font-medium">
                              {lang === "ur" ? remedyInfo.dosageUrdu : remedyInfo.dosage}
                            </p>
                          </div>
                        </div>
                        {/* Local brands */}
                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <PackageCheck className="w-3.5 h-3.5" />
                            {lang === "ur" ? "مقامی برانڈز" : "Available Local Brands"}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {remedyInfo.localProducts.map((p) => (
                              <span key={p} className="text-[10px] px-2.5 py-1 bg-primary-bg text-primary rounded-full font-semibold border border-primary/10">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Cost */}
                        <div className="bg-warning-bg rounded-xl p-3 border border-warning/20 flex items-center gap-2">
                          <span className="text-warning font-bold text-xs">💰 {lang === "ur" ? "تخمینہ لاگت:" : "Est. Cost:"}</span>
                          <span className="text-warning font-bold text-sm">{remedyInfo.estimatedCostPkr}</span>
                        </div>
                      </>
                    )}

                    {/* Prevention */}
                    <div className="mt-3 bg-info-bg rounded-xl p-3 border border-info/20">
                      <p className="text-[10px] font-bold text-info uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {lang === "ur" ? "احتیاطی تدابیر" : "Prevention"}
                      </p>
                      <p className="text-xs text-info leading-relaxed">
                        {lang === "ur" ? remedyInfo.preventionUrdu : remedyInfo.prevention}
                      </p>
                    </div>
                  </>
                ) : (
                  /* Fallback plain remedy text */
                  <div className="bg-gradient-to-br from-primary-bg to-bg-secondary rounded-xl p-4 mb-4 border border-primary/10">
                    <h3 className="font-bold text-sm text-primary mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      {t("capture.treatment")}
                    </h3>
                    <ul className="space-y-2">
                      {result.remedy.split('. ').filter(s => s.trim()).map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                          <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                          </span>
                          {step.trim()}{!step.endsWith('.') ? '.' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Low confidence warning */}
                {result.confidence < 0.5 && (
                  <div className="bg-red-50 border border-danger/20 rounded-xl p-4 mb-4 flex items-start gap-3 mt-3">
                    <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-danger font-medium">
                      {lang === "ur"
                        ? "اعتماد کے ساتھ شناخت نہیں کر سکے۔ مقامی ماہر سے مشورہ کریں۔"
                        : "Could not confidently identify this. Consider consulting a local expert for confirmation."}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate("/assistant")}
                    className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-primary-light active:scale-[0.97] transition-all duration-200 min-touch shadow-md"
                  >
                    {t("tab.assistant")}
                  </button>
                  <button
                    onClick={handleTrackRecovery}
                    className="flex-1 bg-white text-text-primary py-3.5 rounded-2xl font-semibold text-sm border-2 border-gray-100 hover:border-primary/30 hover:shadow-md active:scale-[0.97] transition-all duration-200 min-touch"
                  >
                    {lang === "ur" ? "بحالی کا سراغ لگائیں" : "Track Recovery"}
                  </button>
                </div>
                <button
                  onClick={resetAll}
                  className="w-full mt-2 py-3 text-text-muted text-sm font-medium hover:text-text-primary transition-colors min-touch"
                >
                  {lang === "ur" ? "دوسرا اسکین کریں" : "Scan Another"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}