# FasalDoc — AI-Powered Crop & Livestock Health Companion
### Founding Blueprint — HATCH / NSTP Submission

---

## 1. Identity

**Primary name: FasalDoc**
*(Fasal = crop/harvest in Urdu/Punjabi; "Doc" = doctor — instantly understandable, works for humans, crops, and livestock alike)*

**Alternate names (backups, check domain/trademark availability before deciding):**
- ZaraiDoc (Zarai = agriculture)
- KisanSaathi (Kisan = farmer, Saathi = companion)
- AgriSehat
- PashuFasal AI

**One-line pitch:**
"FasalDoc is an AI health companion for farmers — point your phone camera at a crop or animal, get an instant diagnosis and a locally-relevant remedy, in your own language, even offline."

**Tagline options:** "Har Fasal, Har Jaanwar, Ek App" / "Kheti ka Doctor, Aapki Jeb Mein"

---

## 2. The Problem (why this matters)

- Pakistan loses an estimated **20-30% of crop yield annually** to pests, disease, and poor input decisions — a huge chunk of it preventable with early detection.
- **~40% of Pakistan's labor force** is agriculture-linked, yet most smallholder farmers have no access to agronomists or vets. Diagnosis today = guesswork, a shopkeeper's advice, or a very delayed government extension worker visit.
- Livestock disease (foot-and-mouth, mastitis, parasitic infections) causes major losses in the dairy/meat economy, and again — no accessible diagnostic tool exists at farmer level.
- Existing global apps (Plantix, PlantVillage) are **not tuned to Pakistani crops, local disease strains, Urdu/regional languages, or local remedy availability** (what's actually sold at the local pesticide shop).

This is your wedge: **hyper-localized, multilingual, offline-capable, dual-domain (crop + livestock) diagnosis** — a gap no one has properly filled here.

---

## 3. Product Scope — Phased

### Phase 1 (MVP — target for HATCH demo, Months 1-4)
- Mobile app (Android first — dominant in rural Pakistan)
- Camera-based crop disease detection for **3-5 high-value crops** (start narrow: cotton, wheat, tomato, or sugarcane — pick based on your team's data access)
- On-device or lightweight-server inference
- Remedy suggestion engine (organic + chemical treatment options, with dosage/local product names)
- Urdu + English UI

### Phase 2 (Months 5-9)
- Expand crop coverage (10-15 crops)
- Add **livestock module**: skin conditions, visible symptoms (via photo) + a symptom-checklist chatbot for non-visual issues
- Offline mode (on-device TensorFlow Lite model so it works without signal — critical for rural coverage)
- Regional language expansion (Punjabi, Sindhi, Pashto)

### Phase 3 (Months 10-12+)
- Soil health / fertilizer advisory (photo + basic sensor input)
- Weather-linked proactive alerts ("blight risk high this week in your area")
- Marketplace integration — connect farmer directly to nearest agri-store or vet for the recommended remedy (this becomes a **revenue channel**)
- Community feature — farmers share verified cases, build a local outbreak map (valuable data + virality)

**Important scoping advice:** for HATCH, do NOT try to build all of this. Judges reward a **sharp, working demo** of Phase 1 with a believable roadmap slide for Phases 2-3. Trying to build everything now will dilute your execution.

---

## 4. Technical Architecture

### 4.1 Mobile App
- **Framework:** React Native or Flutter (cross-platform, faster to ship with a small team) — since you know web dev, React Native has a gentler learning curve if your team knows JS/React.
- Camera capture → local preprocessing (resize/normalize) → inference (on-device or API call) → results UI with confidence score + remedy card.

### 4.2 ML Pipeline
- **Model type:** CNN-based image classifier. Don't train from scratch — use **transfer learning** on proven lightweight architectures:
  - **MobileNetV3** or **EfficientNet-Lite** — both designed for on-device/mobile inference, low compute cost.
- **Datasets to start with (public, for pretraining/prototyping):**
  - PlantVillage (54k+ leaf images, 38 classes) — the standard starting dataset
  - PlantDoc (real-world field images, more realistic than PlantVillage's lab photos)
  - iCassava, Rice Leaf Disease datasets for regional relevance
- **Critical next step:** these public datasets are NOT Pakistan-specific. You will need to **collect local data** — partner with:
  - University of Agriculture Faisalabad (UAF)
  - Pakistan Agricultural Research Council (PARC)
  - Local agri extension offices
  This local data collection is actually a **defensibility moat** — anyone can use PlantVillage, but locally-labeled Pakistani crop disease data is hard to replicate.
- **On-device deployment:** convert trained model to **TensorFlow Lite** or **ONNX** for offline inference — this is your key differentiator vs. apps that require constant connectivity.
- **Livestock module (Phase 2):** similar CNN approach for visible skin/eye conditions; for non-visual symptoms, a **decision-tree or lightweight LLM-based symptom checker** (rule-based is safer than open LLM here — less hallucination risk for animal health).

### 4.3 Remedy Recommendation Engine
- Do **not** let a raw LLM freely generate treatment advice — that's a liability risk (wrong dosage = real farmer losses).
- Build a **structured remedy database**: disease → verified treatment options (organic + chemical) → dosage → locally available product names → estimated cost.
- Populate this database *with expert validation* — this is where an agronomist/vet advisor (see team section) becomes essential, not optional.
- LLM can be used to **rephrase/translate/explain** the remedy in simple Urdu — not to invent the remedy itself.

### 4.4 Backend & DevOps (this is where your devops skill matters a lot)
- **Backend:** Python + FastAPI (fast, matches your Python/ML skillset, easy to containerize)
- **Infra:** Start with a free/low-cost tier — GCP or AWS free credits (startups can often get $1000-5000 in cloud credits; NSTP/HATCH may also have cloud partner perks — ask them directly)
- **CI/CD:** GitHub Actions for automated testing/deployment — cheap, well-documented, matches your GitHub-based workflow
- **Containerization:** Docker for the backend + model-serving service, so it's portable and easy to scale later
- **Model serving:** TensorFlow Serving or a lightweight FastAPI wrapper around the model for the cases where inference happens server-side (higher-accuracy fallback model) vs. on-device (fast, offline, lower-accuracy model)
- **Database:** PostgreSQL for structured remedy/user data; consider a vector DB (e.g. pgvector) later if you add semantic search over farmer queries

---

## 5. Business Model

| Revenue Stream | Description | Timeline |
|---|---|---|
| **Freemium subscription** | Basic detection free; advanced features (soil advisory, priority support, unlimited scans) paid | Phase 2+ |
| **B2B2C partnerships** | License to seed/fertilizer companies (e.g. Engro, FFC) who want to offer value-added service to farmers they sell to | Phase 2+ |
| **Marketplace commission** | Connect farmers to agri-stores/vets for recommended remedies, take a small cut | Phase 3 |
| **Government/NGO contracts** | Agri extension digitization projects, World Bank/FAO-funded rural development programs | Ongoing, pursue in parallel |
| **Data insights (aggregated, anonymized)** | Sell regional disease-outbreak trend data to agri-input companies, insurers | Phase 3+ |

Don't chase monetization hard in year 1 — focus on **user adoption + data collection**. Revenue conversations come easier once you have real usage numbers to show partners.

---

## 6. Team Structure (you + 4 partners = 5 people)

Assign clear, non-overlapping ownership — HATCH judges specifically look for this:

1. **You (ML/AI Lead):** model architecture, training pipeline, dataset strategy
2. **Partner 1 — Mobile/Frontend Lead:** React Native/Flutter app, UX, offline-mode engineering
3. **Partner 2 — Backend/DevOps Lead:** FastAPI backend, cloud infra, CI/CD, model serving
4. **Partner 3 — Product/Business Lead:** market research, HATCH pitch deck, partnerships (universities, agri companies), user interviews with actual farmers
5. **Partner 4 — Data/Domain Lead:** dataset collection & cleaning, coordination with agri university partners, and — critically — sourcing an **agronomist and/or vet as an advisor** (even informal/part-time). This person doesn't need to be a co-founder but is essential for credibility and correctness of remedy data.

---

## 7. 12-Month Roadmap

| Timeframe | Milestone |
|---|---|
| Month 1 | Team roles locked, problem validation (interview 15-20 real farmers or agri-extension workers), finalize target crops |
| Month 2 | Collect/curate dataset (public + start local partnerships), build v1 model prototype |
| Month 3 | Build MVP app (basic camera capture + inference + remedy card), internal testing |
| Month 4 | **HATCH submission/demo** — polished MVP, pitch deck, working prototype |
| Month 5-6 | Field pilot with a small group of real farmers (10-30 users) via a local agri university or extension office partnership — gather real feedback |
| Month 7-9 | Add livestock module, offline mode, expand crop coverage based on pilot feedback |
| Month 10-12 | Refine based on pilot data, pursue seed funding / NSTP incubation next stage, start B2B conversations |

---

## 8. Risks & Honest Challenges

- **Data scarcity:** Pakistan-specific labeled agri/livestock disease image data is limited — budget real time and relationship-building for this, it's your biggest bottleneck, not the ML itself.
- **Rural smartphone/internet access:** design for low-end Android devices and poor connectivity from day one — offline-first is not optional, it's core.
- **Trust & liability:** wrong remedy advice can cause real financial harm to farmers — validate your remedy database with actual agronomists/vets, and consider a clear disclaimer + "consult local expert for severe cases" fallback.
- **Adoption:** farmers won't download an app just because it exists — distribution through trusted channels (agri extension workers, cooperatives, fertilizer company partnerships) will matter more than app-store marketing.

---

## 9. Competitive Landscape (brief)

- **Plantix** (Germany/India) — global leader, large dataset, but not tuned for Pakistani crops/language/local remedies, and monetizes through their own input marketplace which doesn't serve Pakistani farmers.
- **PlantVillage Nuru** (Penn State, Africa-focused) — similar gap, Africa-tuned not South Asia-tuned.
- Local competition is minimal — this is a genuine opportunity, but expect it to close in 2-3 years as others notice the gap too. Speed and local data moat matter.

---

## 10. Next Immediate Steps (this week)

1. Confirm your 3-5 target crops as a team (don't try to cover everything).
2. Each partner starts their track: you begin pulling PlantVillage/PlantDoc datasets and running a baseline MobileNet classifier.
3. Partner 3 starts reaching out to UAF/PARC or any agri department for a possible advisor/data partnership.
4. Register your team for the next HATCH cycle if not already done, and check NSTP's specific submission requirements/deadlines.

---

*This is a living document — update it as you validate assumptions with real farmers and real data. The startups that win aren't the ones with the fanciest plan on day one, they're the ones who talk to real users fastest and adjust.*
