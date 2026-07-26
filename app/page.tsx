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

export const metadata: Metadata = {
  title: {
    absolute: `${config.appName} — ${config.tagline}`,
  },
  description: config.appDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${config.appName} — ${config.tagline}`,
    description: config.appDescription,
    type: "website",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
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
