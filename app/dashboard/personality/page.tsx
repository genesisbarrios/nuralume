import PageCard from "@/components/dashboard/PageCard";
import { getSavedArchetype, getSavedBigFive, getSavedMbti } from "./actions";
import PersonalityTabs from "./PersonalityTabs";

export default async function PersonalityPage() {
  const [mbti, bigFive, archetype] = await Promise.all([
    getSavedMbti(),
    getSavedBigFive(),
    getSavedArchetype(),
  ]);

  return (
    <PageCard title="Personality Tests">
      <PersonalityTabs
        initialMbti={mbti}
        initialBigFive={bigFive}
        initialArchetype={archetype}
      />
    </PageCard>
  );
}
