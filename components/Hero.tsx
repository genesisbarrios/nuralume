import Link from "next/link";
import { Sparkles } from "lucide-react";
import config from "@/config";
import HeroScene from "./HeroScene";
import HeroBrain from "./HeroBrain";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#030208] text-[#F2E8DC]">
      {/* space, soundwaves and neurons */}
      <HeroScene brainId="hero-brain" />
      {/* fade into the page below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#030208]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center gap-6 px-4 pb-14 pt-20 text-center sm:px-6 md:gap-8 md:pb-20 md:pt-24">
        <div id="hero-brain" className="relative aspect-[4/3] w-[min(92vw,540px)] -my-6 md:-my-10">
          <HeroBrain />
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

    </section>
  );
}
