import type { ZodiacSign } from "@/libs/zodiac";
import { getAstroApiClient } from "@/libs/astroApiClient";

export type HoroscopeFrequency = "daily" | "weekly";

export interface HoroscopeResult {
  sign: ZodiacSign;
  date: string;
  text: string;
  frequency: HoroscopeFrequency;
  source: "api" | "fallback";
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

export async function getDailyHoroscope(
  sign: ZodiacSign,
  date: Date = new Date()
): Promise<HoroscopeResult> {
  const isoDate = date.toISOString().slice(0, 10);
  const client = getAstroApiClient();

  if (!client) {
    return {
      sign,
      date: isoDate,
      text: getFallbackText(sign, date),
      frequency: "daily",
      source: "fallback",
    };
  }

  try {
    const result = await client.horoscope.getSignDailyHoroscopeText(
      {
        sign,
        date: isoDate,
        language: "en",
        tradition: "universal",
        format: "paragraph",
      },
      { signal: AbortSignal.timeout(8000) }
    );

    return {
      sign,
      date: isoDate,
      text: result.text,
      frequency: "daily",
      source: "api",
    };
  } catch (err) {
    console.error("[horoscope] falling back:", err);
    return {
      sign,
      date: isoDate,
      text: getFallbackText(sign, date),
      frequency: "daily",
      source: "fallback",
    };
  }
}

export async function getWeeklyHoroscope(
  sign: ZodiacSign,
  date: Date = new Date()
): Promise<HoroscopeResult> {
  const isoDate = date.toISOString().slice(0, 10);
  const client = getAstroApiClient();

  if (!client) {
    return {
      sign,
      date: isoDate,
      text: getFallbackText(sign, date),
      frequency: "weekly",
      source: "fallback",
    };
  }

  try {
    const result = await client.horoscope.getSignWeeklyHoroscopeText(
      {
        sign,
        language: "en",
        tradition: "universal",
        format: "short",
      },
      { signal: AbortSignal.timeout(8000) }
    );

    return {
      sign,
      date: isoDate,
      text: result.text,
      frequency: "weekly",
      source: "api",
    };
  } catch (err) {
    console.error("[horoscope] falling back:", err);
    return {
      sign,
      date: isoDate,
      text: getFallbackText(sign, date),
      frequency: "weekly",
      source: "fallback",
    };
  }
}

export async function getHoroscope(
  sign: ZodiacSign,
  frequency: HoroscopeFrequency,
  date: Date = new Date()
): Promise<HoroscopeResult> {
  return frequency === "weekly"
    ? getWeeklyHoroscope(sign, date)
    : getDailyHoroscope(sign, date);
}
