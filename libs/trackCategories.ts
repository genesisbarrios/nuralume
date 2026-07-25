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
  range: string;
  description: string;
  // Hex background color, applied inline — these live outside app/ and
  // components/, which is all Tailwind's `content` config scans, so
  // Tailwind utility classes referencing color here would never get
  // generated into the CSS bundle.
  color: string;
  // Relative number of wave cycles to draw — higher = faster oscillation.
  cycles: number;
}[] = [
  { subcategory: "gamma", label: "Gamma", range: "30–100 Hz", description: "Focus, Synchronize", color: "#9333ea", cycles: 9 },
  { subcategory: "beta", label: "Beta", range: "12–30 Hz", description: "Concentrate, Think", color: "#2563eb", cycles: 7 },
  { subcategory: "alpha", label: "Alpha", range: "8–12 Hz", description: "Meditate, Create, Relax", color: "#059669", cycles: 5 },
  { subcategory: "theta", label: "Theta", range: "4–8 Hz", description: "Visualize, Dream", color: "#f97316", cycles: 3 },
  { subcategory: "delta", label: "Delta", range: "0.5–4 Hz", description: "Sleep, Restore, Transcend", color: "#4338ca", cycles: 1.5 },
];
