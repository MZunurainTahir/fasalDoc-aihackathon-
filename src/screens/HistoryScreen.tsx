import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase, Diagnosis, RecoveryCase } from "../lib/supabase";
import { db, isOnline } from "../lib/db";
import { Trash2, ChevronRight, CameraOff, Search, CheckCircle, Clock, AlertTriangle, Sprout, WifiOff } from "lucide-react";

export default function HistoryScreen() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [activeCases, setActiveCases] = useState<(RecoveryCase & { diagnosis?: Diagnosis })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "crop" | "livestock">("all");
  const [showActiveCases] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [usingCached, setUsingCached] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setUsingCached(false);
    try {
      if (!isOnline()) throw new Error("offline");

      const { data: diagnosesData } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (diagnosesData) setDiagnoses(diagnosesData as Diagnosis[]);

      // Fetch active recovery cases with their diagnoses
      const { data: cases } = await supabase
        .from('recovery_cases')
        .select('*, diagnosis:diagnosis_id(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cases) setActiveCases(cases as unknown as (RecoveryCase & { diagnosis?: Diagnosis })[]);
    } catch (err) {
      // Offline fallback — read from local IndexedDB
      console.info("[HistoryScreen] Offline — reading from local DB");
      setUsingCached(true);
      try {
        const localDiagnoses = await db.diagnoses
          .orderBy("created_at")
          .reverse()
          .toArray();

        if (localDiagnoses.length > 0) {
          setDiagnoses(localDiagnoses as unknown as Diagnosis[]);
        }

        const localCases = await db.recoveryCases
          .orderBy("created_at")
          .reverse()
          .toArray();

        if (localCases.length > 0) {
          setActiveCases(localCases as unknown as (RecoveryCase & { diagnosis?: Diagnosis })[]);
        }
      } catch (localErr) {
        console.error('Error fetching local history:', localErr);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleUpdateCaseStatus = async (caseId: string, status: 'improved' | 'no_change' | 'worse') => {
    await supabase
      .from('recovery_cases')
      .update({ status, last_checked_at: new Date().toISOString(), days_since_diagnosis: Math.floor((Date.now() - new Date(activeCases.find(c => c.id === caseId)?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) })
      .eq('id', caseId);
    fetchHistory();
  };

  // Filter and search
  let filtered = diagnoses;
  if (filter === "crop" || filter === "livestock") {
    filtered = filtered.filter(d => d.type === filter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(d =>
      d.predicted_disease?.toLowerCase().includes(q) ||
      d.remedy_applied?.toLowerCase().includes(q)
    );
  }

  const activeRecoveryCases = showActiveCases ? activeCases.filter(c => c.status === 'active') : [];

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-lg font-heading font-bold text-text-primary">{t("history.title")}</h1>
        {diagnoses.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all history?')) {
                supabase.from('diagnoses').delete().eq('user_id', user?.id);
                setDiagnoses([]);
              }
            }}
            className="flex items-center gap-1.5 text-danger text-sm font-medium hover:opacity-80 transition-opacity min-touch"
          >
            <Trash2 className="w-4 h-4" />
            {t("history.delete")}
          </button>
        )}
      </div>

      {/* Offline cached indicator */}
      {usingCached && (
        <div className="mx-5 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">{t('offline.dataFromCache')}</p>
        </div>
      )}

      {/* Active Recovery Cases */}
      {activeRecoveryCases.length > 0 && (
        <div className="px-5 mb-4">
          <h2 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Active Recovery Cases ({activeRecoveryCases.length})
          </h2>
          <div className="space-y-2">
            {activeRecoveryCases.map((caseItem) => (
              <div key={caseItem.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-amber-700" />
                    <p className="font-semibold text-sm text-amber-800">
                      {caseItem.diagnosis?.predicted_disease || 'Unknown'}
                    </p>
                  </div>
                  <span className="text-xs text-amber-600 bg-white px-2 py-0.5 rounded-full">
                    {caseItem.days_since_diagnosis || 0}d ago
                  </span>
                </div>
                <p className="text-xs text-amber-700 mb-3">
                  {lang === "ur" ? "حالت کیا ہے؟" : "How is it looking?"}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleUpdateCaseStatus(caseItem.id, 'improved')}
                    className="flex-1 py-2 bg-success/10 text-success rounded-xl text-xs font-semibold hover:bg-success/20 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                    Improved
                  </button>
                  <button
                    onClick={() => handleUpdateCaseStatus(caseItem.id, 'no_change')}
                    className="flex-1 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold hover:bg-amber-200 transition-colors"
                  >
                    No Change
                  </button>
                  <button
                    onClick={() => handleUpdateCaseStatus(caseItem.id, 'worse')}
                    className="flex-1 py-2 bg-red-50 text-danger rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                    Worse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search bar */}
      {diagnoses.length > 0 && (
        <div className="px-5 mb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ur" ? "بیماری کے نام سے تلاش کریں..." : "Search by disease name..."}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {diagnoses.length > 0 && (
        <div className="flex gap-2 px-5 mb-4">
          {(["all", "crop", "livestock"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all min-touch ${
                filter === f
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-text-muted border border-border hover:bg-gray-50"
              }`}
            >
              {f === "all" ? t("history.all") :
               f === "crop" ? "🌾 Crops" : "🐄 Livestock"}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="px-5 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-border animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : diagnoses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-bg to-green-100 flex items-center justify-center">
            <CameraOff className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center max-w-xs">
            <p className="text-text-muted font-medium mb-1">{t("history.noScans")}</p>
            <p className="text-text-muted/60 text-xs">
              {lang === "ur" ? "اپنی پہلی تشخیص کروانے کے لیے اسکین کریں" : "Scan your first crop or livestock to get started"}
            </p>
          </div>
          <button
            onClick={() => navigate("/capture?mode=crop")}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-light active:scale-[0.97] transition-all shadow-md shadow-primary/20"
          >
            {t("home.scanCrop")}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted text-sm">{t("history.noScans")}</p>
        </div>
      ) : (
        <div className="flex-1 px-5 space-y-2 overflow-y-auto">
          {filtered.map((scan) => (
            <div
              key={scan.id}
              className="bg-white rounded-2xl p-4 border border-border hover:shadow-md hover:border-primary/10 transition-all duration-200 cursor-pointer min-touch group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  scan.type === "crop" ? "bg-primary-bg" : "bg-amber-50"
                }`}>
                  {scan.type === "crop" ? "🌾" : "🐄"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-text-primary truncate group-hover:text-primary transition-colors">
                    {scan.predicted_disease || 'Unknown'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {scan.confidence && (
                      <span className={`text-xs font-semibold ${
                        scan.confidence >= 0.8 ? 'text-primary' :
                        scan.confidence >= 0.5 ? 'text-amber-600' : 'text-danger'
                      }`}>
                        {(scan.confidence * 100).toFixed(0)}% match
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      scan.type === "crop" ? "bg-primary-bg text-primary" : "bg-amber-50 text-amber-700"
                    }`}>
                      {scan.type === "crop" ? "Crop" : "Livestock"}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(scan.created_at).toLocaleDateString(lang === "ur" ? "ur-PK" : "en-IN", {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}