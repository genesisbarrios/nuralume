interface ConfigProps {
  appName: string;
  appDescription: string;
  tagline: string;
  domainName: string;
  stripe: {
    plans: {
      priceId: string;
      name: string;
      description: string;
      price: number;
      priceAnchor?: number;
      features: { name: string }[];
    }[];
  };
  resend: {
    fromNoReply: string;
    fromAdmin: string;
    supportEmail: string;
  };
  colors: {
    theme: string;
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}

const config: ConfigProps = {
  appName: "Nuralume",
  appDescription:
    "A spiritual wellness app: sound healing with solfeggio frequencies, binaural beats and brain waves, daily affirmations, your horoscope, birth chart, numerology and Human Design, all in one calming space.",
  tagline: "tune your mind.",
  // The site is served at www (the apex redirects there), so canonicals,
  // sitemap and structured data must use it too.
  domainName: "www.nuralume.xyz",
  stripe: {
    plans: [
      {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
        name: "Starter",
        description: "Explore the essentials, at no cost.",
        price: 0,
        features: [
          { name: "Daily affirmations" },
          { name: "Basic reminders" },
          { name: "Sun-sign horoscope" },
        ],
      },
      {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "",
        name: "Nuralume Pro",
        description: "The full healing toolkit, unlocked.",
        price: 9,
        priceAnchor: 19,
        features: [
          { name: "Full healing music library" },
          { name: "Unlimited reminders" },
          { name: "Full birth chart & Human Design" },
          { name: "Numerology deep dive" },
        ],
      },
    ],
  },
  resend: {
    fromNoReply: "Nuralume <nuralume@proton.me>",
    fromAdmin: "Nuralume <nuralume@proton.me>",
    supportEmail: "nuralume@proton.me",
  },
  colors: {
    theme: "nuralume",
    main: "#6C4FB6",
  },
  auth: {
    loginUrl: "/login",
    callbackUrl: "/dashboard",
  },
};

export default config;
