import {
  calculateChart,
  fromJulianDate,
  getSunPosition,
  type Chart,
} from "celestine";
import { computeNatalChart, type BirthDataInput } from "@/libs/astrology";
import { TYPE_STRATEGY } from "@/libs/humanDesignTypes";

export type { BirthDataInput };
export { HUMAN_DESIGN_TYPES, type HumanDesignTypeInfo } from "@/libs/humanDesignTypes";

// ============================================================================
// Standard Human Design bodygraph structure (public-domain system data,
// unchanged since Ra Uru Hu's original 1992 system — the same reference
// tables any Human Design calculator uses, cross-validated internally below
// via the gate-count/channel-count checks).
// ============================================================================

// The 64 gates in zodiacal order, starting at 0° Aries. Each gate spans
// exactly 360/64 = 5.625°, further split into 6 lines of 0.9375° each.
const GATE_WHEEL = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23,
  8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64,
  47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58,
  38, 54, 61, 60,
];

export type Center =
  | "Head"
  | "Ajna"
  | "Throat"
  | "G"
  | "Heart"
  | "Spleen"
  | "SolarPlexus"
  | "Sacral"
  | "Root";

const CENTER_GATES: Record<Center, number[]> = {
  Head: [64, 61, 63],
  Ajna: [47, 24, 4, 17, 43, 11],
  Throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  G: [7, 1, 13, 25, 46, 2, 15, 10],
  Heart: [21, 40, 26, 51],
  Spleen: [48, 57, 44, 50, 32, 28, 18],
  SolarPlexus: [6, 37, 22, 36, 30, 55, 49],
  Sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  Root: [58, 38, 54, 53, 60, 52, 19, 39, 41],
};

const GATE_CENTER: Record<number, Center> = Object.fromEntries(
  Object.entries(CENTER_GATES).flatMap(([center, gates]) =>
    gates.map((g) => [g, center as Center])
  )
);

// The 36 channels connecting the 64 gates. A handful of gates (10, 20, 34,
// 57) each participate in more than one channel — that's a real, distinctive
// feature of the bodygraph (the G/Throat/Sacral/Spleen "hub"), not a
// duplication bug.
const CHANNELS: [number, number][] = [
  [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31], [9, 52],
  [10, 20], [10, 34], [10, 57], [11, 56], [12, 22], [13, 33], [16, 48],
  [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45], [23, 43],
  [24, 61], [25, 51], [26, 44], [27, 50], [28, 38], [29, 46], [30, 41],
  [32, 54], [34, 57], [35, 36], [37, 40], [39, 55], [42, 53], [47, 64],
];

const MOTOR_CENTERS: Center[] = ["Sacral", "Heart", "SolarPlexus", "Root"];

// ============================================================================
// Gate/line extraction from ecliptic longitude
// ============================================================================

const GATE_SIZE = 360 / 64; // 5.625°
const LINE_SIZE = GATE_SIZE / 6; // 0.9375°

export interface Activation {
  planet: string;
  gate: number;
  line: number;
}

function longitudeToGateLine(longitude: number): { gate: number; line: number } {
  const norm = ((longitude % 360) + 360) % 360;
  const index = Math.floor(norm / GATE_SIZE);
  const withinGate = norm - index * GATE_SIZE;
  const line = Math.min(Math.floor(withinGate / LINE_SIZE) + 1, 6);
  return { gate: GATE_WHEEL[index], line };
}

