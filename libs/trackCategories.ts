import type { TrackCategory, TrackSubcategory } from "@/types/database";

export interface Track {
  id: string;
  title: string;
  artist: string | null;
  label: string;
  url: string;
  durationSeconds: number | null;
  subcategory: TrackSubcategory | null;
  albumArt: string | null;
}

export const CATEGORY_LABELS: Record<TrackCategory, string> = {
  brain_waves: "Neural Frequency",
  solfeggio: "Solfeggio",
  binaural_beats: "Binaural Beats",
};

// Used when a track has no embedded album art. Drop matching images (e.g.
// sourced from Pexels) into public/brain-waves/ to fill these in — until then
// the player falls back to a plain icon.
export const SUBCATEGORY_FALLBACK_IMAGE: Partial<Record<TrackSubcategory, string>> = {
  alpha: "/brain-waves/alpha.jpg",
  beta: "/brain-waves/beta.jpg",
  delta: "/brain-waves/delta.jpg",
  theta: "/brain-waves/theta.jpg",
  gamma: "/brain-waves/gamma.jpg",
};

export const BRAIN_WAVE_TAGS: {
  subcategory: TrackSubcategory;
  label: string;
  description: string;
  className: string;
  // Relative number of wave cycles to draw — higher = faster oscillation.
  cycles: number;
}[] = [
  { subcategory: "gamma", label: "Gamma", description: "Focus, Synchronize", className: "bg-purple-600 text-white", cycles: 9 },
  { subcategory: "beta", label: "Beta", description: "Concentrate, Think", className: "bg-blue-600 text-white", cycles: 7 },
  { subcategory: "alpha", label: "Alpha", description: "Meditate, Create, Relax", className: "bg-emerald-600 text-white", cycles: 5 },
  { subcategory: "theta", label: "Theta", description: "Visualize, Dream", className: "bg-orange-500 text-white", cycles: 3 },
  { subcategory: "delta", label: "Delta", description: "Sleep, Restore, Transcend", className: "bg-indigo-700 text-white", cycles: 1.5 },
];
