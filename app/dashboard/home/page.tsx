import HomeOverview from "@/components/dashboard/HomeOverview";
import { getProfileBirthData } from "@/libs/profile";
import { getDailyAffirmation } from "@/libs/affirmations";
import { getRemindersWithStatus } from "@/app/dashboard/reminders/actions";
import { getFavoriteAffirmationIds } from "@/app/dashboard/affirmations/actions";
import { getHomeHoroscope } from "./actions";

export default async function HomePage() {
  const [profile, reminders, favoriteIds, horoscope] = await Promise.all([
    getProfileBirthData(),
    getRemindersWithStatus(),
    getFavoriteAffirmationIds(),
    getHomeHoroscope(),
  ]);

  return (
    <HomeOverview
      profile={profile}
      reminders={reminders}
      dailyAffirmation={getDailyAffirmation()}
      initialFavoriteIds={favoriteIds}
      horoscope={horoscope}
    />
  );
}
