/**
 * Mirrors the keys of REMEDY_DATABASE in the frontend (src/lib/remedyData.ts).
 * Kept as a plain list here (not the full data) so the backend can ask the
 * model to pick the closest match without duplicating the whole remedy
 * database server-side. The frontend is the source of truth for remedy text.
 */
export const REMEDY_KEYS = [
  "Tomato___Early_blight",
  "Tomato___Late_blight",
  "Wheat___Leaf_rust",
  "Cotton___Bacterial_blight",
  "Rice___Blast",
  "Potato___Late_Blight",
  "Livestock___Foot_and_Mouth",
  "Livestock___Bovine_Mastitis",
  "Livestock___Lumpy_Skin",
];

export const CROP_KEYS = REMEDY_KEYS.filter((k) => !k.startsWith("Livestock"));
export const LIVESTOCK_KEYS = REMEDY_KEYS.filter((k) => k.startsWith("Livestock"));
