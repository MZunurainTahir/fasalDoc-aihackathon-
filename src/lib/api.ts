/**
 * Client for the FasalDoc backend (real AI diagnosis + chat).
 * All calls degrade gracefully: if the backend is unreachable (offline,
 * not deployed yet, cold start, etc.) callers fall back to the local
 * mock logic already used elsewhere in the app — the UI never breaks.
 */
import { isOnline } from "./db";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";

const REQUEST_TIMEOUT_MS = 25_000;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = API_URL ? `${API_URL}${path}` : path;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export interface DiagnoseResponse {
  disease: string;
  matchedKey: string | null;
  confidence: number;
  isHealthy: boolean;
  description: string;
  source: "ai" | "mock";
}

export async function requestDiagnosis(params: {
  imageBase64: string;
  mode: "crop" | "livestock";
  lang: "en" | "ur";
  symptoms?: Record<string, unknown>;
}): Promise<DiagnoseResponse | null> {
  if (!isOnline()) return null;
  try {
    return await postJson<DiagnoseResponse>("/api/diagnose", params);
  } catch (err) {
    console.warn("[api] diagnosis request failed, will use local fallback:", err);
    return null;
  }
}

export interface ChatResponse {
  reply: string;
  source: "ai" | "mock";
}

export async function requestChatReply(params: {
  messages: { role: "user" | "assistant"; content: string }[];
  lang: "en" | "ur";
}): Promise<ChatResponse | null> {
  if (!isOnline()) return null;
  try {
    return await postJson<ChatResponse>("/api/chat", params);
  } catch (err) {
    console.warn("[api] chat request failed, will use local fallback:", err);
    return null;
  }
}

export function isBackendConfigured(): boolean {
  return Boolean(API_URL);
}
