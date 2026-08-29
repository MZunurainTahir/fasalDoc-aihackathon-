# FasalDoc — AI Crop & Livestock Health Companion

An AI health companion for Pakistani farmers: point your phone camera at a crop or
animal, get an instant diagnosis and a locally-relevant remedy (organic + chemical),
in Urdu or English, even offline. Built for the HATCH/NSTP hackathon.

This repo has two parts:

```
├── src/            React 19 + Vite + TypeScript PWA (the app itself)
├── backend/         Node/Express API that calls a real AI model for diagnosis + chat
└── supabase/schema.sql   Database schema + Row Level Security policies
```

---

## ⚠️ Before you do anything else: rotate your API keys

Real-looking API keys (Groq, OpenRouter, Gemini, GitHub, OpenAI, HuggingFace, etc.)
were shared in plaintext during this build. Treat all of them as compromised:

1. Go to each provider's dashboard and **regenerate/revoke** the key.
2. Put the new keys only in `backend/.env` (already gitignored — never commit it).
3. Never paste real secrets into a chat, issue tracker, or `README`.

The app is fully functional without any of them — see "Offline/mock mode" below.

---

## What's implemented

- **Camera/gallery capture** → client-side image compression → real AI diagnosis
  (crop disease *or* livestock condition) via the backend, matched against a
  built-in remedy database (organic + chemical treatment, dosage, local product
  names, estimated cost, prevention tips) in Urdu and English.
- **AI chat assistant** (text + voice input via Web Speech API) for general
  crop/livestock questions, backed by a real LLM with a farmer-focused system
  prompt, session history saved per user.
- **Offline-first**: every scan and chat message is saved to IndexedDB (Dexie)
  immediately and synced to Supabase in the background when back online. If the
  backend or internet is unreachable, the app **automatically falls back** to
  realistic local mock responses so a demo never breaks mid-pitch.
- **Farmer Hub** (`/tools`): searchable disease library, a fertilizer dosage
  calculator (acre/kanal), the HATCH pitch deck as an in-app slideshow, and a
  helpline directory (tel: links).
- **Auth**: real Supabase email/password auth, plus a one-tap "Demo Farmer"
  login that seeds realistic sample data — use this for judging/demo day so you
  never depend on network conditions for login.
- **Bilingual UI** (Urdu/English) with a language switcher, PWA installability
  (works offline once installed, home-screen icon), and text-to-speech for
  reading diagnoses aloud.

## What I fixed

- Both "AI" features (`CaptureScreen`, `AssistantScreen`) were pure mocks with a
  code comment saying *"replace with actual API call"* — now wired to a real
  backend with automatic fallback.
- The Supabase tables the app already called (`profiles`, `diagnoses`,
  `chat_sessions`, `chat_messages`, `recovery_cases`) never existed anywhere in
  the project — added `supabase/schema.sql` with Row Level Security so a real
  deploy actually persists data instead of silently failing every query.
- Captured photos were uploaded/stored at full camera resolution (multi-MB) —
  added client-side canvas compression (max 1024px, JPEG q0.7) before upload,
  as the project's own Error Playbook doc recommended but the code hadn't done.
- Several TypeScript strict-mode errors (`noUnusedLocals`) that would fail a
  CI type-check were cleaned up.
- `package.json` name was the Vite default `"my-app"` — renamed to `"fasaldoc"`.
- Default Groq model IDs (`llama-3.3-70b-versatile`, `llama-4-scout`) were
  deprecated by Groq in June 2026 — updated to the current recommended models
  (`openai/gpt-oss-120b` for chat, `qwen/qwen3.6-27b` for vision).

---

## Running locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in GROQ_API_KEY (get a free one at console.groq.com)
npm start               # http://localhost:8000
```

Check it's alive: `curl http://localhost:8000/health`

### 2. Frontend

```bash
npm install
cp .env.example .env    # VITE_API_URL should point at your backend
npm run dev              # http://localhost:5173
```

Tap **"Continue as Demo Farmer"** on the login screen to skip auth entirely and
explore the app with pre-seeded sample data — the fastest way to see everything
working.

---

## Deploying (so you can actually demo/submit it)

### Step 1 — Supabase (data + auth)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the entire contents of
   `supabase/schema.sql`, and run it.
3. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key** — you'll need these for the frontend deploy.

### Step 2 — Backend (Render, Railway, Fly.io, or any Node host)

Example using [Render](https://render.com) (free tier works for a demo):

1. Push this repo to GitHub.
2. New → Web Service → connect the repo, set **Root Directory** to `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables from `backend/.env.example` (at minimum
   `GROQ_API_KEY`; set `CORS_ORIGIN` to your frontend's deployed URL once you
   have it).
5. Deploy, then note the public URL (e.g. `https://fasaldoc-api.onrender.com`).

> Free tiers "cold start" after idling — the first request after a pause can
> take a few seconds. Warm it up right before your demo, or mention it if
> judges test the live app after a break (this is a known, acceptable MVP
> tradeoff — see `Startup/fasaldoc-project/fasaldoc/docs/FasalDoc_Error_Playbook.md`).

### Step 3 — Frontend (Vercel or Netlify)

Example using [Vercel](https://vercel.com):

1. New Project → import the repo → Framework preset: **Vite**.
2. Set the **Root Directory** to the repo root (not `backend`).
3. Environment variables:
   - `VITE_API_URL` = your backend URL from Step 2
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` = from Step 1
4. Deploy. Build command `npm run build`, output directory `dist` (Vercel
   auto-detects these for Vite).
5. Go back to your backend host and set `CORS_ORIGIN` to this new frontend URL,
   then redeploy the backend so it accepts requests from it.

You now have a live, installable PWA with real AI diagnosis and chat.

### Offline/mock mode (no backend needed at all)

If you don't set `VITE_API_URL`, or the backend is unreachable, or you don't
configure an LLM key on the backend — the app keeps working using realistic
built-in mock responses for both diagnosis and chat. This is intentional: it
means your demo can never fully break, even with bad wifi at the venue.

---

## Environment variables reference

| File | Variable | Required? | Notes |
|---|---|---|---|
| `backend/.env` | `GROQ_API_KEY` | Recommended | Free tier at console.groq.com. Without it, falls back to mock diagnosis/chat. |
| `backend/.env` | `OPENROUTER_API_KEY` | Optional | Automatic fallback if Groq fails. |
| `backend/.env` | `CORS_ORIGIN` | Recommended for prod | Comma-separated allowed origins; defaults to `*`. |
| `.env` (root) | `VITE_API_URL` | Required for real AI | URL of your deployed backend. |
| `.env` (root) | `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Recommended | From your Supabase project. Falls back to a built-in demo project otherwise. |

---

## Project docs

The original founding/hackathon docs are preserved under
`Startup/fasaldoc-project/fasaldoc/docs/` — worth reading before demo day:
`FasalDoc_Startup_Blueprint.md`, `FasalDoc_MVP_Build_Plan.md`,
`FasalDoc_Error_Playbook.md`, `FasalDoc_Data_Collection_Strategy.md`,
`FasalDoc_Pitch_Deck_Structure.md`. The in-app **Farmer Hub → Startup Deck**
tab also turns the pitch deck structure into an actual on-screen slideshow you
can present from your phone.
