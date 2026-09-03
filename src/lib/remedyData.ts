export interface RemedyInfo {
  id: string;
  category: "crop" | "livestock";
  cropOrAnimal: string;
  cropOrAnimalUrdu: string;
  name: string;
  nameUrdu: string;
  scientificName?: string;
  symptoms: string[];
  symptomsUrdu: string[];
  organic: string;
  organicUrdu: string;
  chemical: string;
  chemicalUrdu: string;
  dosage: string;
  dosageUrdu: string;
  localProducts: string[];
  estimatedCostPkr: string;
  prevention: string;
  preventionUrdu: string;
  severity: "low" | "medium" | "high" | "critical";
  sampleImage: string;
  confidence: number;
}

export const REMEDY_DATABASE: Record<string, RemedyInfo> = {
  "Tomato___Early_blight": {
    id: "Tomato___Early_blight",
    category: "crop",
    cropOrAnimal: "Tomato",
    cropOrAnimalUrdu: "ٹماٹر",
    name: "Tomato Early Blight",
    nameUrdu: "ٹماٹر کا اگیتا جھلساؤ",
    scientificName: "Alternaria solani",
    symptoms: [
      "Dark brown circular spots with concentric rings on lower leaves",
      "Yellowing halo around spots",
      "Premature leaf drop leading to sunscald on fruits",
      "Collar rot on young seedlings"
    ],
    symptomsUrdu: [
      "نچلے پتوں پر گول بھورے دھبے جن میں گول دائرے ہوتے ہیں",
      "دھبوں کے گرد پیلا ہالہ",
      "پتوں کا قبل از وقت گرنا جس سے پھل دھوپ سے جھلس جاتا ہے",
      "چھوٹے پودوں کے تنے پر سڑاند"
    ],
    organic: "Remove and destroy affected lower leaves immediately. Spray neem seed kernel extract (5%) or neem oil (5ml/L) every 7 days. Mulch soil around plants with straw to prevent soil-to-leaf splash.",
    organicUrdu: "متاثرہ نچلے پتے فوری کاٹ کر تلف کریں۔ نیم کا تیل (5 ملی لیٹر فی لیٹر پانی) یا نیم کے پتوں کا عرق ہر 7 دن بعد چھڑکیں۔ پودوں کے گرد توڑی/گھاس بچھائیں تاکہ مٹی اچھل کر پتوں پر نہ لگے۔",
    chemical: "Apply Chlorothalonil 75% WP or Mancozeb 80% WP as preventive. If infection is established, spray Difenoconazole or Azoxystrobin.",
    chemicalUrdu: "حفاظتی طور پر مینکوزیب (Mancozeb 80% WP) یا کلوروتھالونل کا اسپرے کریں۔ بیماری پھیلنے پر ڈائی فینوکونازول کا اسپرے کریں۔",
    dosage: "Antracol / Mancozeb: 250-300g per 100 Litres of water per acre. Score 250 EC: 100ml per acre.",
    dosageUrdu: "اینٹراکول یا مینکوزیب: 250 تا 300 گرام فی 100 لیٹر پانی فی ایکڑ۔ اسکور 250 ای سی: 100 ملی لیٹر فی ایکڑ۔",
    localProducts: ["Score 250 EC (Syngenta)", "Antracol 70 WP (Bayer)", "Dithane M-45 (Corteva)", "Cabrio Top (BASF)"],
    estimatedCostPkr: "Rs. 1,200 – 2,200 per acre",
    prevention: "Practice 3-year crop rotation (avoid planting after potatoes or chillies). Avoid overhead sprinkler irrigation. Maintain 60cm plant spacing for air circulation.",
    preventionUrdu: "3 سالہ فصلی ہیر پھیر اپنائیں (ٹماٹر، آلو اور مرچ کے بعد نہ لگائیں)۔ فوارہ آبپاشی سے پرہیز کریں اور پودوں کے درمیان مناسب فاصلہ رکھیں۔",
    severity: "medium",
    sampleImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    confidence: 0.89,
  },
  "Tomato___Late_blight": {
    id: "Tomato___Late_blight",
    category: "crop",
    cropOrAnimal: "Tomato",
    cropOrAnimalUrdu: "ٹماٹر",
    name: "Tomato Late Blight",
    nameUrdu: "ٹماٹر کا پچھیتا جھلساؤ",
    scientificName: "Phytophthora infestans",
    symptoms: [
      "Large, irregular water-soaked dark lesions on leaves and stems",
      "White fungal mold on leaf undersides in humid conditions",
      "Brown leathery rot on green and ripe tomato fruits",
      "Rapid wilting and death of entire plant canopy in cool humid weather"
    ],
    symptomsUrdu: [
      "پتوں اور تنوں پر پانی بھرے سیاہ دھبے",
      "نمی والے موسم میں پتوں کی نچلی سطح پر سفید پھپھوندی",
      "کچے اور پکے ٹماٹروں پر چمڑے جیسا بھورا گل سڑاؤ",
      "ٹھنڈے اور مرطوب موسم میں پورا پودا چند دنوں میں تباہ ہو جانا"
    ],
    organic: "Copper hydroxide spray in early morning. Remove infected plants from field in sealed bags. Improve field drainage.",
    organicUrdu: "صبح کے وقت کاپر ہائیڈرو آکسائیڈ کا اسپرے کریں۔ شدید متاثرہ پودوں کو تھیلوں میں بند کر کے کھیت سے دور دفن کریں۔ نکاسی آب کا بہترین انتظام رکھیں۔",
    chemical: "Metalaxyl + Mancozeb combination fungicide or Dimethomorph + Mancozeb. Spray immediately when morning humidity exceeds 85%.",
    chemicalUrdu: "میٹالیکسل + مینکوزیب (Metalaxyl + Mancozeb) یا ڈائیمیتھومورف کا فوری اسپرے کریں۔ جب صبح کی نمی 85 فیصد سے زیادہ ہو تو فوری حفاظتی اسپرے کریں۔",
    dosage: "Ridomil Gold: 250g per 100L water per acre. Acrobat MZ: 250g per acre.",
    dosageUrdu: "ریڈومل گولڈ: 250 گرام فی 100 لیٹر پانی فی ایکڑ۔ ایکروبیٹ ایم زیڈ: 250 گرام فی ایکڑ۔",
    localProducts: ["Ridomil Gold (Syngenta)", "Acrobat MZ (BASF)", "Aliette 80 WP (Bayer)", "Curzate M8 (Corteva)"],
    estimatedCostPkr: "Rs. 2,000 – 3,500 per acre",
    prevention: "Destroy cull piles and volunteer tomato/potato plants. Stake plants to keep foliage off wet soil.",
    preventionUrdu: "پرانے اور گلے سڑے پودوں کے ڈھیر تلف کریں۔ پودوں کو لکڑیوں سے باندھیں تاکہ پتے گیلی زمین کو نہ چھوئیں۔",
    severity: "critical",
    sampleImage: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&auto=format&fit=crop&q=80",
    confidence: 0.94,
  },
  "Wheat___Leaf_rust": {
    id: "Wheat___Leaf_rust",
    category: "crop",
    cropOrAnimal: "Wheat",
    cropOrAnimalUrdu: "گندم",
    name: "Wheat Brown / Leaf Rust",
    nameUrdu: "گندم کی بھوری کنگی (رسٹ)",
    scientificName: "Puccinia triticina",
    symptoms: [
      "Small circular to oval orange-brown powdery pustules on upper leaf surface",
      "Pustules rub off on fingers as orange-brown dust",
      "Leaves turn yellow and dry prematurely",
      "Severe yield reduction and shriveled grain formation"
    ],
    symptomsUrdu: [
      "پتوں کی اوپری سطح پر چھوٹے نارنجی بھورے پاؤڈر جیسے دانے",
      "انگلی پھیرنے پر نارنجی سفوف کا ہاتھ پر لگ جانا",
      "پتے زرد ہو کر وقت سے پہلے سوکھ جاتے ہیں",
      "سٹے کمزور اور دانے سکڑے ہوئے پیدا ہوتے ہیں"
    ],
    organic: "Spray wood ash water extract mixed with fermented sour buttermilk. Early sowing helps avoid late-season rust peaks.",
    organicUrdu: "لکڑی کی راکھ کے پانی میں کھٹی لسی ملا کر اسپرے کریں۔ وقت پر بروقت کاشت (یکم تا 20 نومبر) پچھیتی کنگی کے حملے سے بچاتی ہے۔",
    chemical: "Apply Triazole group fungicides such as Propiconazole 25% EC or Tebuconazole + Trifloxystrobin.",
    chemicalUrdu: "ٹرائیازول گروپ کی پھپھوند کش ادویات مثلاً پروپیکونازول (Propiconazole) یا ٹیبوکونازول کا اسپرے کریں۔",
    dosage: "Tilt 250 EC: 200ml in 100-120 Litres water per acre. Nativo 75 WG: 65g per acre.",
    dosageUrdu: "ٹلٹ 250 ای سی: 200 ملی لیٹر فی 100 تا 120 لیٹر پانی فی ایکڑ۔ نیٹیوو: 65 گرام فی ایکڑ۔",
    localProducts: ["Tilt 250 EC (Syngenta)", "Nativo 75 WG (Bayer)", "Topas 100 EC (Syngenta)", "Folicur (Bayer)"],
    estimatedCostPkr: "Rs. 1,500 – 2,800 per acre",
    prevention: "Cultivate certified rust-resistant varieties approved by PARC/UAF (e.g., Akbar-19, Dilkash-20, Ghazi-19, Subhani-21). Eradicate alternate host weeds.",
    preventionUrdu: "تحقیقی اداروں کی منظور شدہ کنگی کے خلاف قوت مدافعت رکھنے والی اقسام (جیسے اکبر 19، دلکش 20، غازی 19، سبحانی 21) کاشت کریں۔ جڑی بوٹیوں کا خاتمہ کریں۔",
    severity: "high",
    sampleImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    confidence: 0.91,
  },
  "Cotton___Bacterial_blight": {
    id: "Cotton___Bacterial_blight",
    category: "crop",
    cropOrAnimal: "Cotton",
    cropOrAnimalUrdu: "کپاس",
    name: "Cotton Bacterial Blight / Black Arm",
    nameUrdu: "کپاس کی کالی شاخ / بیکٹیریل بلائیٹ",
    scientificName: "Xanthomonas citri pv. malvacearum",
    symptoms: [
      "Angular water-soaked spots bounded by leaf veins on cotyledons and leaves",
      "Spots turn reddish-brown to black ('Angular leaf spot')",
      "Black elongated lesions on branches causing black-arm symptom and breakage",
      "Water-soaked oily lesions on bolls resulting in premature boll drop or stained lint"
    ],
    symptomsUrdu: [
      "پتوں کی رگوں کے درمیان کونے دار پانی بھرے دھبے",
      "دھبے گہرے بھورے یا سیاہ ہو جانا",
      "شاخوں پر لمبوترے سیاہ نشانات جن سے شاخیں ٹوٹ جاتی ہیں (کالی شاخ)",
      "ٹینڈوں پر تیل نما داغ جس سے ٹینڈے گر جاتے ہیں یا روئی داغدار ہو جاتی ہے"
    ],
    organic: "Seed treatment with hot water (52°C for 10 min). Spray garlic bulb extract (5%) + copper sulphate solution.",
    organicUrdu: "کاشت سے قبل بیج کو گرم پانی (52 ڈگری پر 10 منٹ) یا تیزاب سے زہر آلود کریں۔ لہسن کا عرق اور نیلا تھوتھا ملا کر اسپرے کریں۔",
    chemical: "Copper Oxychloride 50% WP mixed with Streptomycin sulphate / Kasugamycin antibiotics.",
    chemicalUrdu: "کاپر آکسی کلورائیڈ (Copper Oxychloride 50% WP) میں اسٹریپٹو مائیسن یا کاسوگامائیسن ملا کر اسپرے کریں۔",
    dosage: "Cuprofix / Cobox: 500g + Agrimycin 50g in 100-120 Litres water per acre.",
    dosageUrdu: "کوبرو فکس یا کوبوکس: 500 گرام + ایگری مائیسن 50 گرام فی 100 لیٹر پانی فی ایکڑ۔",
    localProducts: ["Cuprofix (UPL)", "Cobox 50 WP (Bayer)", "Kasumin 2L (Arysta)", "Champion (Nufarm)"],
    estimatedCostPkr: "Rs. 1,400 – 2,500 per acre",
    prevention: "Use acid-delinted certified seed. Deep plough cotton stubbles after harvest to bury infected debris.",
    preventionUrdu: "ہمیشہ تیزاب سے روئیں اترا ہوا تصدیق شدہ بیج کاشت کریں۔ کپاس کی چنائی کے بعد چھڑیاں اکھاڑ کر گہرا ہل چلائیں۔",
    severity: "high",
    sampleImage: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80",
    confidence: 0.88,
  },
  "Rice___Blast": {
    id: "Rice___Blast",
    category: "crop",
    cropOrAnimal: "Rice",
    cropOrAnimalUrdu: "دھان / چاول",
    name: "Rice Blast (Leaf & Neck Blast)",
    nameUrdu: "دھان کا بلاسٹ (پتوں اور گردن توڑ بیماری)",
    scientificName: "Magnaporthe oryzae",
    symptoms: [
      "Spindle-shaped or eye-shaped lesions with grey center and reddish-brown borders",
      "Lesions enlarge and coalesce causing leaves to burn and desiccate",
      "Black-brown rot at node below the panicle causing neck rot (empty white panicles)",
      "Severe lodging and grain filling failure"
    ],
    symptomsUrdu: [
      "پتوں پر آنکھ نما یا تکلے کی شکل کے دھبے جن کا درمیان خاکستری اور کنارے بھورے ہوتے ہیں",
      "دھبے آپس میں مل کر پورے پتے کو جھلسا دیتے ہیں",
      "سٹے کی بنیاد (گردن) پر کالا نشان اور سٹہ ٹوٹ جانا (گردن توڑ بیماری)",
      "سٹے خالی اور سفید رہ جاتے ہیں جس سے پیداوار صفر ہو جاتی ہے"
    ],
    organic: "Apply silica-rich rice husk ash to soil. Avoid standing stagnant water in cool weather. Spray diluted cow urine + neem extract.",
    organicUrdu: "زمین میں چاول کی راکھ (سلیکا) ڈالیں۔ کھڑے پانی کو نکال کر تازہ پانی لگائیں۔ نیم کا عرق چھڑکیں۔",
    chemical: "Apply Tricyclazole 75% WP or Isoprothiolane 40% EC or Azoxystrobin + Difenoconazole.",
    chemicalUrdu: "ٹرائی سائیکلازول (Tricyclazole 75% WP) یا آئسوپروتھائیولین کا فوری اسپرے کریں۔",
    dosage: "Beam 75 WP / Trooper: 100-120g in 100L water per acre. Amistar Top: 200ml per acre.",
    dosageUrdu: "بیم 75 ڈبلیو پی یا ٹروپر: 100 تا 120 گرام فی 100 لیٹر پانی فی ایکڑ۔ ایمسٹار ٹاپ: 200 ملی لیٹر فی ایکڑ۔",
    localProducts: ["Beam 75 WP (Corteva)", "Trooper (Dow)", "Amistar Top (Syngenta)", "Fuji-One (Nihon Nohyaku)"],
    estimatedCostPkr: "Rs. 1,600 – 3,000 per acre",
    prevention: "Avoid excessive nitrogen (Urea) doses — split into 3 applications. Maintain continuous 3-5cm water depth during heading stage.",
    preventionUrdu: "یوریا کھاد کا حد سے زیادہ استعمال نہ کریں بلکہ اقساط میں دیں۔ نثار کے وقت کھیت میں مناسب وتر برقرار رکھیں۔",
    severity: "critical",
    sampleImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    confidence: 0.92,
  },
  "Potato___Late_Blight": {
    id: "Potato___Late_Blight",
    category: "crop",
    cropOrAnimal: "Potato",
    cropOrAnimalUrdu: "آلو",
    name: "Potato Late Blight",
    nameUrdu: "آلو کا پچھیتا جھلساؤ",
    scientificName: "Phytophthora infestans",
    symptoms: [
      "Water-soaked dark lesions starting from leaf tips and margins",
      "Downy white fungal growth on underside of leaves in morning mist",
      "Stem rot turning stems black and fragile",
      "Tubers develop dry brown granular decay under the skin"
    ],
    symptomsUrdu: [
      "پتوں کے کناروں اور نوکوں سے پانی بھرے سیاہ دھبے شروع ہونا",
      "صبح کے وقت پتوں کی نچلی طرف سفید باریک پھپھوندی",
      "تنوں کا گل سڑ کر کالا اور کمزور ہو جانا",
      "آلوؤں کے چھلکے کے نیچے بھورا خشک سڑاؤ پیدا ہونا"
    ],
    organic: "Spray 1% Bordeaux mixture. Burn or bury infected tops 10 days before harvesting tubers.",
    organicUrdu: "1 فیصد بورڈو مکسچر کا اسپرے کریں۔ کٹائی سے 10 دن قبل اوپر والی تمام بیلیں کاٹ کر تلف کریں۔",
    chemical: "Dimethomorph + Mancozeb or Cymoxanil + Mancozeb or Mandipropamid.",
    chemicalUrdu: "ڈائیمیتھومورف + مینکوزیب یا سائموکسانل یا ریڈومل گولڈ کا فوری اسپرے کریں۔",
    dosage: "Acrobat MZ: 250g per 100L water per acre. Revus 250 SC: 100ml per acre.",
    dosageUrdu: "ایکروبیٹ ایم زیڈ: 250 گرام فی 100 لیٹر پانی فی ایکڑ۔ ریوس: 100 ملی لیٹر فی ایکڑ۔",
    localProducts: ["Acrobat MZ (BASF)", "Ridomil Gold (Syngenta)", "Revus (Syngenta)", "Curzate M8 (Corteva)"],
    estimatedCostPkr: "Rs. 2,200 – 3,800 per acre",
    prevention: "Plant certified disease-free seed tubers. Hill up soil well around potato bases to prevent spore washing onto tubers.",
    preventionUrdu: "تصدیق شدہ صحتمند بیج استعمال کریں۔ پودوں کی جڑوں پر مٹی چڑھا کر اونچی رکھیں تاکہ پانی سے جراثیم آلو تک نہ پہنچیں۔",
    severity: "critical",
    sampleImage: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    confidence: 0.95,
  },
  "Livestock___Foot_and_Mouth": {
    id: "Livestock___Foot_and_Mouth",
    category: "livestock",
    cropOrAnimal: "Cattle & Buffalo",
    cropOrAnimalUrdu: "گائے اور بھینس",
    name: "Foot & Mouth Disease (FMD / منہ کھر)",
    nameUrdu: "منہ کھر کی بیماری (FMD)",
    scientificName: "Aphtae epizooticae (Aphthovirus)",
    symptoms: [
      "High fever (104-106°F), shivering and sudden milk production drop",
      "Excessive ropy salivation and smacking of lips",
      "Painful blisters (vesicles) on tongue, dental pad, gums and inside mouth",
      "Severe blisters in interdigital space of hooves causing extreme lameness"
    ],
    symptomsUrdu: [
      "تیز بخار (104 تا 106 ڈگری فارن ہائیٹ) اور دودھ کی پیداوار میں اچانک شدید کمی",
      "منہ سے مسلسل رال اور جھاگ ٹپکنا اور ہونٹ چپکانا",
      "زبان، مسوڑھوں اور تالو پر دردناک چھالے اور زخم",
      "کھروں کے درمیان چھالے اور زخم جن سے جانور لنگڑا کر چلتا ہے یا بیٹھ جاتا ہے"
    ],
    organic: "Wash mouth 3 times daily with 1% potassium permanganate (Lal Dawai) or 2% sodium bicarbonate solution. Apply neem oil + turmeric paste on foot lesions. Feed soft boiled porridge (dalia) with honey/ghee.",
    organicUrdu: "پوٹاشیم پرمینگنیٹ (لال دوائی) یا میٹھے سوڈے کے محلول سے منہ دن میں 3 بار دھوئیں۔ کھروں کے زخموں پر نیم کا تیل اور ہلدی کا لیپ کریں۔ نرم گرم دلیہ کھلائیں۔",
    chemical: "No antiviral cure exists — secondary bacterial infection prevention: Administer Oxytetracycline LA or Ceftiofur sodium + Flunixin Meglumine for fever and pain relief under veterinary supervision.",
    chemicalUrdu: "اینٹی بائیوٹک (آکسی ٹیٹراسائیکلین یا سیفٹیوفر) اور بخار/درد کش ٹیکہ (فلو نکسن) ڈاکٹر کے مشورے سے لگائیں تاکہ ثانوی انفیکشن نہ ہو۔",
    dosage: "Consult Veterinary Doctor immediately. Oxytetracycline LA: 1ml per 10kg body weight (IM). Flunixin: 2ml per 45kg body weight.",
    dosageUrdu: "فوری ویٹرنری ڈاکٹر سے رجوع کریں۔ اینٹی بائیوٹک اور درد کش ادویات جانور کے وزن کے مطابق دی جاتی ہیں۔",
    localProducts: ["Alamycin LA (Norbrook)", "Renamycin (Renata)", "Finadyne (MSD)", "Lal Dawai (KMnO4)"],
    estimatedCostPkr: "Rs. 1,500 – 3,000 per animal",
    prevention: "Vaccinate all cattle and buffalo bi-annually (Spring and Autumn) with FMD Vaccine (AIT / VRI Lahore). Strict quarantine of new animals for 21 days.",
    preventionUrdu: "سال میں دو مرتبہ (بہار اور خزاں میں) منہ کھر کی ویکسین لازمی لگوائیں۔ نئے جانوروں کو 21 دن تک الگ رکھیں۔",
    severity: "critical",
    sampleImage: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80",
    confidence: 0.93,
  },
  "Livestock___Bovine_Mastitis": {
    id: "Livestock___Bovine_Mastitis",
    category: "livestock",
    cropOrAnimal: "Dairy Cow & Buffalo",
    cropOrAnimalUrdu: "دودھیل گائے اور بھینس",
    name: "Bovine Mastitis (سڑو / ساڑو)",
    nameUrdu: "سڑو کی بیماری (حیوانہ کی سوزش)",
    scientificName: "Staphylococcus / Streptococcus mastitis",
    symptoms: [
      "Swollen, hot, red and painful udder (quarter enlargement)",
      "Abnormal milk: watery, clots, flakes, blood or pus tinged",
      "Cow resists milking or kicks due to severe tenderness",
      "Fever and refusal to eat in acute toxic mastitis"
    ],
    symptomsUrdu: [
      "لیوے (حیوانے) کا سوج جانا، گرم اور سخت ہو جانا",
      "دودھ میں پھٹکیاں، چھچھڑے، خون یا پیپ آنا",
      "چھونے یا چوائی کے دوران جانور کا لات مارنا اور درد محسوس کرنا",
      "شدید حالت میں تیز بخار اور چارہ نہ کھانا"
    ],
    organic: "Frequent stripping of affected quarter (every 2 hours). Cold water compresses during acute swelling, warm Epsom salt water later. Apply mastitis herbal ointment.",
    organicUrdu: "متاثرہ تھن سے ہر 2 گھنٹے بعد دودھ پوری طرح نکالیں۔ شروع میں ٹھنڈے پانی کی پٹیاں اور بعد میں نیم گرم نمک ملے پانی سے ٹکور کریں۔",
    chemical: "Intramammary antibiotic infusion tubes (Cloxacillin / Amoxicillin-Clavulanate) after complete milk evacuation + systemic antibiotic and NSAID (Meloxicam).",
    chemicalUrdu: "تھن کو مکمل خالی کر کے تھن میں چڑھانے والی اینٹی بائیوٹک ٹیوب چڑھائیں اور پٹھوں میں میل آکسیکیم اور اینٹی بائیوٹک کا ٹیکہ لگوائیں۔",
    dosage: "Intramammary tube (e.g. Mastijet Forte / Synulox LC): 1 tube per affected quarter after milking, once daily for 3 days.",
    dosageUrdu: "ماسٹائی جیٹ فورٹ یا سائینولوکس ٹیوب: ایک ٹیوب روزانہ تھن خالی کر کے 3 دن تک چڑھائیں۔",
    localProducts: ["Mastijet Forte (Intervet)", "Synulox LC (Zoetis)", "Melonex (Intas)", "Gentamicin Vet"],
    estimatedCostPkr: "Rs. 1,000 – 2,500 per cow",
    prevention: "Post-milking teat dipping in 0.5% iodine solution. Keep bedding dry, clean, and lime-dusted. Never allow cows to lie down immediately after milking.",
    preventionUrdu: "چوائی کے بعد تھنوں کو آیوڈین محلول میں ڈبوئیں۔ باڑے کے فرش کو خشک اور صاف رکھیں اور چونا چھڑکیں۔ چوائی کے فوراً بعد چارہ ڈالیں تاکہ گائے بیٹھے نہیں۔",
    severity: "high",
    sampleImage: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=600&auto=format&fit=crop&q=80",
    confidence: 0.90,
  },
  "Livestock___Lumpy_Skin": {
    id: "Livestock___Lumpy_Skin",
    category: "livestock",
    cropOrAnimal: "Cattle",
    cropOrAnimalUrdu: "گائے اور بچھڑے",
    name: "Lumpy Skin Disease (LSD / لمپی سکن)",
    nameUrdu: "لمپی سکن کی بیماری (جلد کے گلٹھے)",
    scientificName: "Lumpy skin disease virus (Capripoxvirus)",
    symptoms: [
      "Firm, raised, painful round nodules (2-5cm) all over skin, neck, udder and legs",
      "High persistent fever (104-106°F) and ocular/nasal discharge",
      "Edema and severe swelling in dewlap and legs causing difficulty standing",
      "Nodules turn necrotic, ulcerate and leave deep core holes ('sit-fast')"
    ],
    symptomsUrdu: [
      "پورے جسم، گردن، لیوے اور ٹانگوں پر 2 تا 5 سینٹی میٹر سخت ابھرے ہوئے دانے (گلٹھے)",
      "تیز بخار، آنکھوں اور ناک سے رطوبت بہنا",
      "گلے کی جھالر اور ٹانگوں میں پانی بھر کر شدید سوجن آنا",
      "دانوں کا پھٹ کر گہرے زخم بن جانا"
    ],
    organic: "Isolate affected cow. Apply neem oil, turmeric, and camphor paste on burst skin lesions. Spray animal shelter with mosquito repellents and neem leaf smoke.",
    organicUrdu: "متاثرہ جانور کو فوری الگ کریں۔ پھٹے دانوں پر نیم کا تیل، کافور اور ہلدی ملا کر لگائیں۔ باڑے میں مچھر اور مکھیاں مارنے کا انتظام کریں۔",
    chemical: "Symptomatic treatment: Antipyretics (Paracetamol/Ketoprofen) + Antihistamines (Chlorpheniramine) + Broad-spectrum antibiotic (Enrofloxacin/Oxytetracycline) to prevent wound maggot/fly strike.",
    chemicalUrdu: "علاماتی علاج: بخار اور درد کے ٹیکے + الرجی کا ٹیکہ (Pheniramine) + زخموں کو مکھیوں کے کیڑوں سے بچانے کیلئے اینٹی بائیوٹک اور نیلے اسپرے کا استعمال کریں۔",
    dosage: "Consult Registered Vet. Ketoprofen 3mg/kg + Penicillin/Streptomycin daily for 5 days. Spray wounds with Oxytetracycline skin spray.",
    dosageUrdu: "ویٹرنری ڈاکٹر سے معائنہ کروائیں۔ اینٹی بائیوٹک اور درد کش ادویات 5 دن تک تجویز کے مطابق دیں۔",
    localProducts: ["Terramycin Skin Spray (Zoetis)", "Ketovet (Star)", "Avil Vet (Sanofi)", "Enrovet (ICI)"],
    estimatedCostPkr: "Rs. 2,000 – 4,500 per animal",
    prevention: "Annual Goat Pox / Homologous LSD Vaccination. Strict vector control (control biting flies, mosquitoes and ticks with Deltamethrin spray).",
    preventionUrdu: "گوٹ پاکس یا لمپی سکن ویکسین بروقت لگوائیں۔ باڑے میں مچھروں، چیچڑوں اور مکھیوں کا اسپرے کے ذریعے خاتمہ کریں۔",
    severity: "critical",
    sampleImage: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
    confidence: 0.96,
  },
  "Cotton___Whitefly": {
    id: "Cotton___Whitefly",
    category: "crop",
    cropOrAnimal: "Cotton",
    cropOrAnimalUrdu: "کپاس",
    name: "Cotton Whitefly (Silverleaf Whitefly)",
    nameUrdu: "کپاس کی سفید مکھی",
    scientificName: "Bemisia tabaci",
    symptoms: [
      "Tiny white moth-like insects on undersides of leaves",
      "Leaves curl upwards, turn yellow and become sticky with honeydew",
      "Sooty black mould grows on honeydew-covered leaves",
      "Stunted growth and poor boll opening; transmits Cotton Leaf Curl Virus"
    ],
    symptomsUrdu: [
      "پتوں کی نچلی سطح پر چھوٹی سفید مکھی نما کیڑے",
      "پتے اوپر کی طرف مڑتے، پیلے ہوتے اور شہد جیسے مواد سے چپچپے ہو جاتے ہیں",
      "چپچپے پتوں پر سیاہ پھپھوندی کی پرت جم جاتی ہے",
      "پودے کی نشونما رک جاتی ہے اور ٹنکھیاں ٹھیک نہیں کھلتیں؛ یہ CLCuV وائرس بھی پھیلاتی ہے"
    ],
    organic: "Install yellow sticky traps (10-12 per acre). Spray neem oil 5ml/L or neem seed kernel extract weekly. Release predatory mites/ladybird beetles.",
    organicUrdu: "ایکڑ میں 10-12 پیلی چپچپی ٹرپیں لگائیں۔ نیم کا تیل 5 ملی لیٹر فی لیٹر پانی یا نیم کے بیجوں کا عرق ہفتہ وار چھڑکیں۔ شکار کرنے والے کیڑے چھوڑیں۔",
    chemical: "Rotate insecticides to avoid resistance: Imidacloprid, Thiamethoxam, Acetamiprid or Pyriproxyfen. Spray underside of leaves thoroughly.",
    chemicalUrdu: "مقاومت سے بچنے کے لیے ادویات کو تبدیل کریں: ایمڈاکلپورڈ، تھائیامیٹھوکسام، ایسیٹامپریڈ یا پیری پروکسیفین۔ پتوں کی نچلی سطح پر اچھی طرح اسپرے کریں۔",
    dosage: "Confidor 200 SL: 250ml per acre. Match 50 EC: 300ml per acre. Add sticker/spreader for underside coverage.",
    dosageUrdu: "کنفیڈور 200 ایس ایل: 250 ملی لیٹر فی ایکڑ۔ میچ 50 ای سی: 300 ملی لیٹر فی ایکڑ۔ پتوں کی نچلی سطح چپکنے کے لیے اسٹکر ملائیں۔",
    localProducts: ["Confidor 200 SL (Bayer)", "Actara 25 WG (Syngenta)", "Match 50 EC (Syngenta)", "Mospilan 20 SP (Nihon Nohyaku)"],
    estimatedCostPkr: "Rs. 2,500 – 4,000 per acre",
    prevention: "Remove weed hosts (e.g., bhindi, datura) around field. Avoid continuous cotton cropping. Use certified virus-free seed.",
    preventionUrdu: "کھیت کے ارد گرد جڑی بوٹیاں اور متبادل میزبان پودے (بھنڈی، دatura) صاف کریں۔ مسلسل کپاس نہ لگائیں۔ تصدیق شدہ وائرس سے پاک بیج استعمال کریں۔",
    severity: "high",
    sampleImage: "https://images.unsplash.com/photo-1596240934758-bc82f2e48e46?w=600&auto=format&fit=crop&q=80",
    confidence: 0.88,
  },
  "Maize___Fall_Armyworm": {
    id: "Maize___Fall_Armyworm",
    category: "crop",
    cropOrAnimal: "Maize",
    cropOrAnimalUrdu: "مکئی",
    name: "Maize Fall Armyworm",
    nameUrdu: "مکئی کا فال آرمی وورم",
    scientificName: "Spodoptera frugiperda",
    symptoms: [
      "Small larvae hide in leaf whorls and feed on tender leaves",
      "Characteristic 'window-pane' damage on emerging leaves",
      "Large ragged holes in leaves and chewed tassels/ears",
      "Frass (insect excreta) visible inside whorls"
    ],
    symptomsUrdu: [
      "چھوٹے کیڑے پتوں کی گولائی میں چھپتے ہیں اور نرم پتے کھاتے ہیں",
      "نکلتے ہوئے پتوں پر 'ونڈو پین' جیسا نقصان",
      "پتوں پر بڑے دانتے ہوئے سوراخ اور کھائے ہوئے گوبرے",
      "پتوں کی گولائی میں کیڑے کا گوبر نظر آتا ہے"
    ],
    organic: "Apply neem-based botanicals or Beauveria bassiana bio-pesticide. Hand-pick egg masses and young larvae. Use pheromone traps for monitoring.",
    organicUrdu: "نیم پر مبنی ادویات یا بیووریا باسیاں بائیو پیسٹیسائڈ کا اسپرے کریں۔ انڈوں کے گچھوں اور چھوٹے کیڑوں کو ہاتھ سے اکھاڑیں۔ فرومون ٹرپس نگرانی کے لیے استعمال کریں۔",
    chemical: "Chlorantraniliprole, Emamectin benzoate or Lufenuron. Target early larval stages inside whorls before they bore into stem/ear.",
    chemicalUrdu: "کلورانٹرانیلی پرول، ایمامیکٹن بنزوئیٹ یا لیوفینورون کا استعمال کریں۔ کیڑے سوق یا بھوٹے میں جانے سے پہلے ابتدائی مراحل میں گولائی پر اسپرے کریں۔",
    dosage: "Coragen 20 SC: 100ml per acre. Proclaim 5 SG: 200g per acre. Add 100ml vegetable oil per 100L water for better penetration.",
    dosageUrdu: "کوریجین 20 ایس سی: 100 ملی لیٹر فی ایکڑ۔ پروکلیم 5 ایس جی: 200 گرام فی ایکڑ۔ بہتر رساؤ کے لیے 100 لیٹر پانی میں 100 ملی لیٹر سبزیوں کا تیل ملائیں۔",
    localProducts: ["Coragen 20 SC (FMC)", "Proclaim 5 SG (Syngenta)", "Prevathon 5 SC (DuPont)", "Tracer 480 SC (Dow)"],
    estimatedCostPkr: "Rs. 1,800 – 3,200 per acre",
    prevention: "Early planting, regular scouting, and destroying crop residues. Rotate with non-host crops like wheat or gram.",
    preventionUrdu: "بروقت کاشت، باقاعدہ نگرانی اور فضلہ کو تلف کرنا۔ گندم یا چنا جیسے غیر میزبان فصلوں کے ساتھ ہیر پھیر کریں۔",
    severity: "high",
    sampleImage: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
    confidence: 0.91,
  },
};

