import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase, Diagnosis } from "../lib/supabase";
import { db, isOnline } from "../lib/db";
import { Leaf, Camera, ChevronRight, Sprout, Activity, TrendingUp, HeartPulse, Plus, WifiOff, BookOpen, Calculator, Presentation, Clock } from "lucide-react";

export default function HomeScreen() {
  const { t, lang } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [recentDiagnoses, setRecentDiagnoses] = useState<Diagnosis[]>([]);
  const [activeCases, setActiveCases] = useState<number>(0);
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usingCached, setUsingCached] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setUsingCached(false);
    try {
      if (!isOnline()) throw new Error("offline");

      // Fetch recent diagnoses from Supabase
      const { data: diagnoses } = await supabase
        .from('diagnoses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (diagnoses) {
        setRecentDiagnoses(diagnoses as Diagnosis[]);
        setScanCount(diagnoses.length);
      }

      // Fetch active recovery cases
      const { count } = await supabase
        .from('recovery_cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setActiveCases(count || 0);
    } catch (err) {
      // Offline fallback — read from local IndexedDB
      console.info("[HomeScreen] Offline — reading from local DB");
      setUsingCached(true);
      try {
        const localDiagnoses = await db.diagnoses
          .orderBy("created_at")
          .reverse()
          .limit(5)
          .toArray();

        if (localDiagnoses.length > 0) {
          setRecentDiagnoses(localDiagnoses as unknown as Diagnosis[]);
          setScanCount(localDiagnoses.length);
        }

        const localActiveCases = await db.recoveryCases
          .where("status")
          .equals("active")
          .count();
        setActiveCases(localActiveCases);
      } catch (localErr) {
        console.error('Error fetching local data:', localErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const greeting = lang === "ur"
    ? `السلام علیکم, ${profile?.full_name || ''}`
    : `Assalam-o-Alaikum, ${profile?.full_name || 'Farmer'}`;

  const dateStr = new Date().toLocaleDateString(lang === "ur" ? "ur-PK" : "en-IN", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      {/* Greeting Section */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-text-muted text-sm font-medium">{dateStr}</p>
        <h1 className="text-xl font-heading font-bold text-text-primary mt-0.5">
          {greeting.split(',')[0]}<span className="text-primary">,</span>
          <br />
          <span className="text-lg">{greeting.split(',')[1]}</span>
        </h1>
      </div>

      {/* Offline cached indicator */}
      {usingCached && (
        <div className="mx-5 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">{t('offline.dataFromCache')}</p>
        </div>
      )}

      {/* Stats Row */}
      <div className="px-5 mt-2 mb-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl p-3.5 border border-border shadow-sm">
            <div className="w-8 h-8 bg-primary-bg rounded-xl flex items-center justify-center mb-2">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-text-primary">{scanCount}</p>
            <p className="text-xs text-text-muted">{t('home.scansThisMonth')}</p>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-border shadow-sm">
            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
              <HeartPulse className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-text-primary">{activeCases}</p>
            <p className="text-xs text-text-muted">{t('home.pendingReports')}</p>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-border shadow-sm">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-text-primary">
              {recentDiagnoses.filter(d => d.confidence && d.confidence >= 0.7).length}
            </p>
            <p className="text-xs text-text-muted">{t('home.diseasesIdentified')}</p>
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="px-5 mb-5">
        <h2 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide text-text-muted">
          {t('home.quickActions')}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/capture?mode=crop")}
            className="flex-1 bg-gradient-to-br from-primary to-primary-light rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.97] transition-all duration-200 min-touch shadow-lg"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-sm">{t("home.scanCrop")}</span>
            <span className="text-white/70 text-xs">Quick diagnose</span>
          </button>

          <button
            onClick={() => navigate("/capture?mode=livestock")}
            className="flex-1 bg-gradient-to-br from-amber-600 to-amber-500 rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-xl hover:shadow-amber-600/20 active:scale-[0.97] transition-all duration-200 min-touch shadow-lg"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-sm">{t("home.scanLivestock")}</span>
            <span className="text-white/70 text-xs">Check health</span>
          </button>
        </div>
      </div>

      {/* Active Cases */}
      {activeCases > 0 && (
        <div className="px-5 mb-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-amber-800">{activeCases} Active {activeCases === 1 ? 'Case' : 'Cases'}</p>
                <p className="text-xs text-amber-600">Track recovery progress</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 bg-white rounded-lg text-amber-700 text-sm font-medium shadow-sm hover:shadow transition-all"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Farmer Hub Quick Access */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wide">
            {t('home.farmerTools')}
          </h2>
          <button
            onClick={() => navigate("/tools")}
            className="text-primary text-xs font-semibold hover:underline"
          >
            {lang === "ur" ? "سب دیکھیں" : "See all"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate("/tools")}
            className="bg-white rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-primary-bg rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <p className="font-bold text-xs text-text-primary">{t('home.diseaseLib')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "20+ بیماریاں اور علاج" : "20+ diseases & remedies"}</p>
          </button>
          <button
            onClick={() => navigate("/tools")}
            className="bg-white rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Calculator className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-bold text-xs text-text-primary">{t('home.calc')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "ایکڑ / کنال کا حساب" : "Acre & kanal dosage"}</p>
          </button>
          <button
            onClick={() => navigate("/tools")}
            className="bg-white rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Presentation className="w-4 h-4 text-green-700" />
            </div>
            <p className="font-bold text-xs text-text-primary">{t('home.pitchDeck')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "HATCH ڈیک" : "For competition judges"}</p>
          </button>
          <button
            onClick={() => navigate("/history")}
            className="bg-white rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-bold text-xs text-text-primary">{lang === "ur" ? "بحالی ٹریکر" : "Recovery Tracker"}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "فعال مقدمات" : "Track active cases"}</p>
          </button>
        </div>
      </div>
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide text-text-muted">
            {t("home.recentScans")}
          </h2>
          {recentDiagnoses.length > 0 && (
            <button
              onClick={() => navigate("/history")}
              className="text-primary text-xs font-semibold hover:underline"
            >
              See all
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-border animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentDiagnoses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-border shadow-sm">
            <div className="w-16 h-16 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-7 h-7 text-primary" />
            </div>
            <p className="text-text-muted text-sm font-medium mb-1">{t("home.noScans")}</p>
            <p className="text-text-muted/70 text-xs mb-4">
              {lang === "ur" ? "اپنی پہلی فصل یا مویشی کی تصویر لیں" : "Snap your first crop or livestock photo"}
            </p>
            <button
              onClick={() => navigate("/capture?mode=crop")}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-light active:scale-[0.97] transition-all shadow-md shadow-primary/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("home.scanCrop")}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentDiagnoses.map((scan) => (
              <button
                key={scan.id}
                onClick={() => navigate("/history")}
                className="w-full bg-white rounded-xl p-3 flex items-center gap-3 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 min-touch group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                  scan.type === "crop" ? "bg-primary-bg" : "bg-amber-50"
                }`}>
                  {scan.type === "crop" ? "🌾" : "🐄"}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-text-primary group-hover:text-primary transition-colors">
                    {scan.predicted_disease || 'Unknown'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {scan.confidence && (
                      <span className={`text-xs font-medium ${
                        scan.confidence >= 0.8 ? 'text-primary' :
                        scan.confidence >= 0.5 ? 'text-amber-600' : 'text-danger'
                      }`}>
                        {(scan.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                    <span className="text-xs text-text-muted">
                      {new Date(scan.created_at).toLocaleDateString(lang === "ur" ? "ur-PK" : "en-IN", {
                        month: 'short', day: 'numeric'
                      })}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      scan.type === "crop" ? "bg-primary-bg text-primary" : "bg-amber-50 text-amber-700"
                    }`}>
                      {scan.type === "crop" ? "Crop" : "Livestock"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}