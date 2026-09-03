/**
 * Pakistan provincial and city data for location-aware features
 * (weather, mandi rates, schemes, helplines).
 */

export interface City {
  id: string;
  nameEn: string;
  nameUr: string;
  province: ProvinceId;
  lat: number;
  lon: number;
  majorMandi?: string;
}

export type ProvinceId = "punjab" | "sindh" | "kpk" | "balochistan" | "gb" | "ajk";

export interface Province {
  id: ProvinceId;
  nameEn: string;
  nameUr: string;
  capital: string;
  majorCrops: string[];
  majorCropsUr: string[];
  majorLivestock: string[];
  majorLivestockUr: string[];
}

export const PROVINCES: Province[] = [
  {
    id: "punjab",
    nameEn: "Punjab",
    nameUr: "پنجاب",
    capital: "Lahore",
    majorCrops: ["Wheat", "Cotton", "Rice", "Sugarcane", "Maize"],
    majorCropsUr: ["گندم", "کپاس", "چاول", "گنا", "مکئی"],
    majorLivestock: ["Cattle", "Buffalo", "Poultry"],
    majorLivestockUr: ["گائے", "بھینس", "پولٹری"],
  },
  {
    id: "sindh",
    nameEn: "Sindh",
    nameUr: "سندھ",
    capital: "Karachi",
    majorCrops: ["Rice", "Cotton", "Sugarcane", "Wheat", "Dates"],
    majorCropsUr: ["چاول", "کپاس", "گنا", "گندم", "کھجور"],
    majorLivestock: ["Cattle", "Camel", "Poultry"],
    majorLivestockUr: ["گائے", "اونٹ", "پولٹری"],
  },
  {
    id: "kpk",
    nameEn: "Khyber Pakhtunkhwa",
    nameUr: "خیبر پختونخوا",
    capital: "Peshawar",
    majorCrops: ["Wheat", "Maize", "Tobacco", "Fruits", "Vegetables"],
    majorCropsUr: ["گندم", "مکئی", "تمباکو", "پھل", "سبزیاں"],
    majorLivestock: ["Cattle", "Sheep", "Goat"],
    majorLivestockUr: ["گائے", "بھیڑ", "بکری"],
  },
  {
    id: "balochistan",
    nameEn: "Balochistan",
    nameUr: "بلوچستان",
    capital: "Quetta",
    majorCrops: ["Wheat", "Dates", "Fruits", "Livestock Fodder"],
    majorCropsUr: ["گندم", "کھجور", "پھل", "چارہ"],
    majorLivestock: ["Sheep", "Goat", "Camel"],
    majorLivestockUr: ["بھیڑ", "بکری", "اونٹ"],
  },
  {
    id: "gb",
    nameEn: "Gilgit-Baltistan",
    nameUr: "گلگت بلتستان",
    capital: "Gilgit",
    majorCrops: ["Wheat", "Potatoes", "Apricots", "Apples"],
    majorCropsUr: ["گندم", "آلو", "خوبانی", "سیب"],
    majorLivestock: ["Yak", "Sheep", "Goat"],
    majorLivestockUr: ["یاک", "بھیڑ", "بکری"],
  },
  {
    id: "ajk",
    nameEn: "Azad Jammu & Kashmir",
    nameUr: "آزاد جموں و کشمیر",
    capital: "Muzaffarabad",
    majorCrops: ["Maize", "Rice", "Walnuts", "Apples"],
    majorCropsUr: ["مکئی", "چاول", "اخروٹ", "سیب"],
    majorLivestock: ["Cattle", "Goat", "Sheep"],
    majorLivestockUr: ["گائے", "بکری", "بھیڑ"],
  },
];

