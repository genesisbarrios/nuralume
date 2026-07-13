"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { getNumerologyProfile, type NumerologyProfile } from "@/libs/numerology";
import { getBirthChart, type AstrologyResult } from "@/libs/astrology";
import {
  getHoroscope,
  type HoroscopeFrequency,
  type HoroscopeResult,
} from "@/libs/horoscope";
import { getProfileBirthData, saveBirthData } from "@/libs/profile";
import type { PersonalityTestType } from "@/types/database";

export { getProfileBirthData, saveBirthData };
export type { ProfileBirthData } from "@/libs/profile";

export type HoroscopeBundle = Record<HoroscopeFrequency, HoroscopeResult>;

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
  revalidatePath("/dashboard/home");
  return result;
}

function isSameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

// Generated from the user's actual transits (see libs/horoscope.ts), so it's
// genuinely daily — cached per calendar day (UTC) rather than indefinitely,
// and recomputed automatically once that day rolls over, on top of the
// existing explicit-refresh / birth-data-edit triggers.
export async function getOrComputeHoroscope(
  forceRefresh = false
): Promise<HoroscopeBundle | null> {
  if (!forceRefresh) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("personality_results")
        .select("result, updated_at")
        .eq("user_id", user.id)
        .eq("test_type", "horoscope")
        .maybeSingle();

      if (data?.result && isSameUtcDay(new Date(data.updated_at), new Date())) {
        return data.result as unknown as HoroscopeBundle;
      }
    }
  }

  const profile = await getProfileBirthData();
  if (!profile?.birthDate) return null;

  const birthInput = {
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    city: profile.birthCity,
    countryCode: profile.birthCountryCode,
  };
  const [daily, weekly] = await Promise.all([
    getHoroscope(birthInput, "daily"),
    getHoroscope(birthInput, "weekly"),
  ]);

  const bundle: HoroscopeBundle = { daily, weekly };
  await saveResult("horoscope", bundle as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/astrology");
  revalidatePath("/dashboard/home");
  return bundle;
}
