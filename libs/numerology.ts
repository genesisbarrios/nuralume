const MASTER_NUMBERS = [11, 22, 33];

export function reduceDigits(value: number, keepMaster = true): number {
  let n = value;
  while (n > 9 && !(keepMaster && MASTER_NUMBERS.includes(n))) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

export function calculateLifePathNumber(birthDateIso: string): number {
  const digitSum = birthDateIso
    .replace(/-/g, "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
  return reduceDigits(digitSum);
}

const LETTER_VALUES: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function sumLetters(name: string, filter: (letter: string) => boolean) {
  return name
    .toLowerCase()
    .split("")
    .filter((char) => /[a-z]/.test(char) && filter(char))
    .reduce((sum, char) => sum + (LETTER_VALUES[char] ?? 0), 0);
}

export function calculateDestinyNumber(fullName: string): number {
  return reduceDigits(sumLetters(fullName, () => true));
}

export function calculateSoulUrgeNumber(fullName: string): number {
  return reduceDigits(sumLetters(fullName, (letter) => VOWELS.has(letter)));
}

export const NUMBER_MEANINGS: Record<number, string> = {
  1: "Leadership, independence, and a drive to originate rather than follow.",
  2: "Partnership, diplomacy, and sensitivity to others.",
  3: "Creativity, expression, and joy shared outward.",
  4: "Structure, discipline, and a need for solid foundations.",
  5: "Freedom, change, and a hunger for new experience.",
  6: "Responsibility, nurturing, and care for home and community.",
  7: "Introspection, analysis, and a search for deeper truth.",
  8: "Ambition, material mastery, and personal power.",
  9: "Compassion, completion, and service to something larger than self.",
  11: "Master number: intuition and spiritual insight amplified.",
  22: "Master number: the 'master builder' — big visions made real.",
  33: "Master number: selfless devotion and healing through service.",
};

export interface NumerologyProfile {
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  meanings: typeof NUMBER_MEANINGS;
  source: "local";
}

export function getNumerologyProfile(
  fullName: string,
  birthDateIso: string
): NumerologyProfile {
  return {
    lifePathNumber: calculateLifePathNumber(birthDateIso),
    destinyNumber: calculateDestinyNumber(fullName),
    soulUrgeNumber: calculateSoulUrgeNumber(fullName),
    meanings: NUMBER_MEANINGS,
    source: "local",
  };
}
