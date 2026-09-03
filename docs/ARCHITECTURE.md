# FasalDoc — Architecture Guide

## System Overview

FasalDoc is a three-tier Progressive Web App (PWA) designed for low-bandwidth agricultural environments. The architecture prioritizes **offline-first resilience**, **sub-second diagnosis**, and **bilingual accessibility** across Urdu and English.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Farmer's Smartphone / PWA                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Home    │ │ Capture  │ │Assistant │ │  Tools   │          │
│  │  Screen  │ │  Screen  │ │  Screen  │ │  Screen  │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       └─────────────┴───────────┴─────────────┘                │
│                         │ React 19 + TypeScript                │
│                    ┌────┴─────┐                                 │
│                    │  Zustand  │ ← Global state                 │
│                    │  Store    │                                 │
│                    └────┬─────┘                                 │
│            ┌────────────┼────────────┐                          │
│            │            │            │                          │
│     ┌──────┴──┐  ┌─────┴────┐ ┌────┴──────┐                   │
│     │ Dexie.js│  │ API      │ │ Supabase  │                   │
│     │ (IDB)   │  │ Client   │ │ Client    │                   │
│     └─────────┘  └────┬─────┘ └────┬──────┘                   │
└────────────────────────┼────────────┼──────────────────────────┘
                         │            │
              ┌──────────┘            └──────────┐
              │ HTTP/REST                         │ Supabase SDK
              ▼                                   ▼
   ┌────────────────────┐              ┌─────────────────────┐
   │  FasalDoc Backend  │              │  Supabase Cloud     │
   │  Express.js (ESM)  │              │  PostgreSQL + RLS   │
   │                    │              │  Auth Service        │
   │  /api/diagnose     │              │  Storage (images)   │
   │  /api/chat         │              └─────────────────────┘
   │  /health           │
   └────────┬───────────┘
            │
   ┌────────┴──────────────────────────────────┐
   │         LLM Provider Mesh                  │
   │                                            │
   │  ┌─────────┐ ┌──────┐ ┌─────────────┐    │
   │  │ Gemini  │ │ Groq │ │ OpenRouter  │    │
   │  │ 2.0     │ │      │ │             │    │
   │  └─────────┘ └──────┘ └─────────────┘    │
   │                                            │
   │  ┌─────────────────────────────────────┐  │
   │  │  Offline RAG Knowledge Engine       │  │
   │  │  (Verified Pakistani Agri KB)       │  │
   │  └─────────────────────────────────────┘  │
   └────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Screen Components

The app uses **React Router v7** for navigation with lazy-loaded screens:

```
App.tsx (Root)
├── AuthScreen.tsx        → /login
├── HomeScreen.tsx        → / (dashboard with weather, mandi rates, recent scans)
├── CaptureScreen.tsx     → /capture (camera + diagnosis flow)
├── AssistantScreen.tsx   → /assistant (AI chat interface)
├── HistoryScreen.tsx     → /history (past diagnoses)
├── ToolsScreen.tsx       → /tools (14-tool farmer utility hub)
└── SettingsScreen.tsx    → /settings (language, theme, account)
```

### State Management

- **Zustand** (`store.ts`): Global app state — theme, language, auth status, sync queue.
- **React Context**: `AuthContext` (authentication), `LanguageContext` (i18n).
- **Dexie.js** (`db.ts`): Local IndexedDB for diagnoses, chat sessions, offline queue.

### Offline-First Data Flow

```
User Action
    │
    ▼
┌─────────────┐     Online? ──Yes──▶ HTTP POST to Backend
│  API Client │        │                    │
│  (api.ts)   │        │                    ▼
└─────────────┘        No             ┌───────────┐
                       │              │  Response  │
                       ▼              │  → Dexie   │
                ┌─────────────┐       └───────────┘
                │  Dexie.js   │
                │  Save Local │
                │  Queue Sync │
                └──────┬──────┘
                       │
              Connection Restored?
                       │
                       ▼
                ┌─────────────┐
                │  Background │
                │  Sync to    │
                │  Supabase   │
                └─────────────┘
```

---

## Backend Architecture

### Module Structure

```
backend/src/
├── server.js       → Express app, routes, middleware, startup
├── llm.js          → Multi-provider LLM client with fallback chain
├── diagnose.js     → Image diagnosis: vision model call + remedy matching
├── chat.js         → Chat endpoint: RAG context injection + LLM completion
├── rag.js          → Offline RAG engine: keyword search over Agri KB
└── remedyKeys.js   → Crop/livestock catalogue keys for remedy lookup
```

### LLM Provider Fallback

