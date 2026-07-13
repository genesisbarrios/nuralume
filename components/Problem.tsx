import { BellOff, BrainCircuit, CloudRain } from "lucide-react";

const problems = [
  {
    icon: CloudRain,
    title: "Wellness apps are scattered",
    description:
      "One app for meditation, another for habits, another for your horoscope. Nothing talks to each other, and nothing sticks.",
  },
  {
    icon: BrainCircuit,
    title: "Generic content, not you",
    description:
      "Most affirmation and astrology apps recycle the same content for everyone. It's hard to feel like any of it is actually for you.",
  },
  {
    icon: BellOff,
    title: "Good habits fade fast",
    description:
      "Meditating, drinking water, eating well — the basics slip without a gentle, consistent nudge to bring you back to them.",
  },
];

export default function Problem() {
  return (
    <section className="bg-base-100 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Your mind deserves better than a dozen disconnected apps
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
