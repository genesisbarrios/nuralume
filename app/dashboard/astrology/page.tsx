import PageCard from "@/components/dashboard/PageCard";
import {
  getOrComputeBirthChart,
  getOrComputeHoroscope,
  getOrComputeHumanDesign,
  getOrComputeNumerology,
  getProfileBirthData,
} from "./actions";
import AstrologyTabs from "./AstrologyTabs";

export default async function AstrologyPage() {
  const profile = await getProfileBirthData();

  const [birthChart, horoscope, numerology, humanDesign] = await Promise.all([
    getOrComputeBirthChart(),
    getOrComputeHoroscope(),
    getOrComputeNumerology(),
    getOrComputeHumanDesign(),
  ]);

  return (
    <PageCard title="Astrology">
      <AstrologyTabs
        initialProfile={profile}
        initialBirthChart={birthChart}
        initialHoroscope={horoscope}
        initialNumerology={numerology}
        initialHumanDesign={humanDesign}
      />
    </PageCard>
  );
}
