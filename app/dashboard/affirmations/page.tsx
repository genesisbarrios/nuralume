import PageCard from "@/components/dashboard/PageCard";
import { getDailyAffirmation } from "@/libs/affirmations";
import { getFavoriteAffirmationIds, getFavoriteAffirmations } from "./actions";
import AffirmationView from "./AffirmationView";

export default async function AffirmationsPage() {
  const [favoriteIds, favorites] = await Promise.all([
    getFavoriteAffirmationIds(),
    getFavoriteAffirmations(),
  ]);

  return (
    <PageCard title="Daily Affirmations">
      <AffirmationView
        dailyAffirmation={getDailyAffirmation()}
        initialFavoriteIds={favoriteIds}
        favorites={favorites}
      />
    </PageCard>
  );
}
