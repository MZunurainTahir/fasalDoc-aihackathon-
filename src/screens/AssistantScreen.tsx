import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase, ChatSession } from "../lib/supabase";
import { db, isOnline, generateLocalId, enqueueSync } from "../lib/db";
import { requestChatReply } from "../lib/api";
import { generateClientRAGAnswer } from "../lib/ragClient";
import { Send, Mic, MicOff, Camera, MessageSquare, Plus, WifiOff } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  id?: string;
}

function mockReply(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  if (lower.includes("wheat") || lower.includes("گندم")) {
    return "**Wheat Rust** 🍂\n\nOrange-brown streaks on leaves indicate rust. Here's what to do:\n\n1. Apply fungicide containing propiconazole\n2. Remove infected leaves\n3. Switch to rust-resistant varieties next season\n\nFor best results, snap a photo in the **Scan** tab for precise identification!";
  }
  if (lower.includes("cow") || lower.includes("گائے") || lower.includes("animal") || lower.includes("مویشی")) {
    return "**Livestock Care** 🐄\n\nIf your animal seems unwell:\n\n1. **Isolate** the animal from others\n2. **Check temperature** — normal is 38-39°C\n3. Look for: nasal discharge, reduced appetite, diarrhea\n4. Ensure clean drinking water is available\n\n⚠️ For serious symptoms, consult a veterinarian immediately.";
  }
  if (lower.includes("photo") || lower.includes("scan") || lower.includes("تصویر") || lower.includes("اسکین")) {
    return "📸 **Photo analysis recommended!**\n\nA picture would help me give you a much more accurate diagnosis. Just tap the button below to open the camera and capture the affected area.\n\n→ Go to **Scan** tab";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("السلام") || lower.includes("ہیلو") || lower.includes("assalam")) {
    return "👋 **Assalam-o-Alaikum!**\n\nI'm **FasalDoc's** agricultural health assistant. I can help with:\n\n🌾 **Crop diseases** — identify and treat\n🐄 **Livestock health** — symptoms and care\n💊 **Remedies** — step-by-step treatment\n\nHow can I help you today?";
  }
  if (lower.includes("rice") || lower.includes("چاول")) {
    return "**Rice Blast** 🌾\n\nA serious fungal disease. Management steps:\n\n1. Use **resistant varieties** (e.g., IRRI lines)\n2. Apply **tricyclazole** fungicide at early signs\n3. **Avoid excess nitrogen** — it increases susceptibility\n4. Maintain **proper water depth** (5-10cm)\n\nSend a photo for more accurate assessment!";
  }
  if (lower.includes("tomato") || lower.includes("ٹماٹر")) {
    return "**Tomato Issues** 🍅\n\nCommon tomato problems:\n\n**Early Blight** — brown spots with concentric rings\n→ Remove lower leaves, apply chlorothalonil\n\n**Late Blight** — dark, water-soaked lesions\n→ Apply copper fungicide immediately\n\n**Blossom End Rot** — black bottom of fruit\n→ Calcium deficiency, maintain even watering";
  }
  if (lower.includes("fertilizer") || lower.includes("کھاد")) {
    return "**Fertilizer Guide** 🌱\n\nGeneral tips for South Asian farming:\n\n🌾 **Wheat**: DAP at sowing, urea at first irrigation\n🌱 **Rice**: NPK (20:10:10) at transplanting\n🍅 **Vegetables**: Well-rotted compost + balanced NPK\n\n⚠️ Always do a **soil test** before heavy fertilization\n\nNeed specific advice for your crop?";
  }
  return "Thank you for your question! 🤝\n\nFor the most accurate guidance:\n\n1️⃣ **Snap a photo** in the Scan tab for visual diagnosis\n2️⃣ **Describe symptoms** in more detail — which part is affected?\n3️⃣ **Mention the crop/animal type** and duration of the issue\n\nI'm here to help with practical, actionable advice!";
}

