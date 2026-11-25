// Plain-language explainers for the five brain wave bands, shown on the
// homepage brain's glass cards. Labels, ranges and colors come from
// BRAIN_WAVE_TAGS (libs/trackCategories.ts) so they match the dashboard.
export const BRAIN_WAVE_INFO: Record<string, { state: string; about: string; listen: string }> = {
  gamma: {
    state: "Peak focus & insight",
    about:
      "The fastest brain waves. Gamma activity is linked to high-level processing, learning and moments of insight, and is often strong in experienced meditators.",
    listen: "Deep work, studying, creative breakthroughs.",
  },
  beta: {
    state: "Alert & thinking",
    about:
      "Your everyday waking mind: problem-solving, conversation and concentration. Balanced beta keeps you sharp; too much can feel like stress or racing thoughts.",
    listen: "Getting things done, staying on task.",
  },
  alpha: {
    state: "Calm & present",
    about:
      "Relaxed, wakeful calm, the state you slip into when you close your eyes and breathe. Alpha bridges the conscious and subconscious mind and is linked to creativity and lower stress.",
    listen: "Meditation, unwinding, creative flow.",
  },
  theta: {
    state: "Dreamy & intuitive",
    about:
      "The twilight state between waking and sleep, present in light sleep, deep meditation and daydreams. Theta is linked to visualization, intuition and memory.",
    listen: "Visualization, deep meditation, journaling.",
  },
  delta: {
    state: "Deep rest & healing",
    about:
      "The slowest brain waves, dominant in deep, dreamless sleep, when the body restores and repairs itself.",
    listen: "Falling asleep, recovery, deep rest.",
  },
};
