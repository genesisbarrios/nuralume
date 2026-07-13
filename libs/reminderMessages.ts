import type { ReminderCategory } from "@/types/database";

export const REMINDER_CATEGORY_LABELS: Record<ReminderCategory, string> = {
  hydration: "Hydration",
  nutrition: "Nutrition",
  meditation: "Meditate",
  exercise: "Exercise",
};

const MESSAGE_POOLS: Record<ReminderCategory, string[]> = {
  hydration: [
    "Time for a glass of water.",
    "Have you had water in the last hour?",
    "Hydration check — take a sip.",
    "A little water now beats a headache later.",
    "Refill your glass and drink up.",
  ],
  nutrition: [
    "Have a piece of fruit or a healthy snack.",
    "When did you last eat something nourishing?",
    "Give your body some real fuel right now.",
    "A balanced meal will carry you further than a quick fix.",
    "Check in — are you eating enough today?",
  ],
  meditation: [
    "Take three slow, deep breaths right now.",
    "A two-minute pause can reset your whole day.",
    "Close your eyes and just notice your breath for a moment.",
    "Step away and sit with stillness for a minute.",
    "Let your shoulders drop and take a breath.",
  ],
  exercise: [
    "Stand up and stretch for a minute.",
    "A short walk could do you good right now.",
    "Move your body — even a minute counts.",
    "Roll your shoulders and neck, you've been still a while.",
    "Take the stairs, or just pace for a bit.",
  ],
};

// Four rotating windows across the day, so the message changes as the day
// goes on without needing a server-side scheduler or push notifications.
function timeBucket(date: Date): number {
  const hour = date.getHours();
  if (hour < 11) return 0; // morning
  if (hour < 15) return 1; // midday
  if (hour < 19) return 2; // afternoon
  return 3; // evening
}

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getRotatingReminderMessage(
  category: ReminderCategory,
  date: Date = new Date()
): string {
  const pool = MESSAGE_POOLS[category];
  const seed = dayOfYear(date) * 4 + timeBucket(date);
  return pool[seed % pool.length];
}
