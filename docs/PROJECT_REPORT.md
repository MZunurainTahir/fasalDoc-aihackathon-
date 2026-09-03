# FasalDoc — Complete Project Report

**Version:** 2.0  
**Date:** September 2026  
**Event:** BanoQabil AI Hackathon  
**Team:** MZunurain Tahir (Founder & Lead Architect) & Muhammad Abdullah Khalid (Co-Founder & Tech Partner)

---

## 1. Executive Summary

FasalDoc is an AI-powered crop and livestock health intelligence platform designed for smallholder farmers in Pakistan. It delivers instant, bilingual (Urdu/English) visual diagnosis, verified remedy prescriptions, weather-based disease risk forecasts, live mandi rates, government scheme directories, and tele-veterinary bookings — all in an offline-first Progressive Web App (PWA) that works even on 2G/3G rural networks.

### Mission
To eliminate preventable crop and livestock losses by putting an AI agronomist and veterinarian in every farmer's pocket.

### Vision
Become Pakistan's most trusted digital agriculture health companion, expanding to SAARC markets by 2027.

---

## 2. Problem Statement

Pakistan's agricultural sector faces critical challenges:

- **30–40% annual crop losses** due to delayed disease diagnosis (PARC/NARC estimates)
- **1 extension officer per 2,000+ farmers** — expertise is physically inaccessible
- **Rs. 800+ billion** estimated annual economic loss from crop diseases and livestock mortality
- **58+ million farming families** lack instant diagnostic tools
- **Low literacy & connectivity** in rural areas limit adoption of generic global apps
- **Information asymmetry** — farmers don't know real-time mandi rates, available subsidies, or certified experts

---

## 3. Solution Overview

FasalDoc combines edge computer vision, domain-specific RAG, weather intelligence, and market/government data into one farmer-friendly mobile platform.

### Core Capabilities

1. **AI Visual Diagnosis** — Snap a photo of crop or livestock symptoms; get diagnosis in <3 seconds
2. **Verified Remedy Prescriptions** — Organic + chemical treatments with local Pakistani brands, dosages, and PKR costs
3. **Bilingual Voice Interface** — Full Urdu/English support with speech-to-text and text-to-speech
4. **Offline-First Architecture** — Works without internet; syncs when connectivity returns
5. **Weather Disease Risk Forecast** — Hyperlocal 5-day outbreak risk by province/city
6. **Live Mandi Rates** — Commodity prices from major markets across all provinces
7. **Government Schemes Hub** — Federal and provincial subsidies, loans, insurance, and support programs
8. **Tele-Vet & Crop Advisor Booking** — Consult certified vets, plant pathologists, and extension officers
9. **14-Tool Farmer Hub** — Fertilizer calculator, yield & income estimator, seed rate calculator, crop calendar, soil health, irrigation planner, community pest reports, disease library, and helplines
10. **Recovery Tracking** — Track treatment progress and follow-up reminders
11. **Adaptive UI** — Full dark mode and Urdu/English theming on every screen

---

## 4. Market Opportunity

### Pakistan Agriculture at a Glance

| Metric | Value |
|--------|-------|
| Agricultural GDP share | ~23% |
| Farming population | 40–45% of workforce |
| Agricultural land | 44+ million hectares |
| Mobile subscribers | 195+ million |
| Smartphones in rural areas | Rapidly growing (estimated 60M+ by 2026) |

### Total Addressable Market (TAM)
- **Primary:** 8M+ smallholder farming households in Pakistan
- **Serviceable:** 3M+ smartphone-owning farmers
- **Initial beachhead:** Punjab province (60% of national agricultural output)

### Revenue Model
1. **Freemium App** — Free 10 scans/month; Pro at Rs. 199/month for unlimited scans + priority tele-vet
2. **B2B Partnerships** — ZTBL, PPCBL, agri-input companies, crop insurance providers
3. **Tele-Vet Commission** — 10–15% on paid consultations
4. **Agri-Input Marketplace** (Phase 4) — Lead generation for certified retailers
5. **Government/NGO Contracts** — Provincial agriculture department deployments

---

## 5. Technical Architecture

### Frontend
- **React 19 + TypeScript**
- **Vite 7 PWA** with Workbox service worker
- **Tailwind CSS v4** mobile-first design with full dark mode
- **Dexie.js** IndexedDB for offline storage
- **Zustand** lightweight state management
- **react-router-dom v7** navigation

### Backend
- **Node.js + Express** AI gateway
- **Multi-provider LLM mesh:** Gemini, Groq, OpenRouter
- **Domain RAG engine** for offline fallback
- **Rate limiting & structured error handling**

### Database & Auth
- **Supabase PostgreSQL** with Row Level Security
- **Auth:** Email/password + demo/guest mode

### AI/ML
- **Vision models** via Gemini 2.0 Flash / Groq
- **Offline RAG** with curated Pakistani agricultural knowledge base
- **Image compression** client-side before upload (max 1024px, JPEG q0.7)

