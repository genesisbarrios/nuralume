import PageCard from "@/components/dashboard/PageCard";
import { getSavedBigFive, getSavedMbti } from "./actions";
import PersonalityTabs from "./PersonalityTabs";

export default async function PersonalityPage() {
  const [mbti, bigFive] = await Promise.all([
    getSavedMbti(),
    getSavedBigFive(),
  ]);

  return (
    <PageCard title="Personality Tests">
      <PersonalityTabs initialMbti={mbti} initialBigFive={bigFive} />
    </PageCard>
  );
}
