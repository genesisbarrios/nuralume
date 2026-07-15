import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";

const PopItGame = dynamic(() => import("@/components/games/PopItGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-base-content/50">
      Loading...
    </div>
  ),
});

export const metadata: Metadata = {
  title: `Grounding Games — ${config.appName}`,
  description:
    "A free, no-signup grounding game — drag to spin, tap to pop. Try it right here, no account needed.",
};

export default function GamesTrialPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Grounding Games
            </h1>
            <p className="mt-3 text-base-content/70">
              A little tactile, screen-based fidgeting for when your mind
              needs somewhere else to go. Try this one free — no account
              needed.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h2 className="text-center text-xl font-bold">Pop It</h2>
          <p className="mb-3 text-center text-sm text-base-content/60">
            Drag to spin, tap a bubble to pop it.
          </p>
          <div className="h-[60vh] min-h-[360px] overflow-hidden rounded-2xl border border-base-300 bg-base-200">
            <PopItGame />
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary to-secondary py-12 text-primary-content">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold">More games inside the app</h2>
            <p className="mt-2 text-primary-content/90">
              This is one trial game — the full Grounding Games tab in your
              dashboard grows from here, alongside healing music,
              affirmations, and your birth chart.
            </p>
            <Link
              href="/login"
              className="btn btn-lg mt-6 border-none bg-base-100 text-base-content hover:bg-base-200"
            >
              Try Nuralume free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
