import { postAstrologyApi } from "@/libs/astrologyApiCom";

export interface GeocodeResult {
  placeName: string;
  lat: number;
  lon: number;
  ianaTimezone: string | null;
}

interface GeoDetailsResponse {
  geonames?: {
    place_name: string;
    latitude: string;
    longitude: string;
    country_code: string;
    timezone_id: string;
  }[];
}

// Passing "City, CountryCode" as a single query string breaks this endpoint
// (returns zero results) — it wants a bare place name. Country code is used
// afterward to disambiguate between multiple matches instead.
export async function geocodePlace(
  place: string,
  preferredCountryCode?: string | null
): Promise<GeocodeResult | null> {
  const data = await postAstrologyApi<GeoDetailsResponse>("geo_details", {
    place,
    maxRows: 5,
  });

  const matches = data.geonames ?? [];
  if (matches.length === 0) return null;

  const match =
    (preferredCountryCode &&
      matches.find(
        (m) =>
          m.country_code?.toUpperCase() === preferredCountryCode.toUpperCase()
      )) ||
    matches[0];

  return {
    placeName: match.place_name,
    lat: Number(match.latitude),
    lon: Number(match.longitude),
    ianaTimezone: match.timezone_id ?? null,
  };
}

// astrologyapi.com's own timezone_with_dst endpoint is unreliable (observed
// failing consistently in testing), so this computes the historical,
// DST-aware UTC offset directly from the IANA zone using Node's built-in
// Intl support instead of depending on it.
export function getUtcOffsetHours(
  ianaTimezone: string,
  birthDate: string, // yyyy-mm-dd
  birthTime: string // HH:mm
): number {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);

  // Treat the local birth time as if it were a UTC instant purely so we have
  // a Date value to feed through the timezone formatter below.
  const naiveUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimezone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts: Record<string, string> = {};
  for (const part of dtf.formatToParts(naiveUtc)) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }

  const resolvedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute)
  );

  const offsetMinutes = (resolvedAsUtc - naiveUtc.getTime()) / 60000;
  return offsetMinutes / 60;
}
