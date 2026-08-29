import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "../lib/network";
import { useLanguage } from "../context/LanguageContext";

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="bg-amber-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 animate-slideDown"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t('offline.banner')}</span>
    </div>
  );
}