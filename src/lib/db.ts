/**
 * FasalDoc Offline Database — IndexedDB via Dexie.
 * Stores all app data locally for full offline access.
 * Syncs with Supabase when online.
 */
import Dexie, { type Table } from "dexie";
import { REMEDY_DATABASE } from "./remedyData";
import { supabase } from "./supabase";

/* ── Types mirroring Supabase schema ── */

export interface LocalProfile {
  id: string;
  full_name: string;
  phone: string | null;
  location: string;
  farming_type: string;
  preferred_language: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalDiagnosis {
  id?: string;
  localId?: string; // generated client-side when offline
  user_id: string;
  type: "crop" | "livestock";
  image_url: string | null;
  predicted_disease: string | null;
  confidence: number | null;
  remedy_applied: string | null;
  notes: string | null;
  created_at: string;
  /** Set when created offline — Synced status */
  _synced?: boolean;
}

export interface LocalChatSession {
  id?: string;
  localId?: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  _synced?: boolean;
}

export interface LocalChatMessage {
  id?: string;
  localId?: string;
  session_id: string;
  session_localId?: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  _synced?: boolean;
}

export interface LocalRecoveryCase {
  id?: string;
  localId?: string;
  user_id: string;
  diagnosis_id: string | null;
  diagnosis_localId?: string | null;
  status: "active" | "improved" | "no_change" | "worse";
  days_since_diagnosis: number | null;
  follow_up_photo_url: string | null;
  last_checked_at: string | null;
  created_at: string;
  _synced?: boolean;
}

/** Pending operation to sync when back online */
export interface PendingSyncOp {
  id?: number;
  table: string;
  operation: "insert" | "update" | "delete";
  recordId: string;
  data: Record<string, unknown>;
  timestamp: number;
}

/* ── Database class ── */

class FasalDocDB extends Dexie {
  profiles!: Table<LocalProfile, string>;
  diagnoses!: Table<LocalDiagnosis, string>;
  chatSessions!: Table<LocalChatSession, string>;
  chatMessages!: Table<LocalChatMessage, string>;
  recoveryCases!: Table<LocalRecoveryCase, string>;
  pendingSync!: Table<PendingSyncOp, number>;

