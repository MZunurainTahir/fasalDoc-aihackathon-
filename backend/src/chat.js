import { chatCompletion } from "./llm.js";
import { searchKnowledgeBase, generateRAGAnswer } from "./rag.js";

const SYSTEM_PROMPT_EN =
  "You are FasalDoc's expert agricultural & livestock health assistant for Pakistani farmers (Punjab/Sindh). " +
  "You provide practical, accurate, concise, and structured advice. Use markdown bold headings, numbered steps, " +
  "organic remedies, chemical remedies with exact local product names and dosages (per acre/kanal), and clear prevention steps. " +
  "Below is verified domain knowledge retrieved from FasalDoc's agricultural database for the user's query:";

const SYSTEM_PROMPT_UR =
  "آپ FasalDoc کے ماہر زرعی و مویشی صحت کے معاون ہیں۔ کسانوں کو آسان، درست اور مکمل جواب دیں۔ " +
  "جواب میں قدرتی علاج، کیمیائی دوائیں (مقامی برانڈ نام اور فی ایکڑ خوراک کے ساتھ)، اور حفاظتی تدابیر شامل کریں۔ " +
  "ذیل میں فصلی و زرعی ڈیٹا بیس سے حاصل کردہ معلومات درج ہیں:";

export async function chatReply({ messages, lang }) {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const isUr = lang === "ur" || /[\u0600-\u06FF]/.test(lastUserMsg);

  // 1. RAG Retrieval from local knowledge base
  const retrievedItems = searchKnowledgeBase(lastUserMsg);
  const ragContextStr = retrievedItems
    .map(
      (item) =>
        `[Topic: ${item.titleEn} / ${item.titleUr}]\n` +
        `Summary: ${item.summaryEn}\n` +
        `Organic: ${item.organicEn}\n` +
        `Chemical & Products: ${item.chemicalEn} (Local Brands: ${item.localProducts.join(", ")})\n` +
        `Dosage: ${item.dosageEn}\n` +
        `Prevention: ${item.preventionEn}\n`
    )
    .join("\n---\n");

  try {
    const basePrompt = isUr ? SYSTEM_PROMPT_UR : SYSTEM_PROMPT_EN;
    const fullSystemPrompt = `${basePrompt}\n\n=== RETRIEVED KNOWLEDGE CONTEXT ===\n${ragContextStr}\n====================================`;

    const trimmed = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));

    const content = await chatCompletion({
      messages: [{ role: "system", content: fullSystemPrompt }, ...trimmed],
    });

    return { reply: content.trim(), source: "ai_rag" };
  } catch (err) {
    console.warn("[chatReply] LLM call failed or timed out, returning Instant RAG Answer:", err.message);
    // Instant RAG Answer generation (<10ms fallback)
    const ragReply = generateRAGAnswer(lastUserMsg, isUr ? "ur" : "en");
    return { reply: ragReply, source: "rag_engine" };
  }
}
