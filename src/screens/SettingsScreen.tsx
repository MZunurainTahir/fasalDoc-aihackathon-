import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/db";
import { User, Globe, Wifi, Info, Mail, ChevronRight, LogOut, CheckCircle, Edit2, X, MapPin, Phone, Sprout, CloudOff, RefreshCw } from "lucide-react";

export default function SettingsScreen() {
  const { t, lang, setLang } = useLanguage();
  const { user, profile, signOut, updateProfile } = useAuth();
  const [offlineMode, setOfflineMode] = useState(
    () => localStorage.getItem("fasaldoc_offline") === "true"
  );
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [farmingType, setFarmingType] = useState(profile?.farming_type || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check pending sync count
  useEffect(() => {
    const checkPending = async () => {
      if (!offlineMode) {
        setPendingSyncCount(0);
        return;
      }
      try {
        const count = await db.pendingSync.count();
        setPendingSyncCount(count);
      } catch { /* ignore */ }
    };
    checkPending();
    const interval = setInterval(checkPending, 10000);
    return () => clearInterval(interval);
  }, [offlineMode]);

  const toggleOffline = () => {
    const next = !offlineMode;
    setOfflineMode(next);
    localStorage.setItem("fasaldoc_offline", String(next));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ full_name: fullName, location, phone, farming_type: farmingType });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setEditing(false);
  };

  const handleLogout = async () => {
    if (confirm(t('auth.logoutConfirm'))) {
      await signOut();
    }
  };

  const menuItemClass = "w-full bg-white rounded-2xl p-4 border border-border flex items-center justify-between hover:shadow-md hover:border-primary/10 transition-all duration-200 min-touch group";
  const iconClass = "w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200";
  const arrowClass = "w-4 h-4 text-text-muted group-hover:text-primary transition-colors";

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      <div className="px-5 pt-4 pb-4">
        <h1 className="text-lg font-heading font-bold text-text-primary">{t("settings.title")}</h1>
      </div>

      {/* Profile Card */}
      <div className="mx-5 mb-4">
        <div className="bg-gradient-to-br from-primary to-primary-light rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-white">
              <h2 className="font-bold text-lg">{profile?.full_name || 'Farmer'}</h2>
              <p className="text-white/80 text-sm">{user?.email}</p>
              {profile?.location && (
                <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </p>
              )}
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {editing ? <X className="w-5 h-5 text-white" /> : <Edit2 className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {editing && (
        <div className="mx-5 mb-4 bg-white rounded-3xl p-5 border border-border shadow-lg animate-fadeIn">
          <h3 className="font-bold text-sm text-text-primary mb-4">{t('auth.personalInfo')}</h3>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('auth.fullName')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('auth.location')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth.phonePlaceholder')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">{t('auth.farmingType')}</label>
              <div className="flex gap-1.5">
                {["crops", "livestock", "both"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFarmingType(type)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all border ${
                      farmingType === type
                        ? "border-primary bg-primary-bg text-primary"
                        : "border-gray-200 text-text-muted hover:border-gray-300"
                    }`}
                  >
                    {t(`auth.${type}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl text-sm font-medium text-text-muted hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  <><CheckCircle className="w-4 h-4" /> {t('auth.profileSaved')}</>
                ) : (
                  t('auth.saveProfile')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 space-y-2">
        {/* Language toggle */}
        <button className={menuItemClass}>
          <div className="flex items-center gap-3">
            <Globe className={iconClass} />
            <div className="text-left">
              <p className="font-semibold text-sm text-text-primary">{t("settings.language")}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {lang === "en" ? t("settings.english") : t("settings.urdu")}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setLang(lang === "en" ? "ur" : "en"); }}
            className={`relative w-12 h-7 rounded-full transition-colors min-touch ${lang === "ur" ? "bg-primary" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${lang === "ur" ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </button>

        {/* Offline mode */}
        <button className={menuItemClass}>
          <div className="flex items-center gap-3">
            {offlineMode ? <CloudOff className={iconClass} /> : <Wifi className={iconClass} />}
            <div className="text-left">
              <p className="font-semibold text-sm text-text-primary">{t("settings.dataStorage")}</p>
              <p className="text-xs text-text-muted mt-0.5 max-w-[200px]">
                {offlineMode
                  ? t('offline.available')
                  : (lang === "ur" ? "صرف آن لائن" : "Online only")}
              </p>
              {offlineMode && pendingSyncCount > 0 && (
                <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  {pendingSyncCount} {t('offline.syncPending')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleOffline(); }}
            className={`relative w-12 h-7 rounded-full transition-colors min-touch ${offlineMode ? "bg-primary" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${offlineMode ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </button>

        {/* About */}
        <button className={menuItemClass}>
          <div className="flex items-center gap-3">
            <Info className={iconClass} />
            <div className="text-left">
              <p className="font-semibold text-sm text-text-primary">{t("settings.about")}</p>
              <p className="text-xs text-text-muted mt-0.5">v0.1.0 (MVP)</p>
            </div>
          </div>
          <ChevronRight className={arrowClass} />
        </button>

        {/* Privacy */}
        <button className={menuItemClass}>
          <div className="flex items-center gap-3">
            <Mail className={iconClass} />
            <div className="text-left">
              <p className="font-semibold text-sm text-text-primary">{t("settings.privacy")}</p>
              <p className="text-xs text-text-muted mt-0.5">{lang === "ur" ? "آپ کا ڈیٹا محفوظ ہے" : "Your data is secure"}</p>
            </div>
          </div>
          <ChevronRight className={arrowClass} />
        </button>

        {/* Account info */}
        <button className={`${menuItemClass} border-danger/10`}>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-text-muted" />
            <div className="text-left">
              <p className="font-semibold text-sm text-text-primary">Account</p>
              <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 border border-danger/10 flex items-center gap-3 hover:shadow-md hover:border-danger/30 transition-all duration-200 min-touch group"
        >
          <LogOut className="w-5 h-5 text-danger group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm text-danger">{t('auth.logout')}</span>
        </button>
      </div>

      <div className="mt-6 px-5 pb-4">
        <p className="text-center text-xs text-text-muted flex items-center justify-center gap-1">
          <Sprout className="w-3 h-3" />
          FasalDoc {t("settings.version")} 0.1.0 (MVP)
        </p>
      </div>
    </div>
  );
}