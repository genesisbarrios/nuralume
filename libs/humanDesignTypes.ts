// Pure static data — deliberately kept dependency-free (no celestine, no
// astrology.ts) so client components can import it without dragging the
// ~4MB celestine computation library into the browser bundle. If you need
// the actual chart computation, import from libs/humanDesign.ts instead
// (server-only usage).

export const TYPE_STRATEGY: Record<string, string> = {
  Generator: "Respond to what shows up, rather than initiating.",
  "Manifesting Generator": "Respond, then inform others before acting.",
  Manifestor: "Inform others before you act.",
  Projector: "Wait for invitation and recognition.",
  Reflector: "Wait a full lunar cycle before big decisions.",
};

export interface HumanDesignTypeInfo {
  type: string;
  strategy: string;
  description: string;
  lifeTheme: string;
  energyMechanics: string;
  // The "signature" feeling when living correctly, and the "not-self"
  // feeling that signals you've drifted from strategy — a core, standard
  // part of the system (not something niche/uncertain like the gate wheel).
  signature: string;
  notSelf: string;
}

export const HUMAN_DESIGN_TYPES: HumanDesignTypeInfo[] = [
  {
    type: "Generator",
    strategy: TYPE_STRATEGY.Generator,
    description:
      "About 70% of people. Generators have sustainable energy for work they love and are here to master their craft through response.",
    lifeTheme:
      "Mastery through response — building deep satisfaction by doing work that genuinely lights you up, rather than chasing it directly.",
    energyMechanics:
      "Sacral-defined: a sustainable, renewable life-force engine built for hard work. The gut gives a felt yes/no to what shows up — that response, not self-generated initiation, is the reliable signal for what to engage with.",
    signature: "Satisfaction",
    notSelf:
      "Frustration — the sign you've said yes to something your gut never actually agreed to.",
  },
  {
    type: "Manifesting Generator",
    strategy: TYPE_STRATEGY["Manifesting Generator"],
    description:
      "A fast-moving Generator variant — multi-passionate, efficient, and prone to skipping steps that others find necessary.",
    lifeTheme:
      "Multi-passionate mastery — moving quickly across several things at once instead of one linear path, and still building real skill in each.",
    energyMechanics:
      "Same sustainable Sacral engine as a Generator, wired to move fast and skip steps once the gut response is clear. Informing others before acting smooths out the friction that speed otherwise causes with people who aren't expecting it.",
    signature: "Satisfaction and peace",
    notSelf:
      "Frustration and anger — from skipping the 'inform' step, or from forcing that fast energy into a slow, linear process that doesn't fit.",
  },
  {
    type: "Manifestor",
    strategy: TYPE_STRATEGY.Manifestor,
    description:
      "About 9% of people. Manifestors initiate and are here to make things happen, independently of others' response.",
    lifeTheme:
      "Initiation and impact — here to start things and set energy in motion, independently, without waiting on permission or response.",
    energyMechanics:
      "Not Sacral-defined, so energy arrives in bursts rather than a sustainable hum. A motor center connects directly to the Throat, giving the capacity to act on impulse — informing others first is what keeps that impact from blindsiding people.",
    signature: "Peace",
    notSelf:
      "Anger — shows up when informing gets skipped and others feel controlled, or try to control the Manifestor's movement in return.",
  },
  {
    type: "Projector",
    strategy: TYPE_STRATEGY.Projector,
    description:
      "About 20% of people. Projectors see others deeply and guide effectively, but thrive most when invited rather than pushing.",
    lifeTheme:
      "Guidance and systems — here to see others deeply and direct energy wisely, not to generate constant output themselves.",
    energyMechanics:
      "No Sacral definition and no motor connected to the Throat, so there's no built-in sustainable energy source. Designed for focused bursts with real rest between — recognition and invitation are what let that guidance actually land instead of being resisted.",
    signature: "Success",
    notSelf:
      "Bitterness — surfaces when real insight goes unrecognized, or invitations never come and the Projector pushes their energy out unasked.",
  },
  {
    type: "Reflector",
    strategy: TYPE_STRATEGY.Reflector,
    description:
      "Under 1% of people. Reflectors are highly sensitive mirrors of their environment, and benefit from patience above all.",
    lifeTheme:
      "Reflection and evaluation — a sensitive mirror for the health of whatever community or environment they're in.",
    energyMechanics:
      "No centers are consistently defined at all, so there's no fixed energy type to lean on — everything is sampled and amplified from the environment, on a roughly 28-day lunar cycle, which is why big decisions benefit from waiting that long.",
    signature: "Surprise and delight",
    notSelf:
      "Disappointment — shows up when decisions get rushed, or the wrong environment is chosen and there's nothing healthy left to reflect.",
  },
];
