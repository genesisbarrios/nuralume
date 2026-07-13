"use client";

import { useState, useTransition } from "react";
import { Fingerprint, Globe2, Hash, Moon, RefreshCw, Sun } from "lucide-react";
import ApiFallbackNotice from "@/components/dashboard/ApiFallbackNotice";
import BirthDataForm from "@/components/dashboard/BirthDataForm";
import type { NumerologyProfile } from "@/libs/numerology";
import type { AstrologyResult } from "@/libs/astrology";
import type { WellnessInsightResult } from "@/libs/wellnessInsights";
import type { AstrocartographyResult } from "@/libs/astrocartography";
import type { HoroscopeResult } from "@/libs/horoscope";
import type { HumanDesignResult } from "@/libs/humanDesign";
import { HUMAN_DESIGN_TYPES } from "@/libs/humanDesign";
import type { ProfileBirthData } from "@/libs/profile";
import { getProfileBirthData } from "@/libs/profile";
import {
  getAstrocartographyForProfile,
  getHoroscopeForProfile,
  getOrComputeBirthChart,
  getOrComputeHumanDesign,
  getOrComputeNumerology,
  getWellnessForProfile,
} from "./actions";

type Tab =
  | "birth_chart"
  | "horoscope"
  | "astrocartography"
  | "numerology"
  | "human_design";

const TAB_LABELS: Record<Tab, string> = {
  birth_chart: "Birth Chart",
  horoscope: "Horoscope",
  astrocartography: "Astrocartography",
  numerology: "Numerology",
  human_design: "Human Design",
};

const TAB_ICONS: Record<Tab, typeof Sun> = {
  birth_chart: Sun,
  horoscope: Moon,
  astrocartography: Globe2,
  numerology: Hash,
  human_design: Fingerprint,
};

