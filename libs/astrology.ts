import { calculateChart, type Chart } from "celestine";
import { getSunSignFromDate, type ZodiacSign } from "@/libs/zodiac";
import { geocodePlace, getUtcOffsetHours } from "@/libs/geocoding";

export interface AstrologyHouse {
  house: number;
  sign: string;
  degree: number;
}

export interface AstrologyAspect {
  body1: string;
  body2: string;
  type: string;
  symbol: string;
  orb: number;
}

export interface AstrologyPlanet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
}

export interface AstrologyResult {
  sunSign: ZodiacSign;
  moonSign: string | null;
  risingSign: string | null;
  risingDegree: number | null;
  // Full body list including Sun and Moon (for expand-for-details lookups);
  // UI sections that already have dedicated Sun/Moon cards filter them out.
  planets: AstrologyPlanet[] | null;
  houses: AstrologyHouse[] | null;
  aspects: AstrologyAspect[] | null;
  source: "api" | "fallback";
}

export interface BirthDataInput {
  birthDate: string; // ISO yyyy-mm-dd
  birthTime?: string | null; // HH:mm
  city?: string | null;
  countryCode?: string | null; // ISO 3166-1 alpha-2, e.g. "US"
}

const EMPTY_CHART = {
  moonSign: null,
  risingSign: null,
  risingDegree: null,
  planets: null,
  houses: null,
  aspects: null,
} as const;

// Shared by getBirthChart and the horoscope transit generator — both need
// the same natal longitudes, just shaped differently. Fully local
// (Celestine, validated against JPL Horizons / Swiss Ephemeris) — no
// external API, no rate limits, no credits to run out. Only the city ->
// lat/lon/timezone lookup hits a (free, keyless) network service.
export async function computeNatalChart(
  input: BirthDataInput
): Promise<Chart | null> {
  if (!input.birthTime || !input.city) return null;

  const geo = await geocodePlace(input.city, input.countryCode);
  if (!geo || !geo.ianaTimezone) return null;

  const tzone = getUtcOffsetHours(
    geo.ianaTimezone,
    input.birthDate,
    input.birthTime
  );

  const [year, month, day] = input.birthDate.split("-").map(Number);
  const [hour, minute] = input.birthTime.split(":").map(Number);

  return calculateChart(
    {
      year,
      month,
      day,
      hour,
      minute,
      timezone: tzone,
      latitude: geo.lat,
      longitude: geo.lon,
    },
    // Keep to the mainstream 10 planets + Chiron + nodes — the 4 asteroids
    // and Arabic Lots are niche and would roughly double the aspect list
    // for little value to a casual, non-practitioner audience.
    { includeAsteroids: false, includeLilith: false, includeLots: false }
  );
}

export async function getBirthChart(
  input: BirthDataInput
): Promise<AstrologyResult> {
  const sunSign = getSunSignFromDate(input.birthDate);

  try {
    const chart = await computeNatalChart(input);
    if (!chart) {
      throw new Error("Missing birth time/city or could not geocode");
    }

    const moon = chart.planets.find((p) => p.name === "Moon");

    return {
      sunSign,
      moonSign: moon?.signName ?? null,
      risingSign: chart.angles.ascendant.signName,
      risingDegree: Math.round(chart.angles.ascendant.degree),
      planets: chart.planets.map((p) => ({
        name: p.name,
        sign: p.signName,
        degree: Math.round(p.degree),
        house: p.house,
        isRetrograde: p.isRetrograde,
      })),
      houses: chart.houses.cusps.map((cusp) => ({
        house: cusp.house,
        sign: cusp.signName,
        degree: Math.round(cusp.degree),
      })),
      aspects: chart.aspects.all.map((aspect) => ({
        body1: aspect.body1,
        body2: aspect.body2,
        type: aspect.type,
        symbol: aspect.symbol,
        orb: Math.round(aspect.orb * 10) / 10,
      })),
      source: "api",
    };
  } catch (err) {
    console.error("[astrology] falling back:", err);
    return { sunSign, ...EMPTY_CHART, source: "fallback" };
  }
}