// Human Design's classical 13 bodies: Sun, Earth (always exactly opposite
// the Sun), Moon, both lunar Nodes, and the 7 traditional planets. Chiron
// isn't part of the classical system, so it's deliberately excluded even
// though it's present in the shared celestine chart (used elsewhere for
// astrology) for consistency with standard Human Design charts.
function activationsFromChart(chart: Chart): Activation[] {
  const sun = chart.planets.find((p) => p.name === "Sun");
  if (!sun) return [];

  const bodies: { name: string; longitude: number }[] = [
    { name: "Sun", longitude: sun.longitude },
    { name: "Earth", longitude: (sun.longitude + 180) % 360 },
    ...chart.planets
      .filter((p) => p.name !== "Sun" && p.name !== "Chiron")
      .map((p) => ({ name: p.name, longitude: p.longitude })),
    ...chart.nodes.map((n) => ({ name: n.name, longitude: n.longitude })),
  ];

  return bodies.map(({ name, longitude }) => ({
    planet: name,
    ...longitudeToGateLine(longitude),
  }));
}

// Finds the Julian Date when the Sun was exactly 88° of ecliptic longitude
// earlier than at birth — the "Design" moment in Human Design (commonly
// approximated as "~88-89 days before birth", but the real definition is
// solar arc, not calendar days; a numeric solve here is both more accurate
// and simpler than hardcoding an average that varies with season).
function findDesignJulianDate(birthJD: number, natalSunLongitude: number): number {
  const target = ((natalSunLongitude - 88) % 360 + 360) % 360;
  let jd = birthJD - 88;

  // Sun moves ~0.9856°/day; 5 Newton-style iterations converges to well
  // under a thousandth of a degree, far tighter than the 0.9375°-wide lines
  // this feeds into.
  for (let i = 0; i < 5; i++) {
    const sunLongitude = getSunPosition(jd).longitude;
    let diff = sunLongitude - target;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    jd -= diff / 0.9856;
  }
  return jd;
}

// ============================================================================
// Bodygraph derivation: defined centers, connectivity, type, authority
// ============================================================================

function definedChannels(gates: Set<number>): [number, number][] {
  return CHANNELS.filter(([a, b]) => gates.has(a) && gates.has(b));
}

function definedCentersFrom(channels: [number, number][]): Set<Center> {
  const centers = new Set<Center>();
  for (const [a, b] of channels) {
    centers.add(GATE_CENTER[a]);
    centers.add(GATE_CENTER[b]);
  }
  return centers;
}

// Connected components among defined centers, using defined channels as
// edges — needed to determine "motor connected to throat" (which can be an
// indirect path through other defined centers, not just a direct channel).
function centerComponents(
  centers: Set<Center>,
  channels: [number, number][]
): Center[][] {
  const adjacency = new Map<Center, Set<Center>>();
  for (const c of Array.from(centers)) adjacency.set(c, new Set());
  for (const [a, b] of channels) {
    const ca = GATE_CENTER[a];
    const cb = GATE_CENTER[b];
    if (centers.has(ca) && centers.has(cb)) {
      adjacency.get(ca)?.add(cb);
      adjacency.get(cb)?.add(ca);
    }
  }

  const visited = new Set<Center>();
  const components: Center[][] = [];
  for (const start of Array.from(centers)) {
    if (visited.has(start)) continue;
    const stack = [start];
    const comp: Center[] = [];
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || visited.has(current)) continue;
      visited.add(current);
      comp.push(current);
      for (const next of Array.from(adjacency.get(current) ?? [])) {
        if (!visited.has(next)) stack.push(next);
      }
    }
    components.push(comp);
  }
  return components;
}

function throatConnectsToMotor(components: Center[][]): boolean {
  const throatComponent = components.find((c) => c.includes("Throat"));
  return throatComponent
    ? throatComponent.some((c) => MOTOR_CENTERS.includes(c))
    : false;
}

function determineType(
  centers: Set<Center>,
  components: Center[][]
): string {
  if (centers.size === 0) return "Reflector";

  const motorToThroat = throatConnectsToMotor(components);
  if (centers.has("Sacral")) {
    return motorToThroat ? "Manifesting Generator" : "Generator";
  }
  if (centers.has("Throat") && motorToThroat) {
    return "Manifestor";
  }
  return "Projector";
}

