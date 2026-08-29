/**
 * FasalDoc RAG (Retrieval-Augmented Generation) & Knowledge Engine
 * Plain JavaScript ESM for Node.js backend.
 * 
 * Provides fast, offline-capable, highly accurate knowledge retrieval for Pakistani
 * agricultural (crop & livestock) questions. Covers crops (wheat, rice, cotton, tomato, 
 * potato, sugarcane, maize, citrus, chili, etc.), livestock (cattle, buffalo, goat, sheep, poultry), 
 * soil/fertilizers, wet/flooded field recovery, pest control, and disease treatment.
 */

export const KNOWLEDGE_BASE = [
  {
    id: "wheat_wet_flooded",
    category: "crop",
    topics: ["wheat", "wet crop", "waterlogging", "rain", "flood", "yellowing"],
    keywords: ["wheat", "wet", "water", "flood", "rain", "yellow", "soil", "drainage", "گندم", "پانی", "بارش", "پیلا"],
    titleEn: "Wheat Crop Waterlogging & Wet Field Recovery",
    titleUr: "گندم کی فصل میں پانی کا کھڑا ہونا اور پیلا پن",
    summaryEn: "Standing water or heavy rain causes oxygen depletion at wheat roots, leading to root rot and yellowing (nitrogen deficiency). Immediate drainage and foliar nutrition are essential.",
    summaryUr: "کھیت میں اضافی پانی یا شدید بارش سے گندم کی جڑوں کو آکسیجن نہیں ملتی جس سے جڑیں گلنے لگتی ہیں اور پتے پیلے پڑ جاتے ہیں۔ فوری پانی کی نکاسی اور فولیر اسپرے ضروری ہے۔",
    organicEn: "1. Drain excess water immediately from the field using drainage channels.\n2. Spray 2% Fermented Whey/Buttermilk mixed with wood ash extract after field dries slightly to stimulate root activity.\n3. Apply well-rotted farmyard manure or vermicompost once field permits walking.",
    organicUrdu: "1. کھیت سے اضافی پانی کا فوری نالیاں بنا کر اخراج کریں۔\n2. زمین خشک ہونے پر کھٹی لسی (2٪ محلول) کا اسپرے جڑوں کی طاقت کے لیے کریں۔\n3. گوبر کی پرانی کھاد کا استعمال کریں۔",
    chemicalEn: "1. Top-dress Urea (15-20 kg/acre) mixed with Zinc Sulphate 33% (3 kg/acre) as soon as field dries to restore green color.\n2. Apply foliar spray of NPK (19:19:19) @ 500g/acre in 100L water if roots cannot absorb soil fertilizers.\n3. Spray Propiconazole 25% EC (200ml/acre) to prevent fungal leaf rust encouraged by wet humidity.",
    chemicalUrdu: "1. وتر آنے پر یوریا (15-20 کلوگرام فی ایکڑ) اور زنک سلفیٹ (3 کلوگرام) ملا کر چھٹا دیں۔\n2. NPK 19:19:19 (500 گرام فی ایکڑ) کا پتوں پر اسپرے کریں تاکہ فوراً غذائیت ملے۔\n3. نمی کی وجہ سے کنگی کے خوف سے پروپیکونازول (Tilt) کا اسپرے کریں۔",
    dosageEn: "Foliar NPK: 500g in 100L water per acre. Tilt 250 EC: 200ml in 100L water per acre.",
    dosageUrdu: "این پی کے اسپرے: 500 گرام فی 100 لیٹر پانی۔ ٹلٹ 250 ای سی: 200 ملی لیٹر فی ایکڑ۔",
    preventionEn: "Ensure laser land leveling prior to sowing. Build raised beds (bed planting) for wheat in flood-prone zones.",
    preventionUrdu: "کاشت سے قبل لیزر لیولنگ لازمی کریں۔ نچلے اور پانی جمع ہونے والے علاقوں میں بیڈ پلانٹنگ اپنائیں۔",
    localProducts: ["Tilt 250 EC (Syngenta)", "Zincol (FMC)", "SoluPotasse (TES)", "Engro Urea"]
  },
  {
    id: "wheat_rust",
    category: "crop",
    topics: ["wheat", "rust", "fungus", "yellow leaf", "brown spot"],
    keywords: ["wheat", "rust", "brown", "yellow", "pustule", "fungus", "tilt", "گندم", "کنگی", "رسٹ", "پیلا"],
    titleEn: "Wheat Leaf & Stripe Rust (کنگی)",
    titleUr: "گندم کی بھوری اور پیلی کنگی",
    summaryEn: "Fungal disease causing orange-brown or yellow powdery streaks on leaves. Causes grain shriveling and up to 50% yield loss if untreated.",
    summaryUr: "پتوں پر نارنجی یا زرد پاؤڈر نما دھبے بن جاتے ہیں۔ بروقت علاج نہ کرنے سے دانہ چھوٹا رہ جاتا ہے اور پیداوار شدید متاثر ہوتی ہے۔",
    organicEn: "Spray sour buttermilk solution (5L buttermilk in 100L water). Sow rust-resistant certified seed varieties early (Nov 1-20).",
    organicUrdu: "کھٹی لسی کا اسپرے کریں۔ نومبر کی شروعات میں منظور شدہ اقسام کی وقت پر کاشت کریں۔",
    chemicalEn: "Spray Propiconazole 25% EC or Tebuconazole + Trifloxystrobin immediately upon first sight of yellow/brown dust on leaves.",
    chemicalUrdu: "علامات ظاہر ہوتے ہی پروپیکونازول (Tilt 250 EC) یا ٹیبوکونازول (Nativo) کا اسپرے کریں۔",
    dosageEn: "Tilt 250 EC: 200ml per acre in 100-120L water. Nativo 75 WG: 65g per acre.",
    dosageUrdu: "ٹلٹ: 200 ملی لیٹر فی 100 لیٹر پانی فی ایکڑ۔ نیٹیوو: 65 گرام فی ایکڑ۔",
    preventionEn: "Use resistant certified varieties like Akbar-19, Dilkash-20, Subhani-21, Ghazi-19.",
    preventionUrdu: "اکبر 19، دلکش 20، سبحانی 21 جیسی قوت مدافعت والی اقسام کاشت کریں۔",
    localProducts: ["Tilt 250 EC (Syngenta)", "Nativo 75 WG (Bayer)", "Folicur (Bayer)", "Topas (Syngenta)"]
  },
  {
    id: "rice_blast",
    category: "crop",
    topics: ["rice", "paddy", "blast", "neck rot", "leaf spot"],
    keywords: ["rice", "paddy", "blast", "neck", "spot", "tricyclazole", "چاول", "دھان", "بلاسٹ", "گردن توڑ"],
    titleEn: "Rice Blast & Neck Rot (دھان کا بلاسٹ)",
    titleUr: "دھان کا بلاسٹ اور گردن توڑ بیماری",
    summaryEn: "Eye-shaped lesions on leaves and neck breakage below the panicle leading to empty white heads (blanking).",
    summaryUr: "پتوں پر آنکھ نما دھبے اور سٹے کی بنیاد (گردن) کا کالا ہو کر ٹوٹ جانا، جس سے دانہ نہیں بنتا۔",
    organicEn: "Apply silica-rich rice husk ash to soil. Avoid continuous stagnant cold water in fields.",
    organicUrdu: "زمین میں چاول کی راکھ ڈالیں۔ کھڑے پانی کی جگہ تازہ پانی تبدیل کریں۔",
    chemicalEn: "Spray Tricyclazole 75% WP or Isoprothiolane 40% EC or Azoxystrobin + Difenoconazole at booting & heading stage.",
    chemicalUrdu: "ٹرائی سائیکلازول (Beam 75 WP) یا آئسوپروتھائیولین کا گوبھ اور نثار کی حالت میں اسپرے کریں۔",
    dosageEn: "Beam 75 WP: 120g/acre. Amistar Top: 200ml/acre in 100L water.",
    dosageUrdu: "بیم 75 ڈبلیو پی: 120 گرام فی ایکڑ۔ ایمسٹار ٹاپ: 200 ملی لیٹر فی ایکڑ۔",
    preventionEn: "Do not overuse nitrogen (Urea). Split nitrogen application into 3 equal doses.",
    preventionUrdu: "یوریا کی زیادتی سے پرہیز کریں۔ نائٹروجن 3 اقساط میں دیں۔",
    localProducts: ["Beam 75 WP (Corteva)", "Amistar Top (Syngenta)", "Fuji-One (Nihon Nohyaku)", "Trooper (Dow)"]
  },
  {
    id: "cotton_whitefly_blight",
    category: "crop",
    topics: ["cotton", "whitefly", "bacterial blight", "black arm", "clcuv"],
    keywords: ["cotton", "whitefly", "leaf curl", "blight", "boll", "کپاس", "سفید مکھی", "مروڑ", "کالی شاخ"],
    titleEn: "Cotton Whitefly, CLCuV & Bacterial Blight Management",
    titleUr: "کپاس کی سفید مکھی، پتے مروڑ اور کالی شاخ کا علاج",
    summaryEn: "Whitefly transmits Cotton Leaf Curl Virus (CLCuV) and sooty mold. Bacterial blight causes angular leaf spots and black arm branch rot.",
    summaryUr: "سفید مکھی وائرس پھیلاتی ہے جس سے پتے اوپر مڑ جاتے ہیں۔ بیکٹیریل بلائیٹ سے شاخیں کالی ہو کر ٹوٹتی ہیں۔",
    organicEn: "Spray Neem seed oil 5ml/L + Soap solution (2g/L) for whitefly control. Remove virus infected plants early.",
    organicUrdu: "نیم کا تیل (5 ملی لیٹر) صابن کے پانی کے ساتھ ملا کر اسپرے کریں۔ متاثرہ بوٹے نکال دیں۔",
    chemicalEn: "For Whitefly: Pyriproxyfen 10% EC or Diafenthiuron 50% WP. For Bacterial Blight: Copper Oxychloride + Streptomycin.",
    chemicalUrdu: "سفید مکھی کیلئے پائری پروکسی فن یا ڈایا فینتھیوران۔ کالی شاخ کیلئے کاپر آکسی کلورائیڈ + ایگری مائیسن۔",
    dosageEn: "Pyriproxyfen: 400ml/acre. Copper Oxychloride: 500g + Streptomycin 50g in 100L water/acre.",
    dosageUrdu: "پائری پروکسی فن: 400 ملی لیٹر۔ کاپر آکسی کلورائیڈ: 500 گرام + ایگری مائیسن 50 گرام فی ایکڑ۔",
    preventionEn: "Use acid-delinted seeds. Rotate crops with non-hosts like maize or sorghum.",
    preventionUrdu: "تیزاب سے دھویا ہوا بیج استعمال کریں۔ فصلی ہیر پھیر اپنائیں۔",
    localProducts: ["Polo 500 SC (Syngenta)", "Pyriproxyfen (FMC)", "Cuprofix (UPL)", "Agrimycin"]
  },
  {
    id: "tomato_blight",
    category: "crop",
    topics: ["tomato", "early blight", "late blight", "fruit rot"],
    keywords: ["tomato", "blight", "leaf spot", "fruit rot", "fungus", "ٹماٹر", "جھلساؤ", "داغ", "سڑن"],
    titleEn: "Tomato Early & Late Blight Treatment",
    titleUr: "ٹماٹر کا اگیتا اور پچھیتا جھلساؤ",
    summaryEn: "Early blight causes dark concentric ring spots on lower leaves. Late blight causes rapid blackening of canopy and leathery fruit rot.",
    summaryUr: "پتوں پر سیاہ دائرے دار دھبے اور ٹماٹروں کا کالا ہو کر سڑ جانا۔ نمی والے موسم میں تیزی سے پھیلتا ہے۔",
    organicEn: "Prune affected lower leaves. Spray Neem oil (5ml/L) or Copper hydroxide solution in early morning.",
    organicUrdu: "نچلے متاثرہ پتے کاٹ دیں۔ نیم کے تیل کا یا کاپر ہائیڈرو آکسائیڈ کا اسپرے کریں۔",
    chemicalEn: "Spray Chlorothalonil or Mancozeb as preventive. Use Ridomil Gold (Metalaxyl + Mancozeb) or Difenoconazole for active blight.",
    chemicalUrdu: "حفاظتی طور پر مینکوزیب کا اسپرے کریں۔ شدید حملے پر ریڈومل گولڈ یا اسکور کا اسپرے کریں۔",
    dosageEn: "Ridomil Gold: 250g per 100L water per acre. Score 250 EC: 100ml per acre.",
    dosageUrdu: "ریڈومل گولڈ: 250 گرام فی 100 لیٹر پانی فی ایکڑ۔ اسکور: 100 ملی لیٹر فی ایکڑ۔",
    preventionEn: "Avoid overhead watering. Maintain proper spacing (60cm) for airflow. Stake plants to elevate fruit.",
    preventionUrdu: "پودوں پر اوپر سے پانی نہ ڈالیں۔ پودوں کو لکڑیوں سے باندھ کر اونچا رکھیں۔",
    localProducts: ["Ridomil Gold (Syngenta)", "Score 250 EC (Syngenta)", "Antracol (Bayer)", "Acrobat MZ (BASF)"]
  },
  {
    id: "potato_late_blight",
    category: "crop",
    topics: ["potato", "late blight", "tuber rot", "black stem"],
    keywords: ["potato", "blight", "tuber", "stem", "rot", "آلو", "جھلساؤ", "سڑن"],
    titleEn: "Potato Late Blight & Tuber Management",
    titleUr: "آلو کا پچھیتا جھلساؤ اور تنے کا سڑنا",
    summaryEn: "Devastating water mold causing water-soaked leaf spots with white mildew underneath and brown tuber rot in wet cloudy weather.",
    summaryUr: "سرد اور مرطوب موسم میں پتوں پر پانی والے دھبے اور سفید فنگس، اور آلو کا اندر سے گل جانا۔",
    organicEn: "Earth up potato ridges to cover tubers deep (15cm). Spray baking soda (5g/L) with soap solution.",
    organicUrdu: "آلو کی مٹی اونچی چڑھائیں۔ بیکنگ سوڈا کے پانی کا چھڑکاؤ کریں۔",
    chemicalEn: "Spray Cymoxanil + Mancozeb (Curzate M) or Dimethomorph + Mancozeb (Acrobat MZ) at first sign of weather moisture.",
    chemicalUrdu: "کرزیٹ ایم (Curzate M) یا ایکرو بیٹ (Acrobat MZ) کا فوری اسپرے کریں۔",
    dosageEn: "Curzate M8: 250g in 100L water per acre every 7 days.",
    dosageUrdu: "کرزیٹ ایم 8: 250 گرام فی 100 لیٹر پانی فی ایکڑ۔",
    preventionEn: "Use certified disease-free seed tubers. Avoid excessive nitrogen fertilizer.",
    preventionUrdu: "تصدیق شدہ بیج استعمال کریں اور زیادہ نائٹروجن سے بچیں۔",
    localProducts: ["Curzate M8 (Corteva)", "Acrobat MZ (BASF)", "Melody Duo (Bayer)", "Revus (Syngenta)"]
  },
  {
    id: "maize_fall_armyworm",
    category: "crop",
    topics: ["maize", "corn", "fall armyworm", "borer", "whorl"],
    keywords: ["maize", "corn", "armyworm", "borer", "leaf hole", "مکئی", "فال آرمی ورم", "سنڈی", "سوراخ"],
    titleEn: "Maize Fall Armyworm & Stem Borer Control",
    titleUr: "مکئی کا فال آرمی ورم اور تنے کی سنڈی",
    summaryEn: "Chewed whorl leaves with shot-holes and sawdust-like frass inside the central growing point of maize plants.",
    summaryUr: "مکئی کے پودے کے چوڑے پتوں اور گوپ میں سوراخ اور لکڑی کی برادے نما فضلے والی سنڈی۔",
    organicEn: "Apply dry fine sand or wood ash mixed with neem dust into the central whorl of young maize plants.",
    organicUrdu: "مکئی کی گوپ میں خشک ریت یا راکھ اور نیم کی خلی کا پاؤڈر ڈالیں۔",
    chemicalEn: "Apply Emamectin Benzoate 1.9% EC or Chlorantraniliprole 20% SC or Spinetoram into the whorls.",
    chemicalUrdu: "مکئی کی گوپ میں ایمامیکٹن بینزویٹ یا کوراجن (Chlorantraniliprole) کا اسپرے کریں۔",
    dosageEn: "Emamectin Benzoate: 200ml/acre directed straight into plant whorls.",
    dosageUrdu: "ایمامیکٹن: 200 ملی لیٹر فی ایکڑ براہ راست گوپ کے اندر۔",
    preventionEn: "Early planting in spring. Intercrop with cowpea or beans.",
    preventionUrdu: "وقت پر کاشت اور بین المذاہب کاشتکاری اپنائیں۔",
    localProducts: ["Coragen (FMC)", "Match 50 EC (Syngenta)", "Proclaim (Syngenta)", "Radiant (Corteva)"]
  },
  {
    id: "fertilizer_guide",
    category: "general_agri",
    topics: ["fertilizer", "dap", "urea", "npk", "dosage", "acre"],
    keywords: ["fertilizer", "dap", "urea", "npk", "potash", "zinc", "dosage", "کھاد", "یوریا", "ڈی اے پی", "خوراک"],
    titleEn: "Fertilizer Schedule & Dosage Guide for Crops (Punjab/Sindh)",
    titleUr: "مختلف فصلوں کے لیے کھاد کا شیڈول اور مقدار",
    summaryEn: "Balanced NPK and micro-nutrient application per acre for optimal crop yields.",
    summaryUr: "بہترین پیداوار کے لیے فی ایکڑ یوریا، ڈی اے پی، پوٹاش اور زنک کی متوازن مقدار۔",
    organicEn: "Combine 2-3 tons of composted farmyard manure per acre during soil preparation with bio-fertilizers (Azotobacter/PSB).",
    organicUrdu: "زمین کی تیاری میں 2 تا 3 ٹالی گوبر کی دیسی کھاد ڈالیں۔",
    chemicalEn: "🌾 Wheat: 1 bag DAP + 1 bag Urea at sowing; 1 bag Urea at 1st irrigation (20-25 days); 0.5 bag Urea at 2nd irrigation.\n🍚 Rice: 1 bag DAP + 0.5 bag SOP at land prep; 1.5 bags Urea split in 3 doses.\n🌱 Cotton: 1.5 bags DAP + 2.5 bags Urea split across blooming/boll stages.\n🌽 Maize: 2 bags DAP + 3 bags Urea split into 4 doses.",
    chemicalUrdu: "🌾 گندم: بوائی کے وقت 1 بوری DAP + 1 بوری یوریا؛ پہلے پانی پر 1 بوری یوریا؛ دوسرے پانی پر آدھی بوری یوریا۔\n🍚 دھان: تیاری پر 1 بوری DAP؛ 1.5 بوری یوریا 3 اقساط میں۔\n🌱 کپاس: 1.5 بوری DAP + 2.5 بوری یوریا پھول اور گوڈی پر۔\n🌽 مکئی: 2 بوری DAP + 3 بوری یوریا 4 اقساط میں۔",
    dosageEn: "Standard bag size: 50kg. Zinc Sulphate 33%: 3-6 kg/acre with 1st irrigation.",
    dosageUrdu: "زنک سلفیٹ (33٪): 3 تا 6 کلوگرام فی ایکڑ پہلے پانی پر۔",
    preventionEn: "Conduct soil fertility test every 2 years. Do not broadcast Urea on dry soil surface under high sunlight.",
    preventionUrdu: "ہر 2 سال بعد مٹی کا تجربہ کروائیں۔ یوریا کھلی تیز دھوپ میں سوکھی زمین پر نہ چھٹائیں۔",
    localProducts: ["Engro DAP", "Sona Urea (FFC)", "FMC Zinc", "SOP Potash"]
  },
  {
    id: "livestock_fmd",
    category: "livestock",
    topics: ["cow", "buffalo", "fmd", "foot and mouth", "blister", "fever", "mouth"],
    keywords: ["cow", "buffalo", "fmd", "foot", "mouth", "saliva", "blister", "fever", "گائے", "بھینس", "منہ کھر", "بخار", "رال"],
    titleEn: "Foot & Mouth Disease (FMD / منہ کھر) in Cattle & Buffalo",
    titleUr: "گائے اور بھینسوں میں منہ کھر (FMD) کی بیماری",
    summaryEn: "Highly contagious viral infection causing high fever (104-106°F), excessive ropy saliva, lip smacking, and painful blisters inside mouth and between hooves.",
    summaryUr: "تیز بخار، منہ سے مسلسل رال ٹپکنا، منہ اور کھروں میں دردناک چھالے جس سے جانور لنگڑا کر چلتا ہے اور دودھ خشک ہو جاتا ہے۔",
    organicEn: "1. Wash mouth 3 times daily with 1% Potassium Permanganate (Lal Dawai / لال دوائی) or 2% Baking Soda water.\n2. Apply Neem oil mixed with turmeric paste on foot lesions.\n3. Feed soft warm porridge (dalia) with ghee or honey.",
    organicUrdu: "1. لال دوائی (پوٹاشیم پرمینگنیٹ) کے پانی سے منہ دن میں 3 بار دھوئیں۔\n2. کھروں کے زخموں پر نیم کا تیل اور ہلدی ملائیں۔\n3. نرم دلیہ اور گھی کھلائیں۔",
    chemicalEn: "No direct antiviral. Provide symptomatic relief: Oxytetracycline LA or Ceftiofur injection to prevent secondary bacterial infection + Flunixin Meglumine or Ketoprofen for fever and pain.",
    chemicalUrdu: "ثانوی انفیکشن سے بچاؤ کیلئے آکسی ٹیٹراسائیکلین ٹیکہ اور بخار/درد کیلئے فلو نکسن کا ٹیکہ ویٹرنری ڈاکٹر سے لگوائیں۔",
    dosageEn: "Oxytetracycline LA: 1ml per 10kg bodyweight (IM). Flunixin: 2ml per 45kg bodyweight.",
    dosageUrdu: "ادویات کی مقدار جانور کے وزن کے مطابق ویٹرنری ڈاکٹر کی ہدایت پر دیں۔",
    preventionEn: "Vaccinate bi-annually (Spring and Autumn) with FMD vaccine. Isolate sick animals immediately.",
    preventionUrdu: "سال میں دو بار (بہار اور خزاں) منہ کھر کی ویکسین لازمی لگوائیں۔",
    localProducts: ["Alamycin LA (Norbrook)", "Finadyne (MSD)", "Lal Dawai (KMnO4)", "AIT FMD Vaccine"]
  },
  {
    id: "livestock_mastitis",
    category: "livestock",
    topics: ["cow", "buffalo", "mastitis", "udder", "milk clots", "swelling"],
    keywords: ["cow", "buffalo", "mastitis", "udder", "milk", "clot", "swelling", "گائے", "بھینس", "سڑو", "ساڑو", "لیوا", "دودھ"],
    titleEn: "Bovine Mastitis (سڑو / ساڑو) Udder Infection",
    titleUr: "دودھیل جانوروں میں سڑو (ساڑو) کا مرض",
    summaryEn: "Bacterial infection of udder causing swelling, hardness, heat, pain, and abnormal milk (clots, flakes, pus, blood).",
    summaryUr: "حیوانے (لیوے) کی سوزش، سوجن اور دودھ میں پھٹکیاں، خون یا پیپ کا آنا۔ جانور چوائی کے وقت لات مارتا ہے۔",
    organicEn: "1. Completely strip affected quarter every 2 hours.\n2. Apply cold water compresses initially, followed by warm Epsom salt water compresses.\n3. Apply aloe vera gel with turmeric on udder skin.",
    organicUrdu: "1. متاثرہ تھن سے ہر 2 گھنٹے بعد دودھ اچھی طرح نچوڑیں۔\n2. ٹھنڈے پانی کی پٹیاں اور بعد میں گرم نمک والے پانی سے ٹکور کریں۔\n3. ایلوویرا اور ہلدی کا لیپ کریں۔",
    chemicalEn: "Infuse Intramammary antibiotic tube (Mastijet Forte or Synulox LC) into affected quarter after milking + Inject Meloxicam (NSAID) for pain/swelling.",
    chemicalUrdu: "تھن کو خالی کر کے ماسٹائی جیٹ فورٹ (Mastijet) ٹیوب تھن کے اندر چڑھائیں اور درد کا ٹیکہ دیں۔",
    dosageEn: "Intramammary tube: 1 tube per quarter daily for 3 days after complete milking.",
    dosageUrdu: "ماسٹائی جیٹ ٹیوب: 1 ٹیوب روزانہ 3 دن تک۔",
    preventionEn: "Dip teats in 0.5% iodine solution post-milking. Keep barn floor dry and clean.",
    preventionUrdu: "چوائی کے فوراً بعد تھنوں کو آیوڈین محلول میں ڈبوئیں۔ باڑے کا فرش خشک رکھیں۔",
    localProducts: ["Mastijet Forte (Intervet)", "Synulox LC (Zoetis)", "Melonex (Intas)", "Iodine Teat Dip"]
  },
  {
    id: "livestock_fever_bloat",
    category: "livestock",
    topics: ["cow", "buffalo", "goat", "fever", "bloat", "digestion", "diarrhea"],
    keywords: ["fever", "bloat", "gas", "cow", "buffalo", "goat", "diarrhea", "bukhar", "افارہ", "بخار", "پیٹ", "دست", "بکری"],
    titleEn: "Livestock Fever, Bloat (افارہ) & Digestive Care",
    titleUr: "جانوروں کا بخار، افارہ (گیس) اور پیٹ کی بیماریاں",
    summaryEn: "High fever, swollen left flank (bloat due to gas buildup), off-feed, or watery diarrhea.",
    summaryUr: "جانور کا بخار سے نڈھال ہونا، پیٹ کے بائیں طرف کا پھولنا (افارہ) یا دست لگنا۔",
    organicEn: "For Bloat: Administer 200ml Mustard oil + 20g Asafoetida (ہینگ) + 50g Black salt in lukewarm water. Drench slowly.\nFor Fever: Wash animal head with cool water and give willow bark / ginger tea.",
    organicUrdu: "افارہ کیلئے: 200 ملی لیٹر سرسوں کا تیل + 20 گرام ہینگ + 50 گرام کالا نمک نیم گرم پانی میں ملا کر پلائیں۔\nبخار کیلئے: جانور کے سر پر ٹھنڈا پانی ڈالیں۔",
    chemicalEn: "For Bloat: Administer Tympol or Bloatosil liquid via oral drench. For Fever: Inject Paracetamol / Ketoprofen / Meloxicam.",
    chemicalUrdu: "افارہ کیلئے: ٹمپول (Tympol) یا بلواٹو سل پلائیں۔ بخار کیلئے پیراسیٹامول یا کیٹوپروفن کا ٹیکہ دیکھیں۔",
    dosageEn: "Tympol: 100ml for large cattle in 500ml water. Ketoprofen: 3ml per 100kg IM.",
    dosageUrdu: "ٹمپول: 100 ملی لیٹر بڑوں کیلئے 500 ملی لیٹر پانی میں۔",
    preventionEn: "Avoid sudden feeding of wet young berseem or rotten fodder. Provide clean drinking water.",
    preventionUrdu: "گیلا یا فنگس زدہ چارہ مت کھلائیں۔ تازہ صاف پانی ہر وقت میسر رکھیں۔",
    localProducts: ["Tympol (ICI)", "Bloatosil (Sami)", "Ketovet (Star)", "Avil Vet"]
  },
  {
    id: "greetings_general",
    category: "general",
    topics: ["hello", "hi", "help", "who", "assalam", "salaam", "fasaldoc"],
    keywords: ["hello", "hi", "help", "who", "assalam", "salaam", "fasaldoc", "سلام", "السلام", "ہیلو", "مدد"],
    titleEn: "FasalDoc Agricultural AI Companion",
    titleUr: "FasalDoc AI زرعی و مویشی معاون",
    summaryEn: "FasalDoc is your AI-powered crop and livestock health assistant designed specifically for Pakistani farmers.",
    summaryUr: "FasalDoc کسان بھائیوں کے لیے فصلوں اور مویشیوں کا AI علاج اور رہنمائی فراہم کرتا ہے۔",
    organicEn: "Ask any question about crop diseases, pest control, livestock symptoms, fertilizer doses, or snap a photo in the Scan tab for visual diagnosis.",
    organicUrdu: "کسی بھی فصل، بیماری، کیڑوں، مویشیوں کے مرض یا کھادوں کی مقدار کے بارے میں سوال پوچھیں یا **Scan** بٹن سے تصویر لیں!",
    chemicalEn: "Provides exact local Pakistani chemical brands (Syngenta, Bayer, FMC, Engro, ICI) and exact dosage per acre.",
    chemicalUrdu: "پاکستانی مارکیٹ کی اصلی کیمیائی ادویات اور فی ایکڑ مقدار بتاتا ہے۔",
    dosageEn: "Always follow recommended application rates per acre / kanal.",
    dosageUrdu: "ایکڑ اور کنال کے حساب سے درست خوراک استعمال کریں۔",
    preventionEn: "Regular crop scouting and early vaccination for livestock.",
    preventionUrdu: "فصل کا روزانہ معائنہ اور مویشیوں کو وقت پر ویکسین لگوائیں۔",
    localProducts: ["FasalDoc Scan", "FasalDoc RAG Engine", "Local Agri Stores"]
  }
];

