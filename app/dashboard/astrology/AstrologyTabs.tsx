"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Hash, Moon, Pencil, PersonStanding, RefreshCw, Sun } from "lucide-react";
import ApiFallbackNotice from "@/components/dashboard/ApiFallbackNotice";
import BirthDataForm from "@/components/dashboard/BirthDataForm";
import type { CelestialVariant } from "@/components/dashboard/CelestialOrb";
import type { NumerologyProfile } from "@/libs/numerology";
import type { AstrologyPlanet, AstrologyResult } from "@/libs/astrology";
import type { HoroscopeFrequency } from "@/libs/horoscope";
import type { Center, HumanDesignResult } from "@/libs/humanDesign";
import type { ProfileBirthData } from "@/libs/profile";
import type { ZodiacSign } from "@/libs/zodiac";
import type { PlanetName } from "@/components/dashboard/PlanetIcons3D";
import { getProfileBirthData } from "@/libs/profile";
import {
  getOrComputeBirthChart,
  getOrComputeHoroscope,
  getOrComputeHumanDesign,
  getOrComputeNumerology,
  type HoroscopeBundle,
} from "./actions";

const AstroSceneRoot = dynamic(
  () => import("@/components/dashboard/AstroSceneRoot"),
  { ssr: false }
);
const CelestialOrb = dynamic(
  () => import("@/components/dashboard/CelestialOrb"),
  { ssr: false }
);
const ZodiacAnimalIcon = dynamic(
  () =>
    import("@/components/dashboard/ZodiacAnimals3D").then(
      (m) => m.ZodiacAnimalIcon
    ),
  { ssr: false }
);
const PlanetIcon = dynamic(
  () => import("@/components/dashboard/PlanetIcons3D").then((m) => m.PlanetIcon),
  { ssr: false }
);
const HumanFigure3D = dynamic(
  () => import("@/components/dashboard/HumanFigure3D"),
  { ssr: false }
);

type Tab = "birth_chart" | "horoscope" | "numerology" | "human_design";

const TAB_LABELS: Record<Tab, string> = {
  birth_chart: "Birth Chart",
  horoscope: "Horoscope",
  numerology: "Numerology",
  human_design: "Human Design",
};

const TAB_ICONS: Record<Tab, typeof Sun> = {
  birth_chart: Sun,
  horoscope: Moon,
  numerology: Hash,
  human_design: PersonStanding,
};

