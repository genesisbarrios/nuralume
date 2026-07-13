import { getAstroApiClient } from "@/libs/astroApiClient";
import type { BirthDataInput } from "@/libs/astrology";

export interface AstrocartographyHighlight {
  planet: string;
  lineType: string;
  meaning: string;
  keywords: string[];
}

export interface AstrocartographyResult {
  highlights: AstrocartographyHighlight[];
  source: "api" | "fallback";
}

export async function getAstrocartographyHighlights(
  input: BirthDataInput
): Promise<AstrocartographyResult> {
  const client = getAstroApiClient();

  if (!client || !input.birthTime || !input.city || !input.countryCode) {
    return { highlights: [], source: "fallback" };
  }

  try {
    const [year, month, day] = input.birthDate.split("-").map(Number);
    const [hour, minute] = input.birthTime.split(":").map(Number);

    const { lines } = await client.astrocartography.getLines(
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
        coordinate_density: 20, // API minimum
      },
      { signal: AbortSignal.timeout(8000) }
    );

    const highlights = lines
      .filter((line) => line.strength === "very_strong" || line.strength === "strong")
      .slice(0, 5)
      .map((line) => ({
        planet: line.planet,
        lineType: line.line_type,
        meaning: line.meaning,
        keywords: line.keywords,
      }));

    return { highlights, source: "api" };
  } catch (err) {
    console.error("[astrocartography] falling back:", err);
    return { highlights: [], source: "fallback" };
  }
}
