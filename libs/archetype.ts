export type Archetype =
  | "innocent"
  | "everyman"
  | "hero"
  | "caregiver"
  | "explorer"
  | "rebel"
  | "lover"
  | "creator"
  | "jester"
  | "sage"
  | "magician"
  | "ruler";

export interface ArchetypeQuestion {
  id: string;
  text: string;
  archetype: Archetype;
}

export const ARCHETYPE_QUESTIONS: ArchetypeQuestion[] = [
  { id: "in1", text: "I try to see the good in people and situations.", archetype: "innocent" },
  { id: "in2", text: "I'd rather stay hopeful than dwell on what could go wrong.", archetype: "innocent" },
  { id: "ev1", text: "I feel most comfortable being one of the group, not standing out.", archetype: "everyman" },
  { id: "ev2", text: "I value being down-to-earth and relatable over being impressive.", archetype: "everyman" },
  { id: "he1", text: "I rise to a challenge, especially when others are counting on me.", archetype: "hero" },
  { id: "he2", text: "Proving I can overcome something difficult matters a lot to me.", archetype: "hero" },
  { id: "ca1", text: "Taking care of the people around me comes naturally to me.", archetype: "caregiver" },
  { id: "ca2", text: "I often put others' needs ahead of my own.", archetype: "caregiver" },
  { id: "ex1", text: "I get restless if I stay in the same place or routine too long.", archetype: "explorer" },
  { id: "ex2", text: "I'd rather chart my own path than follow someone else's map.", archetype: "explorer" },
  { id: "re1", text: "I question rules that don't make sense to me, even unpopular ones.", archetype: "rebel" },
  { id: "re2", text: "I'm drawn to shaking things up rather than preserving the status quo.", archetype: "rebel" },
  { id: "lo1", text: "Deep connection and intimacy with others matter more to me than almost anything.", archetype: "lover" },
  { id: "lo2", text: "I notice and appreciate beauty in everyday things.", archetype: "lover" },
  { id: "cr1", text: "I feel most alive when I'm making or building something new.", archetype: "creator" },
  { id: "cr2", text: "Self-expression is one of the most important things to me.", archetype: "creator" },
  { id: "je1", text: "I use humor to lighten the mood, even in serious moments.", archetype: "jester" },
  { id: "je2", text: "I'd rather enjoy the present moment than worry about the future.", archetype: "jester" },
  { id: "sa1", text: "I want to understand how and why things work before I act.", archetype: "sage" },
  { id: "sa2", text: "People come to me for careful, well-reasoned advice.", archetype: "sage" },
  { id: "ma1", text: "I believe in my ability to turn ideas into reality.", archetype: "magician" },
  { id: "ma2", text: "I'm drawn to transformation — helping myself or others change fundamentally.", archetype: "magician" },
  { id: "ru1", text: "I like being in charge and creating order out of chaos.", archetype: "ruler" },
  { id: "ru2", text: "I naturally take responsibility for outcomes when a group needs direction.", archetype: "ruler" },
];

export interface ArchetypeInfo {
  name: string;
  description: string;
}

export const ARCHETYPE_INFO: Record<Archetype, ArchetypeInfo> = {
  innocent: { name: "The Innocent", description: "Optimistic and trusting, you seek happiness and do things the right way — your faith in good outcomes is genuine, not naive." },
  everyman: { name: "The Everyman", description: "Down-to-earth and empathetic, you value belonging and connection over standing out — people trust you because you're real." },
  hero: { name: "The Hero", description: "Courageous and driven, you prove your worth by rising to difficult challenges and following through when it counts." },
  caregiver: { name: "The Caregiver", description: "Compassionate and generous, you find meaning in protecting and supporting the people around you." },
  explorer: { name: "The Explorer", description: "Independent and restless, you're happiest discovering new places, ideas, or versions of yourself." },
  rebel: { name: "The Rebel", description: "Bold and unconventional, you question broken rules and aren't afraid to disrupt what isn't working." },
  lover: { name: "The Lover", description: "Passionate and intimate, you seek deep connection and notice beauty that others walk past." },
  creator: { name: "The Creator", description: "Imaginative and expressive, you're driven to build things of lasting, original value." },
  jester: { name: "The Jester", description: "Playful and present, you bring lightness to the room and refuse to take everything so seriously." },
  sage: { name: "The Sage", description: "Thoughtful and analytical, you seek truth and understanding before acting, and others lean on your judgment." },
  magician: { name: "The Magician", description: "Visionary and transformative, you believe in turning ideas into reality and helping things fundamentally change." },
  ruler: { name: "The Ruler", description: "Confident and organized, you create order and naturally take charge when direction is needed." },
};

export interface ArchetypeResult {
  primary: Archetype;
  secondary: Archetype;
  scores: Record<Archetype, number>;
  source: "local";
}

export function scoreArchetype(answers: Record<string, number>): ArchetypeResult {
  const scores = {} as Record<Archetype, number>;
  for (const key of Object.keys(ARCHETYPE_INFO) as Archetype[]) {
    scores[key] = 0;
  }

  for (const q of ARCHETYPE_QUESTIONS) {
    const answer = answers[q.id];
    if (answer == null) continue;
    scores[q.archetype] += answer;
  }

  const ranked = (Object.keys(scores) as Archetype[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  return {
    primary: ranked[0],
    secondary: ranked[1],
    scores,
    source: "local",
  };
}
