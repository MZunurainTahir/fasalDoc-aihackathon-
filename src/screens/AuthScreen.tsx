import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Mail, Lock, User, MapPin, Phone, Sprout, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles, ShieldCheck } from "lucide-react";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const { t } = useLanguage();
  const { signIn, signUp, loginAsDemo } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [farmingType, setFarmingType] = useState<string>("both");

  const switchMode = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await loginAsDemo();
    } catch {
      setError("Failed to enter demo mode.");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError(t('common.error'));
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setError(t('auth.passwordRequired'));
        return;
      }
      if (password !== confirmPassword) {
        setError(t('auth.passwordsMatch'));
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error: err } = await signIn(email.trim(), password);
        if (err) {
          setError(err.message === 'Invalid login credentials' ? t('auth.loginError') : err.message);
        }
      } else {
        const { error: err } = await signUp(email.trim(), password, fullName.trim());
        if (err) {
          setError(err.message || t('auth.signupError'));
        } else {
          setSuccess(t('auth.signupSuccess'));
        }
      }
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-bg-secondary/80 border-2 border-border-strong rounded-xl text-text-primary text-sm transition-all duration-200 focus:bg-bg-elevated focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-text-muted/60";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-bg-primary to-success-bg flex flex-col justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/30 mb-3">
            <Sprout className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-text-primary">
            {t('app.name')}
          </h1>
          <p className="text-xs font-semibold text-primary mt-0.5 tracking-wide uppercase">
            {t('app.tagline')}
          </p>
          <p className="text-xs text-text-muted mt-1 italic">
            "{t('app.subtagline')}"
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-bg-elevated/90 backdrop-blur-xl rounded-3xl border border-border shadow-xl p-6">
          {/* 1-Tap Guest / Demo Mode Button for Judges */}
          <div className="mb-6">
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group border border-emerald-500/30"
            >
              {demoLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>{t('auth.guestDemo')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-text-muted mt-1.5 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('auth.demoDescription')}
            </p>
          </div>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-border-strong w-full" />
            <span className="bg-bg-elevated px-3 text-xs text-text-muted font-medium uppercase tracking-wider">
              {t('auth.or')}
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-border/90 rounded-xl p-1 mb-5">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-bg-elevated text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-bg-elevated text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {t('auth.signup')}
            </button>
          </div>

          {/* Success / Error alerts */}
          {success && (
            <div className="mb-4 p-3.5 bg-success-bg border border-success/20 rounded-xl flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-xs text-success font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 bg-danger-bg border border-danger/20 rounded-xl flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-danger mt-1.5 shrink-0" />
              <p className="text-xs text-danger font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder={t('auth.fullNamePlaceholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder={t('auth.location')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    placeholder={t('auth.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1.5">
                    {t('auth.farmingType')}
                  </label>
                  <div className="flex gap-1.5">
                    {["crops", "livestock", "both"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFarmingType(type)}
                        className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                          farmingType === type
                            ? "border-primary bg-primary-bg text-primary shadow-xs"
                            : "border-border-strong text-text-muted hover:border-border"
                        }`}
                      >
                        {t(`auth.${type}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pl-10 pr-10`}
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === "signup" && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('auth.confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pl-10 pr-10`}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? t('auth.login') : t('auth.signup')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-4 text-center">
            <p className="text-xs text-text-muted">
              {mode === "login" ? t('auth.noAccount') : t('auth.haveAccount')}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="text-primary font-bold hover:underline"
              >
                {mode === "login" ? t('auth.signup') : t('auth.login')}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-text-muted mt-5">
          FasalDoc © {new Date().getFullYear()} — Built for Pakistani Farmers & BanoQabil AI Hackathon
        </p>
      </div>
    </div>
  );
}