/**
 * Thin, high-speed LLM client.
 * Supports Gemini, Groq, and OpenRouter with strict low-latency timeouts (2.5s).
 * If external LLMs are down/slow or keys are invalid, falls back seamlessly to the RAG Knowledge Engine.
 */

const GROQ_BASE_URL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const GROQ_CHAT_MODEL = process.env.GROQ_CHAT_MODEL && !process.env.GROQ_CHAT_MODEL.includes("/")
  ? process.env.GROQ_CHAT_MODEL
  : "llama-3.3-70b-versatile";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL && !process.env.GROQ_VISION_MODEL.includes("/")
  ? process.env.GROQ_VISION_MODEL
  : "llama-3.2-11b-vision-preview";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_CHAT_MODEL = process.env.OPENROUTER_CHAT_MODEL || "meta-llama/llama-3.3-70b-instruct";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "google/gemini-2.0-flash-001";

const GEMINI_MODEL = "gemini-2.0-flash";
const TIMEOUT_MS = 2_500;

function isValidApiKey(key, prefix) {
  if (!key || typeof key !== "string" || key.length < 20) return false;
  // If prefix check specified or general hex check for invalid dummy key placeholders
  if (prefix && !key.startsWith(prefix)) return false;
  // Ignore dummy hex placeholder keys (64 random hex chars without standard key format)
  if (/^[0-9a-f]{50,}$/i.test(key) && !key.startsWith("gsk_") && !key.startsWith("sk-or-") && !key.startsWith("AIzaSy")) {
    return false;
  }
  return true;
}

async function postJson(url, headers, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function chatCompletion({ messages, imageDataUrl, jsonMode = false }) {
  const errors = [];

  // 1. Try Gemini REST API if valid key present
  const geminiKey = process.env.GEMINI_API_KEY;
  if (isValidApiKey(geminiKey, "AIzaSy")) {
    try {
      return await callGeminiApi({
        apiKey: geminiKey,
        messages,
        imageDataUrl,
        jsonMode,
      });
    } catch (err) {
      errors.push(`gemini: ${err.message}`);
    }
  }

  // 2. Try Groq (ultra fast) if key starts with gsk_ or passes validation
  const groqKey = process.env.GROQ_API_KEY;
  if (isValidApiKey(groqKey, "gsk_")) {
    try {
      return await callOpenAICompatible({
        baseUrl: GROQ_BASE_URL,
        apiKey: groqKey,
        model: imageDataUrl ? GROQ_VISION_MODEL : GROQ_CHAT_MODEL,
        messages,
        imageDataUrl,
        jsonMode,
      });
    } catch (err) {
      errors.push(`groq: ${err.message}`);
    }
  }

  // 3. Try OpenRouter if key starts with sk-or- or passes validation
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (isValidApiKey(openrouterKey, "sk-or-")) {
    try {
      return await callOpenAICompatible({
        baseUrl: OPENROUTER_BASE_URL,
        apiKey: openrouterKey,
        model: imageDataUrl ? OPENROUTER_VISION_MODEL : OPENROUTER_CHAT_MODEL,
        messages,
        imageDataUrl,
        jsonMode,
        extraHeaders: {
          "HTTP-Referer": "https://fasaldoc.app",
          "X-Title": "FasalDoc",
        },
      });
    } catch (err) {
      errors.push(`openrouter: ${err.message}`);
    }
  }

  throw new Error(
    errors.length ? `Providers failed or timed out — ${errors.join(" | ")}` : "No active LLM key"
  );
}

async function callGeminiApi({ apiKey, messages, imageDataUrl, jsonMode }) {
  const systemMsg = messages.find((m) => m.role === "system")?.content || "";
  const conversation = messages.filter((m) => m.role !== "system");

  const contents = conversation.map((m) => {
    const role = m.role === "assistant" ? "model" : "user";
    return {
      role,
      parts: [{ text: m.content }],
    };
  });

  if (imageDataUrl) {
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageDataUrl.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
    const lastContent = contents[contents.length - 1];
    if (lastContent && lastContent.role === "user") {
      lastContent.parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents,
    systemInstruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800,
      responseMimeType: jsonMode ? "application/json" : "text/plain",
    },
  };

  const data = await postJson(url, {}, body);
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini API");
  return text;
}

async function callOpenAICompatible({ baseUrl, apiKey, model, messages, imageDataUrl, jsonMode, extraHeaders }) {
  let finalMessages = messages;

  if (imageDataUrl) {
    finalMessages = [...messages];
    const lastIdx = finalMessages.length - 1;
    const last = finalMessages[lastIdx];
    finalMessages[lastIdx] = {
      role: last.role,
      content: [
        { type: "text", text: last.content },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ],
    };
  }

  const body = {
    model,
    messages: finalMessages,
    temperature: 0.3,
    max_tokens: 800,
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const data = await postJson(
    `${baseUrl}/chat/completions`,
    { Authorization: `Bearer ${apiKey}`, ...(extraHeaders || {}) },
    body
  );

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from provider");
  return content;
}

export function parseJsonLoose(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in model output");
  return JSON.parse(cleaned.slice(start, end + 1));
}

