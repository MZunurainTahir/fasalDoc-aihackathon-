/**
 * Client-Side RAG (Retrieval-Augmented Generation) Engine.
 * Enables instant (< 10ms) responses with verified local remedies and advice.
 */
import { REMEDY_DATABASE } from "./remedyData";

export function generateClientRAGAnswer(userQuery: string, lang: "en" | "ur" = "en"): string {
  const q = userQuery.toLowerCase();
  const isUr = lang === "ur" || /[\u0600-\u06FF]/.test(userQuery);

  // 1. Wet crops / Waterlogging / Flooding
  if (q.includes("wet") || q.includes("water") || q.includes("flood") || q.includes("rain") || q.includes("پانی") || q.includes("گیلا") || q.includes("بارش")) {
    if (q.includes("wheat") || q.includes("گندم")) {
      return isUr
        ? `🌾 **گندم کی فصل میں کھڑا پانی اور پیلا پن — RAG ماہرانہ حل** 🌾\n\n` +
          `📌 **مسئلہ:** گندم کے کھیت میں پانی کھڑا رہنے سے جڑوں کو آکسیجن نہیں ملتی جس سے نائٹروجن کی کمی (پیلا پن) اور روٹ روٹ کا خطرہ ہوتا ہے۔\n\n` +
          `🌿 **قدرتی / دیسی علاج:**\n` +
          `1. کھیت سے نالیاں بنا کر پانی فوری طور پر باہر نکالیں۔\n` +
          `2. زمین خشک ہونے پر 2٪ کھٹی لسی کے محلول کا اسپرے جڑوں کی بحالی کے لیے کریں۔\n` +
          `3. لکڑی کی راکھ کے پانی کا چھڑکاؤ کریں۔\n\n` +
          `🧪 **کیمیائی علاج و غذائی سپلیمنٹ:**\n` +
          `1. **یوریا + زنک سلفیٹ:** وتر آنے پر یوریا (15-20 کلوگرام) میں زنک سلفیٹ 33٪ (3 کلوگرام) ملا کر چھٹا دیں۔\n` +
          `2. **فولیر اسپرے (NPK 19:19:19):** 500 گرام فی 100 لیٹر پانی فی ایکڑ اسپرے کریں تاکہ پتے فوراً غذا حاصل کریں۔\n` +
          `3. **کنگی (Rust) سے بچاؤ:** نمی کی وجہ سے Tilt 250 EC (200 ملی لیٹر/ایکڑ) کا حفاظتی اسپرے کریں۔\n\n` +
          `🛍️ **مقامی پروڈکٹس:** Tilt 250 EC (Syngenta), Zincol (FMC), Engro Urea.\n\n` +
          `💡 *تصویر کے ذریعے مزید درست معائنہ کے لیے **Scan** ٹیب کا استعمال کریں۔*`
        : `🌾 **Wheat Crop Waterlogging & Wet Field Recovery Advisory** 🌾\n\n` +
          `📌 **Diagnosis:** Standing water in wheat fields causes root oxygen starvation, resulting in yellowing (nitrogen leaching) and fungal root decay.\n\n` +
          `🌿 **Organic & Immediate Steps:**\n` +
          `1. **Drain Water:** Create immediate drainage channels to flush excess water out of the field.\n` +
          `2. **Root Booster:** Spray 2% fermented sour buttermilk / whey once field dries to stimulate beneficial soil microbes.\n` +
          `3. **Ash Application:** Spread dry wood ash to absorb excess moisture and add potash.\n\n` +
          `🧪 **Chemical Treatment & Fertilizer Rescue:**\n` +
          `1. **Top-Dress Nitrogen + Zinc:** Once field is workable (vattar condition), top-dress 15-20 kg Urea + 3 kg Zinc Sulphate (33%) per acre.\n` +
          `2. **Foliar NPK Spray:** Apply Soluble NPK (19:19:19) @ 500g in 100L water per acre for fast leaf absorption.\n` +
          `3. **Rust Prevention:** High moisture induces Wheat Rust — spray Propiconazole (Tilt 250 EC) @ 200ml/acre.\n\n` +
          `🛍️ **Local Recommended Products:** Tilt 250 EC (Syngenta), Zincol (FMC), SoluPotasse (TES), Sona Urea.\n\n` +
          `💡 *For visual diagnosis of leaf spots, snap a photo in the **Scan** tab!*`;
    }
    return isUr
      ? `🌧️ **فصل میں پانی کے کھڑا ہونے اور نماء کی خرابی کا حل** 🌧️\n\n` +
        `1. کھیت سے پانی کا فوری اخراج یقینی بنائیں۔\n` +
        `2. وتر آنے پر NPK (19:19:19) 500 گرام فی ایکڑ کا پتوں پر اسپرے کریں۔\n` +
        `3. نائٹروجن کی کمی دور کرنے کے لیے یوریا کھاد ہلکی مقدار میں دیں۔\n` +
        `4. فنگس اور گل سڑاؤ کے بچاؤ کے لیے کاپر آکسی کلورائیڈ کا اسپرے کریں۔`
      : `🌧️ **Wet Field & Crop Waterlogging Management** 🌧️\n\n` +
        `1. **Drainage:** Immediately remove excess water using drainage cuts.\n` +
        `2. **Foliar Spray:** Apply Soluble NPK (19:19:19) @ 500g/100L water to bypass damaged roots.\n` +
        `3. **Nitrogen Boost:** Top-dress light dose of Urea once soil becomes firm.\n` +
        `4. **Fungicide Protection:** Apply Copper Oxychloride (500g/acre) to stop root rot.`;
  }

  // 2. Wheat Rust
  if (q.includes("wheat") || q.includes("گندم")) {
    const item = REMEDY_DATABASE["Wheat___Leaf_rust"];
    return isUr
      ? `🌾 **گندم کی بیماری (کنگی / rust) کا مکمل علاج** 🌾\n\n` +
        `📝 **علامات:** ${item.symptomsUrdu.join("، ")}\n\n` +
        `🌿 **دیسی / قدرتی علاج:** ${item.organicUrdu}\n\n` +
        `🧪 **کیمیائی علاج:** ${item.chemicalUrdu}\n\n` +
        `💊 **خوراک (Dosage):** ${item.dosageUrdu}\n\n` +
        `🛍️ **پاکستان کے معیاری برانڈز:** ${item.localProducts.join(", ")}\n\n` +
        `🛡️ **حفاظتی تدابیر:** ${item.preventionUrdu}`
      : `🌾 **Wheat Rust (کنگی) Comprehensive Treatment** 🌾\n\n` +
        `📝 **Symptoms:** ${item.symptoms.join("; ")}\n\n` +
        `🌿 **Organic Remedy:** ${item.organic}\n\n` +
        `🧪 **Chemical Remedy:** ${item.chemical}\n\n` +
        `💊 **Dosage:** ${item.dosage}\n\n` +
        `🛍️ **Recommended Products:** ${item.localProducts.join(", ")}\n\n` +
        `🛡️ **Prevention:** ${item.prevention}`;
  }

  // 3. Rice Blast
  if (q.includes("rice") || q.includes("paddy") || q.includes("دھان") || q.includes("چاول")) {
    const item = REMEDY_DATABASE["Rice___Blast"];
    return isUr
      ? `🍚 **دھان کے بلاسٹ (گردن توڑ) بیماری کا علاج** 🍚\n\n` +
        `📝 **علامات:** ${item.symptomsUrdu.join("، ")}\n\n` +
        `🌿 **قدرتی حل:** ${item.organicUrdu}\n\n` +
        `🧪 **کیمیائی دوا:** ${item.chemicalUrdu}\n\n` +
        `💊 **مقدار:** ${item.dosageUrdu}\n\n` +
        `🛍️ **برانڈز:** ${item.localProducts.join(", ")}`
      : `🍚 **Rice Blast & Neck Rot Advisory** 🍚\n\n` +
        `📝 **Symptoms:** ${item.symptoms.join("; ")}\n\n` +
        `🌿 **Organic Remedy:** ${item.organic}\n\n` +
        `🧪 **Chemical Treatment:** ${item.chemical}\n\n` +
        `💊 **Dosage:** ${item.dosage}\n\n` +
        `🛍️ **Top Local Products:** ${item.localProducts.join(", ")}`;
  }

  // 4. Cow / Animal / Foot and Mouth / Mastitis / Fever
  if (q.includes("cow") || q.includes("buffalo") || q.includes("animal") || q.includes("fever") || q.includes("fmd") || q.includes("mastitis") || q.includes("گائے") || q.includes("بھینس") || q.includes("جانور") || q.includes("بخار") || q.includes("منہ کھر")) {
    if (q.includes("mastitis") || q.includes("سڑو") || q.includes("ساڑو") || q.includes("udder") || q.includes("milk")) {
      const item = REMEDY_DATABASE["Livestock___Bovine_Mastitis"];
      return isUr
        ? `🐄 **جانور کے حیوانے کی سوجن (سڑو/ساڑو) کا علاج** 🐄\n\n` +
          `📝 **علامات:** ${item.symptomsUrdu.join("، ")}\n\n` +
          `🌿 **دیسی علاج:** ${item.organicUrdu}\n\n` +
          `🧪 **کیمیائی علاج:** ${item.chemicalUrdu}\n\n` +
          `💊 **خوراک:** ${item.dosageUrdu}\n\n` +
          `🛍️ **ادویات:** ${item.localProducts.join(", ")}`
        : `🐄 **Bovine Mastitis (Udder Swelling) Advisory** 🐄\n\n` +
          `📝 **Symptoms:** ${item.symptoms.join("; ")}\n\n` +
          `🌿 **Organic Remedy:** ${item.organic}\n\n` +
          `🧪 **Chemical Remedy:** ${item.chemical}\n\n` +
          `💊 **Dosage:** ${item.dosage}\n\n` +
          `🛍️ **Products:** ${item.localProducts.join(", ")}`;
    }
    const fmd = REMEDY_DATABASE["Livestock___Foot_and_Mouth"];
    return isUr
      ? `🐄 **مویشیوں (گائے/بھینس) کی بیماری اور بخار کا حل** 🐄\n\n` +
        `📌 **منہ کھر (FMD) / بخار کی علامات:** ${fmd.symptomsUrdu.join("، ")}\n\n` +
        `🌿 **دیسی دیکھ بھال:** ${fmd.organicUrdu}\n\n` +
        `🧪 **ویٹرنری علاج:** ${fmd.chemicalUrdu}\n\n` +
        `💊 **مقدار:** ${fmd.dosageUrdu}\n\n` +
        `🛍️ **مقامی ادویات:** ${fmd.localProducts.join(", ")}`
      : `🐄 **Livestock Health & Fever Advisory** 🐄\n\n` +
        `📌 **FMD / Fever Symptoms:** ${fmd.symptoms.join("; ")}\n\n` +
        `🌿 **Organic Care:** ${fmd.organic}\n\n` +
        `🧪 **Veterinary Remedy:** ${fmd.chemical}\n\n` +
        `💊 **Dosage:** ${fmd.dosage}\n\n` +
        `🛍️ **Recommended Products:** ${fmd.localProducts.join(", ")}`;
  }

  // 5. Tomato
  if (q.includes("tomato") || q.includes("ٹماٹر")) {
    const item = REMEDY_DATABASE["Tomato___Early_blight"];
    return isUr
      ? `🍅 **ٹماٹر کے جھلساؤ (Blight) کا علاج** 🍅\n\n` +
        `📝 **علامات:** ${item.symptomsUrdu.join("، ")}\n\n` +
        `🌿 **دیسی طریقہ:** ${item.organicUrdu}\n\n` +
        `🧪 **کیمیائی طریقہ:** ${item.chemicalUrdu}\n\n` +
        `💊 **مقدار:** ${item.dosageUrdu}\n\n` +
        `🛍️ **برانڈز:** ${item.localProducts.join(", ")}`
      : `🍅 **Tomato Blight Management Guide** 🍅\n\n` +
        `📝 **Symptoms:** ${item.symptoms.join("; ")}\n\n` +
        `🌿 **Organic Method:** ${item.organic}\n\n` +
        `🧪 **Chemical Treatment:** ${item.chemical}\n\n` +
        `💊 **Dosage:** ${item.dosage}\n\n` +
        `🛍️ **Products:** ${item.localProducts.join(", ")}`;
  }

  // 6. Fertilizer / Nitrogen / Urea / DAP
  if (q.includes("fertilizer") || q.includes("dap") || q.includes("urea") || q.includes("کھاد")) {
    return isUr
      ? `🌱 **فصلوں کی کھاد کا ماہرانہ چارٹ (پاکستان)** 🌱\n\n` +
        `🌾 **گندم:** 1 بوری DAP + 1 بوری یوریا بوائی پر؛ 1 بوری یوریا پہلے پانی پر۔\n` +
        `🍚 **دھان:** 1 بوری DAP تیاری پر؛ 1.5 بوری یوریا 3 اقساط میں۔\n` +
        `🌱 **کپاس:** 1.5 بوری DAP + 2.5 بوری یوریا اقساط میں۔\n` +
        `🍅 **سبزیاں:** گوبر کی پرانی کھاد + متوازن NPK 20:20:20۔\n\n` +
        `⚠️ *ہمیشہ مٹی کا ٹیسٹ کروائیں اور تیز دھوپ میں یوریا مت چھٹائیں۔*`
      : `🌱 **Fertilizer Dosage & Application Chart** 🌱\n\n` +
        `🌾 **Wheat:** 1 bag DAP + 1 bag Urea at sowing; 1 bag Urea at 1st irrigation (20-25 days).\n` +
        `🍚 **Rice:** 1 bag DAP at land prep; 1.5 bags Urea split across 3 applications.\n` +
        `🌱 **Cotton:** 1.5 bags DAP + 2.5 bags Urea split during growth/flowering.\n` +
        `🍅 **Vegetables:** Composted manure + Balanced NPK (20:20:20).\n\n` +
        `⚠️ *Tip: Avoid broadcasting Urea on dry dry soil in hot sun to prevent ammonia loss.*`;
  }

  // Default General RAG Reply
  return isUr
    ? `🤝 **السلام علیکم! FasalDoc AI زرعی و مویشی معاون** 🤝\n\n` +
      `آپ کسی بھی فصل یا جانور کے بارے میں سوال پوچھ سکتے ہیں:\n\n` +
      `🌾 **فصلیں:** گندم، دھان، کپاس، ٹماٹر، آلو، مکئی کی بیماریاں اور علاج\n` +
      `🐄 **مویشی:** گائے، بھینس، بکریوں میں بخار، سڑو، منہ کھر، افارہ کا دیسی اور ویٹرنری علاج\n` +
      `🌱 **کھاد و زہریں:** یوریا، DAP، اور معیاری کیمیائی اسپرے کی فی ایکڑ خوراک\n\n` +
      `💡 *فوری تشخیص کیلئے نیچے **Scan** بٹن پر کلک کر کے تصویر کھینچیں۔*`
    : `🤝 **Assalam-o-Alaikum! FasalDoc AI Agricultural Companion** 🤝\n\n` +
      `I can help you with comprehensive guidance on:\n\n` +
      `🌾 **Crop Health:** Wheat, Rice, Cotton, Tomato, Potato disease identification & remedies\n` +
      `🐄 **Livestock Care:** Cattle, Buffalo, Goat fever, mastitis, FMD, and digestive treatments\n` +
      `🌱 **Fertilizer & Spray:** Exact DAP/Urea doses per acre and top Pakistani local product brands\n\n` +
      `💡 *For instant automated image analysis, tap the **Scan** tab below!*`;
}
