"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { scoreMbti, type MbtiResult } from "@/libs/mbti";
import { scoreBigFive, type BigFiveResult } from "@/libs/bigFive";
import { scoreArchetype, type ArchetypeResult } from "@/libs/archetype";
import type { PersonalityTestType } from "@/types/database";

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
  if (!user) throw new Error("You must be signed in to save results.");

  const { error } = await supabase.from("personality_results").upsert(
    {
      user_id: user.id,
      test_type: testType,
      result,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,test_type" }
  );

  if (error) {
    console.error(`[personality:${testType}] save failed:`, error);
    throw new Error(error.message);
  }
}

export async function getSavedMbti(): Promise<MbtiResult | null> {
  const saved = await getSavedResult("mbti");
  return saved as unknown as MbtiResult | null;
}

export async function submitMbtiQuiz(
  answers: Record<string, number>
): Promise<MbtiResult> {
  const result = scoreMbti(answers);
  await saveResult("mbti", result as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/personality");
  return result;
}

export async function getSavedBigFive(): Promise<BigFiveResult | null> {
  const saved = await getSavedResult("big_five");
  return saved as unknown as BigFiveResult | null;
}

export async function submitBigFiveQuiz(
  answers: Record<string, number>
): Promise<BigFiveResult> {
  const result = scoreBigFive(answers);
  await saveResult("big_five", result as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/personality");
  return result;
}

export async function getSavedArchetype(): Promise<ArchetypeResult | null> {
  const saved = await getSavedResult("archetype");
  return saved as unknown as ArchetypeResult | null;
}

export async function submitArchetypeQuiz(
  answers: Record<string, number>
): Promise<ArchetypeResult> {
  const result = scoreArchetype(answers);
  await saveResult("archetype", result as unknown as Record<string, unknown>);
  revalidatePath("/dashboard/personality");
  return result;
}
