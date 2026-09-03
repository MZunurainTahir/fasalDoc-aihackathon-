/**
 * Tele-veterinary / tele-extension booking module for FasalDoc.
 * Provides a directory of registered veterinarians and extension officers
 * that farmers can book for video, audio or in-person consultations.
 */

export type ConsultationType = "video" | "audio" | "clinic" | "field_visit";
export type ExpertType = "veterinarian" | "crop_specialist" | "extension_officer";

export interface ExpertProfile {
  id: string;
  name: string;
  type: ExpertType;
  title: string;
  titleUrdu: string;
  specialties: string[];
  specialtiesUrdu: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  consultations: number;
  feePkr: number;
  availableSlots: string[];
  image?: string;
}

export const EXPERTS: ExpertProfile[] = [
  {
    id: "dr-ahmed-vet",
    name: "Dr. Ahmed Raza",
    type: "veterinarian",
    title: "Senior Livestock Veterinarian",
    titleUrdu: "سینئر مویشیات کا ویٹرنری ڈاکٹر",
    specialties: ["Mastitis", "Lumpy Skin Disease", "FMD", "Reproduction"],
    specialtiesUrdu: ["ماسٹائٹس", "لمپی سکن", "ایف ایم ڈی", "افزائش"],
    languages: ["Urdu", "English", "Punjabi"],
    experienceYears: 12,
    rating: 4.9,
    consultations: 1240,
    feePkr: 500,
    availableSlots: ["09:00 AM", "11:30 AM", "04:00 PM"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "dr-sana-crop",
    name: "Dr. Sana Khalid",
    type: "crop_specialist",
    title: "Plant Pathologist & Crop Advisor",
    titleUrdu: "پلانٹ پیتھالوجسٹ اور فصل مشیر",
    specialties: ["Wheat Rust", "Cotton Whitefly", "Tomato Blight", "IPM"],
    specialtiesUrdu: ["گندم کنگی", "کپاس سفید مکھی", "ٹماٹر جھلساؤ", "آئی پی ایم"],
    languages: ["Urdu", "English"],
    experienceYears: 8,
    rating: 4.8,
    consultations: 856,
    feePkr: 400,
    availableSlots: ["10:00 AM", "02:00 PM", "06:00 PM"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "mr-ali-extension",
    name: "Ali Hassan",
    type: "extension_officer",
    title: "Agriculture Extension Officer",
    titleUrdu: "زرعی توسیع افسر",
    specialties: ["Fertilizer Planning", "Seed Selection", "Soil Health", "Government Schemes"],
    specialtiesUrdu: ["کھاد پروگرام", "بیج منتخب کرنا", "مٹی کی صحت", "سرکاری اسکیمیں"],
    languages: ["Urdu", "Punjabi", "Saraiki"],
    experienceYears: 15,
    rating: 4.7,
    consultations: 2100,
    feePkr: 0,
    availableSlots: ["09:30 AM", "12:00 PM", "03:30 PM"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "dr-fatima-poultry",
    name: "Dr. Fatima Noor",
    type: "veterinarian",
    title: "Poultry & Layer Specialist",
    titleUrdu: "پولٹری اور انڈے دینے والے پرندوں کی ماہر",
    specialties: ["Newcastle Disease", "Coccidiosis", "Vaccination", "Feed Formulation"],
    specialtiesUrdu: ["رانی کھیت", "کوکسڈیوسس", "ویکسینیشن", "خوراک ترکیب"],
    languages: ["Urdu", "English", "Punjabi"],
    experienceYears: 6,
    rating: 4.8,
    consultations: 640,
    feePkr: 350,
    availableSlots: ["08:00 AM", "05:00 PM", "07:00 PM"],
    image: "/dr-fatima-noor.png",
  },
];

export const CONSULTATION_TYPES: { id: ConsultationType; label: string; labelUrdu: string; icon: string }[] = [
  { id: "video", label: "Video Call", labelUrdu: "ویڈیو کال", icon: "Video" },
  { id: "audio", label: "Audio Call", labelUrdu: "آڈیو کال", icon: "Phone" },
  { id: "clinic", label: "Clinic Visit", labelUrdu: "کلینک آؤٹ ریچ", icon: "MapPin" },
  { id: "field_visit", label: "Field Visit", labelUrdu: "کھیت کا دورہ", icon: "Tractor" },
];

export const EXPERT_TYPES: { id: ExpertType; label: string; labelUrdu: string }[] = [
  { id: "veterinarian", label: "Veterinarian", labelUrdu: "ویٹرنری ڈاکٹر" },
  { id: "crop_specialist", label: "Crop Specialist", labelUrdu: "فصل ماہر" },
  { id: "extension_officer", label: "Extension Officer", labelUrdu: "توسیع افسر" },
];
