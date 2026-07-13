export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

// [sign, month, day] — the day each sign STARTS on (inclusive), Capricorn wraps the year.
const SIGN_START_DATES: [ZodiacSign, number, number][] = [
  ["Capricorn", 1, 1],
  ["Aquarius", 1, 20],
  ["Pisces", 2, 19],
  ["Aries", 3, 21],
  ["Taurus", 4, 20],
  ["Gemini", 5, 21],
  ["Cancer", 6, 21],
  ["Leo", 7, 23],
  ["Virgo", 8, 23],
  ["Libra", 9, 23],
  ["Scorpio", 10, 23],
  ["Sagittarius", 11, 22],
  ["Capricorn", 12, 22],
];

export function getSunSignFromDate(isoDate: string): ZodiacSign {
  const [, monthStr, dayStr] = isoDate.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);

  let sign: ZodiacSign = "Capricorn";
  for (const [candidate, m, d] of SIGN_START_DATES) {
    if (month > m || (month === m && day >= d)) {
      sign = candidate;
    }
  }
  return sign;
}
