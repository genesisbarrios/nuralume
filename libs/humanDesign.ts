export interface HumanDesignResult {
  type: string | null;
  strategy: string | null;
  authority: string | null;
  profile: string | null;
  source: "api" | "fallback";
}

export interface BirthDataInput {
  birthDate: string; // ISO yyyy-mm-dd
  birthTime?: string | null; // HH:mm
  city?: string | null;
  countryCode?: string | null;
}

export const HUMAN_DESIGN_TYPES = [
  {
    type: "Generator",
    strategy: "Respond to what shows up, rather than initiating.",
    description:
      "About 70% of people. Generators have sustainable energy for work they love and are here to master their craft through response.",
  },
  {
    type: "Manifesting Generator",
    strategy: "Respond, then inform others before acting.",
    description:
      "A fast-moving Generator variant — multi-passionate, efficient, and prone to skipping steps that others find necessary.",
  },
  {
    type: "Manifestor",
    strategy: "Inform others before you act.",
    description:
      "About 9% of people. Manifestors initiate and are here to make things happen, independently of others' response.",
  },
  {
    type: "Projector",
    strategy: "Wait for invitation and recognition.",
    description:
      "About 20% of people. Projectors see others deeply and guide effectively, but thrive most when invited rather than pushing.",
  },
  {
    type: "Reflector",
    strategy: "Wait a full lunar cycle before big decisions.",
    description:
      "Under 1% of people. Reflectors are highly sensitive mirrors of their environment, and benefit from patience above all.",
  },
];

// No verified Human Design provider is wired up: the AstroAPI SDK (libs/astroApiClient.ts)
// doesn't expose a Human Design endpoint, and HUMAN_DESIGN_API_KEY was a guess at a
// different provider we don't have confirmed docs for. This always returns the fallback
// so the UI shows the static type overview until a real provider is confirmed and wired in.
export async function getHumanDesignChart(
  _input: BirthDataInput
): Promise<HumanDesignResult> {
  return {
    type: null,
    strategy: null,
    authority: null,
    profile: null,
    source: "fallback",
  };
}
