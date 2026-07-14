"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
// Narrower than libs/horoscope's HoroscopeFrequency (which also allows
// "monthly" for browsing in the Astrology tab) — the profiles table's
// horoscope_frequency column only supports daily/weekly for the Home page.
export type HomeHoroscopeFrequency = "daily" | "weekly";

export interface ProfileBirthData {
  email: string | null;
  displayName: string | null;
  birthDate: string | null;
  birthTime: string | null;
  birthCity: string | null;
  birthCountryCode: string | null;
  horoscopeFrequency: HomeHoroscopeFrequency;
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
      "email, display_name, birth_date, birth_time, birth_city, birth_country_code, horoscope_frequency"
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: data?.email ?? user.email ?? null,
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
  horoscopeFrequency?: HomeHoroscopeFrequency;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to save your details.");

  // Upsert (not update) so this self-heals if the auto-provisioning trigger
  // never created a profiles row for this user; .select() + checking for a
  // returned row matters because RLS silently matches zero rows on a
  // mismatched auth.uid() instead of raising an error.
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: input.displayName,
        birth_date: input.birthDate,
        birth_time: input.birthTime || null,
        birth_city: input.birthCity || null,
        birth_country_code: input.birthCountryCode || null,
        horoscope_frequency: input.horoscopeFrequency ?? "daily",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("[saveBirthData] failed:", error);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error(
      "Save didn't apply — try signing out and back in, then retry."
    );
  }

  revalidatePath("/dashboard/astrology");
  revalidatePath("/dashboard/home");
}