export const CROP_LIST = [
  { id: "wheat", nameEn: "Wheat", nameUr: "گندم", emoji: "🌾", season: "Rabi (Winter)", mainDiseases: ["Leaf Rust", "Stripe Rust", "Loose Smut", "Powdery Mildew"] },
  { id: "cotton", nameEn: "Cotton", nameUr: "کپاس", emoji: "🌱", season: "Kharif (Summer)", mainDiseases: ["Bacterial Blight", "Cotton Leaf Curl Virus (CLCuV)", "Root Rot"] },
  { id: "rice", nameEn: "Rice", nameUr: "دھان / چاول", emoji: "🍚", season: "Kharif (Summer)", mainDiseases: ["Rice Blast", "Bacterial Leaf Blight", "Brown Spot", "Sheath Blight"] },
  { id: "tomato", nameEn: "Tomato", nameUr: "ٹماٹر", emoji: "🍅", season: "All Year", mainDiseases: ["Early Blight", "Late Blight", "Leaf Curl Virus", "Bacterial Wilt"] },
  { id: "potato", nameEn: "Potato", nameUr: "آلو", emoji: "🥔", season: "Autumn / Spring", mainDiseases: ["Late Blight", "Early Blight", "Black Scurf", "Scab"] },
  { id: "sugarcane", nameEn: "Sugarcane", nameUr: "کماد / گنا", emoji: "🎋", season: "Annual", mainDiseases: ["Red Rot", "Smut", "Whip Smut", "Ratoon Stunting"] },
  { id: "maize", nameEn: "Maize / Corn", nameUr: "مکئی", emoji: "🌽", season: "Spring / Autumn", mainDiseases: ["Maydis Leaf Blight", "Turcicum Blight", "Stalk Rot"] },
];

export const LIVESTOCK_LIST = [
  { id: "cattle", nameEn: "Cattle (Cows & Bulls)", nameUr: "گائے اور بیل", emoji: "🐄", mainDiseases: ["Foot & Mouth Disease", "Lumpy Skin Disease", "Bovine Mastitis", "Hemorrhagic Septicemia (HS)"] },
  { id: "buffalo", nameEn: "Nili-Ravi Buffalo", nameUr: "بھینس (نیلی راوی)", emoji: "🐃", mainDiseases: ["Mastitis", "Foot & Mouth", "Hemorrhagic Septicemia (گل گھوٹو)"] },
  { id: "goat_sheep", nameEn: "Goats & Sheep", nameUr: "بکریاں اور بھیڑیں", emoji: "🐐", mainDiseases: ["PPR (بکریوں کا طاعون)", "Enterotoxemia", "Contagious Ecthyma"] },
  { id: "poultry", nameEn: "Poultry & Desi Chickens", nameUr: "دیسی مرغیاں اور پولٹری", emoji: "🐔", mainDiseases: ["Newcastle Disease (رانی کھیت)", "Infectious Bronchitis", "Coccidiosis"] },
];
