"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { getNumerologyProfile, type NumerologyProfile } from "@/libs/numerology";
import { getBirthChart, type AstrologyResult } from "@/libs/astrology";
import { getWellnessInsight, type WellnessInsightResult } from "@/libs/wellnessInsights";
import {
  getAstrocartographyHighlights,
  type AstrocartographyResult,
} from "@/libs/astrocartography";
import { getHoroscope, type HoroscopeResult } from "@/libs/horoscope";
import { getSunSignFromDate } from "@/libs/zodiac";
import { getHumanDesignChart, type HumanDesignResult } from "@/libs/humanDesign";
import { getProfileBirthData, saveBirthData } from "@/libs/profile";
import type { PersonalityTestType } from "@/types/database";

export { getProfileBirthData, saveBirthData };
export type { ProfileBirthData } from "@/libs/profile";

async function getSavedResult(testType: PersonalityTestType) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("personality_results")
    .select("result")
    .eq("user_id", user.id)
    .eq("test_type", testType)
    .maybeSingle();

  return data?.result ?? null;
}

async function saveResult(
  testType: PersonalityTestType,
  result: Record<string, unknown>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("personality_results").upsert(
    {
      user_id: user.id,
      test_type: testType,
      result,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,test_type" }
  );
}

export async function getOrComputeNumerology(
  forceRefresh = false
): Promise<NumerologyProfile | null> {
  if (!forceRefresh) {
    const saved = await getSavedResult("numerology");
    if (saved) return saved as unknown as NumerologyProfile;
  }

  const profile = await getProfileBirthData();
  if (!profile?.displayName || !profile?.birthDate) return null;

  const result = getNumerologyProfile(profile.displayName, profile.birthDate);
  await saveResult("numerology", result as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/astrology");
  return result;
}

export async function getOrComputeBirthChart(
  forceRefresh = false
): Promise<AstrologyResult | null> {
  if (!forceRefresh) {
    const saved = await getSavedResult("astrology");
    if (saved) return saved as unknown as AstrologyResult;
  }

  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  const result = await getBirthChart({
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    city: profile.birthCity,
    countryCode: profile.birthCountryCode,
  });
  await saveResult("astrology", result as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/astrology");
  return result;
}

// Wellness insight and astrocartography are cheap, birth-data-derived reads —
// not persisted to personality_results, computed fresh each visit (same
// pattern as horoscope).
export async function getWellnessForProfile(): Promise<WellnessInsightResult | null> {
  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  return getWellnessInsight({
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    city: profile.birthCity,
    countryCode: profile.birthCountryCode,
  });
}

export async function getAstrocartographyForProfile(): Promise<AstrocartographyResult | null> {
  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  return getAstrocartographyHighlights({
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    city: profile.birthCity,
    countryCode: profile.birthCountryCode,
  });
}

// Always daily, independent of the home page's horoscope_frequency setting.
export async function getHoroscopeForProfile(): Promise<HoroscopeResult | null> {
  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  const sign = getSunSignFromDate(profile.birthDate);
  return getHoroscope(sign, "daily");
}

// Human Design has no verified provider yet (always fallback — see
// libs/humanDesign.ts), so this doesn't gate on birth data being present,
// just uses it if available.
export async function getOrComputeHumanDesign(
  forceRefresh = false
): Promise<HumanDesignResult> {
  if (!forceRefresh) {
    const saved = await getSavedResult("human_design");
    if (saved) return saved as unknown as HumanDesignResult;
  }

  const profile = await getProfileBirthData();
  const result = await getHumanDesignChart({
    birthDate: profile?.birthDate ?? "",
    birthTime: profile?.birthTime,
    city: profile?.birthCity,
    countryCode: profile?.birthCountryCode,
  });
  await saveResult("human_design", result as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/astrology");
  return result;
}
