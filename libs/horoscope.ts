import {
  AspectType,
  calculateTransits,
  toJulianDate,
  type NatalPoint,
  type Transit,
} from "celestine";
import { getSunSignFromDate, type ZodiacSign } from "@/libs/zodiac";
import { computeNatalChart, type BirthDataInput } from "@/libs/astrology";

// Monthly isn't offered — see git history for the astrologyapi.com-specific
// reason this was originally dropped; no longer relevant now that horoscopes
// are generated from real transits instead of a third-party endpoint.
export type HoroscopeFrequency = "daily" | "weekly";

export interface HoroscopeResult {
  sign: ZodiacSign;
  text: string;
  frequency: HoroscopeFrequency;
  source: "transit" | "fallback";
}

const FALLBACK_POOL = [
  "Today favors quiet reflection over big decisions — let your thoughts settle before you act.",
  "A conversation today may reveal more than expected. Listen closely.",
  "Your energy is best spent on one meaningful task rather than several small ones.",
  "Trust the progress you can't see yet. Not everything blooms on schedule.",
  "A small act of self-care today will pay off more than you expect.",
  "Someone close to you needs your patience more than your advice right now.",
  "This is a good day to release something you've been holding onto.",
  "Your intuition is sharper than usual today — don't second-guess it.",
  "Slow down. The rush you feel is manufactured, not necessary.",
  "A fresh perspective on an old problem is within reach today.",
];

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getFallbackText(sign: ZodiacSign, date: Date): string {
  const seed = dayOfYear(date) + sign.charCodeAt(0);
  return FALLBACK_POOL[seed % FALLBACK_POOL.length];
}

// What each transiting body is "about", for sentence generation.
const BODY_THEME: Record<string, string> = {
  Sun: "your sense of identity and vitality",
  Moon: "your emotions and inner world",
  Mercury: "communication and how you're thinking things through",
  Venus: "love, connection, and what you value",
  Mars: "your drive, energy, and how you take action",
  Jupiter: "growth, luck, and opportunity",
  Saturn: "responsibility, structure, and discipline",
  Uranus: "unexpected change and fresh insight",
  Neptune: "your intuition, dreams, and imagination",
  Pluto: "deep transformation and hidden power",
  Chiron: "an old wound that's ready to heal",
  "True Node": "your sense of direction and purpose",
};

// What each natal point represents, for the "...to your natal X" half of
// the sentence.
const NATAL_POINT_LABEL: Record<string, string> = {
  Sun: "your core identity",
  Moon: "your emotional foundation",
  Ascendant: "how you're showing up to the world",
  Mercury: "your natal Mercury",
  Venus: "your natal Venus",
  Mars: "your natal Mars",
  Jupiter: "your natal Jupiter",
  Saturn: "your natal Saturn",
  Uranus: "your natal Uranus",
  Neptune: "your natal Neptune",
  Pluto: "your natal Pluto",
  Chiron: "your natal Chiron",
};

const ASPECT_PHRASE: Partial<Record<AspectType, string>> = {
  [AspectType.Conjunction]: "is merging with",
  [AspectType.Sextile]: "is gently supporting",
  [AspectType.Trine]: "is flowing easily with",
  [AspectType.Square]: "is creating friction with",
  [AspectType.Opposition]: "is pulling against",
};

function sentenceFor(transit: Transit): string {
  const theme = BODY_THEME[transit.transitingBody] ?? `${transit.transitingBody}'s energy`;
  const natal = NATAL_POINT_LABEL[transit.natalPoint] ?? `your natal ${transit.natalPoint}`;
  const verb = ASPECT_PHRASE[transit.aspectType] ?? "is aspecting";

  return `Transiting ${transit.transitingBody} ${verb} ${natal}, putting a spotlight on ${theme}${
    transit.isRetrograde ? " — and it's retrograde, so expect some revisiting" : ""
  }.`;
}

async function natalPointsFor(input: BirthDataInput): Promise<NatalPoint[] | null> {
  const chart = await computeNatalChart(input);
  if (!chart) return null;

  return [
    ...chart.planets.map((p) => ({
      name: p.name,
      longitude: p.longitude,
      type: (p.name === "Sun" || p.name === "Moon" ? "luminary" : "planet") as
        | "luminary"
        | "planet",
      house: p.house,
    })),
    {
      name: "Ascendant",
      longitude: chart.angles.ascendant.longitude,
      type: "angle",
    },
  ];
}

const TRANSIT_CONFIG = {
  aspectTypes: [
    AspectType.Conjunction,
    AspectType.Sextile,
    AspectType.Square,
    AspectType.Trine,
    AspectType.Opposition,
  ],
  minimumStrength: 50,
};

function jdForDate(date: Date): number {
  return toJulianDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  });
}

// Picks the single strongest instance of each unique (transiting body,
// natal point, aspect) combo across the given transit results, so a
// transit that's active on multiple sampled days doesn't get double-counted.
function dedupeByStrength(results: Transit[][]): Transit[] {
  const best = new Map<string, Transit>();
  for (const transits of results) {
    for (const t of transits) {
      const key = `${t.transitingBody}|${t.natalPoint}|${t.aspectType}`;
      const existing = best.get(key);
      if (!existing || t.strength > existing.strength) {
        best.set(key, t);
      }
    }
  }
  return Array.from(best.values()).sort((a, b) => b.strength - a.strength);
}

export async function getHoroscope(
  input: BirthDataInput,
  frequency: HoroscopeFrequency,
  date: Date = new Date()
): Promise<HoroscopeResult> {
  const sign = getSunSignFromDate(input.birthDate);

  try {
    const natalPoints = await natalPointsFor(input);
    if (!natalPoints) {
      throw new Error("Missing birth time/city or could not geocode");
    }

    const sampleDays = frequency === "daily" ? 1 : 7;
    const results: Transit[][] = [];
    for (let i = 0; i < sampleDays; i++) {
      const sampleDate = new Date(date);
      sampleDate.setUTCDate(sampleDate.getUTCDate() + i);
      const result = calculateTransits(
        natalPoints,
        jdForDate(sampleDate),
        TRANSIT_CONFIG
      );
      results.push(result.transits);
    }

    const topTransits = dedupeByStrength(results).slice(
      0,
      frequency === "daily" ? 2 : 3
    );

    if (topTransits.length === 0) {
      return {
        sign,
        text: getFallbackText(sign, date),
        frequency,
        source: "fallback",
      };
    }

    const intro = frequency === "weekly" ? "This week: " : "";
    const text = intro + topTransits.map(sentenceFor).join(" ");

    return { sign, text, frequency, source: "transit" };
  } catch (err) {
    console.error(`[horoscope:${frequency}] falling back:`, err);
    return {
      sign,
      text: getFallbackText(sign, date),
      frequency,
      source: "fallback",
    };
  }
}
