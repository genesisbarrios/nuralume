export type MbtiDichotomy = "EI" | "SN" | "TF" | "JP";

export interface MbtiQuestion {
  id: string;
  text: string;
  dichotomy: MbtiDichotomy;
  // 1 = agreeing leans toward the first letter (E/S/T/J); -1 leans toward the second (I/N/F/P).
  direction: 1 | -1;
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  { id: "ei1", text: "I feel energized after spending time in a big group of people.", dichotomy: "EI", direction: 1 },
  { id: "ei2", text: "I'd rather spend a free evening alone or with one close friend than at a party.", dichotomy: "EI", direction: -1 },
  { id: "ei3", text: "I tend to think out loud, working through ideas as I speak.", dichotomy: "EI", direction: 1 },
  { id: "ei4", text: "Long stretches of social interaction leave me needing quiet time to recharge.", dichotomy: "EI", direction: -1 },
  { id: "ei5", text: "I find it easy to start conversations with strangers.", dichotomy: "EI", direction: 1 },
  { id: "ei6", text: "I prefer to observe a group before jumping into the conversation.", dichotomy: "EI", direction: -1 },
  { id: "sn1", text: "I trust concrete facts and past experience more than hunches.", dichotomy: "SN", direction: 1 },
  { id: "sn2", text: "I'm drawn to patterns, possibilities, and 'what could be' more than 'what is'.", dichotomy: "SN", direction: -1 },
  { id: "sn3", text: "I'd rather follow a clear, proven method than improvise a new approach.", dichotomy: "SN", direction: 1 },
  { id: "sn4", text: "I often notice abstract connections between unrelated ideas.", dichotomy: "SN", direction: -1 },
  { id: "sn5", text: "I pay close attention to details other people tend to miss.", dichotomy: "SN", direction: 1 },
  { id: "sn6", text: "I get bored rehashing details and would rather discuss the big picture.", dichotomy: "SN", direction: -1 },
  { id: "tf1", text: "When making a hard decision, logic matters more to me than how people will feel.", dichotomy: "TF", direction: 1 },
  { id: "tf2", text: "I naturally consider how a decision will affect everyone's feelings.", dichotomy: "TF", direction: -1 },
  { id: "tf3", text: "I'd rather be seen as fair and consistent than warm and accommodating.", dichotomy: "TF", direction: 1 },
  { id: "tf4", text: "Maintaining harmony in a group matters more to me than being 'right'.", dichotomy: "TF", direction: -1 },
  { id: "tf5", text: "I give feedback directly, even if it might sting a little.", dichotomy: "TF", direction: 1 },
  { id: "tf6", text: "I soften criticism so it doesn't hurt the other person.", dichotomy: "TF", direction: -1 },
  { id: "jp1", text: "I like having a clear plan and sticking to it.", dichotomy: "JP", direction: 1 },
  { id: "jp2", text: "I prefer to keep my options open rather than commit to one plan early.", dichotomy: "JP", direction: -1 },
  { id: "jp3", text: "Unfinished tasks nag at me until they're done.", dichotomy: "JP", direction: 1 },
  { id: "jp4", text: "I do my best work under the pressure of a last-minute deadline.", dichotomy: "JP", direction: -1 },
  { id: "jp5", text: "I feel more comfortable once a decision is made and settled.", dichotomy: "JP", direction: 1 },
  { id: "jp6", text: "Spontaneous changes of plan excite me more than they stress me.", dichotomy: "JP", direction: -1 },
];

export interface MbtiTypeInfo {
  type: string;
  nickname: string;
  description: string;
}

export const MBTI_TYPES: Record<string, MbtiTypeInfo> = {
  ISTJ: { type: "ISTJ", nickname: "The Inspector", description: "Practical, fact-minded, and reliable — ISTJs bring order and follow-through to everything they commit to." },
  ISFJ: { type: "ISFJ", nickname: "The Protector", description: "Warm and dependable, ISFJs quietly look after the people and details others overlook." },
  INFJ: { type: "INFJ", nickname: "The Advocate", description: "Idealistic and insightful, INFJs seek meaning and quietly work toward a better world." },
  INTJ: { type: "INTJ", nickname: "The Architect", description: "Strategic and independent, INTJs build long-term plans and rarely stop refining them." },
  ISTP: { type: "ISTP", nickname: "The Virtuoso", description: "Hands-on and adaptable, ISTPs solve problems by quietly experimenting until something works." },
  ISFP: { type: "ISFP", nickname: "The Adventurer", description: "Gentle and spontaneous, ISFPs express themselves through experience more than words." },
  INFP: { type: "INFP", nickname: "The Mediator", description: "Guided by values, INFPs search for authenticity and champion causes they believe in." },
  INTP: { type: "INTP", nickname: "The Logician", description: "Curious and analytical, INTPs love taking ideas apart to see how they really work." },
  ESTP: { type: "ESTP", nickname: "The Entrepreneur", description: "Bold and energetic, ESTPs thrive in the moment and act before overthinking." },
  ESFP: { type: "ESFP", nickname: "The Entertainer", description: "Spontaneous and warm, ESFPs bring energy and fun into any room they enter." },
  ENFP: { type: "ENFP", nickname: "The Campaigner", description: "Enthusiastic and imaginative, ENFPs see possibility and connection everywhere." },
  ENTP: { type: "ENTP", nickname: "The Debater", description: "Quick-witted and curious, ENTPs love exploring ideas and playing devil's advocate." },
  ESTJ: { type: "ESTJ", nickname: "The Executive", description: "Organized and decisive, ESTJs get things done and keep everyone on schedule." },
  ESFJ: { type: "ESFJ", nickname: "The Consul", description: "Sociable and dutiful, ESFJs create harmony and look after their community." },
  ENFJ: { type: "ENFJ", nickname: "The Protagonist", description: "Charismatic and empathetic, ENFJs inspire and rally people toward a shared goal." },
  ENTJ: { type: "ENTJ", nickname: "The Commander", description: "Confident and strategic, ENTJs naturally take charge and drive toward results." },
};

export interface MbtiResult {
  type: string;
  info: MbtiTypeInfo;
  scores: Record<MbtiDichotomy, number>;
  source: "local";
}

export function scoreMbti(answers: Record<string, number>): MbtiResult {
  const scores: Record<MbtiDichotomy, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const q of MBTI_QUESTIONS) {
    const answer = answers[q.id];
    if (answer == null) continue;
    scores[q.dichotomy] += (answer - 3) * q.direction;
  }

  const type =
    (scores.EI >= 0 ? "E" : "I") +
    (scores.SN >= 0 ? "S" : "N") +
    (scores.TF >= 0 ? "T" : "F") +
    (scores.JP >= 0 ? "J" : "P");

  return { type, info: MBTI_TYPES[type], scores, source: "local" };
}