### External APIs
- **OpenWeatherMap / VisualCrossing** for weather disease-risk forecasts
- **Pakistan Bureau of Statistics / Provincial Mandi Committees** for commodity rates
- **Supabase** for auth, database, and real-time sync

### Quality Engineering
- 48 automated unit tests (Vitest) covering weather, market, schemes, yield, seed rate, and community report logic
- Zero TypeScript errors enforced via strict type-checking
- GitHub Actions CI pipeline: type-check → test → build on every push

---

## 6. Provincial Coverage

FasalDoc is designed for nationwide deployment with localized data:

| Province | Key Crops | Key Livestock | Cities Covered |
|----------|-----------|---------------|----------------|
| Punjab | Wheat, Cotton, Rice, Sugarcane, Maize | Cattle, Buffalo, Poultry | Lahore, Faisalabad, Multan, Bahawalpur, Gujranwala, Sahiwal, Sargodha |
| Sindh | Rice, Cotton, Sugarcane, Wheat | Cattle, Camel, Poultry | Karachi, Hyderabad, Sukkur, Nawabshah, Larkana |
| Khyber Pakhtunkhwa | Wheat, Maize, Tobacco, Fruits | Cattle, Sheep, Goat | Peshawar, Mardan, Swat, Abbottabad, D.I. Khan |
| Balochistan | Wheat, Dates, Fruits, Livestock | Sheep, Goat, Camel | Quetta, Gwadar, Sibi, Loralai, Khuzdar |
| Gilgit-Baltistan | Wheat, Fruits, Potatoes | Yak, Sheep, Goat | Gilgit, Skardu, Hunza |
| AJK | Maize, Rice, Fruits | Cattle, Goat | Muzaffarabad, Mirpur, Rawalakot |

---

## 7. Feature Deep Dive

### 7.1 AI Diagnosis
- Accepts crop or livestock photos
- Compresses images for low-bandwidth networks
- Backend vision model classifies condition; falls back to RAG if offline
- Returns disease name, confidence, organic/chemical remedies, dosage, cost, prevention

### 7.2 Weather Disease Risk
- User selects or auto-detects location
- Fetches current weather + 5-day forecast
- Algorithm scores risk based on humidity, temperature, rainfall
- Issues color-coded alerts with recommended actions
- Covers all provinces with city-level granularity

### 7.3 Mandi Rates
- Daily commodity prices from major markets
- Provincial market coverage
- Trend indicators (up/down/stable)
- Price history (planned)

### 7.4 Government Schemes
- Federal and provincial schemes
- Eligibility, benefits, contacts, deadlines
- Filter by category (crop, livestock, insurance, finance, inputs)
- Direct helpline dialing

### 7.5 Tele-Vet
- Book video/audio/clinic/field visits
- Verified expert profiles with ratings and specialties
- Bilingual consultation support
- Appointment scheduling with reminders

### 7.6 Farmer Tools (14-Tool Hub)
- Fertilizer/NPK calculator per acre/kanal
- Yield & income estimator with low/average/high projections for 7 major crops
- Seed rate calculator with spacing and season guidance
- Crop calendar with sowing, irrigation, and harvest windows
- Soil health scoring with amendment recommendations
- Irrigation planner by crop stage, soil type, and temperature
- Community pest & disease outbreak reports, filtered by province
- Disease library with search
- Emergency helplines
- Interactive pitch deck for demos

---

## 8. Competitive Advantage

| Competitor | FasalDoc Differentiator |
|------------|-------------------------|
| Generic plant ID apps | Pakistan-specific remedies, brands, dosages, and Urdu voice |
| International AgriTech | Offline-first for rural connectivity |
| WhatsApp-based advisory | Structured, verified, traceable diagnoses with history |
| Local SMS services | Visual AI diagnosis + tele-vet + market rates in one app |

---

## 9. Roadmap

- [x] Phase 1: MVP — Crop/livestock diagnosis, RAG chat, PWA, offline sync
- [x] Phase 2: Weather risk alerts, mandi rates, schemes hub, tele-vet
- [x] Phase 3: Farmer intelligence suite — crop calendar, soil health, irrigation planner, yield estimator, seed rate calculator, community pest reports, dark mode
- [ ] Phase 4: IoT soil sensors, agri-input marketplace, B2B dashboards
- [ ] Phase 5: Bangladesh & India localization

---

## 10. Team

- **MZunurain Tahir** — Founder & Lead Architect
  - GitHub: https://github.com/MZunurainTahir
  - Role: Product strategy, AI/ML integration, architecture

- **Muhammad Abdullah Khalid** — Co-Founder & Tech Partner
  - GitHub: https://github.com/AbdullahKhalid
  - Role: Full-stack development, DevOps, system design

---

## 11. Conclusion

FasalDoc addresses a real, measurable problem affecting millions of Pakistani farmers. By combining AI diagnosis, weather intelligence, market data, government scheme awareness, and tele-consultation in one offline-first platform, it has the potential to significantly reduce preventable agricultural losses while building a sustainable AgriTech business.