export function searchKnowledgeBase(query) {
  const q = (query || "").toLowerCase();
  const tokens = q.split(/[\s,.;:!?()"\-]+/).filter((t) => t.length > 1);

  const scored = KNOWLEDGE_BASE.map((item) => {
    let score = 0;
    for (const token of tokens) {
      if (item.keywords.some((kw) => kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase()))) {
        score += 4;
      }
      if (item.topics.some((tp) => tp.toLowerCase().includes(token))) {
        score += 5;
      }
      if (item.titleEn.toLowerCase().includes(token) || item.titleUr.includes(token)) {
        score += 6;
      }
      if (item.summaryEn.toLowerCase().includes(token) || item.summaryUr.includes(token)) {
        score += 3;
      }
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matches = scored.filter((s) => s.score > 0).map((s) => s.item);
  return matches.length > 0 ? matches : [KNOWLEDGE_BASE.find((k) => k.id === "greetings_general") || KNOWLEDGE_BASE[0]];
}

export function generateRAGAnswer(query, lang = "en") {
  const matches = searchKnowledgeBase(query);
  const primary = matches[0];
  const isUr = lang === "ur" || /[\u0600-\u06FF]/.test(query || "");

  // Greetings check
  const qLower = (query || "").toLowerCase();
  if (qLower.includes("hi") || qLower.includes("hello") || qLower.includes("assalam") || qLower.includes("سلام") || qLower.includes("ہیلو") || qLower.includes("who are you")) {
    return isUr
      ? `🤝 **وعلیکم السلام! میں FasalDoc AI زرعی و مویشی معاون ہوں** 🌾\n\n` +
        `میں آپ کی درج ذیل تمام مسائل میں مدد کر سکتا ہوں:\n\n` +
        `🌾 **فصلیں:** گندم، دھان، کپاس، ٹماٹر، آلو، مکئی کی بیماریاں اور علاج\n` +
        `🐄 **مویشی:** گائے، بھینس، بکریوں میں منہ کھر، سڑو، بخار اور افارہ کا علاج\n` +
        `🌱 **کھادیں و زہریں:** یوریا، DAP اور معیاری کیمیائی اسپرے کی فی ایکڑ خوراک\n\n` +
        `💡 *تصویر کے ذریعے فوری تشخیص کے لیے نیچے **Scan** ٹیب کا استعمال کریں یا اپنا سوال ٹائپ کریں!*`
      : `🤝 **Assalam-o-Alaikum! I am FasalDoc AI Agricultural Assistant** 🌾\n\n` +
        `I am fully ready to assist you with:\n\n` +
        `🌾 **Crop Health:** Disease diagnosis for Wheat, Rice, Cotton, Tomato, Potato & Maize\n` +
        `🐄 **Livestock Care:** Cattle, Buffalo & Goat health (FMD, Mastitis, Fever & Bloat)\n` +
        `🌱 **Fertilizers & Sprays:** Exact DAP/Urea doses per acre and top Pakistani brands\n\n` +
        `💡 *For instant visual analysis, tap the **Scan** tab below or ask me any question!*`;
  }

  if (isUr) {
    return `🌾 **FasalDoc AI RAG تجاویز & ماہرانہ رہنما** 🌾\n\n` +
      `📌 **تشخیص / موضوع:** ${primary.titleUr}\n\n` +
      `📝 **صورتحال کا خلاصہ:**\n${primary.summaryUr}\n\n` +
      `🌿 **قدرتی و روایتی علاج (Organic Remedy):**\n${primary.organicUrdu}\n\n` +
      `🧪 **کیمیائی علاج اور مقامی ادویات (Chemical & Products):**\n${primary.chemicalUrdu}\n\n` +
      `💊 **خوراک / مقدار (Dosage):**\n${primary.dosageUrdu}\n\n` +
      `🛍️ **پاکستان میں دستیاب کیمیائی برانڈز:**\n${primary.localProducts.map(p => `• ${p}`).join("\n")}\n\n` +
      `🛡️ **حفاظتی تدابیر (Prevention):**\n${primary.preventionUrdu}\n\n` +
      `💡 *بہترین اور 100٪ درست تشخیص کے لیے **Scan** ٹیب پر جا کر متاثرہ فصل یا جانور کی تصویر بھیجیں!*`;
  }

  return `🌾 **FasalDoc AI RAG Verified Advisory** 🌾\n\n` +
    `📌 **Topic / Diagnosis:** ${primary.titleEn}\n\n` +
    `📝 **Assessment Summary:**\n${primary.summaryEn}\n\n` +
    `🌿 **Organic / Traditional Remedy:**\n${primary.organicEn}\n\n` +
    `🧪 **Chemical Treatment & Local Products:**\n${primary.chemicalEn}\n\n` +
    `💊 **Recommended Dosage:**\n${primary.dosageEn}\n\n` +
    `🛍️ **Recommended Brands (Pakistan):**\n${primary.localProducts.map(p => `• ${p}`).join("\n")}\n\n` +
    `🛡️ **Prevention & Management:**\n${primary.preventionEn}\n\n` +
    `💡 *For instant visual diagnosis, tap the **Scan** tab below and capture a photo!*`;
}
