import PageCard from "@/components/dashboard/PageCard";
import MusicTabs from "@/components/dashboard/MusicTabs";
import { getTracksByCategory } from "@/libs/tracks";

export default async function MusicPage() {
  const [brainWaves, solfeggio, binauralBeats] = await Promise.all([
    getTracksByCategory("brain_waves"),
    getTracksByCategory("solfeggio"),
    getTracksByCategory("binaural_beats"),
  ]);

  return (
    <PageCard title="Sound Healing">
      <MusicTabs
        tracksByCategory={{
          brain_waves: brainWaves,
          solfeggio,
          binaural_beats: binauralBeats,
        }}
      />
    </PageCard>
  );
}
