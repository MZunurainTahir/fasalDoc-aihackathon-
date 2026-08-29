/**
 * FasalDoc data persistence layer.
 * Stores scan history in IndexedDB (via Dexie) for offline-first reliability.
 * Falls back to localStorage for simple preferences.
 */
import { db, generateLocalId, enqueueSync, isOnline } from "./db";

export interface ScanEntry {
  id: string;
  localId?: string;
  imageUri: string;
  disease: string;
  confidence: number;
  date: string;
  type: "crop" | "livestock";
}

const HISTORY_KEY = "fasaldoc_scan_history";

/** Get scan history — reads from IndexedDB, falls back to localStorage */
export async function getHistory(): Promise<ScanEntry[]> {
  try {
    // Try IndexedDB first (offline-first)
    const diagnoses = await db.diagnoses
      .orderBy("created_at")
      .reverse()
      .toArray();

    if (diagnoses.length > 0) {
      return diagnoses.map((d) => ({
        id: d.id || d.localId || "",
        localId: d.localId,
        imageUri: d.image_url || "",
        disease: d.predicted_disease || "Unknown",
        confidence: d.confidence || 0,
        date: d.created_at,
        type: d.type,
      }));
    }

    // Fallback to localStorage for legacy data
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    // Ultimate fallback to localStorage
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

/** Save a scan entry locally first, then sync if online */
export async function saveToHistory(entry: ScanEntry): Promise<void> {
  const localId = generateLocalId();

  // Always save locally
  await db.diagnoses.add({
    localId,
    user_id: "offline", // replaced on sync
    type: entry.type,
    image_url: entry.imageUri,
    predicted_disease: entry.disease,
    confidence: entry.confidence,
    remedy_applied: null,
    notes: null,
    created_at: entry.date,
    _synced: false,
  });

  // If online, sync to Supabase immediately
  if (isOnline()) {
    const { supabase } = await import("./supabase");
    try {
      const { data, error } = await supabase.from("diagnoses").insert({
        type: entry.type,
        image_url: entry.imageUri,
        predicted_disease: entry.disease,
        confidence: entry.confidence,
      });
      if (!error && data) {
        // Mark local record as synced
        const syncedId = (data as any[])?.[0]?.id;
        if (syncedId) {
          await db.diagnoses.where("localId").equals(localId).modify({
            id: syncedId,
            _synced: true,
          });
        }
      }
    } catch {
      // Enqueue for later sync
      await enqueueSync("diagnoses", "insert", localId, {
        localId,
        type: entry.type,
        image_url: entry.imageUri,
        predicted_disease: entry.disease,
        confidence: entry.confidence,
        created_at: entry.date,
      });
    }
  } else {
    // Enqueue for sync when we come back online
    await enqueueSync("diagnoses", "insert", localId, {
      localId,
      type: entry.type,
      image_url: entry.imageUri,
      predicted_disease: entry.disease,
      confidence: entry.confidence,
      created_at: entry.date,
    });
  }

  // Also keep localStorage in sync for backward compat
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    existing.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch { /* ignore */ }
}

/** Clear all history */
export async function clearHistory(): Promise<void> {
  await db.diagnoses.clear();
  localStorage.removeItem(HISTORY_KEY);
}