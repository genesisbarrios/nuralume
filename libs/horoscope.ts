import type { ZodiacSign } from "@/libs/zodiac";
import { hasAstrologyApiKey, postAstrologyApi } from "@/libs/astrologyApiCom";

// Monthly isn't offered — astrologyapi.com's monthly endpoint returns generic
// placeholder content regardless of sign or params on the current plan tier,
// confirmed via live testing (not something fixable from this side).
export type HoroscopeFrequency = "daily" | "weekly";

export interface HoroscopeResult {
  sign: ZodiacSign;
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

interface DailyResponse {
  prediction: Record<string, string> | string;
}

interface MultiParagraphResponse {
  prediction: string[];
}

const ENDPOINTS: Record<HoroscopeFrequency, string> = {
  daily: "sun_sign_prediction/daily",
  weekly: "horoscope_prediction/weekly",
};

export async function getHoroscope(
  sign: ZodiacSign,
  frequency: HoroscopeFrequency,
  date: Date = new Date()
): Promise<HoroscopeResult> {
  if (!hasAstrologyApiKey()) {
    return {
      sign,
      text: getFallbackText(sign, date),
      frequency,
      source: "fallback",
    };
  }

  try {
    const endpoint = `${ENDPOINTS[frequency]}/${sign.toLowerCase()}`;
    const data = await postAstrologyApi<DailyResponse | MultiParagraphResponse>(
      endpoint,
      {}
    );

    let text: string;
    if (Array.isArray((data as MultiParagraphResponse).prediction)) {
      text = (data as MultiParagraphResponse).prediction.join(" ");
    } else if (typeof (data as DailyResponse).prediction === "string") {
      text = (data as DailyResponse).prediction as string;
    } else {
      text = Object.values(
        (data as DailyResponse).prediction as Record<string, string>
      ).join(" ");
    }

    // Defensive: astrologyapi.com has been observed returning generic
    // "sample" placeholder copy on some endpoints/plan tiers — treat that
    // the same as an unavailable API rather than showing it as a real reading.
    if (!text || text.trim().toLowerCase().startsWith("this is sample")) {
      throw new Error(`${frequency} horoscope returned placeholder content`);
    }

    return { sign, text, frequency, source: "api" };
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
