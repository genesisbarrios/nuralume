"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import type { Affirmation } from "@/libs/affirmations";

export async function toggleFavoriteAffirmation(affirmation: Affirmation) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("affirmation_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("affirmation_id", affirmation.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("affirmation_favorites")
      .delete()
      .eq("id", existing.id);
  } else {
    await supabase.from("affirmation_favorites").insert({
      user_id: user.id,
      affirmation_id: affirmation.id,
      affirmation_text: affirmation.text,
    });
  }

  revalidatePath("/dashboard/affirmations");
  revalidatePath("/dashboard/home");
}

export async function getFavoriteAffirmationIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("affirmation_favorites")
    .select("affirmation_id")
    .eq("user_id", user.id);

  return (data ?? []).map((row) => row.affirmation_id);
}

export async function getFavoriteAffirmations() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("affirmation_favorites")
    .select("affirmation_id, affirmation_text, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}
