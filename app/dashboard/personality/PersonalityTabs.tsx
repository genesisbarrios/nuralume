"use client";

import { useState } from "react";
import type { MbtiResult } from "@/libs/mbti";
import type { BigFiveResult } from "@/libs/bigFive";
import type { ArchetypeResult } from "@/libs/archetype";
import MbtiView from "./MbtiView";
import BigFiveView from "./BigFiveView";
import ArchetypeView from "./ArchetypeView";

type Tab = "mbti" | "big_five" | "archetype";

const TAB_LABELS: Record<Tab, string> = {
  mbti: "MBTI",
  big_five: "Big Five",
  archetype: "Archetype",
};

export default function PersonalityTabs({
  initialMbti,
  initialBigFive,
  initialArchetype,
}: {
  initialMbti: MbtiResult | null;
  initialBigFive: BigFiveResult | null;
  initialArchetype: ArchetypeResult | null;
}) {
  const [tab, setTab] = useState<Tab>("mbti");

  return (
    <div>
      <div className="tabs tabs-boxed mb-4 justify-center bg-base-200">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`tab ${tab === t ? "tab-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "mbti" && <MbtiView initialResult={initialMbti} />}
      {tab === "big_five" && <BigFiveView initialResult={initialBigFive} />}
      {tab === "archetype" && (
        <ArchetypeView initialResult={initialArchetype} />
      )}
    </div>
  );
}
