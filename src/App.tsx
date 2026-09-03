import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Home, Scan, MessageCircle, Settings, User, LogOut, Wrench } from "lucide-react";

import HomeScreen from "./screens/HomeScreen";
import CaptureScreen from "./screens/CaptureScreen";
import HistoryScreen from "./screens/HistoryScreen";
import AssistantScreen from "./screens/AssistantScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ToolsScreen from "./screens/ToolsScreen";
import AuthScreen from "./screens/AuthScreen";
import OfflineBanner from "./components/OfflineBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useSyncOnReconnect } from "./lib/network";

/** Bottom tab bar — 5 tabs matching the PRD spec */
function TabBar() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const tabs = [
    { to: "/", icon: Home, label: "tab.home" },
    { to: "/capture", icon: Scan, label: "tab.scan" },
    { to: "/tools", icon: Wrench, label: "tab.tools" },
    { to: "/assistant", icon: MessageCircle, label: "tab.assistant" },
    { to: "/settings", icon: Settings, label: "tab.settings" },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-elevated/80 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 px-3 min-touch transition-all duration-200 ${
                isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative ${isActive ? 'scale-110' : ''}`}>
                  <Icon className="w-5 h-5 transition-transform duration-200" />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-[10px] font-semibold">{t(label)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

/** Header with user avatar */
function AppHeader() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-bg-elevated/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <h1 className="font-heading font-bold text-lg text-text-primary">
            {t('app.name')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut()}
            className="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all duration-200"
            title={t('auth.logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-primary-bg rounded-full flex items-center justify-center border-2 border-primary/20">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { loading } = useAuth();
  useSyncOnReconnect();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-bg-primary relative flex flex-col">
      <ErrorBoundary>
      <ProtectedRoute>
        <OfflineBanner />
        <AppHeader />
        <div className="pb-20 flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/capture" element={<CaptureScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/tools" element={<ToolsScreen />} />
            <Route path="/assistant" element={<AssistantScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <TabBar />
      </ProtectedRoute>
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}