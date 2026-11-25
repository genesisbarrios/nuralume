import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import config from "@/config";
import HeroScene from "./HeroScene";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#030208] text-[#F2E8DC]">
      {/* space, soundwaves and neurons */}
      <HeroScene brainId="hero-brain" />
      {/* fade into the page below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#030208]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-61px)] max-w-6xl flex-col items-center justify-center gap-6 px-4 py-14 text-center sm:px-6 md:gap-8 md:py-20">
        <div id="hero-brain" className="hero-brain relative w-[min(70vw,340px)]">
          <Image
            src="/nuralume-icon.png"
            alt="Nuralume brain"
            width={400}
            height={334}
            priority
            className="h-auto w-full select-none"
          />
        </div>

        <div className="badge gap-2 border-white/20 bg-white/5 py-3 text-[#F2E8DC] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[#F2CDA6]" />
          Healing music &amp; wellness, in one place
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
          {config.appName} —{" "}
          <span className="bg-gradient-to-r from-[#F2CDA6] via-[#B79BFF] to-[#7FA2FF] bg-clip-text text-transparent">
            {config.tagline}
          </span>
        </h1>

        <p className="max-w-xl text-lg text-[#F2E8DC]/75">
          Sound Healing, daily affirmations, gentle reminders,
          your horoscope, and personality insights — a calm
          companion for your mind, every day.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="btn btn-primary btn-lg border-0 shadow-[0_0_30px_rgba(140,90,230,0.55)]">
            Start for free
          </Link>
          <Link href="#features" className="btn btn-outline btn-lg border-white/30 text-[#F2E8DC] hover:border-white/60 hover:bg-white/10 hover:text-white">
            See what&apos;s inside
          </Link>
        </div>
      </div>

      <style>{`
        .hero-brain {
          animation: brain-pulse 3.2s ease-in-out infinite;
          filter: drop-shadow(0 0 18px rgba(160, 110, 255, 0.55)) drop-shadow(0 0 42px rgba(242, 205, 166, 0.25));
        }
        @keyframes brain-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 14px rgba(160, 110, 255, 0.45)) drop-shadow(0 0 30px rgba(242, 205, 166, 0.15)); }
          50% { transform: scale(1.045); filter: drop-shadow(0 0 28px rgba(170, 120, 255, 0.8)) drop-shadow(0 0 70px rgba(242, 205, 166, 0.4)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-brain { animation: none; }
        }
      `}</style>
    </section>
  );
}
