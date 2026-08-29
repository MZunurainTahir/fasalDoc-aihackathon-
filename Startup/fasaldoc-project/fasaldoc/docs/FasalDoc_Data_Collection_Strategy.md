# FasalDoc — Local Data Collection Strategy

Why this matters more than anything else technical: your model's real value comes from
Pakistan-specific data. Anyone can download PlantVillage. Few have labeled photos of
diseased cotton/wheat/tomato from actual Punjab/Sindh fields. This is your moat — treat
it as a core workstream, not an afterthought.

---

## 1. What "Good" Data Looks Like

For each disease class, you want:
- **50-100+ images minimum** to meaningfully improve/fine-tune the model (more is better, but even 50 well-labeled real images per class measurably helps)
- **Real field conditions**: natural lighting, varied backgrounds, different angles/distances — not clean lab photos. This is exactly what PlantVillage lacks and what makes your model actually usable by a farmer holding a phone in a field.
- **Correct, verified labels** — a wrongly labeled image is worse than no image. This is where your agronomist/vet advisor or partner institution becomes essential, not optional.
- **Metadata if possible**: location/region, approximate date, crop variety — useful later for regional disease-trend features (Phase 3).

---

## 2. Collection Channels (pursue several in parallel)

### A. University/Institute Partnerships (highest quality, slowest to set up)
- UAF (University of Agriculture Faisalabad), PARC, or your own university's agri-adjacent departments if any exist
- Ask if they have existing labeled image archives from research projects — sometimes this already exists and just needs permission to use
- Offer something in return: give them early access to the app, credit them as a research/data partner, or offer to build them a small internal tool — partnerships work better as an exchange, not a one-way ask

### B. Field Collection Trips (moderate effort, good quality, fully in your control)
- Visit local farms, nurseries, or agricultural markets (mandi) with your team
- Bring a simple physical checklist: crop type, suspected disease (ask the farmer what they think it is, note it, but get final confirmation from your advisor), photo from 2-3 angles/distances
- Best times: early growing season when disease first appears, and again mid-season — diseases look different at different stages, and your model should learn that
- **Practical tip**: a half-day trip with 2-3 people can realistically gather 100-200 images if you're organized about it

### C. Crowdsourcing via Your Pilot Users (slow start, scales well later)
- Once your MVP is in early pilot users' hands, add a simple "help us improve — was this diagnosis correct?" feedback button
- Every corrected/confirmed prediction becomes a new labeled training example over time
- This is a long-term data flywheel — won't help your HATCH demo, but becomes very valuable by Month 6-9

### D. Local Agri-Input Shops / Extension Workers (fast, informal, needs care)
- Pesticide/fertilizer shop owners and government agri-extension workers see diseased crops constantly and often know what's wrong
- Ask if you can photograph samples brought in by farmers (with permission), and get their informal diagnosis noted — treat this as "helpful but needs expert verification," not ground truth on its own

### E. Public/Research Datasets Beyond PlantVillage (fastest, fills gaps)
- Search for South Asia or India-specific agri datasets (similar climate/crop overlap with Pakistan in many cases) — useful bridge data while local collection ramps up
- Check Kaggle, Zenodo, and university research repositories for anything crop-specific to your chosen 3-5 crops

---

## 3. A Realistic Month-by-Month Data Target

| Month | Target | Primary Channel |
|---|---|---|
| Month 1 | Baseline model on public data only | PlantVillage/PlantDoc |
| Month 2 | First 100-150 local images | Field trip + shop visits |
| Month 3 | 300+ local images total, first retrain with local data mixed in | Field trips + university contact follow-up |
| Month 4 (HATCH) | Whatever you have — even 300-500 local images meaningfully improves real-world accuracy vs. PlantVillage alone | All channels |
| Month 5+ | Ongoing growth via pilot user feedback loop | Crowdsourcing flywheel |

---

## 4. Labeling Workflow (keep it simple, don't overbuild tooling)

1. Store raw images in clearly named folders: `raw_images/cotton/2026-08-15_lahore/`
2. Use a simple spreadsheet (Google Sheets is fine) with columns: `image_filename | crop | suspected_disease | confirmed_by | confidence | location | date`
3. Have your agronomist/vet advisor review and confirm labels weekly, not at the very end — catching a labeling mistake early saves retraining time later
4. Once confirmed, move images into the proper `dataset/CropName___DiseaseName/` folder structure your training script expects

---

## 5. Consent & Ethics (don't skip this)

- If you're photographing farms/shops, get verbal permission — a quick "we're students building a free tool to help farmers, mind if we photograph this affected plant?" goes a long way and is simply the right thing to do
- If any images include identifiable people, get separate consent before using those specific photos in any public materials (pitch deck, demo video)
- If a university/institute shares data with you, get a simple written agreement (even an email confirmation) on how you can use it — protects both sides later

---

## 6. Immediate Action for This Week

1. **Data Lead:** finalize the labeling spreadsheet template today
2. **Product Lead:** identify 1-2 nearby farms, nurseries, or agri markets your team can actually visit within driving distance
3. **Whole team:** block a half-day this week or next for a first field collection trip — don't wait for the "perfect" plan, the first trip teaches you more than more planning will
4. **Data Lead:** send follow-up on UAF/PARC outreach if no response yet from the earlier emails
