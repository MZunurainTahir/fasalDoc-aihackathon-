import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { diagnoseImage } from "./diagnose.js";
import { chatReply } from "./chat.js";
import { logLLMConfig } from "./llm.js";
import { signUpUser } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 8000;

/* ── CORS ──
 * CORS_ORIGIN can be a comma-separated list of allowed origins.
 * Defaults to "*" for easy local/demo use — lock this down before a public launch.
 */
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

// Large enough for a compressed phone-camera photo as base64 (client already
// compresses to quality 0.7 JPEG before sending — see src/lib/api.ts).
app.use(express.json({ limit: "12mb" }));

// Basic abuse protection — generous limits for a hackathon demo, tighten for production.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, fullName, phone, location, farmingType } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    await signUpUser({ email, password, fullName, phone, location, farmingType });
    res.json({ ok: true });
  } catch (err) {
    console.error("[/api/signup] error:", err.message);
    res.status(400).json({ error: "signup_failed", message: err.message });
  }
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "FasalDoc — AI Crop & Livestock Health",
    hackathon: "BanoQabil AI Hackathon 2025",
    time: new Date().toISOString(),
    providers: {
      groq: Boolean(process.env.GROQ_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    },
  });
});

app.post("/api/diagnose", async (req, res) => {
  try {
    const { imageBase64, mode, lang, symptoms } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }
    const result = await diagnoseImage({
      imageBase64,
      mode: mode === "livestock" ? "livestock" : "crop",
      lang: lang === "ur" ? "ur" : "en",
      symptoms: symptoms || null,
    });
    res.json(result);
  } catch (err) {
    console.error("[/api/diagnose] error:", err.message);
    res.status(500).json({ error: "diagnosis_failed", message: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, lang } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }
    const reply = await chatReply({ messages, lang: lang === "ur" ? "ur" : "en" });
    res.json(reply);
  } catch (err) {
    console.error("[/api/chat] error:", err.message);
    res.status(500).json({ error: "chat_failed", message: err.message });
  }
});

app.use((_req, res) => res.status(404).json({ error: "not_found" }));

app.listen(PORT, () => {
  console.log(`\n🌾 FasalDoc Backend — AI Crop & Livestock Health`);
  console.log(`   BanoQabil AI Hackathon 2025`);
  console.log(`   Listening on port ${PORT}\n`);
  logLLMConfig();
});
