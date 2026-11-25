"use client";

import { useState } from "react";
import {
  Music2,
  Sparkles,
  BellRing,
  Moon,
  Fingerprint,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Music2,
    title: "Healing Music",
    description:
      "Sound healing for every state of mind: solfeggio frequencies like 432 Hz and 528 Hz, binaural beats, and delta, theta, alpha, beta and gamma brain wave music for sleep, meditation, relaxation and focus.",
  },
  {
    icon: Sparkles,
    title: "Daily Affirmations",
    description:
      "A new positive affirmation each day for self-love, abundance and calm, with a shuffle for when you need a different perspective and a spot to save the ones that stick.",
  },
  {
    icon: BellRing,
    title: "Reminders",
    description:
      "Gentle nudges to meditate, drink water, and cook a healthy meal — a simple daily checklist that resets every morning.",
  },
  {
    icon: Moon,
    title: "Horoscope & Astrology",
    description:
      "Your daily horoscope, plus your full birth chart, numerology numbers and Human Design type, calculated from your birth date, time and place.",
  },
  {
    icon: Fingerprint,
    title: "Personality Tests",
    description:
      "OCEAN (Big Five), Myers-Briggs, and Archetype — go deeper on who you are with tests built right into your dashboard.",
  },
];

export default function FeaturesAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="features" className="bg-base-200 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything your practice needs, in five tabs
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {features.map((feature, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={feature.title}
                className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-4 p-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-lg font-semibold">
                    {feature.title}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-[4.75rem] text-sm text-base-content/70">
                    {feature.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
