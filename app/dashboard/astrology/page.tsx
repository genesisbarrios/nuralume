import PageCard from "@/components/dashboard/PageCard";
import {
  getAstrocartographyForProfile,
  getHoroscopeForProfile,
  getOrComputeBirthChart,
  getOrComputeHumanDesign,
  getOrComputeNumerology,
  getProfileBirthData,
  getWellnessForProfile,
} from "./actions";
import AstrologyTabs from "./AstrologyTabs";

export default async function AstrologyPage() {
  const profile = await getProfileBirthData();

  const [
    birthChart,
    wellness,
    horoscope,
    astrocartography,
    numerology,
    humanDesign,
  ] = await Promise.all([
    getOrComputeBirthChart(),
    getWellnessForProfile(),
    getHoroscopeForProfile(),
    getAstrocartographyForProfile(),
    getOrComputeNumerology(),
    getOrComputeHumanDesign(),
  ]);

  return (
    <PageCard title="Astrology">
      <AstrologyTabs
        initialProfile={profile}
        initialBirthChart={birthChart}
        initialWellness={wellness}
        initialHoroscope={horoscope}
        initialAstrocartography={astrocartography}
        initialNumerology={numerology}
        initialHumanDesign={humanDesign}
      />
    </PageCard>
  );
}
