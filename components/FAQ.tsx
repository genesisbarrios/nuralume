"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/libs/faqs";

const faqs = FAQS;

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
                {/* always in the HTML (hidden when closed) so search engines read every answer */}
                <p hidden={!isOpen} className="px-5 pb-5 text-sm text-base-content/70">
                  {faq.answer}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
