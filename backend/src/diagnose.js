import { chatCompletion, parseJsonLoose } from "./llm.js";
import { CROP_KEYS, LIVESTOCK_KEYS } from "./remedyKeys.js";

const CROP_MOCK_POOL = [
  { key: "Tomato___Early_blight", disease: "Tomato Early Blight" },
  { key: "Wheat___Leaf_rust", disease: "Wheat Leaf Rust" },
  { key: "Rice___Blast", disease: "Rice Blast" },
  { key: "Cotton___Bacterial_blight", disease: "Cotton Bacterial Blight" },
  { key: "Potato___Late_Blight", disease: "Potato Late Blight" },
];
const LIVESTOCK_MOCK_POOL = [
  { key: "Livestock___Foot_and_Mouth", disease: "Foot & Mouth Disease" },
  { key: "Livestock___Bovine_Mastitis", disease: "Bovine Mastitis" },
  { key: "Livestock___Lumpy_Skin", disease: "Lumpy Skin Disease" },
];

function mockDiagnosis(mode) {
  const pool = mode === "livestock" ? LIVESTOCK_MOCK_POOL : CROP_MOCK_POOL;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const confidence = 0.72 + Math.random() * 0.22;
  return {
    disease: picked.disease,
    matchedKey: picked.key,
    confidence: Number(confidence.toFixed(2)),
    isHealthy: false,
    description: "Simulated result — no AI provider configured on the backend (add GROQ_API_KEY to enable real diagnosis).",
    source: "mock",
  };
}

function buildPrompt({ mode, lang, symptoms }) {
  const keys = mode === "livestock" ? LIVESTOCK_KEYS : CROP_KEYS;
  const symptomLine = symptoms
    ? `\nThe farmer also reported these symptoms: ${JSON.stringify(symptoms)}.`
    : "";

  return (
    `You are an agricultural vision assistant helping smallholder farmers in Pakistan diagnose ${
      mode === "livestock" ? "livestock (animal) health issues" : "crop diseases"
    } from a photo.${symptomLine}\n\n` +
    `Look carefully at the attached image and identify the most likely condition. ` +
    `If it matches one of these known catalogue entries, set "matchedKey" to that exact string: ${keys.join(", ")}. ` +
    `If it clearly does not match any of them, set "matchedKey" to null and instead fill in "disease" and "description" yourself. ` +
    `If the ${mode === "livestock" ? "animal" : "plant"} looks healthy, set "isHealthy" to true.\n\n` +
    `Respond with ONLY a single JSON object, no markdown, no commentary, in this exact shape:\n` +
    `{\n` +
    `  "disease": "short English name of the condition, or 'Healthy'",\n` +
    `  "matchedKey": "one of the catalogue keys above, or null",\n` +
    `  "confidence": 0.0-1.0 number reflecting how sure you are from the image alone,\n` +
    `  "isHealthy": true or false,\n` +
    `  "description": "1-2 plain sentences describing what you see in the image and why you think this${lang === "ur" ? " (respond in Urdu)" : ""}"\n` +
    `}`
  );
}

export async function diagnoseImage({ imageBase64, mode, lang, symptoms }) {
  const imageDataUrl = imageBase64.startsWith("data:")
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  try {
    const raw = await chatCompletion({
      messages: [
        {
          role: "user",
          content: buildPrompt({ mode, lang, symptoms }),
        },
      ],
      imageDataUrl,
      jsonMode: true,
    });

    const parsed = parseJsonLoose(raw);
    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0.6));

    return {
      disease: String(parsed.disease || "Unknown"),
      matchedKey: parsed.matchedKey && typeof parsed.matchedKey === "string" ? parsed.matchedKey : null,
      confidence,
      isHealthy: Boolean(parsed.isHealthy),
      description: String(parsed.description || ""),
      source: "ai",
    };
  } catch (err) {
    console.warn("[diagnoseImage] AI call failed, falling back to mock:", err.message);
    return mockDiagnosis(mode);
  }
}
