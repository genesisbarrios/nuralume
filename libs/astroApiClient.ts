import { AstrologyClient } from "@astro-api/astroapi-typescript";

let client: AstrologyClient | null | undefined;

// Server-only: reads the API key directly from env so it's never bundled client-side.
// ASTRO_API_KEY is the AstroAPI (@astro-api/astroapi-typescript) key — verified working
// against the live API. Note: ASTROLOGY_API_KEY belongs to a *different*, separate
// "Astrology API" service (not AstroAPI) and must not be used here.
export function getAstroApiClient(): AstrologyClient | null {
  if (client !== undefined) return client;

  const apiKey = process.env.ASTRO_API_KEY;
  client = apiKey ? new AstrologyClient({ apiKey }) : null;
  return client;
}
