"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Track } from "@/libs/trackCategories";
import { CATEGORY_LABELS } from "@/libs/trackCategories";
import type { TrackCategory, TrackSubcategory } from "@/types/database";
import MusicPlayer from "./MusicPlayer";
import BrainWaveTags from "./BrainWaveTags";

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
  const [selectedSubcategory, setSelectedSubcategory] = useState<TrackSubcategory | null>(null);

  const tracks = tracksByCategory[category];
  const visibleTracks = selectedSubcategory
    ? tracks.filter((t) => t.subcategory === selectedSubcategory)
    : tracks;

  return (
    <div>
      <div className="relative -mt-2 mb-2 flex justify-center">
        <FloatingCrystal className="pointer-events-none opacity-90" />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-base-200 p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-1 py-2 text-center text-xs font-medium transition-colors ${
              category === cat
                ? "bg-base-100 text-primary shadow-sm"
                : "text-base-content/60 hover:text-base-content"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <BrainWaveTags
        selected={selectedSubcategory}
        onSelect={(subcat) =>
          setSelectedSubcategory((prev) => (prev === subcat ? null : subcat))
        }
      />

      <MusicPlayer
        key={`${category}:${selectedSubcategory ?? "all"}`}
        tracks={visibleTracks}
      />
    </div>
  );
}
