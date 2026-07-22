import Link from "next/link";
import { Sparkles } from "lucide-react";
import config from "@/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-base-200 to-base-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 md:py-28">
        <div className="badge badge-primary badge-outline gap-2 py-3">
          <Sparkles className="h-3.5 w-3.5" />
          Healing music &amp; wellness, in one place
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
          {config.appName} —{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {config.tagline}
          </span>
        </h1>

        <p className="max-w-xl text-lg text-base-content/70">
          Sound Healing, daily affirmations, gentle reminders, 
          your horoscope, and personality insights — a calm
          companion for your mind, every day.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="btn btn-primary btn-lg">
            Start for free
          </Link>
          <Link href="#features" className="btn btn-outline btn-lg">
            See what&apos;s inside
          </Link>
        </div>
      </div>
    </section>
  );
}
