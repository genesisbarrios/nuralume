"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { generateLeaderboardName } from "@/libs/leaderboardName";

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

export interface LeaderboardData {
  top: LeaderboardEntry[];
  self: (LeaderboardEntry & { rank: number }) | null;
}

const LEADERBOARD_SIZE = 10;

export async function getSeraphimLeaderboard(): Promise<LeaderboardData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: top } = await supabase
    .from("seraphim_scores")
    .select("user_id, leaderboard_name, score")
    .order("score", { ascending: false })
    .limit(LEADERBOARD_SIZE);

  const topEntries: LeaderboardEntry[] = (top ?? []).map((r) => ({
    userId: r.user_id,
    name: r.leaderboard_name,
    score: r.score,
  }));

  if (!user) {
    return { top: topEntries, self: null };
  }

  const inTopIndex = topEntries.findIndex((e) => e.userId === user.id);
  if (inTopIndex !== -1) {
    return {
      top: topEntries,
      self: { ...topEntries[inTopIndex], rank: inTopIndex + 1 },
    };
  }

  const { data: selfRow } = await supabase
    .from("seraphim_scores")
    .select("user_id, leaderboard_name, score")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!selfRow) {
    return { top: topEntries, self: null };
  }

  const { count } = await supabase
    .from("seraphim_scores")
    .select("*", { count: "exact", head: true })
    .gt("score", selfRow.score);

  return {
    top: topEntries,
    self: {
      userId: selfRow.user_id,
      name: selfRow.leaderboard_name,
      score: selfRow.score,
      rank: (count ?? 0) + 1,
    },
  };
}

export async function submitSeraphimScore(score: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !Number.isFinite(score) || score <= 0) return;

  const { data: existing } = await supabase
    .from("seraphim_scores")
    .select("score")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("seraphim_scores").insert({
      user_id: user.id,
      leaderboard_name: generateLeaderboardName(),
      score,
    });
  } else if (score > existing.score) {
    await supabase
      .from("seraphim_scores")
      .update({ score, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
  }

  revalidatePath("/dashboard/games");
}