export default function AstrologyTabs({
  initialProfile,
  initialBirthChart,
  initialHoroscope,
  initialNumerology,
  initialHumanDesign,
}: {
  initialProfile: ProfileBirthData | null;
  initialBirthChart: AstrologyResult | null;
  initialHoroscope: HoroscopeBundle | null;
  initialNumerology: NumerologyProfile | null;
  initialHumanDesign: HumanDesignResult | null;
}) {
  const [tab, setTab] = useState<Tab>("birth_chart");
  const [profile, setProfile] = useState(initialProfile);
  const [editingForm, setEditingForm] = useState(false);
  const [birthChart, setBirthChart] = useState(initialBirthChart);
  const [horoscope, setHoroscope] = useState(initialHoroscope);
  const [numerology, setNumerology] = useState(initialNumerology);
  const [humanDesign, setHumanDesign] = useState(initialHumanDesign);
  const [isPending, startTransition] = useTransition();

  const hasBirthData = Boolean(profile?.displayName && profile?.birthDate);

  const refresh = (target: Tab) => {
    startTransition(async () => {
      if (target === "birth_chart") {
        setBirthChart(await getOrComputeBirthChart(true));
      } else if (target === "horoscope") {
        setHoroscope(await getOrComputeHoroscope(true));
      } else if (target === "numerology") {
        setNumerology(await getOrComputeNumerology(true));
      } else {
        setHumanDesign(await getOrComputeHumanDesign(true));
      }
    });
  };

  const handleSaved = async () => {
    setEditingForm(false);
    setProfile(await getProfileBirthData());
    refresh("birth_chart");
    refresh("horoscope");
    refresh("numerology");
    refresh("human_design");
  };

  return (
    <div>
      <AstroSceneRoot />
      <div className="mb-4 grid grid-cols-4 gap-1 rounded-xl bg-base-200 p-1">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
          const Icon = TAB_ICONS[t];
          const isActive = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 transition-colors ${
                isActive
                  ? "bg-base-100 text-primary shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{TAB_LABELS[t]}</span>
            </button>
          );
        })}
      </div>

      {editingForm ? (
        <BirthDataForm
          initial={profile}
          onSaved={handleSaved}
          onCancel={hasBirthData ? () => setEditingForm(false) : undefined}
        />
      ) : (
        <>
          {tab === "birth_chart" &&
            (hasBirthData ? (
              <BirthChartPanel
                result={birthChart}
                isPending={isPending}
                onRefresh={() => refresh("birth_chart")}
                onEdit={() => setEditingForm(true)}
              />
            ) : (
              <NeedsBirthData onAdd={() => setEditingForm(true)} />
            ))}
          {tab === "horoscope" &&
            (hasBirthData ? (
              <HoroscopePanel
                bundle={horoscope}
                isPending={isPending}
                onRefresh={() => refresh("horoscope")}
                onEdit={() => setEditingForm(true)}
              />
            ) : (
              <NeedsBirthData onAdd={() => setEditingForm(true)} />
            ))}
          {tab === "numerology" &&
            (hasBirthData ? (
              <NumerologyPanel
                result={numerology}
                isPending={isPending}
                onRefresh={() => refresh("numerology")}
                onEdit={() => setEditingForm(true)}
              />
            ) : (
              <NeedsBirthData onAdd={() => setEditingForm(true)} />
            ))}
          {tab === "human_design" &&
            (hasBirthData ? (
              <HumanDesignPanel
                result={humanDesign}
                isPending={isPending}
                onRefresh={() => refresh("human_design")}
                onEdit={() => setEditingForm(true)}
              />
            ) : (
              <NeedsBirthData onAdd={() => setEditingForm(true)} />
            ))}
        </>
      )}
    </div>
  );
}

function NeedsBirthData({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl bg-base-200 p-6 text-center">
      <p className="text-sm text-base-content/70">
        Add your name and birth date to see this.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="btn btn-primary btn-sm mt-4"
      >
        Add birth details
      </button>
    </div>
  );
}

function RefreshButton({
  onRefresh,
  isPending,
  onEdit,
}: {
  onRefresh: () => void;
  isPending: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        onClick={onRefresh}
        disabled={isPending}
        className="btn btn-ghost btn-xs gap-1"
      >
        <RefreshCw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
        Refresh
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="btn btn-ghost btn-xs gap-1"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
    </div>
  );
}

const PLANET_MEANING: Record<string, string> = {
  Sun: "Core identity and ego — who you fundamentally are.",
  Moon: "Emotions, instincts, and your inner world.",
  Mercury: "Communication, thinking, and how you process information.",
  Venus: "Love, beauty, and what you value.",
  Mars: "Drive, action, and how you assert yourself.",
  Jupiter: "Growth, luck, and expansion.",
  Saturn: "Discipline, structure, and lessons through limitation.",
  Uranus: "Change, rebellion, and sudden insight.",
  Neptune: "Dreams, intuition, and spirituality.",
  Pluto: "Transformation, power, and what lies beneath the surface.",
  Chiron: "The “wounded healer” — where you've been hurt, and how you heal others.",
};

