"use client";

import { useState } from "react";
import type { MbtiResult } from "@/libs/mbti";
import type { BigFiveResult } from "@/libs/bigFive";
import MbtiView from "./MbtiView";
import BigFiveView from "./BigFiveView";

type Tab = "mbti" | "big_five";

export default function PersonalityTabs({
  initialMbti,
  initialBigFive,
}: {
  initialMbti: MbtiResult | null;
  initialBigFive: BigFiveResult | null;
}) {
  const [tab, setTab] = useState<Tab>("mbti");

  return (
    <div>
      <div className="tabs tabs-boxed mb-4 justify-center bg-base-200">
        <button
          type="button"
          className={`tab ${tab === "mbti" ? "tab-active" : ""}`}
          onClick={() => setTab("mbti")}
        >
          MBTI
        </button>
        <button
          type="button"
          className={`tab ${tab === "big_five" ? "tab-active" : ""}`}
          onClick={() => setTab("big_five")}
        >
          Big Five (OCEAN)
        </button>
      </div>

      {tab === "mbti" ? (
        <MbtiView initialResult={initialMbti} />
      ) : (
        <BigFiveView initialResult={initialBigFive} />
      )}
    </div>
  );
}
