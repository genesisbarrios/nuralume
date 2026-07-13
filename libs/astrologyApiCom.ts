// Thin REST client for astrologyapi.com (https://json.astrologyapi.com/v1).
// Server-only: reads the key directly from env so it never reaches the browser.
// Auth: a key containing "ak-" uses the modern single-header scheme; anything
// else is treated as a legacy "userId:apiKey" Basic Auth credential.

const BASE_URL = "https://json.astrologyapi.com/v1";

function getApiKey(): string | null {
  return process.env.ASTROLOGY_API_KEY || null;
}

export function hasAstrologyApiKey(): boolean {
  return Boolean(getApiKey());
}

function buildAuthHeaders(apiKey: string): Record<string, string> {
  if (apiKey.includes("ak-")) {
    return { "x-astrologyapi-key": apiKey };
  }
  const encoded = Buffer.from(apiKey).toString("base64");
  return { Authorization: `Basic ${encoded}` };
}

export async function postAstrologyApi<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("ASTROLOGY_API_KEY is not configured");

  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(apiKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  const data = await res.json();
  if (!res.ok || data?.status === false || data?.errorType) {
    throw new Error(
      data?.msg || data?.errorMessage || `astrologyapi.com ${endpoint} failed (${res.status})`
    );
  }
  return data as T;
}
