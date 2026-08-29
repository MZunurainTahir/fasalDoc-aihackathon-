/**
 * Network status detection and sync manager for offline support.
 */
import { useEffect, useState, useRef } from "react";
import { drainSyncQueue } from "./db";

/** React hook that tracks online/offline status */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

/** Hook that syncs pending data whenever we come back online */
export function useSyncOnReconnect() {
  const isOnline = useNetworkStatus();
  const wasOffline = useRef(!navigator.onLine);

  useEffect(() => {
    if (isOnline && wasOffline.current) {
      // Just came back online — drain the sync queue
      drainSyncQueue().catch(console.warn);
    }
    wasOffline.current = !isOnline;
  }, [isOnline]);
}

/** Utility to check quickly if we're online */
export function isOnline(): boolean {
  return navigator.onLine;
}