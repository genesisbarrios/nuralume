import PageCard from "@/components/dashboard/PageCard";
import MusicTabs from "@/components/dashboard/MusicTabs";
import { getTracksByCategory } from "@/libs/tracks";
import { BRAIN_WAVE_TAGS } from "@/libs/trackCategories";

export default async function MusicPage({ searchParams }: { searchParams: { wave?: string } }) {
  const wave = BRAIN_WAVE_TAGS.find((t) => t.subcategory === searchParams?.wave)?.subcategory ?? null;
  const [brainWaves, solfeggio, binauralBeats] = await Promise.all([
    getTracksByCategory("brain_waves"),
    getTracksByCategory("solfeggio"),
    getTracksByCategory("binaural_beats"),
  ]);

  return (
    <PageCard title="Sound Healing">
      <MusicTabs
        initialWave={wave}
        tracksByCategory={{
          brain_waves: brainWaves,
          solfeggio,
          binaural_beats: binauralBeats,
        }}
      />
    </PageCard>
  );
}
