import { createClient } from "@/libs/supabase/server";
import type { TrackCategory } from "@/types/database";
import type { Track } from "@/libs/trackCategories";

export async function getTracksByCategory(
  category: TrackCategory
): Promise<Track[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("id, title, label, storage_path, duration_seconds")
    .eq("category", category)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((track) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("healing-music").getPublicUrl(track.storage_path);

    return {
      id: track.id,
      title: track.title,
      label: track.label,
      url: publicUrl,
      durationSeconds: track.duration_seconds,
    };
  });
}
