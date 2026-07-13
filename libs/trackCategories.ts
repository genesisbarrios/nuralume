import type { TrackCategory, TrackSubcategory } from "@/types/database";

export interface Track {
  id: string;
  title: string;
  label: string;
  url: string;
  durationSeconds: number | null;
  subcategory: TrackSubcategory | null;
  albumArt: string | null;
}

export const CATEGORY_LABELS: Record<TrackCategory, string> = {
  brain_waves: "Brain Waves",
  solfeggio: "Solfeggio",
  binaural_beats: "Binaural Beats",
};

// Used when a track has no embedded album art. Drop matching images (e.g.
// sourced from Pexels) into public/brain-waves/ to fill these in — until then
// the player falls back to a plain icon.
export const SUBCATEGORY_FALLBACK_IMAGE: Record<TrackSubcategory, string> = {
  alpha: "/brain-waves/alpha.jpg",
  beta: "/brain-waves/beta.jpg",
  delta: "/brain-waves/delta.jpg",
  theta: "/brain-waves/theta.jpg",
  gamma: "/brain-waves/gamma.jpg",
};