const SIGN_MEANING: Record<string, string> = {
  Aries: "Bold, direct, and quick to act — natural initiator energy.",
  Taurus: "Steady, sensual, and grounded — values comfort and consistency.",
  Gemini: "Curious, adaptable, and communicative — thrives on variety.",
  Cancer: "Nurturing, intuitive, and protective — tied to home and feeling.",
  Leo: "Warm, expressive, and confident — drawn to creativity and recognition.",
  Virgo: "Precise, practical, and analytical — finds meaning in improvement.",
  Libra: "Diplomatic and harmony-seeking — values balance and fairness.",
  Scorpio: "Intense, perceptive, and transformative — drawn to depth over surface.",
  Sagittarius: "Adventurous, honest, and philosophical — craves freedom and meaning.",
  Capricorn: "Disciplined, ambitious, and patient — builds for the long term.",
  Aquarius: "Independent, inventive, and idealistic — thinks in terms of the collective.",
  Pisces: "Empathetic, imaginative, and dreamy — attuned to the unseen.",
};

const HOUSE_MEANING: Record<number, string> = {
  1: "Self, identity, and how you present to the world.",
  2: "Money, possessions, and what you value.",
  3: "Communication, siblings, and everyday learning.",
  4: "Home, family, and your roots.",
  5: "Creativity, romance, and self-expression.",
  6: "Health, work, and daily routines.",
  7: "Partnerships and one-on-one relationships.",
  8: "Transformation, intimacy, and shared resources.",
  9: "Philosophy, travel, and higher learning.",
  10: "Career, reputation, and public life.",
  11: "Community, friendships, and hopes for the future.",
  12: "The subconscious, spirituality, and letting go.",
};

const CENTER_MEANING: Record<Center, { topic: string; defined: string; undefined: string }> = {
  Head: {
    topic: "Mental pressure and inspiration",
    defined: "You have a consistent internal source of mental pressure and inspiration — your own questions drive you, reliably, from within.",
    undefined: "You take in and amplify others' questions and ideas. Open to inspiration from anywhere, but can absorb pressure to have answers that were never really yours to solve.",
  },
  Ajna: {
    topic: "Thinking and certainty",
    defined: "You have a fixed, consistent way of processing information and forming opinions — your certainty is reliable and doesn't shift much with company.",
    undefined: "You're flexible and open-minded, able to see many sides of an idea. Can also absorb others' opinions as your own, or feel pressure to seem certain when you're not.",
  },
  Throat: {
    topic: "Communication and action",
    defined: "You have a consistent, reliable way of speaking and acting — your voice and presence come through the same way regardless of who's around.",
    undefined: "Your communication style shifts depending on who you're with. Can amplify whatever's being said around you, and may feel pressure to speak or be seen when it's not actually your moment.",
  },
  G: {
    topic: "Identity, love, and direction",
    defined: "You have a fixed sense of who you are and where you're headed — your identity and direction hold steady no matter the environment.",
    undefined: "Your sense of self shifts with your environment and relationships. Often finds identity and direction through others rather than a fixed inner compass — which can be a gift for adaptability, or disorienting.",
  },
  Heart: {
    topic: "Willpower and self-worth",
    defined: "You have consistent willpower — reliable follow-through on commitments, and a steady sense of your own worth.",
    undefined: "Your willpower is inconsistent. May overcompensate to prove your worth to others, or need to learn that your value was never something to prove in the first place.",
  },
  Spleen: {
    topic: "Instinct and health",
    defined: "You have consistent, in-the-moment intuition about health, safety, and what's good for you — a steady internal alarm system.",
    undefined: "You amplify the fears and instincts of people around you. May hold onto unhealthy situations or relationships longer than is good for you, but can develop real wisdom about spotting what isn't right for you.",
  },
  SolarPlexus: {
    topic: "Emotions",
    defined: "You move through an emotional wave — there's no truth 'in the now' for you, and clarity comes with time, not in the heat of the moment.",
    undefined: "You're an emotional sponge, absorbing and amplifying the feelings of everyone around you. Emotionally sensitive to your environment, with real potential for emotional wisdom once you learn what's yours and what isn't.",
  },
  Sacral: {
    topic: "Life force and work energy",
    defined: "You have consistent, sustainable life-force energy — a reliable gut-level yes/no response that tells you what to engage with.",
    undefined: "Your energy levels are inconsistent. Can amplify and match the sacral energy of people around you, working past your actual limits — rest is more important for you than it is for defined types.",
  },
  Root: {
    topic: "Pressure and drive",
    defined: "You handle pressure and stress in a steady, consistent way — comfortable operating under a deadline or push to act.",
    undefined: "You amplify the pressure and urgency around you, and may feel rushed or adopt stress that was never actually yours. Learning that the pressure isn't yours to carry brings real ease over time.",
  },
};

function ExpandChevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      className={`h-3 w-3 text-base-content/40 transition-transform ${
        open ? "rotate-180" : ""
      }`}
    />
  );
}

function BirthChartPanel({
  result,
  isPending,
  onRefresh,
  onEdit,
}: {
  result: AstrologyResult | null;
  isPending: boolean;
  onRefresh: () => void;
  onEdit: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (key: string) =>
    setExpanded((current) => (current === key ? null : key));

  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  const findPlanet = (name: string): AstrologyPlanet | undefined =>
    result.planets?.find((p) => p.name === name);

  const otherPlanets =
    result.planets?.filter((p) => p.name !== "Sun" && p.name !== "Moon") ??
    [];

  return (
    <div>
      {result.source === "fallback" && (
        <ApiFallbackNotice message="Showing your sun sign only — add a birth time and city for your full chart." />
      )}
      <div className="mb-4 grid grid-cols-3 text-center">
        {(["sun", "moon", "rising"] as CelestialVariant[]).map((variant) => (
          <div key={variant} className="flex justify-center">
            <CelestialOrb variant={variant} className="pointer-events-none" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          {
            key: "sun",
            sign: result.sunSign as string | null,
            label: "Sun",
            degree: findPlanet("Sun")?.degree ?? null,
            house: findPlanet("Sun")?.house ?? null,
            isRetrograde: findPlanet("Sun")?.isRetrograde ?? false,
            meaning: PLANET_MEANING.Sun,
          },
          {
            key: "moon",
            sign: result.moonSign,
            label: "Moon",
            degree: findPlanet("Moon")?.degree ?? null,
            house: findPlanet("Moon")?.house ?? null,
            isRetrograde: findPlanet("Moon")?.isRetrograde ?? false,
            meaning: PLANET_MEANING.Moon,
          },
          {
            key: "rising",
            sign: result.risingSign,
            label: "Rising",
            degree: result.risingDegree,
            house: null,
            isRetrograde: false,
            meaning: "How you come across to others — your outward style.",
          },
        ].map(({ key, sign, label, degree, house, isRetrograde, meaning }) => {
          const isOpen = expanded === key;
          const hasDetail = degree != null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => hasDetail && toggle(key)}
              className={`rounded-xl bg-base-200 p-4 text-center transition-colors ${
                hasDetail ? "cursor-pointer hover:bg-base-300" : "cursor-default"
              }`}
            >
              <p className="font-handwritten text-xl text-primary">
                {sign ?? "—"}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-base-content/60">
                {label}
                {hasDetail && <ExpandChevron open={isOpen} />}
              </p>
              {isOpen && hasDetail && (
                <div className="mt-2 border-t border-base-300 pt-2 text-left text-[11px] text-base-content/60">
                  <p>
                    {degree}° {sign}
                  </p>
                  {house != null && <p>House {house}</p>}
                  {isRetrograde && <p>Retrograde</p>}
                  <p className="mt-1">{meaning}</p>
                  {sign && SIGN_MEANING[sign] && (
                    <p className="mt-1">
                      <span className="font-semibold">In {sign}:</span>{" "}
                      {SIGN_MEANING[sign]}
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {otherPlanets.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-handwritten text-lg">Planets</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {otherPlanets.map((p) => {
              const key = `planet-${p.name}`;
              const isOpen = expanded === key;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex flex-col items-center rounded-lg bg-base-200 p-2 text-center transition-colors hover:bg-base-300"
                >
                  <PlanetIcon
                    name={p.name as PlanetName}
                    className="pointer-events-none"
                  />
                  <p className="flex items-center gap-1 text-[10px] text-base-content/50">
                    {p.name}
                    <ExpandChevron open={isOpen} />
                  </p>
                  <p className="text-sm font-semibold">
                    {p.sign}
                    {p.isRetrograde && (
                      <span className="ml-1 text-warning">R</span>
                    )}
                  </p>
                  {isOpen && (
                    <div className="mt-2 w-full border-t border-base-300 pt-2 text-left text-[11px] text-base-content/60">
                      <p>{p.degree}° {p.sign}</p>
                      <p>House {p.house}</p>
                      {p.isRetrograde && <p>Retrograde</p>}
                      <p className="mt-1">{PLANET_MEANING[p.name]}</p>
                      {SIGN_MEANING[p.sign] && (
                        <p className="mt-1">
                          <span className="font-semibold">In {p.sign}:</span>{" "}
                          {SIGN_MEANING[p.sign]}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {result.houses && (
        <div className="mt-6">
          <p className="mb-2 font-handwritten text-lg">Houses</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {result.houses.map((h) => {
              const key = `house-${h.house}`;
              const isOpen = expanded === key;
              return (
                <button
                  key={h.house}
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex flex-col items-center rounded-lg bg-base-200 p-2 text-center transition-colors hover:bg-base-300"
                >
                  <ZodiacAnimalIcon
                    sign={h.sign as ZodiacSign}
                    className="pointer-events-none"
                  />
                  <p className="flex items-center gap-1 text-[10px] text-base-content/50">
                    House {h.house}
                    <ExpandChevron open={isOpen} />
                  </p>
                  <p className="text-sm font-semibold">{h.sign}</p>
                  <p className="text-[10px] text-base-content/50">
                    {h.degree}°
                  </p>
                  {isOpen && (
                    <div className="mt-2 w-full border-t border-base-300 pt-2 text-left text-[11px] text-base-content/60">
                      <p>{HOUSE_MEANING[h.house]}</p>
                      {SIGN_MEANING[h.sign] && (
                        <p className="mt-1">
                          <span className="font-semibold">In {h.sign}:</span>{" "}
                          {SIGN_MEANING[h.sign]}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <RefreshButton onRefresh={onRefresh} isPending={isPending} onEdit={onEdit} />
    </div>
  );
}

const FREQUENCY_LABELS: Record<HoroscopeFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
};

function HoroscopePanel({
  bundle,
  isPending,
  onRefresh,
  onEdit,
}: {
  bundle: HoroscopeBundle | null;
  isPending: boolean;
  onRefresh: () => void;
  onEdit: () => void;
}) {
  const [frequency, setFrequency] = useState<HoroscopeFrequency>("daily");

  if (!bundle) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  const result = bundle[frequency];

  return (
    <div>
      <div className="tabs tabs-boxed mb-3 justify-center bg-base-200">
        {(Object.keys(FREQUENCY_LABELS) as HoroscopeFrequency[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`tab tab-sm ${frequency === f ? "tab-active" : ""}`}
            onClick={() => setFrequency(f)}
          >
            {FREQUENCY_LABELS[f]}
          </button>
        ))}
      </div>

      {result.source === "fallback" && (
        <ApiFallbackNotice message="Showing general guidance — add a birth time and city for a horoscope based on your real transits." />
      )}
      <p className="mb-2 text-center font-handwritten text-2xl">
        {result.sign}
      </p>
      <p className="rounded-xl bg-base-200 p-5 text-center text-sm leading-relaxed">
        {result.text}
      </p>
      <RefreshButton onRefresh={onRefresh} isPending={isPending} onEdit={onEdit} />
    </div>
  );
}

function NumerologyPanel({
  result,
  isPending,
  onRefresh,
  onEdit,
}: {
  result: NumerologyProfile | null;
  isPending: boolean;
  onRefresh: () => void;
  onEdit: () => void;
}) {
  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  const rows = [
    { label: "Life Path", value: result.lifePathNumber },
    { label: "Destiny", value: result.destinyNumber },
    { label: "Soul Urge", value: result.soulUrgeNumber },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl bg-base-200 p-4 text-center"
          >
            <p className="font-handwritten text-3xl text-primary">
              {row.value}
            </p>
            <p className="mt-1 text-xs text-base-content/60">{row.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <p key={row.label} className="text-sm">
            <span className="font-semibold">
              {row.label} {row.value}:
            </span>{" "}
            {result.meanings[row.value]}
          </p>
        ))}
      </div>
      <RefreshButton onRefresh={onRefresh} isPending={isPending} onEdit={onEdit} />
    </div>
  );
}

function HumanDesignPanel({
  result,
  isPending,
  onRefresh,
  onEdit,
}: {
  result: HumanDesignResult | null;
  isPending: boolean;
  onRefresh: () => void;
  onEdit: () => void;
}) {
  const [hoveredCenter, setHoveredCenter] = useState<Center | null>(null);

  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  const isHoveredDefined = hoveredCenter
    ? (result.definedCenters?.includes(hoveredCenter) ?? false)
    : false;

  return (
    <div>
      {result.source === "fallback" && (
        <ApiFallbackNotice message="Add a birth time and city to compute your real Human Design chart." />
      )}
      {result.type && (
        <>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="col-span-2 rounded-xl bg-base-200 p-4">
              <p className="font-handwritten text-2xl text-primary">
                {result.type}
              </p>
              <p className="mt-1 text-xs text-base-content/60">Type</p>
            </div>
            <div className="rounded-xl bg-base-200 p-4">
              <p className="font-handwritten text-xl text-primary">
                {result.authority}
              </p>
              <p className="mt-1 text-xs text-base-content/60">Authority</p>
            </div>
            <div className="rounded-xl bg-base-200 p-4">
              <p className="font-handwritten text-xl text-primary">
                {result.profile}
              </p>
              <p className="mt-1 text-xs text-base-content/60">Profile</p>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-base-200 p-4 text-center text-sm leading-relaxed">
            <span className="font-semibold">Strategy: </span>
            {result.strategy}
          </p>

          <p className="mt-3 text-center text-xs text-base-content/50">
            {result.definition} &middot;{" "}
            {result.definedCenters?.length ?? 0} of 9 centers defined
          </p>

          {result.definedCenters && (
            <div className="mt-6">
              <HumanFigure3D
                definedCenters={result.definedCenters}
                onHoverCenter={setHoveredCenter}
              />
              <p className="mt-1 text-center text-[10px] text-base-content/40">
                Hover or tap a label for what it means for that center to be
                defined.
              </p>
              <div className="mt-3 min-h-[5.5rem] rounded-xl bg-base-200 p-4 text-sm">
                {hoveredCenter ? (
                  <>
                    <p className="font-semibold">
                      {hoveredCenter} —{" "}
                      <span className="text-base-content/60">
                        {CENTER_MEANING[hoveredCenter].topic}
                      </span>
                    </p>
                    <p className="mt-1 text-base-content/80">
                      <span className="font-semibold">
                        {isHoveredDefined ? "Defined: " : "Undefined: "}
                      </span>
                      {isHoveredDefined
                        ? CENTER_MEANING[hoveredCenter].defined
                        : CENTER_MEANING[hoveredCenter].undefined}
                    </p>
                  </>
                ) : (
                  <p className="text-base-content/50">
                    Hover a center label above to see what it means.
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
      <RefreshButton onRefresh={onRefresh} isPending={isPending} onEdit={onEdit} />
    </div>
  );
}