```
                    Request
                      │
                      ▼
              ┌───────────────┐
              │ Has Gemini    │──Yes──▶ Gemini 2.0 Flash
              │ API Key?      │                    │
              └───────┬───────┘              Success?──▶ Return
                      No                       │
                      ▼                       Fail
              ┌───────────────┐                │
              │ Has Groq      │──Yes──▶ Groq Llama-3.3-70B
              │ API Key?      │                    │
              └───────┬───────┘              Success?──▶ Return
                      No                       │
                      ▼                       Fail
              ┌───────────────┐                │
              │ Has OpenRouter│──Yes──▶ OpenRouter
              │ API Key?      │                    │
              └───────┬───────┘              Success?──▶ Return
                      No                       │
                      ▼                       Fail
              ┌───────────────┐                │
              │ Offline RAG   │◀───────────────┘
              │ Knowledge     │
              │ Engine        │
              └───────────────┘
```

---

## Database Schema

### Supabase Tables

```
┌─────────────────┐       ┌──────────────────────┐
│   auth.users    │       │   public.profiles     │
│  (Supabase Auth)│──1:1──│  full_name, phone,    │
└────────┬────────┘       │  location, farming_   │
         │                │  type, language       │
         │                └──────────────────────┘
         │
         ├──1:N──┌──────────────────────┐
         │       │  public.diagnoses    │
         │       │  type, image_url,    │
         │       │  predicted_disease,  │
         │       │  confidence, remedy  │
         │       └──────────────────────┘
         │
         ├──1:N──┌──────────────────────┐
         │       │  public.chat_sessions│
         │       │  title, created_at   │
         │       └────────┬─────────────┘
         │                │ 1:N
         │                ▼
         │       ┌──────────────────────┐
         │       │  public.chat_messages│
         │       │  role, content       │
         │       └──────────────────────┘
         │
         └──1:N──┌──────────────────────┐
                 │  public.recovery_    │
                 │  cases               │
                 │  status, days_since, │
                 │  follow_up_photo     │
                 └──────────────────────┘
```

All tables enforce **Row-Level Security (RLS)** — each user can only read/write their own rows via `auth.uid() = user_id` policies.

---

## Data Flow: Diagnosis

```
1. Farmer captures photo
         │
         ▼
2. Client compresses image (canvas, max 1024px, JPEG q0.7)
         │
         ▼
3. Base64 POST → /api/diagnose
         │
         ▼
4. Backend selects vision model (Gemini/Groq/OpenRouter)
         │
         ▼
5. Vision model returns disease name + confidence
         │
         ▼
6. Backend matches disease → remedy database (rag.js)
         │
         ▼
7. Structured JSON response:
   { disease, confidence, remedy: { organic, chemical, prevention } }
         │
         ▼
8. Client saves to Dexie.js (local) + Supabase (cloud sync)
         │
         ▼
9. UI renders diagnosis card with remedy tabs
```

---

## PWA & Service Worker

```
Browser
   │
   ├─── Service Worker (Workbox)
   │       │
   │       ├── Precache: index.html, JS chunks, CSS
   │       │
   │       ├── Runtime Cache:
   │       │     ├── Google Fonts → CacheFirst (1 year)
   │       │     └── Supabase API → NetworkFirst (1 day, 5s timeout)
   │       │
   │       └── Navigation Fallback → index.html (SPA)
   │
   └─── App Shell (React)
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                   │
│                                                       │
│  ┌─────────────┐    ┌─────────────────────────────┐ │
│  │ No API Keys │    │ Supabase Auth Token (JWT)   │ │
│  │ in Bundle   │    │ for user-scoped operations  │ │
│  └─────────────┘    └──────────────┬──────────────┘ │
└──────────────────────────────────────┼────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                   │
                    ▼                  ▼                   ▼
          ┌──────────────┐  ┌────────────────┐  ┌───────────────┐
          │ FasalDoc     │  │ Supabase       │  │ Supabase      │
          │ Backend      │  │ Auth           │  │ Database      │
          │              │  │                │  │               │
          │ LLM keys     │  │ JWT validation │  │ RLS policies  │
          │ (server-side │  │                │  │ (per user_id) │
          │  only)       │  │                │  │               │
          └──────────────┘  └────────────────┘  └───────────────┘
```

---

## Build & CI Pipeline

```
Push / PR to main
        │
        ▼
┌───────────────────┐
│ GitHub Actions CI  │
│                    │
│ 1. npm ci          │
│ 2. tsc --noEmit    │ ← Type-check
│ 3. vitest run      │ ← 48 unit tests
│ 4. vite build      │ ← Production PWA build
└───────────────────┘
```

---

*Last updated: September 2026*
