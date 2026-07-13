"use client";

import { useState, useTransition } from "react";
import { Hash, Moon, RefreshCw, Sun } from "lucide-react";
import ApiFallbackNotice from "@/components/dashboard/ApiFallbackNotice";
import BirthDataForm from "@/components/dashboard/BirthDataForm";
import type { NumerologyProfile } from "@/libs/numerology";
import type { AstrologyResult } from "@/libs/astrology";
import type { HoroscopeFrequency } from "@/libs/horoscope";
import type { ProfileBirthData } from "@/libs/profile";
import { getProfileBirthData } from "@/libs/profile";
import {
  getOrComputeBirthChart,
  getOrComputeHoroscope,
  getOrComputeNumerology,
  type HoroscopeBundle,
} from "./actions";

type Tab = "birth_chart" | "horoscope" | "numerology";

const TAB_LABELS: Record<Tab, string> = {
  birth_chart: "Birth Chart",
  horoscope: "Horoscope",
  numerology: "Numerology",
};

const TAB_ICONS: Record<Tab, typeof Sun> = {
  birth_chart: Sun,
  horoscope: Moon,
  numerology: Hash,
};

export default function AstrologyTabs({
  initialProfile,
  initialBirthChart,
  initialHoroscope,
  initialNumerology,
}: {
  initialProfile: ProfileBirthData | null;
  initialBirthChart: AstrologyResult | null;
  initialHoroscope: HoroscopeBundle | null;
  initialNumerology: NumerologyProfile | null;
}) {
  const [tab, setTab] = useState<Tab>("birth_chart");
  const [profile, setProfile] = useState(initialProfile);
  const [editingForm, setEditingForm] = useState(false);
  const [birthChart, setBirthChart] = useState(initialBirthChart);
  const [horoscope, setHoroscope] = useState(initialHoroscope);
  const [numerology, setNumerology] = useState(initialNumerology);
  const [isPending, startTransition] = useTransition();

  const hasBirthData = Boolean(profile?.displayName && profile?.birthDate);

  const refresh = (target: Tab) => {
    startTransition(async () => {
      if (target === "birth_chart") {
        setBirthChart(await getOrComputeBirthChart(true));
      } else if (target === "horoscope") {
        setHoroscope(await getOrComputeHoroscope(true));
      } else {
        setNumerology(await getOrComputeNumerology(true));
      }
    });
  };

  const handleSaved = async () => {
    setEditingForm(false);
    setProfile(await getProfileBirthData());
    refresh("birth_chart");
    refresh("horoscope");
    refresh("numerology");
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-base-200 p-1">
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
          {hasBirthData && (
            <button
              type="button"
              onClick={() => setEditingForm(true)}
              className="mb-3 text-xs text-primary underline"
            >
              Edit birth details
            </button>
          )}

          {tab === "birth_chart" &&
            (hasBirthData ? (
              <BirthChartPanel
                result={birthChart}
                isPending={isPending}
                onRefresh={() => refresh("birth_chart")}
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
  isPending,
  onRefresh,
}: {
  result: AstrologyResult | null;
  isPending: boolean;
  onRefresh: () => void;
}) {
  if (!result) {
    return <p className="text-sm text-base-content/60">Calculating...</p>;
  }

  return (
    <div>
      {result.source === "fallback" && (
        <ApiFallbackNotice message="Showing your sun sign only — add a birth time and city for your full chart." />
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
      <RefreshButton onRefresh={onRefresh} isPending={isPending} />
    </div>
  );
}

const FREQUENCY_LABELS: Record<HoroscopeFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

function HoroscopePanel({
  bundle,
  isPending,
  onRefresh,
}: {
  bundle: HoroscopeBundle | null;
  isPending: boolean;
  onRefresh: () => void;
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
