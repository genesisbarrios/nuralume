"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import type { HoroscopeFrequency } from "@/libs/horoscope";

export interface ProfileBirthData {
  displayName: string | null;
  birthDate: string | null;
  birthTime: string | null;
  birthCity: string | null;
  birthCountryCode: string | null;
  horoscopeFrequency: HoroscopeFrequency;
}

export async function getProfileBirthData(): Promise<ProfileBirthData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "display_name, birth_date, birth_time, birth_city, birth_country_code, horoscope_frequency"
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    displayName: data?.display_name ?? null,
    birthDate: data?.birth_date ?? null,
    birthTime: data?.birth_time ?? null,
    birthCity: data?.birth_city ?? null,
    birthCountryCode: data?.birth_country_code ?? null,
    horoscopeFrequency: data?.horoscope_frequency ?? "daily",
  };
}

export async function saveBirthData(input: {
  displayName: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  birthCountryCode?: string;
  horoscopeFrequency?: HoroscopeFrequency;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({
      display_name: input.displayName,
      birth_date: input.birthDate,
      birth_time: input.birthTime || null,
      birth_city: input.birthCity || null,
      birth_country_code: input.birthCountryCode || null,
      horoscope_frequency: input.horoscopeFrequency ?? "daily",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  revalidatePath("/dashboard/astrology");
  revalidatePath("/dashboard/home");
}
