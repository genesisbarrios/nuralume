"use server";

import { getProfileBirthData } from "@/libs/profile";
import { getHoroscope, type HoroscopeResult } from "@/libs/horoscope";
import { getSunSignFromDate } from "@/libs/zodiac";

export async function getHomeHoroscope(): Promise<HoroscopeResult | null> {
  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  const sign = getSunSignFromDate(profile.birthDate);
  return getHoroscope(sign, profile.horoscopeFrequency);
}
