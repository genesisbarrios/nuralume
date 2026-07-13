"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Track } from "@/libs/trackCategories";
import { CATEGORY_LABELS } from "@/libs/trackCategories";
import type { TrackCategory } from "@/types/database";
import MusicPlayer from "./MusicPlayer";

const FloatingCrystal = dynamic(() => import("./FloatingCrystal"), {
  ssr: false,
});

const CATEGORIES: TrackCategory[] = ["brain_waves", "solfeggio", "binaural_beats"];

export default function MusicTabs({
  tracksByCategory,
}: {
  tracksByCategory: Record<TrackCategory, Track[]>;
}) {
  const [category, setCategory] = useState<TrackCategory>("solfeggio");

  return (
    <div>
      <div className="relative -mt-2 mb-2 flex justify-center">
        <FloatingCrystal className="pointer-events-none opacity-90" />
      </div>

      <div className="tabs tabs-boxed mb-4 justify-center bg-base-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`tab ${category === cat ? "tab-active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <MusicPlayer tracks={tracksByCategory[category]} />
    </div>
  );
}
