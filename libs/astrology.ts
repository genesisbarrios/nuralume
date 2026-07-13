import { getSignFromAbbreviation, getSunSignFromDate, type ZodiacSign } from "@/libs/zodiac";
import { getAstroApiClient } from "@/libs/astroApiClient";

export interface AstrologyResult {
  sunSign: ZodiacSign;
  moonSign: string | null;
  risingSign: string | null;
  source: "api" | "fallback";
}

export interface BirthDataInput {
  birthDate: string; // ISO yyyy-mm-dd
  birthTime?: string | null; // HH:mm
  city?: string | null;
  countryCode?: string | null; // ISO 3166-1 alpha-2, e.g. "US"
}

export async function getBirthChart(
  input: BirthDataInput
): Promise<AstrologyResult> {
  const sunSign = getSunSignFromDate(input.birthDate);
  const client = getAstroApiClient();

  if (!client || !input.birthTime || !input.city || !input.countryCode) {
    return { sunSign, moonSign: null, risingSign: null, source: "fallback" };
  }

  try {
    const [year, month, day] = input.birthDate.split("-").map(Number);
    const [hour, minute] = input.birthTime.split(":").map(Number);

    const { positions } = await client.data.getPositions({
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
      // The API omits Ascendant unless explicitly requested via active_points.
      options: { active_points: ["Sun", "Moon", "Ascendant"] },
    });

    const moon = positions.find((p) => p.name === "Moon");
    const ascendant = positions.find((p) => p.name === "Ascendant");

    return {
      sunSign,
      moonSign: moon ? getSignFromAbbreviation(moon.sign) : null,
      risingSign: ascendant ? getSignFromAbbreviation(ascendant.sign) : null,
      source: "api",
    };
  } catch (err) {
    console.error("[astrology] falling back:", err);
    return { sunSign, moonSign: null, risingSign: null, source: "fallback" };
  }
}