export const PAKISTAN_CITIES: City[] = [
  // Punjab
  { id: "lahore", nameEn: "Lahore", nameUr: "لاہور", province: "punjab", lat: 31.5204, lon: 74.3587, majorMandi: "Lahore Sabzi Mandi" },
  { id: "faisalabad", nameEn: "Faisalabad", nameUr: "فیصل آباد", province: "punjab", lat: 31.418, lon: 73.079, majorMandi: "Faisalabad Grain Market" },
  { id: "multan", nameEn: "Multan", nameUr: "ملتان", province: "punjab", lat: 30.1575, lon: 71.5249, majorMandi: "Multan Fruit & Vegetable Market" },
  { id: "bahawalpur", nameEn: "Bahawalpur", nameUr: "بہاولپور", province: "punjab", lat: 29.3544, lon: 71.6911, majorMandi: "Bahawalpur Cotton Market" },
  { id: "gujranwala", nameEn: "Gujranwala", nameUr: "گوجرانوالہ", province: "punjab", lat: 32.1617, lon: 74.1883, majorMandi: "Gujranwala Grain Market" },
  { id: "sahiwal", nameEn: "Sahiwal", nameUr: "ساہیوال", province: "punjab", lat: 30.6709, lon: 73.6402, majorMandi: "Sahiwal Grain Market" },
  { id: "sargodha", nameEn: "Sargodha", nameUr: "سرگودھا", province: "punjab", lat: 32.0836, lon: 72.6711, majorMandi: "Sargodha Fruit Market" },
  { id: "rawalpindi", nameEn: "Rawalpindi", nameUr: "راولپنڈی", province: "punjab", lat: 33.5651, lon: 73.0169, majorMandi: "Rawalpindi Sabzi Mandi" },
  { id: "dgkhan", nameEn: "Dera Ghazi Khan", nameUr: "ڈیرہ غازی خان", province: "punjab", lat: 30.032, lon: 70.6404, majorMandi: "D.G. Khan Grain Market" },

  // Sindh
  { id: "karachi", nameEn: "Karachi", nameUr: "کراچی", province: "sindh", lat: 24.8607, lon: 67.0011, majorMandi: "Karachi Sabzi Mandi" },
  { id: "hyderabad", nameEn: "Hyderabad", nameUr: "حیدرآباد", province: "sindh", lat: 25.396, lon: 68.3578, majorMandi: "Hyderabad Grain Market" },
  { id: "sukkur", nameEn: "Sukkur", nameUr: "سکھر", province: "sindh", lat: 27.7139, lon: 68.8574, majorMandi: "Sukkur Fruit Market" },
  { id: "nawabshah", nameEn: "Nawabshah", nameUr: "نوابشاہ", province: "sindh", lat: 26.2442, lon: 68.41, majorMandi: "Nawabshah Cotton Market" },
  { id: "larkana", nameEn: "Larkana", nameUr: "لاڑکانہ", province: "sindh", lat: 27.5589, lon: 68.212, majorMandi: "Larkana Grain Market" },
  { id: "mirpurkhas", nameEn: "Mirpur Khas", nameUr: "میرپورخاص", province: "sindh", lat: 25.5251, lon: 69.0158, majorMandi: "Mirpur Khas Mango Market" },

  // KPK
  { id: "peshawar", nameEn: "Peshawar", nameUr: "پشاور", province: "kpk", lat: 34.0151, lon: 71.5249, majorMandi: "Peshawar Fruit Mandi" },
  { id: "mardan", nameEn: "Mardan", nameUr: "مردان", province: "kpk", lat: 34.1983, lon: 72.0402, majorMandi: "Mardan Grain Market" },
  { id: "swat", nameEn: "Mingora (Swat)", nameUr: "مینگورہ، سوات", province: "kpk", lat: 34.7717, lon: 72.36, majorMandi: "Swat Fruit Market" },
  { id: "abbottabad", nameEn: "Abbottabad", nameUr: "ایبٹ آباد", province: "kpk", lat: 34.1688, lon: 73.2215, majorMandi: "Abbottabad Vegetable Market" },
  { id: "dikhan", nameEn: "Dera Ismail Khan", nameUr: "ڈیرہ اسماعیل خان", province: "kpk", lat: 31.8313, lon: 70.901, majorMandi: "D.I. Khan Grain Market" },

  // Balochistan
  { id: "quetta", nameEn: "Quetta", nameUr: "کوئٹہ", province: "balochistan", lat: 30.1798, lon: 66.975, majorMandi: "Quetta Sabzi Mandi" },
  { id: "gwadar", nameEn: "Gwadar", nameUr: "گوادر", province: "balochistan", lat: 25.1264, lon: 62.3226, majorMandi: "Gwadar Fish & Veg Market" },
  { id: "sibi", nameEn: "Sibi", nameUr: "سبی", province: "balochistan", lat: 29.543, lon: 67.8773, majorMandi: "Sibi Livestock Market" },
  { id: "loralai", nameEn: "Loralai", nameUr: "لورالائی", province: "balochistan", lat: 30.3709, lon: 68.5979, majorMandi: "Loralai Grain Market" },
  { id: "khuzdar", nameEn: "Khuzdar", nameUr: "خضدار", province: "balochistan", lat: 27.8119, lon: 66.6106, majorMandi: "Khuzdar Fruit Market" },

  // Gilgit-Baltistan
  { id: "gilgit", nameEn: "Gilgit", nameUr: "گلگت", province: "gb", lat: 35.918, lon: 74.3133, majorMandi: "Gilgit Fruit Market" },
  { id: "skardu", nameEn: "Skardu", nameUr: "سکردو", province: "gb", lat: 35.2971, lon: 75.6333, majorMandi: "Skardu Apricot Market" },
  { id: "hunza", nameEn: "Hunza", nameUr: "ہنزہ", province: "gb", lat: 36.3167, lon: 74.65, majorMandi: "Hunza Dry Fruit Market" },

  // AJK
  { id: "muzaffarabad", nameEn: "Muzaffarabad", nameUr: "مظفرآباد", province: "ajk", lat: 34.3597, lon: 73.471, majorMandi: "Muzaffarabad Vegetable Market" },
  { id: "mirpur", nameEn: "Mirpur", nameUr: "میرپور", province: "ajk", lat: 33.1416, lon: 73.7481, majorMandi: "Mirpur Grain Market" },
  { id: "rawalakot", nameEn: "Rawalakot", nameUr: "راولاکوٹ", province: "ajk", lat: 33.8578, lon: 73.7609, majorMandi: "Rawalakot Fruit Market" },
];

export function getCitiesByProvince(provinceId: ProvinceId): City[] {
  return PAKISTAN_CITIES.filter((c) => c.province === provinceId);
}

export function getProvinceById(id: ProvinceId): Province | undefined {
  return PROVINCES.find((p) => p.id === id);
}

export function getCityById(id: string): City | undefined {
  return PAKISTAN_CITIES.find((c) => c.id === id);
}

export const DEFAULT_CITY: City = PAKISTAN_CITIES[0];
