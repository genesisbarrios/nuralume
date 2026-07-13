"use server";

import { getProfileBirthData } from "@/libs/profile";
import type { HoroscopeResult } from "@/libs/horoscope";
import { getOrComputeHoroscope } from "@/app/dashboard/astrology/actions";

// Reads the same cached bundle the Astrology tab populates — no separate API
// call happens here, keeping this in line with "only call the API on save".
export async function getHomeHoroscope(): Promise<HoroscopeResult | null> {
  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  const bundle = await getOrComputeHoroscope();
  if (!bundle) return null;

  return bundle[profile.horoscopeFrequency];
}
