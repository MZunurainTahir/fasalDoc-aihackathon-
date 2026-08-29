# FasalDoc — Week-by-Week MVP Build Plan (Months 1-4)
### Target: Working prototype ready for HATCH demo

Assumes 5-person team (you + 4 partners) as defined in the founding blueprint. Roughly 8-10 hrs/week/person alongside coursework — adjust pace if your team can commit more or less.

---

## Month 1 — Foundation & Validation

**Goal: Know exactly what you're building and why, before writing product code.**

### Week 1
- **All:** Team kickoff — lock roles (ML, Mobile, Backend/DevOps, Product/Business, Data/Domain).
- **Product Lead:** Draft a 10-question interview script for farmers/agri-extension workers (what do they currently do when a crop looks sick? what would stop them from using an app?).
- **You (ML):** Download and explore PlantVillage + PlantDoc datasets. Understand class distribution, image quality, gaps.
- **Data Lead:** List and start contacting 3-5 potential partners (UAF, PARC, local agri extension office, even a knowledgeable local farmer/vendor).

### Week 2
- **Product Lead:** Conduct 8-10 farmer/stakeholder interviews (in person if possible — Lahore/Punjab area contacts, or through university agri department). Document findings.
- **You (ML):** Train a baseline MobileNetV3 classifier on PlantVillage for 3-5 crops. Don't aim for perfection — get a working baseline (~70-80% accuracy is fine at this stage).
- **Backend Lead:** Set up GitHub repo, project structure, FastAPI skeleton, Docker basics.
- **Mobile Lead:** Set up React Native project skeleton, get camera capture working (no ML yet — just capture + display image).

