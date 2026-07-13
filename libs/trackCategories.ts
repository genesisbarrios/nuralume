import type { TrackCategory } from "@/types/database";

export interface Track {
  id: string;
  title: string;
  label: string;
  url: string;
  durationSeconds: number | null;
}

export const CATEGORY_LABELS: Record<TrackCategory, string> = {
  brain_waves: "Brain Waves",
  solfeggio: "Solfeggio",
  binaural_beats: "Binaural Beats",
};
