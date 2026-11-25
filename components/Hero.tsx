import Link from "next/link";
import { Sparkles } from "lucide-react";
import HeroScene from "./HeroScene";
import HeroBrain from "./HeroBrain";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#030208] text-[#F2E8DC]">
      {/* space, soundwaves and neurons */}
      <HeroScene brainId="hero-brain" />
      {/* fade into the page below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#030208]" />

      {/* Desktop: text on the left (buttons bottom-left), brain on the right,
          all within one screen. Phones: brain on top, text below. */}
      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-2 px-4 pb-12 pt-20 sm:px-6 lg:h-[100svh] lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:px-10 lg:pb-10 lg:pt-20">
        <div id="hero-brain" className="relative mx-auto aspect-[4/3] w-[min(88vw,520px)] -mb-4 lg:order-2 lg:mb-0 lg:w-full lg:max-w-[680px]">
          <HeroBrain />
        </div>

        <div className="flex flex-col items-center gap-5 text-center lg:order-1 lg:items-start lg:gap-6 lg:text-left">
          <div className="badge gap-2 border-white/20 bg-white/5 py-3 text-[#F2E8DC] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#F2CDA6]" />
            Healing music &amp; wellness, in one place
          </div>

          {/* "Tune / your / mind." one word per line; the brand name lives in the
              page title, logo and badge */}
          <h1 id="hero-title" className="bg-gradient-to-b from-[#F2CDA6] via-[#B79BFF] to-[#7FA2FF] bg-clip-text pb-2 text-5xl font-extrabold leading-[0.92] tracking-tight text-transparent sm:text-7xl xl:text-8xl">
            <span className="block">Tune</span>
            <span className="block">your</span>
            <span className="block">mind.</span>
          </h1>

          <p id="hero-copy" className="max-w-xl text-lg text-[#F2E8DC]/75">
            Sound Healing, daily affirmations, gentle reminders,
            your horoscope, and personality insights — a calm
            companion for your mind, every day.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row lg:mt-4">
            <Link href="/login" className="btn btn-primary btn-lg border-0 shadow-[0_0_30px_rgba(140,90,230,0.55)]">
              Start for free
            </Link>
            <Link href="#features" className="btn btn-outline btn-lg border-white/30 text-[#F2E8DC] hover:border-white/60 hover:bg-white/10 hover:text-white">
              See what&apos;s inside
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
