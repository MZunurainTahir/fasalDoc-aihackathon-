/**
 * Thin, high-speed LLM client.
 * Supports Gemini, Groq, and OpenRouter with configurable timeouts.
 * If external LLMs are down/slow or keys are missing, falls back seamlessly to the RAG Knowledge Engine.
 */

const GROQ_BASE_URL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const GROQ_CHAT_MODEL = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "llama-3.2-11b-vision-preview";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_CHAT_MODEL = process.env.OPENROUTER_CHAT_MODEL || "meta-llama/llama-3.3-70b-instruct";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "google/gemini-2.0-flash-001";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS) || 20_000;

/**
 * Simple API key validation — just checks the key is a non-empty string
 * with a minimum length. We trust that the user provides valid keys.
 */
function isValidApiKey(key) {
  return typeof key === "string" && key.trim().length >= 10;
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
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function chatCompletion({ messages, imageDataUrl, jsonMode = false }) {
  const errors = [];

  // 1. Try Gemini REST API if key present
  const geminiKey = process.env.GEMINI_API_KEY;
  if (isValidApiKey(geminiKey)) {
    try {
      return await callGeminiApi({
        apiKey: geminiKey,
        messages,
        imageDataUrl,
        jsonMode,
      });
    } catch (err) {
      errors.push(`gemini: ${err.message}`);
      console.warn("[LLM] Gemini failed:", err.message);
    }
  }

  // 2. Try Groq
  const groqKey = process.env.GROQ_API_KEY;
  if (isValidApiKey(groqKey)) {
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
      console.warn("[LLM] Groq failed:", err.message);
    }
  }

  // 3. Try OpenRouter
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (isValidApiKey(openrouterKey)) {
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
      console.warn("[LLM] OpenRouter failed:", err.message);
    }
  }

  throw new Error(
    errors.length ? `All providers failed — ${errors.join(" | ")}` : "No active LLM key configured"
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

/**
 * Log active LLM configuration on startup.
 * Called from server.js after dotenv loads.
 */
export function logLLMConfig() {
  const providers = [];
  if (isValidApiKey(process.env.GEMINI_API_KEY)) {
    providers.push(`  ✅ Gemini → model: ${GEMINI_MODEL}`);
  }
  if (isValidApiKey(process.env.GROQ_API_KEY)) {
    providers.push(`  ✅ Groq → chat: ${GROQ_CHAT_MODEL}, vision: ${GROQ_VISION_MODEL}`);
  }
  if (isValidApiKey(process.env.OPENROUTER_API_KEY)) {
    providers.push(`  ✅ OpenRouter → chat: ${OPENROUTER_CHAT_MODEL}, vision: ${OPENROUTER_VISION_MODEL}`);
  }
  if (providers.length === 0) {
    console.warn("[LLM Config] ⚠️  No LLM provider API keys found — falling back to offline RAG only.");
  } else {
    console.log(`[LLM Config] Active providers (timeout: ${TIMEOUT_MS}ms):\n${providers.join("\n")}`);
  }
}
