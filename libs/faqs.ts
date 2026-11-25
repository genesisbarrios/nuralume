import config from "@/config";

// Homepage FAQ: rendered by components/FAQ.tsx and published as FAQPage
// structured data from app/page.tsx (kept here so both read the same list).
export const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is Nuralume?",
    answer:
      "Nuralume is a spiritual wellness app. It brings sound healing music, daily affirmations, gentle reminders, your horoscope and birth chart, numerology, Human Design and personality tests together in one calm space, so your spiritual practice and self-discovery live in one place.",
  },
  {
    question: "Do I need any experience with meditation or astrology?",
    answer:
      "No. Nuralume is built for beginners and experienced practitioners alike — the music tab needs no explanation, and every personality test comes with plain-language context.",
  },
  {
    question: "What kind of healing music is on Nuralume?",
    answer:
      "Three kinds of sound healing: solfeggio frequencies (like 432 Hz and 528 Hz), binaural beats, and brain wave music for each state, from delta for deep sleep and theta for meditation to alpha for relaxation and beta and gamma for focus. We curate the library ourselves and it keeps growing.",
  },
  {
    question: "What are solfeggio frequencies?",
    answer:
      "Solfeggio frequencies are specific tones, such as 396, 417, 528 and 639 Hz, that many people use in sound healing and meditation to relax, release tension and set an intention. Many listeners also enjoy music tuned to 432 Hz for its warm, calming sound.",
  },
  {
    question: "Can Nuralume read my birth chart, numerology and Human Design?",
    answer:
      "Yes. Add your birth date, time and place once, and Nuralume calculates your birth chart, your numerology numbers and your Human Design type, with plain-language explanations. Your daily horoscope is ready every time you open the app.",
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
