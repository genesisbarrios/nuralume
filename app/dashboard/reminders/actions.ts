"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import {
  getRotatingReminderMessage,
  REMINDER_CATEGORY_LABELS,
} from "@/libs/reminderMessages";
import type { ReminderCategory } from "@/types/database";

export interface ReminderWithStatus {
  id: string;
  title: string;
  isDefault: boolean;
  isDone: boolean;
  category: ReminderCategory | null;
  message: string | null;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getRemindersWithStatus(): Promise<ReminderWithStatus[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const today = todayDate();

  const [{ data: reminders }, { data: completions }] = await Promise.all([
    supabase
      .from("reminders")
      .select("id, title, is_default, category")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("reminder_completions")
      .select("reminder_id")
      .eq("user_id", user.id)
      .eq("completed_date", today),
  ]);

  const doneIds = new Set((completions ?? []).map((c) => c.reminder_id));

  return (reminders ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    isDefault: r.is_default,
    isDone: doneIds.has(r.id),
    category: r.category,
    message: r.category ? getRotatingReminderMessage(r.category) : null,
  }));
}

export async function toggleReminderCompletion(
  reminderId: string,
  isCurrentlyDone: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const today = todayDate();

  if (isCurrentlyDone) {
    await supabase
      .from("reminder_completions")
      .delete()
      .eq("user_id", user.id)
      .eq("reminder_id", reminderId)
      .eq("completed_date", today);
  } else {
    await supabase.from("reminder_completions").insert({
      user_id: user.id,
      reminder_id: reminderId,
      completed_date: today,
    });
  }

  revalidatePath("/dashboard/reminders");
  revalidatePath("/dashboard/home");
}

export async function addReminder(title: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !title.trim()) return;

  const { data: existing } = await supabase
    .from("reminders")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("reminders").insert({
    user_id: user.id,
    title: title.trim(),
    sort_order: (existing?.sort_order ?? 0) + 1,
    is_default: false,
  });

  revalidatePath("/dashboard/reminders");
}

export async function deleteReminder(reminderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/reminders");
}

// Enabling a category creates a persistent reminder row tagged with it (so it
// shows up in the daily checklist with a rotating message); disabling removes
// that row. Category reminders aren't duplicated if the row already exists.
export async function setReminderCategory(
  category: ReminderCategory,
  enabled: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("reminders")
    .select("id")
    .eq("user_id", user.id)
    .eq("category", category)
    .maybeSingle();

  if (enabled && !existing) {
    const { data: last } = await supabase
      .from("reminders")
      .select("sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    await supabase.from("reminders").insert({
      user_id: user.id,
      title: REMINDER_CATEGORY_LABELS[category],
      sort_order: (last?.sort_order ?? 0) + 1,
      is_default: false,
      category,
    });
  } else if (!enabled && existing) {
    await supabase.from("reminders").delete().eq("id", existing.id);
  }

  revalidatePath("/dashboard/reminders");
  revalidatePath("/dashboard/home");
}