export default function AstrologyTabs({
  initialProfile,
  initialBirthChart,
  initialWellness,
  initialHoroscope,
  initialAstrocartography,
  initialNumerology,
  initialHumanDesign,
}: {
  initialProfile: ProfileBirthData | null;
  initialBirthChart: AstrologyResult | null;
  initialWellness: WellnessInsightResult | null;
  initialHoroscope: HoroscopeResult | null;
  initialAstrocartography: AstrocartographyResult | null;
  initialNumerology: NumerologyProfile | null;
  initialHumanDesign: HumanDesignResult;
}) {
  const [tab, setTab] = useState<Tab>("birth_chart");
  const [profile, setProfile] = useState(initialProfile);
  const [editingForm, setEditingForm] = useState(
    !initialProfile?.displayName || !initialProfile?.birthDate
  );
  const [birthChart, setBirthChart] = useState(initialBirthChart);
  const [wellness, setWellness] = useState(initialWellness);
  const [horoscope, setHoroscope] = useState(initialHoroscope);
  const [astrocartography, setAstrocartography] = useState(
    initialAstrocartography
  );
  const [numerology, setNumerology] = useState(initialNumerology);
  const [humanDesign, setHumanDesign] = useState(initialHumanDesign);
  const [isPending, startTransition] = useTransition();

  const hasBirthData = Boolean(profile?.displayName && profile?.birthDate);

  const refresh = (target: Tab) => {
    startTransition(async () => {
      if (target === "birth_chart") {
        const [chart, wellnessResult] = await Promise.all([
          getOrComputeBirthChart(true),
          getWellnessForProfile(),
        ]);
        setBirthChart(chart);
        setWellness(wellnessResult);
      } else if (target === "horoscope") {
        setHoroscope(await getHoroscopeForProfile());
      } else if (target === "astrocartography") {
        setAstrocartography(await getAstrocartographyForProfile());
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
    refresh("astrocartography");
    refresh("numerology");
    refresh("human_design");
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-5 gap-1 rounded-xl bg-base-200 p-1">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
          const Icon = TAB_ICONS[t];
          const isActive = tab === t;
          return (
            <button
              key={t}
              type="button"
              title={TAB_LABELS[t]}
              onClick={() => setTab(t)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 transition-colors ${
                isActive
                  ? "bg-base-100 text-primary shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="px-0.5 text-center text-[9px] leading-tight">
                {TAB_LABELS[t]}
              </span>
            </button>
          );
        })}
      </div>

      {!hasBirthData || editingForm ? (
        <BirthDataForm initial={profile} onSaved={handleSaved} />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setEditingForm(true)}
            className="mb-3 text-xs text-primary underline"
          >
            Edit birth details
          </button>

          {tab === "birth_chart" && (
            <BirthChartPanel
              result={birthChart}
              wellness={wellness}
              isPending={isPending}
              onRefresh={() => refresh("birth_chart")}
            />
          )}
          {tab === "horoscope" && (
            <HoroscopePanel
              result={horoscope}
              isPending={isPending}
              onRefresh={() => refresh("horoscope")}
            />
          )}
          {tab === "astrocartography" && (
            <AstrocartographyPanel
              result={astrocartography}
              isPending={isPending}
              onRefresh={() => refresh("astrocartography")}
            />
          )}
          {tab === "numerology" && (
            <NumerologyPanel
              result={numerology}
              isPending={isPending}
              onRefresh={() => refresh("numerology")}
            />
          )}
          {tab === "human_design" && (
            <HumanDesignPanel
              result={humanDesign}
              isPending={isPending}
              onRefresh={() => refresh("human_design")}
            />
          )}
        </>
      )}
    </div>
  );
}

function RefreshButton({
  onRefresh,
  isPending,
}: {
  onRefresh: () => void;
  isPending: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={isPending}
      className="btn btn-ghost btn-xs mt-3 gap-1"
    >
      <RefreshCw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
}

function BirthChartPanel({
  result,
  wellness,
  isPending,
  onRefresh,
}: {
  result: AstrologyResult | null;
  wellness: WellnessInsightResult | null;
  isPending: boolean;
  onRefresh: () => void;
}) {
  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  return (
    <div>
      {result.source === "fallback" && (
        <ApiFallbackNotice message="Showing your sun sign only — add a birth time, city, and country for your full chart." />
      )}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-base-200 p-4">
          <p className="font-handwritten text-xl text-primary">
            {result.sunSign}
          </p>
          <p className="mt-1 text-xs text-base-content/60">Sun</p>
        </div>
        <div className="rounded-xl bg-base-200 p-4">
          <p className="font-handwritten text-xl text-primary">
            {result.moonSign ?? "—"}
          </p>
          <p className="mt-1 text-xs text-base-content/60">Moon</p>
        </div>
        <div className="rounded-xl bg-base-200 p-4">
          <p className="font-handwritten text-xl text-primary">
            {result.risingSign ?? "—"}
          </p>
          <p className="mt-1 text-xs text-base-content/60">Rising</p>
        </div>
      </div>

      {wellness?.insight && (
        <div className="mt-4">
          <p className="mb-2 font-handwritten text-lg">Wellness insight</p>
          {wellness.source === "fallback" && <ApiFallbackNotice />}
          <div className="rounded-xl bg-base-200 p-4">
            {wellness.overallScore != null && (
              <p className="mb-2 text-sm font-semibold">
                Overall wellness score: {wellness.overallScore}/100
              </p>
            )}
            <p className="text-sm leading-relaxed">{wellness.insight}</p>
          </div>
        </div>
      )}

      <RefreshButton onRefresh={onRefresh} isPending={isPending} />
    </div>
  );
}

function HoroscopePanel({
  result,
  isPending,
  onRefresh,
}: {
  result: HoroscopeResult | null;
  isPending: boolean;
  onRefresh: () => void;
}) {
  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  return (
    <div>
      {result.source === "fallback" && <ApiFallbackNotice />}
      <p className="mb-2 text-center font-handwritten text-2xl">
        {result.sign}
      </p>
      <p className="rounded-xl bg-base-200 p-5 text-center text-sm leading-relaxed">
        {result.text}
      </p>
      <RefreshButton onRefresh={onRefresh} isPending={isPending} />
    </div>
  );
}

function AstrocartographyPanel({
  result,
  isPending,
  onRefresh,
}: {
  result: AstrocartographyResult | null;
  isPending: boolean;
  onRefresh: () => void;
}) {
  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  if (result.highlights.length === 0) {
    return (
      <div>
        <ApiFallbackNotice message="Add a birth time, city, and country for your astrocartography highlights." />
        <RefreshButton onRefresh={onRefresh} isPending={isPending} />
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {result.highlights.map((h, i) => (
          <div
            key={`${h.planet}-${h.lineType}-${i}`}
            className="rounded-xl bg-base-200 p-3 text-sm"
          >
            <span className="font-semibold">
              {h.planet} {h.lineType}
            </span>{" "}
            — {h.meaning}
          </div>
        ))}
      </div>
      <RefreshButton onRefresh={onRefresh} isPending={isPending} />
    </div>
  );
}

function HumanDesignPanel({
  result,
  isPending,
  onRefresh,
}: {
  result: HumanDesignResult;
  isPending: boolean;
  onRefresh: () => void;
}) {
  if (result.source === "api") {
    return (
      <div>
        <div className="rounded-xl bg-base-200 p-5 text-center">
          <p className="font-handwritten text-2xl text-primary">
            {result.type}
          </p>
          <p className="mt-2 text-sm">Strategy: {result.strategy}</p>
          <p className="text-sm">Authority: {result.authority}</p>
          <p className="text-sm">Profile: {result.profile}</p>
        </div>
        <RefreshButton onRefresh={onRefresh} isPending={isPending} />
      </div>
    );
  }

  return (
    <div>
      <ApiFallbackNotice message="A personal Human Design chart isn't available yet — here's an overview of the five types:" />
      <div className="space-y-3">
        {HUMAN_DESIGN_TYPES.map((t) => (
          <div key={t.type} className="rounded-xl bg-base-200 p-4">
            <p className="font-handwritten text-lg text-primary">{t.type}</p>
            <p className="text-xs italic text-base-content/60">
              Strategy: {t.strategy}
            </p>
            <p className="mt-1 text-sm">{t.description}</p>
          </div>
        ))}
      </div>
      <RefreshButton onRefresh={onRefresh} isPending={isPending} />
    </div>
  );
}

function NumerologyPanel({
  result,
  isPending,
  onRefresh,
}: {
  result: NumerologyProfile | null;
  isPending: boolean;
  onRefresh: () => void;
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
      <RefreshButton onRefresh={onRefresh} isPending={isPending} />
    </div>
  );
}
