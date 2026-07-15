const SPIRITUAL_WORDS = [
  "Seraphim",
  "Archangel",
  "Cherub",
  "Guardian",
  "Oracle",
  "Mystic",
  "Buddha",
  "Bodhisattva",
  "Phoenix",
  "Celestial",
  "Astral",
  "Nirvana",
  "Sage",
  "Shaman",
  "Angel",
  "Demon",
  "Nomad",
  "Lotus",
  "Zen",
  "Starseed",
];

// Assigned once per user on their first submitted score, then stored — so
// it stays stable across sessions rather than reshuffling on every load.
export function generateLeaderboardName(): string {
  const word =
    SPIRITUAL_WORDS[Math.floor(Math.random() * SPIRITUAL_WORDS.length)];
  const number = Math.floor(Math.random() * 9000) + 100;
  return `${word}${number}`;
}
