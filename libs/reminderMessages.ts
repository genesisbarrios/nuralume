import type { ReminderCategory } from "@/types/database";

export const REMINDER_CATEGORY_LABELS: Record<ReminderCategory, string> = {
  hydration: "Hydration",
  nutrition: "Nutrition",
  meditation: "Meditate",
  exercise: "Exercise",
  grounding: "Grounding",
  coping_skills: "Coping Skills",
};

// Static for now — deliberately isolated behind getRotatingReminderMessage()
// below so this can later be swapped for a live API call (e.g. a daily
// prompt-generation service) without touching any caller.
const MESSAGE_POOLS: Record<ReminderCategory, string[]> = {
  hydration: [
    "Time for a glass of water.",
    "Have you had water in the last hour?",
    "Hydration check — take a sip.",
    "A little water now beats a headache later.",
    "Refill your glass and drink up.",
    "Your body runs better hydrated — top up now.",
    "Keep a glass nearby and sip through the next hour.",
    "Water first, coffee second — how are you doing today?",
    "A quick glass of water can clear the afternoon fog.",
    "Small sips, often — that's the habit worth building.",
  ],
  nutrition: [
    "Have a piece of fruit or a healthy snack.",
    "When did you last eat something nourishing?",
    "Give your body some real fuel right now.",
    "A balanced meal will carry you further than a quick fix.",
    "Check in — are you eating enough today?",
    "Reach for something whole instead of something quick.",
    "Your next meal is a chance to feel better in an hour.",
    "A handful of nuts or veggies beats running on empty.",
    "Slow down for this meal — actually taste it.",
    "Nourishment isn't optional — make time for it today.",
  ],
  meditation: [
    "Take three slow, deep breaths right now.",
    "A two-minute pause can reset your whole day.",
    "Close your eyes and just notice your breath for a moment.",
    "Step away and sit with stillness for a minute.",
    "Let your shoulders drop and take a breath.",
    "Notice five breaths, one at a time, nothing else.",
    "A quiet minute now is worth more than it feels like.",
    "Unclench your jaw, drop your shoulders, breathe.",
    "Sit still for sixty seconds — that's the whole practice.",
    "Come back to your breath, wherever your mind wandered.",
  ],
  exercise: [
    "Stand up and stretch for a minute.",
    "A short walk could do you good right now.",
    "Move your body — even a minute counts.",
    "Roll your shoulders and neck, you've been still a while.",
    "Take the stairs, or just pace for a bit.",
    "A few squats or stretches will wake your body back up.",
    "Step outside for a couple of minutes if you can.",
    "Shake out your hands and legs — get the blood moving.",
    "Your body's been asking for a break — give it one.",
    "Even standing up and pacing counts as movement.",
  ],
  grounding: [
    "Name 5 things you can see, 4 you can hear, and 3 you can feel right now.",
    "Feel your feet on the floor — notice the contact, the weight, the support.",
    "Look around and name one thing in each color you can spot.",
    "Press your palms together and notice the sensation for a few seconds.",
    "Take a moment to notice the temperature of the air around you.",
    "Notice one sound you usually tune out.",
    "Place a hand on something solid and just notice the texture.",
    "Name the room you're in and three things in it, out loud or silently.",
    "Notice where your body is touching the chair or floor right now.",
    "Take one slow breath and notice where you feel it most.",
  ],
  coping_skills: [
    "If something's weighing on you, try naming it in one sentence.",
    "A short break isn't a setback — take one if you need it.",
    "Write down one thing that's bothering you, then one thing in your control about it.",
    "Reach out to someone you trust, even just to say hi.",
    "Give yourself permission to do the next small thing, not everything.",
    "You don't have to fix everything today, just the next step.",
    "It's okay to say no to one thing on your list right now.",
    "Notice the story you're telling yourself — is it the whole truth?",
    "A hard moment isn't a hard life — this will shift.",
    "Ask yourself what you actually need right now, not what you 'should' do.",
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
