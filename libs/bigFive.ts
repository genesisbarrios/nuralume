export type BigFiveTrait =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

export interface BigFiveQuestion {
  id: string;
  text: string;
  trait: BigFiveTrait;
  reverse: boolean;
}

export const BIG_FIVE_QUESTIONS: BigFiveQuestion[] = [
  { id: "o1", text: "I enjoy exploring new ideas, art, or ways of doing things.", trait: "openness", reverse: false },
  { id: "o2", text: "I have a vivid imagination.", trait: "openness", reverse: false },
  { id: "o3", text: "I prefer familiar routines over novel experiences.", trait: "openness", reverse: true },
  { id: "o4", text: "I'm curious about a wide range of topics, even ones outside my expertise.", trait: "openness", reverse: false },

  { id: "c1", text: "I keep my space and schedule well organized.", trait: "conscientiousness", reverse: false },
  { id: "c2", text: "I follow through on plans, even when motivation fades.", trait: "conscientiousness", reverse: false },
  { id: "c3", text: "I often leave things until the last minute.", trait: "conscientiousness", reverse: true },
  { id: "c4", text: "I pay close attention to detail and rarely make careless mistakes.", trait: "conscientiousness", reverse: false },

  { id: "e1", text: "I feel comfortable being the center of attention.", trait: "extraversion", reverse: false },
  { id: "e2", text: "I gain energy from being around other people.", trait: "extraversion", reverse: false },
  { id: "e3", text: "I tend to hang back in social situations rather than take the lead.", trait: "extraversion", reverse: true },
  { id: "e4", text: "I find it easy to introduce myself to new people.", trait: "extraversion", reverse: false },

  { id: "a1", text: "I go out of my way to help others, even at some cost to myself.", trait: "agreeableness", reverse: false },
  { id: "a2", text: "I generally assume good intentions in other people.", trait: "agreeableness", reverse: false },
  { id: "a3", text: "I can be blunt or critical without much concern for how it lands.", trait: "agreeableness", reverse: true },
  { id: "a4", text: "I find it easy to sympathize with people who see things differently than I do.", trait: "agreeableness", reverse: false },

  { id: "n1", text: "I worry about things more than I'd like to.", trait: "neuroticism", reverse: false },
  { id: "n2", text: "My mood can shift quickly when things don't go as planned.", trait: "neuroticism", reverse: false },
  { id: "n3", text: "I generally stay calm and level-headed under pressure.", trait: "neuroticism", reverse: true },
  { id: "n4", text: "Small setbacks can stick with me longer than they probably should.", trait: "neuroticism", reverse: false },
];

export const TRAIT_LABELS: Record<BigFiveTrait, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Neuroticism",
};

const TRAIT_DESCRIPTIONS: Record<BigFiveTrait, { low: string; mid: string; high: string }> = {
  openness: {
    low: "You lean practical and prefer the tried-and-true over novelty for its own sake.",
    mid: "You balance curiosity with practicality, open to new ideas without chasing every one.",
    high: "You're drawn to new ideas, art, and experiences, and enjoy exploring the abstract.",
  },
  conscientiousness: {
    low: "You favor flexibility and spontaneity over rigid plans and schedules.",
    mid: "You're organized when it counts, without being rigid about it.",
    high: "You're disciplined, detail-oriented, and reliably follow through on commitments.",
  },
  extraversion: {
    low: "You recharge through solitude and prefer smaller, deeper interactions.",
    mid: "You're comfortable in social settings but equally value your own space.",
    high: "You draw energy from people and gravitate toward social, high-stimulation settings.",
  },
  agreeableness: {
    low: "You value honesty and directness over smoothing things over.",
    mid: "You balance cooperation with healthy assertiveness.",
    high: "You're warm, cooperative, and quick to consider others' feelings.",
  },
  neuroticism: {
    low: "You tend to stay even-keeled and recover quickly from setbacks.",
    mid: "You experience stress like most people, without it overwhelming you.",
    high: "You feel emotions intensely and may be more sensitive to stress than most.",
  },
};

export type BigFiveLevel = "low" | "mid" | "high";

export interface BigFiveTraitResult {
  trait: BigFiveTrait;
  score: number; // 1-5 average
  level: BigFiveLevel;
  description: string;
}

export interface BigFiveResult {
  traits: BigFiveTraitResult[];
  source: "local";
}

function levelFor(score: number): BigFiveLevel {
  if (score < 2.34) return "low";
  if (score < 3.67) return "mid";
  return "high";
}

export function scoreBigFive(answers: Record<string, number>): BigFiveResult {
  const traits: BigFiveTrait[] = [
    "openness",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "neuroticism",
  ];

  const results: BigFiveTraitResult[] = traits.map((trait) => {
    const questions = BIG_FIVE_QUESTIONS.filter((q) => q.trait === trait);
    const values = questions.map((q) => {
      const raw = answers[q.id] ?? 3;
      return q.reverse ? 6 - raw : raw;
    });
    const score = values.reduce((sum, v) => sum + v, 0) / values.length;
    const level = levelFor(score);

    return {
      trait,
      score: Math.round(score * 100) / 100,
      level,
      description: TRAIT_DESCRIPTIONS[trait][level],
    };
  });

  return { traits: results, source: "local" };
}
