/**
 * Government of Pakistan agriculture / livestock subsidies and support schemes.
 * Data is representative; users should verify current eligibility and deadlines
 * from official sources (agripunjab.gov.pk, nmis.narc.gov.pk, livestock.gov.pk,
 * sindhagri.gov.pk, kp.gov.pk, balochistan.gov.pk, gb.gov.pk, ajk.gov.pk).
 */

import type { ProvinceId } from "./pakistanLocations";

export type SchemeCategory = "crop" | "livestock" | "insurance" | "financial" | "input";

export interface FarmerScheme {
  id: string;
  category: SchemeCategory;
  province: ProvinceId | "federal";
  title: string;
  titleUrdu: string;
  ministry: string;
  ministryUrdu: string;
  summary: string;
  summaryUrdu: string;
  eligibility: string;
  eligibilityUrdu: string;
  benefit: string;
  benefitUrdu: string;
  contact: string;
  deadline?: string;
  active: boolean;
}

export const FARMER_SCHEMES: FarmerScheme[] = [
  // Federal / nationwide
  {
    id: "pm-kisan",
    category: "financial",
    province: "federal",
    title: "PM Kisan Package / Kissan Card",
    titleUrdu: "وزیر اعظم کسان کارڈ",
    ministry: "Government of Pakistan / Provincial Agriculture Dept",
    ministryUrdu: "حکومت پاکستان / صوبائی محکمہ زراعت",
    summary: "Interest-free or subsidised input loans and direct cash support for registered smallholder farmers through the Kissan Card digital platform.",
    summaryUrdu: "کسان کارڈ کے ذریعے چھوٹے کاشتکاروں کو بغیر سود یا کم سود کے قرضے اور براہ راست نقد امداد۔",
    eligibility: "Small farmers with up to 12.5 acres irrigated or 25 acres barani land; CNIC and land-record verification required.",
    eligibilityUrdu: "12.5 ایکڑ تک سینچائی والی زمین یا 25 ایکڑ بارانی زمین کے کسان؛ شناختی کارڈ اور زمینی ریکارڈ ضروری۔",
    benefit: "Subsidised seeds, fertiliser, pesticide and machinery credit; crop insurance coverage.",
    benefitUrdu: "سستے بیج، کھاد، زہر کش ادویات اور مشینری کے قرضے؛ فصل انشورنس۔",
    contact: "0800-15000 (Punjab Agri Helpline) or visit e-Khidmat Markaz",
    active: true,
  },
  {
    id: "crop-insurance",
    category: "insurance",
    province: "federal",
    title: "Crop Loan Insurance Scheme (CLIS)",
    titleUrdu: "فصل قرضہ انشورنس اسکیم",
    ministry: "State Bank of Pakistan / Agricultural Credit",
    ministryUrdu: "اسٹیٹ بینک آف پاکستان / زرعی قرضہ",
    summary: "Free crop insurance bundled with farm credit from participating banks; covers losses from natural calamities, pests and diseases.",
    summaryUrdu: "بینکوں کے زرعی قرضوں کے ساتھ مفت فصل انشورنس؛ قدرتی آفات، کیڑوں اور بیماریوں سے نقصان کا تحفظ۔",
    eligibility: "Farmers availing production/development loans from SBP-registered banks.",
    eligibilityUrdu: "وہ کاشتکار جو رجسٹرڈ بینکوں سے پیداواری یا ترقیاتی قرضہ لیتے ہیں۔",
    benefit: "Loan waiver or compensation up to the insured loan amount in case of crop failure.",
    benefitUrdu: "فصل تباہ ہونے پر قرضے کی رقم تک معاوضہ یا قرضہ معاف۔",
    contact: "Contact your loan branch or SBP helpline 111-727-111",
    active: true,
  },
  {
    id: "pm-livestock-youth",
    category: "livestock",
    province: "federal",
    title: "Prime Minister's Youth Livestock Programme",
    titleUrdu: "وزیر اعظم نوجوانوں کے لیے مویشی پروگرام",
    ministry: "Ministry of National Food Security & Research",
    ministryUrdu: "وزارت قومی خوراک تحفظ و تحقیق",
    summary: "Subsidised provision of pregnant heifers, sheep/goat units and poultry units to unemployed youth and small farmers.",
    summaryUrdu: "بے روزگار نوجوانوں اور چھوٹے کاشتکاروں کو سستی نرگئے بچھڑیاں، بکریاں/بھیڑیں اور مرغیوں کے یونٹ۔",
    eligibility: "18-40 years; valid CNIC; landholding or shed ownership; no defaulter status.",
    eligibilityUrdu: "18 سے 40 سال؛ شناختی کارڈ؛ زمین یا باڑہ؛ ڈیفالٹر نہ ہوں۔",
    benefit: "50% subsidy on livestock unit cost; technical training and veterinary support.",
    benefitUrdu: "مویشیوں کی قیمت پر 50 فیصد سبسڈی؛ تکنیکی تربیت اور ویٹرنری سہولت۔",
    contact: "Livestock & Dairy Development Board (LDDB) or 0800-78685",
    active: true,
  },
  {
    id: "solar-tube-well",
    category: "financial",
    province: "federal",
    title: "Solarization of Tube Wells / PM Solar Scheme",
    titleUrdu: "نلکوں پر سولر نظام / وزیر اعظم سولر اسکیم",
    ministry: "Energy Department / AEDB",
    ministryUrdu: "محکمہ توانائی / متبادل توانائی ترقیاتی بورڈ",
    summary: "Interest-free loans and capital subsidies for converting diesel/electric tube wells to solar-powered irrigation.",
    summaryUrdu: "ڈیزل/بجلی والے نلکوں کو سولر پانی کے نظام میں تبدیل کرنے کے لیے قرضے اور سبسڈی۔",
    eligibility: "Landowners with operational tube wells; NOC from electricity department where applicable.",
    eligibilityUrdu: "جِن کسانوں کے نلکے چل رہے ہوں؛ بجلی محکمے کی این او سی درکار۔",
    benefit: "Up to 70% financing at concessional rates; reduced diesel/electricity bills.",
    benefitUrdu: "70 فیصد تک سستے قرضے؛ ڈیزل اور بجلی کے بلوں میں کمی۔",
    contact: "AEDB or designated participating banks",
    active: true,
  },

  // Punjab
  {
    id: "wheat-subsidy-pb",
    category: "input",
    province: "punjab",
    title: "Punjab Subsidised Wheat Seed & Fertiliser Programme",
    titleUrdu: "پنجاب سستے گندم بیج اور کھاد پروگرام",
    ministry: "Punjab Agriculture Department",
    ministryUrdu: "پنجاب محکمہ زراعت",
    summary: "Certified high-yielding wheat seed and DAP/Urea fertiliser at government-fixed subsidised rates for registered farmers.",
    summaryUrdu: "رجسٹرڈ کاشتکاروں کو اعلیٰ پیداواری گندم کے تصدیق شدہ بیج اور ڈی اے پی/یوریا کھاد سرکاری نرخوں پر۔",
    eligibility: "Registered farmers in target districts; land record verified by patwari/tehsil office.",
    eligibilityUrdu: "ہدف اضلاع کے رجسٹرڈ کاشتکار؛ پٹواری یا تحصیل آفس سے زمینی ریکارڈ کی تصدیق۔",
    benefit: "20-40% subsidy on certified seed and major fertilisers.",
    benefitUrdu: "تصدیق شدہ بیج اور اہم کھادوں پر 20-40 فیصد سبسڈی۔",
    contact: "District Agriculture Extension Office or 0800-15000",
    deadline: "Rabi sowing season (Oct-Nov)",
    active: true,
  },
  {
    id: "citrus-rehab",
    category: "crop",
    province: "punjab",
    title: "Citrus Rehabilitation & High-Density Plantation",
    titleUrdu: "کینو بحالی اور زیادہ پیداواری باغات",
    ministry: "Punjab Agriculture Department / Citrus Development",
    ministryUrdu: "پنجاب زراعت / کینو ترقی",
    summary: "Support for replacing senile citrus orchards with certified virus-free kinnow plants on high-density spacing.",
    summaryUrdu: "بوڑھے کینو کے باغوں کی جگہ تصدیق شدہ وائرس سے پاک کنوں کے پودے لگانے کی سرکاری مدد۔",
    eligibility: "Citrus growers with minimum 1 acre; orchard must be older than 20 years or heavily diseased.",
    eligibilityUrdu: "کم از کم 1 ایکڑ کینو کا باغ؛ 20 سال سے زیادہ پرانا یا شدید بیمار باغ۔",
    benefit: "Free/subsidised saplings, technical guidance and market linkage support.",
    benefitUrdu: "مفت یا سستے پودے، تکنیکی رہنمائی اور مارکیٹ تک رسائی۔",
    contact: "District Horticulture Officer or Citrus Development Officer",
    active: true,
  },
  {
    id: "pb-livestock-vaccination",
    category: "livestock",
    province: "punjab",
    title: "Punjab Free Livestock Vaccination & AI Campaign",
    titleUrdu: "پنجاب مفت مویشی ویکسینیشن اور مصنوعی تولید مہم",
    ministry: "Punjab Livestock & Dairy Development Department",
    ministryUrdu: "پنجاب محکمہ لائیو اسٹاک و ڈیری ڈیولپمنٹ",
    summary: "Free vaccination against FMD, HS, BQ and brucellosis plus subsidised artificial insemination services across Punjab.",
    summaryUrdu: "پنجاب بھر میں ایف ایم ڈی، ایچ ایس، بی کیو اور بروسیلوسس کی مفت ویکسینیشن اور سستی مصنوعی تولید۔",
    eligibility: "All livestock owners; bring animals to nearest veterinary hospital or mobile camp.",
    eligibilityUrdu: "تمام مویشی مالکان؛ جانوروں کو قریب ترین ویٹرنری ہسپتال یا موبل کیمپ لائیں۔",
    benefit: "Free vaccines, deworming and discounted semen straws.",
    benefitUrdu: "مفت ویکسین، ڈی ورمنگ اور سستی سمن اسٹارز۔",
    contact: "District Veterinary Hospital or 0800-09201",
    active: true,
  },

  // Sindh
  {
    id: "sindh-sla",
    category: "financial",
    province: "sindh",
    title: "Sindh Peoples Support Programme / Sindh Agri Loan",
    titleUrdu: "سندھ عوامی سپورٹ پروگرام / سندھ زرعی قرضہ",
    ministry: "Sindh Agriculture Department / SPPAF",
    ministryUrdu: "سندھ محکمہ زراعت / ایس پی پی اے ایف",
    summary: "Interest-free loans and input grants for small farmers, women farmers and tenant growers in Sindh.",
    summaryUrdu: "سندھ کے چھوٹے کاشتکاروں، خواتین کاشتکاروں اور ٹیننٹ کاشتکاروں کے لیے بغیر سود قرضے اور ان پٹ گرانٹ۔",
    eligibility: "Landholders up to 16 acres; CNIC; resident of Sindh; no bank defaulter.",
    eligibilityUrdu: "16 ایکڑ تک زمین کے مالک؛ شناختی کارڈ؛ سندھ کا رہائشی؛ بینک ڈیفالٹر نہ ہوں۔",
    benefit: "Rs. 25,000–100,000 input credit per acre plus free certified seed kits.",
    benefitUrdu: "ایک ایکڑ پر 25,000 سے 100,000 روپے کا ان پٹ کریڈٹ اور مفت تصدیق شدہ بیج کٹس۔",
    contact: "District Agriculture Office or Sindh Agri helpline 021-99204341",
    active: true,
  },
  {
    id: "sindh-rice-subsidy",
    category: "input",
    province: "sindh",
    title: "Sindh Rice Seed & Mechanization Subsidy",
    titleUrdu: "سندھ چاول بیج اور مشینری سبسڈی",
    ministry: "Sindh Agriculture Department",
    ministryUrdu: "سندھ محکمہ زراعت",
    summary: "Subsidised certified rice seed, zero-tillage drills and laser land levellers for rice-wheat cropping zones.",
    summaryUrdu: "چاول-گندم علاقوں کے لیے سستے تصدیق شدہ بیج، زیرو ٹیلیج ڈرلز اور لیزر لیولرز۔",
    eligibility: "Rice growers in Larkana, Sukkur, Shaheed Benazirabad and Badin districts.",
    eligibilityUrdu: "لarkana، سکھر، شہید بینظیر آباد اور بدین اضلاع کے چاول کاشتکار۔",
    benefit: "50% subsidy on machinery; 30% on certified seed.",
    benefitUrdu: "مشینری پر 50 فیصد اور تصدیق شدہ بیج پر 30 فیصد سبسڈی۔",
    contact: "Sindh Agriculture Extension Larkana/Sukkur",
    active: true,
  },

  // Khyber Pakhtunkhwa
  {
    id: "kp-tenant-support",
    category: "financial",
    province: "kpk",
    title: "KP Small Farmers & Tenant Support Programme",
    titleUrdu: "خیبر پختونخوا چھوٹے کسان اور ٹیننٹ سپورٹ پروگرام",
    ministry: "KP Agriculture Department",
    ministryUrdu: "خیبر پختونخوا محکمہ زراعت",
    summary: "Easy-term loans, subsidised inputs and crop insurance for smallholders and sharecroppers in KP.",
    summaryUrdu: "خیبر پختونخوا کے چھوٹے کاشتکاروں اور بٹائی داروں کے لیے آسان قرضے، سستے ان پٹ اور فصل انشورنس۔",
    eligibility: "Farmers with up to 5 acres in KP; tenant farmers with valid agreement.",
    eligibilityUrdu: "خیبر پختونخوا میں 5 ایکڑ تک کے کاشتکار؛ درست معاہدے والے بٹائی دار۔",
    benefit: "Subsidised seed/fertiliser and interest-free seasonal loans.",
    benefitUrdu: "سستے بیج/کھاد اور بغیر سود کے سیزنل قرضے۔",
    contact: "District Agriculture Officer or KP Agri helpline 091-9211377",
    active: true,
  },
  {
    id: "kp-olive",
    category: "crop",
    province: "kpk",
    title: "KP Olive Cultivation Promotion Project",
    titleUrdu: "خیبر پختونخوا زیتون کاشت فروغ پروجیکٹ",
    ministry: "KP Agriculture Department / Italy-Pakistan cooperation",
    ministryUrdu: "خیبر پختونخوا محکمہ زراعت / اٹلی پاکستان تعاون",
    summary: "Free olive saplings, training and buy-back arrangements for farmers in KP and newly merged districts.",
    summaryUrdu: "خیبر پختونخوا اور ضم شدہ اضلاع کے کاشتکاروں کو مفت زیتون کے پودے، تربیت اور خریداری کی ضمانت۔",
    eligibility: "Farmers with suitable sloping/barani land in target districts.",
    eligibilityUrdu: "ہدف اضلاع میں مناسب ڈھلوان یا بارانی زمین کے کاشتکار۔",
    benefit: "Free olive plants, drip irrigation kits and technical guidance.",
    benefitUrdu: "مفت زیتون کے پودے، ڈرپ.irrigation کٹس اور تکنیکی رہنمائی۔",
    contact: "Director General Agriculture Extension KP",
    active: true,
  },

  // Balochistan
  {
    id: "balochistan-orchard",
    category: "crop",
    province: "balochistan",
    title: "Balochistan Orchard Development & Water Management",
    titleUrdu: "بلوچستان باغات ترقی اور پانی کے نظام",
    ministry: "Balochistan Agriculture & Cooperatives Department",
    ministryUrdu: "بلوچستان محکمہ زراعت و تعاونیات",
    summary: "Support for high-value orchards (dates, pomegranates, grapes) with drip irrigation and solar pumps.",
    summaryUrdu: "کھجور، انار، انگور کے باغات کے لیے ڈرپ.irrigation اور سولر پمپس کی مدد۔",
    eligibility: "Farmers in Balochistan with available land and water source.",
    eligibilityUrdu: "بلوچستان کے کاشتکار جن کے پاس زمین اور پانی کا ذریعہ موجود ہو۔",
    benefit: "80% subsidy on drip irrigation material; solar pumps on easy instalments.",
    benefitUrdu: "ڈرپ.irrigation مواد پر 80 فیصد سبسڈی؛ سولر پمپس آسان اقساط پر۔",
    contact: "Director Agriculture Extension Balochistan or 081-9201644",
    active: true,
  },
  {
    id: "balochistan-livestock",
    category: "livestock",
    province: "balochistan",
    title: "Balochistan Livestock & Pasture Improvement Project",
    titleUrdu: "بلوچستان مویشی اور چراگاہ بہتری پروجیکٹ",
    ministry: "Balochistan Livestock & Dairy Development",
    ministryUrdu: "بلوچستان محکمہ لائیو اسٹاک و ڈیری ڈیولپمنٹ",
    summary: "Fodder seed distribution, breed improvement and mobile veterinary camps in pastoral areas.",
    summaryUrdu: "چراگاہی علاقوں میں چارے کے بیج، نسل بہتری اور موبائل ویٹرنری کیمپ۔",
    eligibility: "Livestock owners in designated pastoral/tehsil areas.",
    eligibilityUrdu: "مقررہ چراگاہی/تحصیل علاقوں کے مویشی مالکان۔",
    benefit: "Free fodder seed, deworming medicines and AI services.",
    benefitUrdu: "مفت چارے کے بیج، ڈی ورمنگ ادویات اور مصنوعی تولید کی سہولت۔",
    contact: "Deputy Director Livestock Quetta or 081-9202117",
    active: true,
  },

  // Gilgit-Baltistan
  {
    id: "gb-fruit-dev",
    category: "crop",
    province: "gb",
    title: "GB High-Value Fruit & Cold Chain Development",
    titleUrdu: "گلگت بلتستان قیمتی پھل اور کولڈ چین ترقی",
    ministry: "GB Agriculture & Livestock Department",
    ministryUrdu: "گلگت بلتستان محکمہ زراعت و لائیو اسٹاک",
    summary: "Certified fruit saplings, pruning tools and small cold storage units for apricot, apple and cherry growers.",
    summaryUrdu: "خوبانی، سیب اور چیری کاشتکاروں کے لیے تصدیق شدہ پودے، تراشنے کے اوزار اور چھوٹے کولڈ اسٹوریج۔",
    eligibility: "Fruit growers in Hunza, Skardu, Ghizer and Astore with minimum 0.5 acre orchard.",
    eligibilityUrdu: "ہنزہ، سکردو، غذر اور استور میں کم از کم 0.5 ایکڑ باغ کے پھل کاشتکار۔",
    benefit: "50% subsidy on saplings and cold storage units; training on post-harvest handling.",
    benefitUrdu: "پودوں اور کولڈ اسٹوریج پر 50 فیصد سبسڈی؛ فصل کٹائی کے بعد کے طریقوں کی تربیت۔",
    contact: "Director Agriculture Extension GB or 05811-920107",
    active: true,
  },

  // Azad Jammu & Kashmir
  {
    id: "ajk-agri-dev",
    category: "financial",
    province: "ajk",
    title: "AJK Agriculture Development & Rehabilitation Programme",
    titleUrdu: "آزاد کشمیر زرعی ترقی اور بحالی پروگرام",
    ministry: "AJK Agriculture Department",
    ministryUrdu: "آزاد کشمیر محکمہ زراعت",
    summary: "Input vouchers, small machinery and terracing support for maize, rice and vegetable farmers in AJK.",
    summaryUrdu: "آزاد کشمیر میں مکئی، چاول اور سبزی کاشتکاروں کے لیے ان پٹ واؤچر، چھوٹی مشینری اور دیواریاں۔",
    eligibility: "Small farmers in Muzaffarabad, Mirpur, Kotli, Poonch and Bagh districts.",
    eligibilityUrdu: "مظفرآباد، میرپور، کوٹلی، پونچھ اور باغ اضلاع کے چھوٹے کاشتکار۔",
    benefit: "Rs. 15,000–50,000 input vouchers per season and subsidised tools.",
    benefitUrdu: "فی سیزن 15,000 سے 50,000 روپے کے ان پٹ واؤچر اور سستے آلات۔",
    contact: "Director Agriculture AJK or 05822-920034",
    active: true,
  },
];

export const SCHEME_CATEGORIES: { id: SchemeCategory; label: string; labelUrdu: string }[] = [
  { id: "crop", label: "Crop Support", labelUrdu: "فصل مدد" },
  { id: "livestock", label: "Livestock", labelUrdu: "مویشی" },
  { id: "insurance", label: "Insurance", labelUrdu: "انشورنس" },
  { id: "financial", label: "Finance", labelUrdu: "مالیات" },
  { id: "input", label: "Inputs", labelUrdu: "ان پٹ" },
];

export function getSchemesByProvince(province: ProvinceId | "federal"): FarmerScheme[] {
  return FARMER_SCHEMES.filter((s) => s.province === province || s.province === "federal");
}
