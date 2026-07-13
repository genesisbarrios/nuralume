export interface GeocodeResult {
  placeName: string;
  lat: number;
  lon: number;
  ianaTimezone: string | null;
}

interface OpenMeteoGeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  country?: string;
  admin1?: string;
  timezone?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

// Open-Meteo's geocoding API is free, requires no API key, and returns the
// IANA timezone directly — no separate lookup needed.
export async function geocodePlace(
  place: string,
  preferredCountryCode?: string | null
): Promise<GeocodeResult | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", place);
  url.searchParams.set("count", "5");

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) return null;

  const data = (await res.json()) as OpenMeteoGeocodingResponse;
  const matches = data.results ?? [];
  if (matches.length === 0) return null;

  const match =
    (preferredCountryCode &&
      matches.find(
        (m) => m.country_code?.toUpperCase() === preferredCountryCode.toUpperCase()
      )) ||
    matches[0];

  return {
    placeName: [match.name, match.admin1, match.country]
      .filter(Boolean)
      .join(", "),
    lat: match.latitude,
    lon: match.longitude,
    ianaTimezone: match.timezone ?? null,
  };
}

// Computes the historical, DST-aware UTC offset directly from the IANA zone
// using Node's built-in Intl support — no external API needed for this part.
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
