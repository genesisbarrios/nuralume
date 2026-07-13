"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import config from "@/config";

const faqs = [
  {
    question: "Do I need any experience with meditation or astrology?",
    answer:
      "No. Nuralume is built for beginners and experienced practitioners alike — the music tab needs no explanation, and every personality test comes with plain-language context.",
  },
  {
    question: "Where does the healing music come from?",
    answer:
      "We curate and upload the Brain Wave, Solfeggio, and Binaural Beats tracks ourselves, so the library keeps growing without you having to do anything.",
  },
  {
    question: "Is my birth data private?",
    answer:
      "Yes. Your birth date, time, and location are only used to generate your astrology and Human Design results, and are never shared or shown to other users.",
  },
  {
    question: "Can I use Nuralume for free?",
    answer: `Yes — the ${config.stripe.plans[0]?.name ?? "Starter"} plan gives you daily affirmations, basic reminders, and your sun-sign horoscope at no cost.`,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-base-200 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-base-300 bg-base-100"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm text-base-content/70">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
