import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase, Diagnosis } from "../lib/supabase";
import { db, isOnline } from "../lib/db";
import { Leaf, Camera, ChevronRight, Sprout, Activity, TrendingUp, HeartPulse, Plus, WifiOff, BookOpen, Calculator, Presentation, Clock, CloudRain, Award, TrendingDown, Minus, Droplets, Thermometer, Wind, MapPin } from "lucide-react";
import { getCurrentMockWeather, fetchCurrentWeather, computeDiseaseRisk, riskColor, type WeatherSnapshot } from "../lib/weather";
import { getPricesByProvince, trendSymbol, trendClass } from "../lib/marketPrices";
import { getSelectedCity, setSelectedCity } from "../lib/farmProfile";
import { detectNearestCity } from "../lib/weather";
import { SkeletonList } from "../components/Skeleton";

export default function HomeScreen() {
  const { t, lang } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [recentDiagnoses, setRecentDiagnoses] = useState<Diagnosis[]>([]);
  const [activeCases, setActiveCases] = useState<number>(0);
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usingCached, setUsingCached] = useState(false);
  const [selectedCity, setCity] = useState(getSelectedCity);
  const [weather, setWeather] = useState<WeatherSnapshot>(() => getCurrentMockWeather(selectedCity));
  const [weatherLoading, setWeatherLoading] = useState(true);
  const riskAdvisory = computeDiseaseRisk(weather);

  useEffect(() => {
    let mounted = true;
    setWeatherLoading(true);
    fetchCurrentWeather(selectedCity).then((snapshot) => {
      if (!mounted) return;
      if (snapshot) setWeather(snapshot);
      else setWeather(getCurrentMockWeather(selectedCity));
      setWeatherLoading(false);
    });
    return () => { mounted = false; };
  }, [selectedCity]);

  const detectLocation = async () => {
    const nearest = await detectNearestCity();
    if (nearest) {
      setSelectedCity(nearest);
      setCity(nearest);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setUsingCached(false);

    try {
      // Always read local IndexedDB first (unsynced scans live here).
      let localDiagnoses: any[] = [];
      try {
        localDiagnoses = await db.diagnoses
          .orderBy("created_at")
          .reverse()
          .toArray();
      } catch (dbErr) {
        console.warn("[HomeScreen] IndexedDB read failed:", dbErr);
      }

      // Restrict to the current user's scans so multiple accounts on the same
      // device do not see each other's history. Demo user id is also valid.
      const userLocalDiagnoses = user
        ? localDiagnoses.filter(d => d.user_id === user.id)
        : localDiagnoses;

      // Secondary mirror: localStorage fallback used when IndexedDB fails.
      let legacyScans: any[] = [];
      try {
        const stored = localStorage.getItem("fasaldoc_scan_history");
        if (stored) {
          const parsed = JSON.parse(stored);
          legacyScans = Array.isArray(parsed)
            ? parsed.filter((s: any) => !user || !s.user_id || s.user_id === user.id)
            : [];
        }
      } catch { /* ignore */ }

      // Merge IndexedDB + localStorage, preferring IndexedDB when ids overlap.
      const localById = new Map<string, any>();
      for (const d of [...userLocalDiagnoses, ...legacyScans]) {
        const key = d.id || d.localId;
        if (key && !localById.has(key)) {
          localById.set(key, d);
        }
      }
      const mergedLocalDiagnoses = Array.from(localById.values());

      let mergedDiagnoses = [...mergedLocalDiagnoses];

      if (isOnline() && user) {
        try {
          // Fetch remote diagnoses from Supabase.
          const { data: remoteDiagnoses } = await supabase
            .from('diagnoses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (remoteDiagnoses) {
            // Remote rows + any local rows that are not yet synced.
            const unsyncedLocal = mergedLocalDiagnoses.filter(d => !d._synced);
            mergedDiagnoses = [...remoteDiagnoses, ...unsyncedLocal];
          }

          // Active recovery cases from Supabase.
          const { count } = await supabase
            .from('recovery_cases')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'active');

          // Also count local active cases for offline-created recoveries.
          let localActiveCases = 0;
          try {
            localActiveCases = await db.recoveryCases
              .where("status")
              .equals("active")
              .count();
          } catch { /* ignore */ }

          setActiveCases((count || 0) + localActiveCases);
        } catch (remoteErr) {
          console.warn("[HomeScreen] Remote fetch failed — using local data:", remoteErr);
          setUsingCached(true);
        }
      } else {
        // Offline: active cases come purely from local storage.
        let localActiveCases = 0;
        try {
          localActiveCases = await db.recoveryCases
            .where("status")
            .equals("active")
            .count();
        } catch { /* ignore */ }
        setActiveCases(localActiveCases);
      }

      // Deduplicate by canonical id then sort by date (newest first).
      const seen = new Set<string>();
      const deduped = mergedDiagnoses.filter((d) => {
        const key = d.id;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      deduped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRecentDiagnoses(deduped.slice(0, 5) as Diagnosis[]);
      setScanCount(deduped.length);
    } catch (err) {
      console.error("[HomeScreen] Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
      <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-text-muted text-sm font-medium">{dateStr}</p>
          <h1 className="text-xl font-heading font-bold text-text-primary mt-0.5">
            {greeting.split(',')[0]}<span className="text-primary">,</span>
            <br />
            <span className="text-lg">{greeting.split(',')[1]}</span>
          </h1>
        </div>
        <button
          onClick={detectLocation}
          className="shrink-0 flex items-center gap-1 px-3 py-2 bg-bg-elevated border border-border rounded-xl text-[10px] font-bold text-text-muted hover:border-primary/30 hover:text-primary transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          {selectedCity.nameEn}
        </button>
      </div>

      {/* Offline cached indicator */}
      {usingCached && (
        <div className="mx-5 mb-3 px-3 py-2 bg-warning-bg border border-warning/20 rounded-xl flex items-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-warning shrink-0" />
          <p className="text-xs text-warning font-medium">{t('offline.dataFromCache')}</p>
        </div>
      )}

      {/* BanoQabil AI Hackathon Badge */}
      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-4 shadow-lg shadow-emerald-600/20 flex items-center gap-3 animate-scaleIn">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">BanoQabil AI Hackathon</p>
            <p className="text-white/70 text-[11px]">{lang === "ur" ? "AI زراعت ہیکاتھن — پاکستان" : "AI Agriculture Innovation — Pakistan"}</p>
          </div>
          <span className="text-[10px] bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">2025</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 mt-2 mb-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-bg-elevated rounded-2xl p-3.5 border border-border shadow-sm">
            <div className="w-8 h-8 bg-primary-bg rounded-xl flex items-center justify-center mb-2">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-text-primary animate-countUp">{scanCount}</p>
            <p className="text-xs text-text-muted">{t('home.scansThisMonth')}</p>
          </div>
          <div className="bg-bg-elevated rounded-2xl p-3.5 border border-border shadow-sm">
            <div className="w-8 h-8 bg-warning-bg rounded-xl flex items-center justify-center mb-2">
              <HeartPulse className="w-4 h-4 text-warning" />
            </div>
            <p className="text-lg font-bold text-text-primary animate-countUp">{activeCases}</p>
            <p className="text-xs text-text-muted">{t('home.pendingReports')}</p>
          </div>
          <div className="bg-bg-elevated rounded-2xl p-3.5 border border-border shadow-sm">
            <div className="w-8 h-8 bg-info-bg rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-info" />
            </div>
            <p className="text-lg font-bold text-text-primary animate-countUp">
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
            className="flex-1 bg-gradient-to-br from-primary to-primary-light rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.97] transition-all duration-200 min-touch shadow-lg pulse-glow"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-sm">{t("home.scanCrop")}</span>
            <span className="text-white/70 text-xs">{lang === "ur" ? "فوری تشخیص" : "Instant diagnosis"}</span>
          </button>

          <button
            onClick={() => navigate("/capture?mode=livestock")}
            className="flex-1 bg-gradient-to-br from-amber-600 to-amber-500 rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-xl hover:shadow-amber-600/20 active:scale-[0.97] transition-all duration-200 min-touch shadow-lg"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-sm">{t("home.scanLivestock")}</span>
            <span className="text-white/70 text-xs">{lang === "ur" ? "صحت جانچ" : "Health check"}</span>
          </button>
        </div>
      </div>

      {/* Weather Disease Risk Alert */}
      <div className="px-5 mb-5">
        <div
          className="rounded-2xl p-4 flex items-start gap-3 border"
          style={{
            background: `linear-gradient(135deg, ${riskColor(riskAdvisory.level)}10, ${riskColor(riskAdvisory.level)}05)`,
            borderColor: `${riskColor(riskAdvisory.level)}30`,
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${riskColor(riskAdvisory.level)}20` }}
          >
            <CloudRain className="w-5 h-5" style={{ color: riskColor(riskAdvisory.level) }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-sm" style={{ color: riskColor(riskAdvisory.level) }}>
                {lang === "ur" ? riskAdvisory.titleUrdu : riskAdvisory.title}
              </p>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                style={{ background: riskColor(riskAdvisory.level) }}
              >
                {riskAdvisory.score}%
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: `${riskColor(riskAdvisory.level)}CC` }}>
              {lang === "ur" ? riskAdvisory.messageUrdu : riskAdvisory.message}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {weather.location}</span>
              {weatherLoading && <span className="text-text-muted/60">({lang === "ur" ? "لوڈ ہورہا ہے" : "loading"})</span>}
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {weather.tempC}°C</span>
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.rainfallMm}mm</span>
            </div>
            <button
              onClick={() => navigate("/tools")}
              className="mt-2 text-[11px] font-bold flex items-center gap-1 hover:underline"
              style={{ color: riskColor(riskAdvisory.level) }}
            >
              {lang === "ur" ? "مزید تفصیلات" : "View forecast & advisory"} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Market Prices Widget */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wide">
            {lang === "ur" ? `${selectedCity.province === "punjab" ? "پنجاب" : "صوبہ"} کے منڈی ریٹ` : `${selectedCity.province.charAt(0).toUpperCase() + selectedCity.province.slice(1)} Mandi Rates`}
          </h2>
          <button
            onClick={() => navigate("/tools")}
            className="text-primary text-xs font-semibold hover:underline"
          >
            {lang === "ur" ? "سب دیکھیں" : "See all"}
          </button>
        </div>
        <div className="bg-bg-elevated rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-border">
            {getPricesByProvince(selectedCity.province).slice(0, 3).map((item) => {
              const TrendIcon = item.trend === "up" ? TrendingUp : item.trend === "down" ? TrendingDown : Minus;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate("/tools")}
                  className="p-3 text-center hover:bg-bg-secondary transition-colors"
                >
                  <p className="text-[10px] text-text-muted truncate">{lang === "ur" ? item.nameUr : item.nameEn}</p>
                  <p className="text-sm font-bold text-text-primary">Rs. {item.avgPrice.toLocaleString()}</p>
                  <div className={`flex items-center justify-center gap-0.5 text-[10px] font-medium ${trendClass(item.trend)}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{trendSymbol(item.trend)} {Math.abs(item.trendPercent)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="bg-bg-secondary px-3 py-2 text-[10px] text-text-muted text-center border-t border-border">
            {lang === "ur" ? `تازہ ترین ریٹ — ${selectedCity.nameUr} اور اطراف کی منڈیاں` : `Latest rates from ${selectedCity.nameEn} & nearby mandis`}
          </div>
        </div>
      </div>

      {/* Active Cases */}
      {activeCases > 0 && (
        <div className="px-5 mb-5">
          <div className="bg-warning-bg border border-warning/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-sm text-warning">{activeCases} Active {activeCases === 1 ? 'Case' : 'Cases'}</p>
                <p className="text-xs text-warning/80">Track recovery progress</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 bg-bg-elevated rounded-lg text-warning text-sm font-medium shadow-sm hover:shadow transition-all"
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
            className="bg-bg-elevated rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-primary-bg rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <p className="font-bold text-xs text-text-primary">{t('home.diseaseLib')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "20+ بیماریاں اور علاج" : "20+ diseases & remedies"}</p>
          </button>
          <button
            onClick={() => navigate("/tools")}
            className="bg-bg-elevated rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-warning-bg rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Calculator className="w-4 h-4 text-warning" />
            </div>
            <p className="font-bold text-xs text-text-primary">{t('home.calc')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "ایکڑ / کنال کا حساب" : "Acre & kanal dosage"}</p>
          </button>
          <button
            onClick={() => navigate("/tools")}
            className="bg-bg-elevated rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-success-bg rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Presentation className="w-4 h-4 text-success" />
            </div>
            <p className="font-bold text-xs text-text-primary">{t('home.pitchDeck')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{lang === "ur" ? "BanoQabil AI Hackathon ڈیک" : "For BanoQabil AI Hackathon judges"}</p>
          </button>
          <button
            onClick={() => navigate("/history")}
            className="bg-bg-elevated rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-info-bg rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 text-info" />
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
          <SkeletonList count={3} />
        ) : recentDiagnoses.length === 0 ? (
          <div className="bg-bg-elevated rounded-2xl p-8 text-center border border-border shadow-sm">
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
                className="w-full bg-bg-elevated rounded-xl p-3 flex items-center gap-3 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 min-touch group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                  scan.type === "crop" ? "bg-primary-bg" : "bg-warning-bg"
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
                        scan.confidence >= 0.5 ? 'text-warning' : 'text-danger'
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
                      scan.type === "crop" ? "bg-primary-bg text-primary" : "bg-warning-bg text-warning"
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