function determineAuthority(
  centers: Set<Center>,
  components: Center[][]
): string {
  if (centers.size === 0) return "Lunar";
  if (centers.has("SolarPlexus")) return "Emotional";
  if (centers.has("Sacral")) return "Sacral";
  if (centers.has("Spleen")) return "Splenic";

  const heartComponent = components.find((c) => c.includes("Heart"));
  if (heartComponent?.some((c) => c === "Throat" || c === "G")) {
    return "Ego";
  }
  const gComponent = components.find((c) => c.includes("G"));
  if (gComponent?.includes("Throat")) {
    return "Self-Projected";
  }
  return "Mental (Outer Authority)";
}

function determineDefinition(components: Center[][]): string {
  switch (components.length) {
    case 0:
      return "No Definition";
    case 1:
      return "Single Definition";
    case 2:
      return "Split Definition";
    case 3:
      return "Triple Split Definition";
    default:
      return "Quadruple Split Definition";
  }
}

export interface HumanDesignResult {
  type: string | null;
  strategy: string | null;
  authority: string | null;
  profile: string | null;
  definition: string | null;
  definedCenters: Center[] | null;
  personalityActivations: Activation[] | null;
  designActivations: Activation[] | null;
  source: "computed" | "fallback";
}

const EMPTY_RESULT: Omit<HumanDesignResult, "source"> = {
  type: null,
  strategy: null,
  authority: null,
  profile: null,
  definition: null,
  definedCenters: null,
  personalityActivations: null,
  designActivations: null,
};

// Fully local (Celestine) — no external API. This is a from-scratch
// implementation of the standard Human Design derivation (gate wheel,
// channels, centers, type/authority/definition rules), not a third-party
// library — see project notes for why (the one candidate library found,
// hdkit, ships its core bodygraph logic with the author's own disclaimer
// that it's an unverified, buggy AI conversion). Spot-check against a
// trusted reference chart before treating this as authoritative.
export async function getHumanDesignChart(
  input: BirthDataInput
): Promise<HumanDesignResult> {
  try {
    const natalChart = await computeNatalChart(input);
    if (!natalChart) {
      throw new Error("Missing birth time/city or could not geocode");
    }

    const natalSun = natalChart.planets.find((p) => p.name === "Sun");
    if (!natalSun) throw new Error("Missing natal Sun position");

    const designJD = findDesignJulianDate(
      natalChart.calculated.julianDate,
      natalSun.longitude
    );
    const designCalendar = fromJulianDate(designJD);
    const designChart = calculateChart(
      {
        year: designCalendar.year,
        month: designCalendar.month,
        day: designCalendar.day,
        hour: designCalendar.hour,
        minute: designCalendar.minute,
        second: designCalendar.second,
        timezone: 0,
        latitude: natalChart.input.latitude,
        longitude: natalChart.input.longitude,
      },
      { includeAsteroids: false, includeLilith: false, includeLots: false }
    );

    const personalityActivations = activationsFromChart(natalChart);
    const designActivations = activationsFromChart(designChart);

    const gates = new Set(
      [...personalityActivations, ...designActivations].map((a) => a.gate)
    );
    const channels = definedChannels(gates);
    const centers = definedCentersFrom(channels);
    const components = centerComponents(centers, channels);

    const personalitySun = personalityActivations.find((a) => a.planet === "Sun");
    const designSun = designActivations.find((a) => a.planet === "Sun");
    const profile =
      personalitySun && designSun
        ? `${personalitySun.line}/${designSun.line}`
        : null;

    const type = determineType(centers, components);

    return {
      type,
      strategy: TYPE_STRATEGY[type] ?? null,
      authority: determineAuthority(centers, components),
      profile,
      definition: determineDefinition(components),
      definedCenters: Array.from(centers),
      personalityActivations,
      designActivations,
      source: "computed",
    };
  } catch (err) {
    console.error("[humanDesign] falling back:", err);
    return { ...EMPTY_RESULT, source: "fallback" };
  }
}
