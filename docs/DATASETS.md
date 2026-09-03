# FasalDoc — Datasets & Knowledge Base

This document catalogs all structured datasets, knowledge bases, and agricultural reference data used by the FasalDoc platform.

---

## Table of Contents

- [1. Crop Disease Remedy Database](#1-crop-disease-remedy-database)
- [2. Livestock Disease Remedy Database](#2-livestock-disease-remedy-database)
- [3. Agricultural RAG Knowledge Base](#3-agricultural-rag-knowledge-base)
- [4. Mandi Price Dataset](#4-mandi-price-dataset)
- [5. Weather & Disease Risk Data](#5-weather--disease-risk-data)
- [6. Government Schemes Directory](#6-government-schemes-directory)
- [7. Pakistan Locations Database](#7-pakistan-locations-database)
- [8. Crop Calendar Data](#8-crop-calendar-data)
- [9. Tele-Vet Expert Profiles](#9-tele-vet-expert-profiles)
- [10. Community Pest Reports](#10-community-pest-reports)
- [11. Class Names (ML Model)](#11-class-names-ml-model)
- [12. Supabase Schema](#12-supabase-schema)

---

## 1. Crop Disease Remedy Database

**Source:** `src/lib/remedyData.ts`

A curated database of **20+ crop diseases** across major Pakistani staple crops with verified organic and chemical treatments.

### Supported Crops

| Crop | Diseases Covered | Example |
|------|-----------------|---------|
| **Wheat** | Rust, Powdery Mildew, Karnal Bunt, Loose Smut | `Wheat___Brown_Rust` |
| **Rice** | Blast, Bacterial Leaf Blight, Sheath Blight | `Rice___Blast` |
| **Cotton** | Leaf Curl, Whitefly, Bollworm, Root Rot | `Cotton___Whitefly` |
| **Tomato** | Late Blight, Early Blight, Leaf Curl, Fusarium Wilt | `Tomato___Late_Blight` |
| **Potato** | Late Blight, Early Blight, Blackleg | `Potato___Late_Blight` |
| **Maize** | Fall Armyworm, Northern Leaf Blight, Downy Mildew | `Maize___Fall_Armyworm` |
| **Sugarcane** | Red Rot, Smut, Grassy Shoot | `Sugarcane___Red_Rot` |

### Remedy Record Schema

Each disease entry contains:

```typescript
{
  disease: string;              // Disease name (English)
  diseaseUrdu: string;          // Disease name (Urdu)
  crop: string;                 // Host crop
  organic: string;              // Organic/traditional treatment
  organicUrdu: string;          // Organic treatment (Urdu)
  chemical: {
    activeIngredient: string;   // e.g., "Mancozeb 75% WP"
    brands: string[];           // e.g., ["Dithane M-45", "Manzate"]
    dosage: string;             // e.g., "2.5g/L water"
    interval: string;           // e.g., "7-10 days"
  };
  prevention: string[];         // Preventative measures
}
```

### Example: Tomato Late Blight

```json
{
  "disease": "Tomato Late Blight",
  "diseaseUrdu": "ٹماٹر لیٹ بلائٹ",
  "crop": "Tomato",
  "organic": "Spray neem oil solution (5ml/L) on foliage. Apply copper-based Bordeaux mixture as preventive.",
  "chemical": {
    "activeIngredient": "Mancozeb 75% WP",
    "brands": ["Dithane M-45 (Dow AgroSciences)", "Manzate (UPL)"],
    "dosage": "2.5g per litre water, 500L/acre",
    "interval": "7-10 days, maximum 3 applications per season"
  },
  "prevention": [
    "Remove and destroy infected plant debris immediately",
    "Ensure 60cm minimum plant spacing for air circulation",
    "Avoid overhead irrigation; use drip irrigation instead"
  ]
}
```

---

## 2. Livestock Disease Remedy Database

**Source:** `src/lib/remedyData.ts`

Covers common diseases in Pakistani dairy and poultry livestock.

### Supported Animals

| Animal | Conditions Covered |
|--------|-------------------|
| **Cattle / Buffalo** | Foot & Mouth Disease (FMD), Mastitis, Bloat, Tick Fever |
| **Goat / Sheep** | PPR (Peste des Petits Ruminants), Enterotoxemia, Bloat |
| **Poultry** | Newcastle Disease, Coccidiosis, Fowl Pox, Infectious Bronchitis |

### Example: Newcastle Disease (Poultry)

```json
{
  "disease": "Newcastle Disease",
  "diseaseUrdu": "رانی کھیت",
  "animal": "Poultry",
  "organic": "Isolate affected birds immediately. Provide electrolyte water with jaggery. Maintain clean, dry bedding.",
  "chemical": {
    "activeIngredient": "NDV Vaccine (LaSota strain)",
    "brands": ["Nobilis ND (MSD)", "Nobivac Newcastle"],
    "dosage": "Eye drop or drinking water — 1 dose per bird",
    "interval": "Day 7, Day 21, then every 3 months"
  },
  "prevention": [
    "Strict vaccination schedule from day-old chicks",
    "Biosecurity: foot baths, restricted visitor access",
    "Quarantine new birds for 14 days before introduction"
  ]
}
```

---

## 3. Agricultural RAG Knowledge Base

**Source:** `backend/src/rag.js`

The offline RAG (Retrieval-Augmented Generation) engine contains a curated knowledge base of Pakistani agricultural practices.

### Knowledge Domains

| Domain | Topics |
|--------|--------|
| **Crop Management** | Sowing seasons, seed rates, spacing, irrigation schedules |
| **Soil Health** | pH management, NPK ratios, organic matter, salinity remediation |
| **Pest & Disease** | IPM strategies, biological controls, chemical rotation |
| **Livestock Care** | Vaccination calendars, feed formulation, mastitis prevention |
| **Post-Harvest** | Storage, grading, transport, value-addition |
| **Government Programs** | Subsidy schemes, Kisan Card, crop insurance, microfinance |

### Retrieval Method

The RAG engine uses **keyword-based semantic matching** against the knowledge base entries, then injects matched passages as context into the LLM prompt:

```
User Query → Keyword Extraction → Knowledge Base Search → Top-K Matches → LLM Context Injection → Response
```

When no LLM providers are available, the RAG engine returns its raw matched entries as a structured advisory response.

---

## 4. Mandi Price Dataset

**Source:** `src/lib/marketPrices.ts`

Daily commodity prices from major Pakistani agricultural markets (mandis).

### Commodities Tracked

| Commodity | Unit | Markets |
|-----------|------|---------|
| Wheat (گندم) | per 40kg | Lahore, Multan, Faisalabad, Karachi, Peshawar |
| Rice Basmati (باسمتی چاول) | per 40kg | Gujranwala, Sheikhupura |
| Cotton (کپاس) | per 40kg | Multan, Bahawalpur, D.G. Khan |
| Sugarcane (گنا) | per 40kg | Faisalabad, Sargodha, Jacobabad |
| Tomato (ٹماٹر) | per kg | Lahore, Karachi, Peshawar |
| Potato (آلو) | per kg | Lahore, Okara, Sahiwal |
| Maize (مکئی) | per 40kg | Faisalabad, Sahiwal |
| Milk (دودھ) | per litre | Provincial average |
| Eggs (انڈے) | per dozen | Provincial average |

### Price Record Schema

```typescript
{
  commodity: string;
  commodityUrdu: string;
  price: number;          // PKR
  unit: string;           // "per 40kg", "per kg", "per litre", "per dozen"
  market: string;
  trend: "up" | "down" | "stable";
  change: number;         // percentage change
}
```

---

## 5. Weather & Disease Risk Data

**Source:** `src/lib/weather.ts`

Weather-based crop disease outbreak risk scoring engine.

### Risk Scoring Algorithm

The disease risk score (0–100%) is computed from:

| Factor | Weight | Threshold |
|--------|--------|-----------|
| Humidity | 35% | > 75% → high risk |
| Temperature | 25% | 20–30°C → optimal for fungal growth |
| Rainfall | 20% | > 5mm forecast → elevated risk |
| Weather Condition | 20% | Overcast/fog → reduced evaporation |

### Risk Levels

| Score | Level | Advisory |
|-------|-------|----------|
| 0–30% | Low | Standard monitoring |
| 31–60% | Moderate | Increase field scouting frequency |
| 61–80% | High | Apply preventive fungicide spray |
| 81–100% | Critical | Immediate action required, alert extension services |

### Supported Locations

All major cities across Pakistan's provinces:
- **Punjab**: Lahore, Multan, Faisalabad, Rawalpindi, Bahawalpur, Sargodha, Gujranwala, Sahiwal, Okara, D.G. Khan
- **Sindh**: Karachi, Hyderabad, Sukkur, Larkana, Nawabshah, Mirpur Khas, Jacobabad, Thatta
- **KPK**: Peshawar, Abbottabad, Mardan, Swat, Bannu, D.I. Khan
- **Balochistan**: Quetta, Turbat, Gwadar, Khuzdar, Sibi, Zhob
- **Gilgit-Baltistan**: Gilgit, Skardu
- **AJK**: Muzaffarabad, Mirpur

---

## 6. Government Schemes Directory

**Source:** `src/lib/schemes.ts`

Bilingual directory of federal and provincial agricultural support programs.

### Schemes Catalog

| Scheme | Category | Province | Benefit |
|--------|----------|----------|---------|
| PM Kisan Card | Financial Aid | Federal | Direct cash transfer per acre |
| Crop Insurance (فصل بیمہ) | Insurance | Punjab, Sindh | Weather & pest damage coverage |
| Wheat Support Price | Price Support | Federal | Guaranteed minimum purchase price |
| Citrus Rehabilitation | Horticulture | Punjab (Sargodha) | Sapling subsidy + training |
| Solar Tube-Well | Irrigation | Punjab, Balochistan | 50-60% cost subsidy on solar pumps |
| Livestock Card | Livestock | Punjab | Free vaccination + feed subsidy |
| Youth Livestock Program | Livestock | Federal | Interest-free loans for dairy farms |
| Seed & Fertilizer Subsidy | Inputs | All provinces | 25-50% discount on certified seed/DAP |

---

## 7. Pakistan Locations Database

**Source:** `src/lib/pakistanLocations.ts`

Structured geographic database of Pakistani provinces and their major agricultural cities.

```typescript
{
  province: string;        // "Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK"
  provinceUrdu: string;    // Urdu name
  cities: string[];        // Major cities in the province
}
```

Used by the Weather module, Schemes filter, and Community Reports to provide location-aware data.

---

## 8. Crop Calendar Data

**Source:** `src/lib/cropCalendar.ts`

Seasonal calendar for major Pakistani crops covering the full agricultural cycle.

### Calendar Phases

| Phase | Description |
|-------|-------------|
| **Sowing** | Optimal sowing window by province |
| **Irrigation** | Critical watering periods |
| **Fertilizer** | NPK application schedule (basal + top dress) |
| **Pest Watch** | Peak pest/disease vulnerability windows |
| **Harvest** | Expected harvest period |

### Crops Covered

Wheat (Rabi), Rice (Kharif), Cotton (Kharif), Sugarcane (annual), Maize (dual season), Potato (triple season in Punjab).

---

## 9. Tele-Vet Expert Profiles

**Source:** `src/lib/televet.ts`

Expert directory for tele-consultation services.

### Expert Profile Schema

```typescript
{
  id: string;
  name: string;
  type: "veterinarian" | "crop_advisor";
  title: string;
  titleUrdu: string;
  specialties: string[];
  languages: string[];
  experienceYears: number;
  rating: number;           // 0-5
  consultations: number;    // total completed
  feePkr: number;           // consultation fee (0 = free)
  availableSlots: string[]; // today's available time slots
  image: string;            // profile photo URL
}
```

### Sample Experts

| Name | Specialty | Fee | Rating |
|------|-----------|-----|--------|
| Dr. Ahmad Raza | Large Animal Vet | Free | 4.7 |
| Dr. Fatima Noor | Poultry & Layer Specialist | Rs. 350 | 4.8 |

---

## 10. Community Pest Reports

**Source:** `src/lib/communityReports.ts`

Farmer-reported hyperlocal pest and disease outbreak data.

### Report Schema

```typescript
{
  id: string;
  crop: string;
  pest: string;
  pestUrdu: string;
  severity: "low" | "moderate" | "high" | "critical";
  province: string;
  district: string;
  reportedBy: string;
  date: string;             // ISO date
  advisory: string;
  advisoryUrdu: string;
}
```

---

## 11. Class Names (ML Model)

**Source:** `Startup/fasaldoc-project/fasaldoc/backend/class_names.json`, `backend/src/remedyKeys.js`

The TensorFlow/Keras baseline model classifies images into disease categories. The `remedyKeys.js` module maps model output labels to the remedy database keys.

### Model Classes (Startup Reference)

The FastAPI reference backend uses a MobileNetV3 model trained on crop disease images. Class names map to disease keys used for remedy lookup:

```json
[
  "Tomato___Late_Blight",
  "Tomato___Early_Blight",
  "Potato___Late_Blight",
  "Wheat___Brown_Rust",
  "Rice___Blast",
  ...
]
```

---

## 12. Supabase Schema

**Source:** `supabase/schema.sql`

### Tables

| Table | Rows | Purpose |
|-------|------|---------|
| `profiles` | 1 per user | User farm profile (name, location, farming type, language) |
| `diagnoses` | N per user | Diagnosis history (image, disease, confidence, remedy) |
| `chat_sessions` | N per user | AI chat conversation threads |
| `chat_messages` | N per session | Individual chat messages (user/assistant) |
| `recovery_cases` | N per user | Post-diagnosis recovery tracking |

All tables enforce **Row-Level Security (RLS)** with `auth.uid() = user_id` isolation.

---

## Data Sources & References

| Source | Type | Usage |
|--------|------|-------|
| Pakistan Agricultural Research Council (PARC) | Crop pathology reference | Disease identification |
| Punjab Agriculture Department | Mandi prices, schemes | Market data, subsidy info |
| OpenWeatherMap API | Real-time weather | Weather widget (with fallback) |
| FAO IPM Guidelines | Pest management | RAG knowledge base |
| NARC Crop Calendar | Seasonal data | Crop calendar module |
| Pakistan Bureau of Statistics | Market locations | Location database |

---

*Last updated: September 2026*
