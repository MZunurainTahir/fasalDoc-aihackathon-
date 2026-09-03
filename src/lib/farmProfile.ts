/**
 * Lightweight persisted farm profile (selected city/location).
 * Uses localStorage for simplicity; falls back to defaults in SSR/tests.
 */

import type { City, ProvinceId } from "./pakistanLocations";
import { DEFAULT_CITY, getCityById, PAKISTAN_CITIES } from "./pakistanLocations";

const STORAGE_KEY = "fasaldoc_farm_location";

export interface FarmLocation {
  cityId: string;
  provinceId: ProvinceId;
  detectedAt?: string;
}

function safeStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function getStoredLocation(): FarmLocation {
  const storage = safeStorage();
  if (!storage) return { cityId: DEFAULT_CITY.id, provinceId: DEFAULT_CITY.province };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { cityId: DEFAULT_CITY.id, provinceId: DEFAULT_CITY.province };
    const parsed = JSON.parse(raw) as FarmLocation;
    const city = getCityById(parsed.cityId);
    if (!city) return { cityId: DEFAULT_CITY.id, provinceId: DEFAULT_CITY.province };
    return { cityId: city.id, provinceId: city.province };
  } catch {
    return { cityId: DEFAULT_CITY.id, provinceId: DEFAULT_CITY.province };
  }
}

export function storeLocation(location: FarmLocation): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // ignore quota errors
  }
}

export function getSelectedCity(): City {
  const loc = getStoredLocation();
  return getCityById(loc.cityId) ?? DEFAULT_CITY;
}

export function setSelectedCity(city: City): void {
  storeLocation({ cityId: city.id, provinceId: city.province, detectedAt: new Date().toISOString() });
}

export function getProvinceCities(provinceId: ProvinceId): City[] {
  return PAKISTAN_CITIES.filter((c) => c.province === provinceId);
}
