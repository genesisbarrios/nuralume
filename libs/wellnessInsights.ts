import { getAstroApiClient } from "@/libs/astroApiClient";
import type { BirthDataInput } from "@/libs/astrology";

export interface WellnessInsightResult {
  insight: string | null;
  overallScore: number | null;
  categories: Record<string, number> | null;
  source: "api" | "fallback";
}

const FALLBACK_INSIGHT =
  "Add your birth time and city for a wellness insight tuned to your chart. In the meantime, your best wellness gains come from consistency, not intensity — a few minutes of stillness daily beats an hour once a week.";

// The SDK's declared InsightsResponse type (type/insight/rating/keywords) doesn't match
// what this endpoint actually returns, which is { data: { overall_score, categories,
// recommendations, focus_areas, ... }, message }. Typed loosely here and read defensively.
interface WellnessScoreApiResponse {
  data?: {
    overall_score?: number;
    categories?: Record<string, number>;
    recommendations?: string[];
    focus_areas?: string[];
  };
}

export async function getWellnessInsight(
  input: BirthDataInput
): Promise<WellnessInsightResult> {
  const client = getAstroApiClient();

  if (!client || !input.birthTime || !input.city || !input.countryCode) {
    return {
      insight: FALLBACK_INSIGHT,
      overallScore: null,
      categories: null,
      source: "fallback",
    };
  }

  try {
    const [year, month, day] = input.birthDate.split("-").map(Number);
    const [hour, minute] = input.birthTime.split(":").map(Number);

    const result = (await client.insights.wellness.getWellnessScore(
      {
        subject: {
          name: "Subject",
          birth_data: {
            year,
            month,
            day,
            hour,
            minute,
            second: 0,
            city: input.city,
            country_code: input.countryCode,
          },
        },
      },
      { signal: AbortSignal.timeout(8000) }
    )) as unknown as WellnessScoreApiResponse;

    const insight =
      result.data?.recommendations?.[0] ?? result.data?.focus_areas?.[0] ?? null;

    return {
      insight,
      overallScore: result.data?.overall_score ?? null,
      categories: result.data?.categories ?? null,
      source: "api",
    };
  } catch (err) {
    console.error("[wellness-insight] falling back:", err);
    return {
      insight: FALLBACK_INSIGHT,
      overallScore: null,
      categories: null,
      source: "fallback",
    };
  }
}