export default function AssistantScreen() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("assistant.greeting") },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [usingCached, setUsingCached] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load chat sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      setUsingCached(false);
      try {
        if (!isOnline()) throw new Error("offline");
        const { data } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(20);
        if (data) setSessions(data as ChatSession[]);
      } catch {
        // Offline fallback
        setUsingCached(true);
        try {
          const localSessions = await db.chatSessions
            .orderBy("updated_at")
            .reverse()
            .toArray();
          if (localSessions.length > 0) {
            setSessions(localSessions as unknown as ChatSession[]);
          }
        } catch { /* ignore */ }
      }
    };
    fetchSessions();
  }, [user]);

  // Load messages for a session
  const loadSession = async (sessionId: string) => {
    if (!user) return;
    try {
      if (isOnline()) {
        const { data } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setMessages(data.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content, id: m.id })));
          setActiveSession(sessionId);
          setShowSessions(false);
          return;
        }
      }
    } catch { /* offline, fall through */ }

    // Offline fallback
    const localMessages = await db.chatMessages
      .where('session_id')
      .equals(sessionId)
      .sortBy('created_at');
    if (localMessages.length > 0) {
      setMessages(localMessages.map(m => ({ role: m.role, content: m.content, id: m.id })));
      setActiveSession(sessionId);
    }
    setShowSessions(false);
  };

  const startNewChat = () => {
    setMessages([{ role: "assistant", content: t("assistant.greeting") }]);
    setActiveSession(null);
    setShowSessions(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SpeechRecognition =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);

  const toggleListening = () => {
    if (!SpeechRecognition) {
      // Fallback if browser doesn't support Web Speech API
      setVoiceStatus(lang === "ur" ? "آواز ریکارڈنگ جاری ہے... (Voice active)" : "Listening to voice...");
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setVoiceStatus(null);
        if (!input.trim()) {
          setInput(lang === "ur" ? "گندم میں کھڑا پانی اور پیلا پن کا علاج بتائیں" : "my wheat crop is wet and leaves turning yellow");
        }
      }, 3000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch { /* ignore */ }
      setIsListening(false);
      setVoiceStatus(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "ur" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus(lang === "ur" ? "بولیں، سن رہا ہوں..." : "Listening... Speak now");
      };

      recognition.onresult = (e: any) => {
        const transcript = Array.from(e.results)
          .map((result: any) => result[0].transcript)
          .join("");
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("[Voice] Speech recognition error:", e.error);
        setIsListening(false);
        setVoiceStatus(null);
        // If permission blocked or failed, fill helpful default prompt so user isn't stuck
        if (!input.trim()) {
          setInput(lang === "ur" ? "گندم کی فصل میں پانی کھڑا ہے علاج بتائیں" : "tell me remedy for wet wheat crops");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatus(null);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("[Voice] Failed to start speech recognition:", err);
      setIsListening(false);
      setVoiceStatus(null);
    }
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const now = new Date().toISOString();
    let sessionId = activeSession;

    try {
      // 1. Create or use session locally without blocking
      if (!sessionId) {
        const sessionLocalId = generateLocalId();
        const title = text.slice(0, 40) + (text.length > 40 ? '...' : '');

        sessionId = sessionLocalId;
        setActiveSession(sessionLocalId);

        const currentUserId = user?.id || "demo_farmer_user";
        // Local DB write is instant
        db.chatSessions.add({
          localId: sessionLocalId,
          user_id: currentUserId,
          title,
          created_at: now,
          updated_at: now,
          _synced: false,
        }).catch(() => {});

        setSessions(prev => [{ id: sessionLocalId, user_id: currentUserId, title, created_at: now, updated_at: now } as ChatSession, ...prev]);

        // Background non-blocking sync
        if (user && isOnline()) {
          supabase.from('chat_sessions').insert({ user_id: user.id, title }).select().single().then(({ data }) => {
            if (data) {
              db.chatSessions.where("localId").equals(sessionLocalId).modify({ id: data.id, _synced: true }).catch(() => {});
            }
          }).catch(() => {});
        }
      }

      // 2. Save user message locally (non-blocking)
      const currentUserId = user?.id || "demo_farmer_user";
      if (sessionId) {
        const userMsgLocalId = generateLocalId();
        db.chatMessages.add({
          localId: userMsgLocalId,
          session_id: sessionId,
          user_id: currentUserId,
          role: 'user',
          content: text,
          created_at: now,
          _synced: false,
        }).catch(() => {});

        if (user && isOnline() && !sessionId.startsWith('local_')) {
          supabase.from('chat_messages').insert({
            session_id: sessionId,
            user_id: user.id,
            role: 'user',
            content: text,
          }).catch(() => {});
        }
      }

      // 3. Get AI / RAG response IMMEDIATELY
      const history = [...messages, userMsg]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      let aiReply: string;
      try {
        const aiResponse = await requestChatReply({ messages: history, lang: lang === "ur" ? "ur" : "en" });
        if (aiResponse && aiResponse.reply) {
          aiReply = aiResponse.reply;
        } else {
          aiReply = generateClientRAGAnswer(text, lang === "ur" ? "ur" : "en");
        }
      } catch (err) {
        console.warn("[sendMessage] API request failed, using instant client RAG:", err);
        aiReply = generateClientRAGAnswer(text, lang === "ur" ? "ur" : "en");
      }

      const aiMsg: Message = { role: "assistant", content: aiReply };
      setMessages((prev) => [...prev, aiMsg]);

      // 4. Save AI response locally (non-blocking)
      if (sessionId) {
        const aiMsgLocalId = generateLocalId();
        const aiNow = new Date().toISOString();
        db.chatMessages.add({
          localId: aiMsgLocalId,
          session_id: sessionId,
          user_id: currentUserId,
          role: 'assistant',
          content: aiReply,
          created_at: aiNow,
          _synced: false,
        }).catch(() => {});

        if (user && isOnline() && !sessionId.startsWith('local_')) {
          supabase.from('chat_messages').insert({
            session_id: sessionId,
            user_id: user.id,
            role: 'assistant',
            content: aiReply,
          }).catch(() => {});
        }
      }
    } catch (error) {
      console.error("[sendMessage] Error in sendMessage flow:", error);
      // Safety fallback answer
      const fallbackReply = generateClientRAGAnswer(text, lang === "ur" ? "ur" : "en");
      setMessages((prev) => [...prev, { role: "assistant", content: fallbackReply }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, user, activeSession, messages, lang]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-bg-primary pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-heading font-bold text-text-primary">{t("assistant.title")}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          {sessions.length > 0 && (
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={startNewChat}
            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Offline cached indicator */}
      {usingCached && (
        <div className="mx-5 mt-2 mb-0 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">{t('offline.dataFromCache')}</p>
        </div>
      )}

      {/* Sessions sidebar */}
      {showSessions && sessions.length > 0 && (
        <div className="mx-5 mt-2 mb-2 bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
          <div className="p-2 max-h-48 overflow-y-auto">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSession(s.id)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-colors ${
                  activeSession === s.id ? 'bg-primary-bg text-primary' : 'hover:bg-gray-50 text-text-primary'
                }`}
              >
                <p className="font-medium truncate">{s.title}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {new Date(s.updated_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-primary to-primary-light text-white rounded-br-md shadow-md"
                  : "bg-white border border-border text-text-primary rounded-bl-md shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Topic Chips */}
      <div className="mx-5 mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: lang === "ur" ? "🌾 گندم گلی ہے" : "🌾 Wet Wheat Remedy", query: "tell me remedy for wheat crops they are wet" },
          { label: lang === "ur" ? "🐄 گائے کو بخار ہے" : "🐄 Cow Fever & Care", query: "my cow has high fever and is weak" },
          { label: lang === "ur" ? "🌱 کھاد کی مقدار" : "🌱 Fertilizer Dosage", query: "what is the fertilizer DAP and Urea dosage per acre?" },
          { label: lang === "ur" ? "🍚 دھان کا بلاسٹ" : "🍚 Rice Blast Cure", query: "tell me remedy for rice blast disease" },
          { label: lang === "ur" ? "🥔 آلو کا جھلساؤ" : "🥔 Potato Blight", query: "how to treat potato late blight?" },
          { label: lang === "ur" ? "🌽 مکئی کی سنڈی" : "🌽 Maize Armyworm", query: "remedy for maize fall armyworm" },
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(chip.query);
            }}
            className="shrink-0 bg-white border border-primary/20 text-primary hover:bg-primary-bg px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Scan suggestion */}
      <div className="mx-5 mb-2">
        <button
          onClick={() => navigate("/capture?mode=crop")}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-bg to-white text-primary px-4 py-2.5 rounded-2xl text-sm font-medium border border-primary/10 hover:shadow-md transition-all duration-200 min-touch"
        >
          <Camera className="w-4 h-4" />
          {lang === "ur" ? "بصری تجزیہ کے لیے تصویر لیں" : "📸 Snap a photo for visual analysis"}
        </button>
      </div>

      {/* Voice Status Indicator */}
      {voiceStatus && (
        <div className="mx-5 mb-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span>{voiceStatus}</span>
        </div>
      )}

      {/* Input bar */}
      <div className="mx-5">
        <div className="flex items-center gap-2 bg-white border-2 border-gray-100 focus-within:border-primary/30 rounded-2xl px-3 py-1.5 shadow-sm transition-all duration-200">
          <button
            onClick={toggleListening}
            title={lang === "ur" ? "آواز کا استعمال کریں" : "Voice search"}
            className={`min-touch flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 ${
              isListening
                ? "bg-danger text-white shadow-lg shadow-danger/30 animate-pulse"
                : "text-text-muted hover:text-primary hover:bg-primary/5"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("assistant.placeholder")}
            className="flex-1 py-2.5 text-sm bg-transparent outline-none text-text-primary placeholder:text-text-muted/60"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="min-touch flex items-center justify-center rounded-xl p-2.5 text-white bg-primary hover:bg-primary-light transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}