import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import config from "@/config";
import { defaultOgImage } from "@/libs/seo";
import { FAQS } from "@/libs/faqs";

const homeTitle = `${config.appName} — Sound Healing, Astrology & Spiritual Wellness`;
const site = `https://${config.domainName}`;

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: config.appDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: config.appDescription,
    type: "website",
    url: "/",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: config.appDescription,
    images: [defaultOgImage.url],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${site}/#app`,
        name: config.appName,
        url: site,
        description: config.appDescription,
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Sound healing music: solfeggio frequencies, binaural beats and brain wave music",
          "Daily affirmations",
          "Daily horoscope and birth chart",
          "Numerology",
          "Human Design",
          "Personality tests: Big Five, Myers-Briggs and archetypes",
          "Mindfulness reminders and grounding games",
        ],
        publisher: { "@id": `${site}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Problem />
        <FeaturesAccordion />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
