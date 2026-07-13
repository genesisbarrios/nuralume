import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";

export const metadata: Metadata = {
  title: `Terms of Service — ${config.appName}`,
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="prose prose-slate mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-US")}</p>

        <p>
          Welcome to {config.appName}. By creating an account or using{" "}
          {config.appName}, you agree to these Terms of Service.
        </p>

        <h2>1. Using {config.appName}</h2>
        <p>
          {config.appName} provides healing music, daily affirmations,
          reminders, horoscope content, and personality-test insights for
          personal, non-commercial use. You must be at least 16 years old to
          create an account.
        </p>

        <h2>2. Your account</h2>
        <p>
          You are responsible for the accuracy of the information you
          provide, including any birth data used to generate astrology,
          numerology, or Human Design results, and for keeping your account
          credentials secure.
        </p>

        <h2>3. Content is for reflection, not advice</h2>
        <p>
          Horoscope, astrology, numerology, and Human Design content on{" "}
          {config.appName} is provided for entertainment and self-reflection
          purposes only, and should not be treated as medical, psychological,
          financial, or professional advice.
        </p>

        <h2>4. Subscriptions</h2>
        <p>
          Paid plans, if purchased, renew automatically until canceled. You
          can cancel at any time from your account settings; access continues
          until the end of the current billing period.
        </p>

        <h2>5. Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of{" "}
          {config.appName} after a change constitutes acceptance of the
          updated terms.
        </p>

        <h2>6. Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${config.resend.supportEmail}`}>
            {config.resend.supportEmail}
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