  constructor() {
    super("FasalDocDB");

    this.version(1).stores({
      profiles: "id",
      diagnoses: "id, localId, user_id, type, created_at, _synced",
      chatSessions: "id, localId, user_id, updated_at, _synced",
      chatMessages: "id, localId, session_id, user_id, created_at, _synced",
      recoveryCases: "id, localId, user_id, status, _synced",
      pendingSync: "++id, table, timestamp",
    });
  }
}

export const db = new FasalDocDB();

/* ── Helper: generate a local temp ID ── */
export function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ── Bulk sync helpers ── */

export function isOnline(): boolean {
  if (typeof localStorage !== "undefined" && localStorage.getItem("fasaldoc_offline") === "true") {
    return false;
  }
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

export async function enqueueSync(
  table: string,
  operation: "insert" | "update" | "delete",
  recordId: string,
  data: Record<string, unknown>,
) {
  try {
    await db.pendingSync.add({
      table,
      operation,
      recordId,
      data,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.warn("Failed to enqueue sync:", e);
  }
}

export async function drainSyncQueue() {
  const ops = await db.pendingSync.toArray();
  if (ops.length === 0) return;

  for (const op of ops) {
    try {
      const { table, operation, recordId, data } = op;

      if (operation === "insert") {
        const { localId, _synced, ...cleanData } = data as Record<string, unknown>;
        await supabase.from(table).insert(cleanData);
        await markSynced(table, recordId);
      } else if (operation === "update") {
        await supabase.from(table).update(data).eq("id", recordId);
        await markSynced(table, recordId);
      } else if (operation === "delete") {
        await supabase.from(table).delete().eq("id", recordId);
      }
    } catch (err) {
      console.warn(`[Sync] Failed to sync ${op.operation} on ${op.table}:`, err);
      return;
    }
  }

  await db.pendingSync.clear();
}

async function markSynced(table: string, id: string) {
  const tableMap: Record<string, string> = {
    diagnoses: "diagnoses",
    chat_sessions: "chatSessions",
    chat_messages: "chatMessages",
    recovery_cases: "recoveryCases",
  };
  const dexieTable = tableMap[table];
  if (dexieTable) {
    await (db as any)[dexieTable].where("localId").equals(id).modify({ _synced: true });
  }
}

/** Pre-populate rich initial demo data for offline and demo testing */
export async function seedInitialLocalData(userId: string = "demo_farmer_user") {
  try {
    const existingCount = await db.diagnoses.count();
    if (existingCount > 0) return; // already seeded

    const now = new Date();
    const d1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const d2 = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const d3 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const wheatData = REMEDY_DATABASE["Wheat___Leaf_rust"];
    const tomatoData = REMEDY_DATABASE["Tomato___Early_blight"];
    const fmdData = REMEDY_DATABASE["Livestock___Foot_and_Mouth"];

    // Seed Diagnoses
    const id1 = generateLocalId();
    const id2 = generateLocalId();
    const id3 = generateLocalId();

    await db.diagnoses.bulkAdd([
      {
        id: id1,
        localId: id1,
        user_id: userId,
        type: "crop",
        image_url: wheatData.sampleImage,
        predicted_disease: wheatData.name,
        confidence: wheatData.confidence,
        remedy_applied: wheatData.chemical,
        notes: "Field #2 near tube-well, sprayed Tilt 250 EC.",
        created_at: d1,
        _synced: true,
      },
      {
        id: id2,
        localId: id2,
        user_id: userId,
        type: "livestock",
        image_url: fmdData.sampleImage,
        predicted_disease: fmdData.name,
        confidence: fmdData.confidence,
        remedy_applied: fmdData.organic,
        notes: "Sahiwal cow #4 isolated, washed with Lal Dawai.",
        created_at: d2,
        _synced: true,
      },
      {
        id: id3,
        localId: id3,
        user_id: userId,
        type: "crop",
        image_url: tomatoData.sampleImage,
        predicted_disease: tomatoData.name,
        confidence: tomatoData.confidence,
        remedy_applied: tomatoData.organic,
        notes: "Tunnel vegetable patch, removed lower diseased leaves.",
        created_at: d3,
        _synced: true,
      },
    ]);

    // Seed Recovery cases
    await db.recoveryCases.bulkAdd([
      {
        id: generateLocalId(),
        localId: generateLocalId(),
        user_id: userId,
        diagnosis_id: id1,
        status: "active",
        days_since_diagnosis: 2,
        follow_up_photo_url: null,
        last_checked_at: d1,
        created_at: d1,
        _synced: true,
      },
      {
        id: generateLocalId(),
        localId: generateLocalId(),
        user_id: userId,
        diagnosis_id: id2,
        status: "improved",
        days_since_diagnosis: 4,
        follow_up_photo_url: null,
        last_checked_at: d2,
        created_at: d2,
        _synced: true,
      },
    ]);

    // Seed Chat Session
    const sessId = generateLocalId();
    await db.chatSessions.add({
      id: sessId,
      localId: sessId,
      user_id: userId,
      title: "Wheat rust treatment inquiry",
      created_at: d1,
      updated_at: d1,
      _synced: true,
    });

    await db.chatMessages.bulkAdd([
      {
        id: generateLocalId(),
        localId: generateLocalId(),
        session_id: sessId,
        user_id: userId,
        role: "user",
        content: "گندم پر کنگی کا حملہ ہوا ہے، کیا کروں؟",
        created_at: d1,
        _synced: true,
      },
      {
        id: generateLocalId(),
        localId: generateLocalId(),
        session_id: sessId,
        user_id: userId,
        role: "assistant",
        content: "**گندم کی بھوری کنگی (Wheat Rust)** 🍂\n\nفوری اقدامات:\n1. ٹلٹ (Tilt 250 EC) بحساب 200 ملی لیٹر یا نیٹیوو (Nativo) 65 گرام فی ایکڑ اسپرے کریں۔\n2. اسپرے صبح 10 بجے کے بعد کریں جب شبنم سوکھ چکی ہو۔\n3. فصل میں یوریا کا زائد استعمال روک دیں۔",
        created_at: d1,
        _synced: true,
      }
    ]);
  } catch (e) {
    console.error("Error seeding initial data:", e);
  }
}