### Week 3
- **All:** Team review of interview findings. **Finalize your 3-5 target crops** based on real farmer pain points + data availability (don't pick purely on data convenience).
- **You (ML):** Improve baseline model, start evaluating on PlantDoc (real-world images) to check how badly accuracy drops outside lab-condition photos — this tells you how much local data you'll actually need.
- **Data Lead:** Begin building the remedy database structure (spreadsheet is fine for now: disease → symptoms → organic remedy → chemical remedy → dosage → local product names). Start populating for your chosen crops using verified agri-extension sources.
- **Backend Lead:** Build basic FastAPI endpoint that accepts an image and returns a dummy/mock response — get the pipeline shape right before the real model is ready.

### Week 4
- **All:** Checkpoint meeting — review model accuracy, remedy DB progress, app skeleton. Adjust scope if anything's behind.
- **You (ML):** Convert current model to TensorFlow Lite, test inference speed on an actual Android device (not just simulator).
- **Mobile Lead:** Connect camera capture to backend API call, display raw prediction response in UI (still ugly, that's fine).
- **Product Lead:** Start drafting the HATCH application/pitch narrative using early findings — problem statement + validation evidence.

---

## Month 2 — Core Functionality

**Goal: End-to-end flow working — photo in, diagnosis + remedy out.**

### Week 5
- **You (ML):** Fine-tune model specifically on your finalized 3-5 crops with any local images gathered so far. Set up a proper train/val/test split and track accuracy per class.
- **Backend Lead:** Replace mock response with real model inference (server-side call to your saved model).
- **Data Lead:** Get remedy database to "complete for MVP crops" — every disease class in your model should have a matching remedy entry.
- **Mobile Lead:** Build the results screen UI — diagnosis name, confidence score, remedy card layout.

### Week 6
- **All:** First internal end-to-end test — take real photos of test plants (even printed images or a nursery visit), run through the full app flow, log failures.
- **You (ML):** Address the most common failure modes found in testing (e.g. lighting sensitivity, background clutter confusing the model — consider data augmentation).
- **Backend Lead:** Add basic error handling (blurry image, no leaf detected, low-confidence prediction → "unclear, try again" instead of a wrong confident answer).
- **Mobile Lead:** Add Urdu translation for UI labels and remedy text (at least static UI strings; dynamic remedy text can be pre-translated in the database).

### Week 7
- **You (ML):** Implement on-device inference path (TFLite model bundled in app) as a fallback for offline mode — test with airplane mode on.
- **Backend Lead:** Set up basic logging/analytics (which crops/diseases are being scanned, confidence distributions) — you'll want this data later.
- **Product Lead:** Reach out to 5-10 more farmers/stakeholders to test an early build and get feedback (even a rough version — real reactions matter more than polish right now).
- **Data Lead:** Continue expanding local dataset — organize any collected images with proper labels, keep building the local-data moat.

### Week 8
- **All:** Checkpoint — full team demo of current app to each other, cold (no explaining away rough edges). Note every point of confusion or friction.
- **Mobile Lead:** Polish based on demo feedback — loading states, error messages, basic onboarding screen.
- **Backend Lead:** Deploy backend to a cloud instance (GCP/AWS free tier) so the app isn't just running locally — start getting comfortable with real deployment.
- **You (ML):** Document model performance clearly (accuracy per class, known weaknesses) — you'll need this for the pitch.

---

## Month 3 — Polish & Pilot Prep

**Goal: App is stable enough to hand to a real farmer without you standing next to them.**

### Week 9
- **All:** Identify 10-15 farmers/small growers willing to pilot-test the app (through your university/PARC contacts if possible).
- **Mobile Lead:** Build a simple onboarding flow — 2-3 screens explaining how to use the app (icons/visuals over text, since literacy levels vary).
- **Backend Lead:** Add basic rate-limiting/stability so the backend doesn't fall over under pilot load.
- **Data Lead:** Cross-check remedy database entries with your agronomist/vet advisor if you've secured one — accuracy matters more than coverage here.

### Week 10
- **All:** Soft-launch pilot with your identified test group. Provide a simple feedback channel (WhatsApp group, short form, or in-person check-ins).
- **You (ML):** Monitor real-world prediction confidence/accuracy from pilot usage, start a list of misclassifications for future retraining.
- **Product Lead:** Start building the actual pitch deck structure (problem, solution, demo, market size, traction/validation evidence, team, roadmap, ask).

### Week 11
- **All:** Collect and review pilot feedback. Triage into "must-fix before HATCH" vs "roadmap item."
- **Mobile Lead + Backend Lead:** Fix critical bugs/UX blockers found during pilot.
- **You (ML):** If time allows, retrain model incorporating any new local data collected during pilot.

### Week 12
- **All:** Feature freeze — no new features from here, only stability/polish. This is the hardest discipline to hold, but critical.
- **Product Lead:** Finalize pitch deck draft, start rehearsing the live demo (have a backup recorded video demo in case of live-demo failure — always do this).

---

## Month 4 — HATCH Demo Prep

**Goal: A confident, working, rehearsed pitch + demo.**

### Week 13
- **All:** Full dry-run of the pitch + live demo to an outside audience (professors, seniors, anyone not on the team) — collect honest critique.
- **Product Lead:** Refine pitch based on dry-run feedback.

### Week 14
- **All:** Final bug fixes only. Prepare backup materials — screenshots, recorded demo video, printed one-pager.
- **Data/Domain Lead:** Prepare a short "validation evidence" slide — pilot user count, farmer testimonials/quotes, any measurable outcome (e.g. "correctly flagged X out of Y confirmed cases in pilot").

### Week 15
- **All:** Second dry-run, ideally to someone who's seen a HATCH pitch before or a mentor. Tighten timing (most pitch slots are 5-10 minutes — practice to the exact limit).

### Week 16 — **HATCH Submission/Demo**
- Ship it. Demo confidently. Be ready to answer: "What happens after this?" and "Why will farmers actually use this?" — those are almost always the real questions judges care about.

---

## Cadence Recommendations
- **Weekly team sync** (30-45 min) — status, blockers, adjust plan.
- **Bi-weekly demo to yourselves** — forces honesty about actual progress vs. perceived progress.
- **Keep a shared doc of "known issues / cut scope"** — HATCH judges respect a team that knows its own limitations over one that pretends everything's perfect.

---

## Reality Check
This plan is ambitious for a 5-person team of second-year students alongside coursework. If Month 1-2 validation reveals the timeline is too tight, **cut crop coverage or drop the offline mode for the HATCH demo specifically** — a rock-solid 2-crop online-only demo beats a shaky 5-crop offline one. You can always say "offline mode and expanded crops are next quarter" in the roadmap slide.
