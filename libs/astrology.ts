import { getSunSignFromDate, type ZodiacSign } from "@/libs/zodiac";
import { hasAstrologyApiKey, postAstrologyApi } from "@/libs/astrologyApiCom";
import { geocodePlace, getUtcOffsetHours } from "@/libs/geocoding";

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

interface Planet {
  name: string;
  sign: string;
}

interface HouseCusps {
  houses: { house: number; sign: string; degree: number }[];
}

export async function getBirthChart(
  input: BirthDataInput
): Promise<AstrologyResult> {
  const sunSign = getSunSignFromDate(input.birthDate);

  if (!hasAstrologyApiKey() || !input.birthTime || !input.city) {
    return { sunSign, moonSign: null, risingSign: null, source: "fallback" };
  }

  try {
    const geo = await geocodePlace(input.city, input.countryCode);
    if (!geo || !geo.ianaTimezone) {
      throw new Error("Could not geocode birth location");
    }

    const tzone = getUtcOffsetHours(
      geo.ianaTimezone,
      input.birthDate,
      input.birthTime
    );

    const [year, month, day] = input.birthDate.split("-").map(Number);
    const [hour, minute] = input.birthTime.split(":").map(Number);
    const body = {
      day,
      month,
      year,
      hour,
      min: minute,
      lat: geo.lat,
      lon: geo.lon,
      tzone,
    };

    const [planets, houseCusps] = await Promise.all([
      postAstrologyApi<Planet[]>("planets/tropical", body),
      postAstrologyApi<HouseCusps>("house_cusps/tropical", body),
    ]);

    const moon = planets.find((p) => p.name === "Moon");
    const ascendantHouse = houseCusps.houses?.find((h) => h.house === 1);

    return {
      sunSign,
      moonSign: moon?.sign ?? null,
      risingSign: ascendantHouse?.sign ?? null,
      source: "api",
    };
  } catch (err) {
    console.error("[astrology] falling back:", err);
    return { sunSign, moonSign: null, risingSign: null, source: "fallback" };
  }
}
