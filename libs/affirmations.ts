export interface Affirmation {
  id: string;
  text: string;
}

const AFFIRMATION_TEXTS = [
  "I am exactly where I need to be right now.",
  "My mind is calm, and my heart is open.",
  "I trust the timing of my life.",
  "I release what I cannot control.",
  "I am worthy of rest and gentleness.",
  "Every breath brings me back to center.",
  "I choose peace over perfection.",
  "I am grounded, safe, and supported.",
  "My feelings are valid, and I honor them.",
  "I am allowed to grow at my own pace.",
  "I attract calm, clarity, and ease.",
  "Today, I meet myself with compassion.",
  "I am learning to trust my own voice.",
  "I let go of yesterday and welcome today.",
  "My body deserves kindness, not criticism.",
  "I am capable of handling whatever comes my way.",
  "I choose thoughts that nourish me.",
  "I am enough, exactly as I am.",
  "I give myself permission to slow down.",
  "I am open to receiving good things.",
  "My energy is precious, and I protect it.",
  "I am becoming more myself every day.",
  "I forgive myself for what I didn't know then.",
  "I am guided, even when the path is unclear.",
  "I choose progress over pressure.",
  "I am at peace with my past.",
  "My presence is a gift to the people around me.",
  "I welcome stillness without guilt.",
  "I am rooted, like a tree that bends but does not break.",
  "I trust my intuition to lead me well.",
  "I am worthy of love, especially my own.",
  "I release the need to control every outcome.",
  "I am gentle with myself as I would be with a friend.",
  "I am allowed to change my mind and my path.",
  "I honor the season of life I am in.",
  "I am not behind — I am on my own timeline.",
  "My breath is my anchor in every storm.",
  "I choose to see challenges as invitations to grow.",
  "I am surrounded by more support than I realize.",
  "I let go of comparison and return to myself.",
  "I am proud of how far I've come.",
  "I create space for joy in my everyday life.",
  "I trust that healing is not linear, and that's okay.",
  "I am safe to feel everything I feel.",
  "I choose curiosity over judgment, especially toward myself.",
  "I am worthy of the same grace I offer others.",
  "My worth is not defined by my productivity.",
  "I am learning, unlearning, and growing — all at once.",
  "I welcome abundance in all its forms.",
  "I am becoming a safe place for myself.",
];

export const AFFIRMATIONS: Affirmation[] = AFFIRMATION_TEXTS.map(
  (text, index) => ({
    id: `aff-${String(index + 1).padStart(3, "0")}`,
    text,
  })
);

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getDailyAffirmation(date: Date = new Date()): Affirmation {
  const index = dayOfYear(date) % AFFIRMATIONS.length;
  return AFFIRMATIONS[index];
}

export function getRandomAffirmation(excludeId?: string): Affirmation {
  const pool = excludeId
    ? AFFIRMATIONS.filter((a) => a.id !== excludeId)
    : AFFIRMATIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}
