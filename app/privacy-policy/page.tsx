import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";

export const metadata: Metadata = {
  title: `Privacy Policy — ${config.appName}`,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="prose prose-slate mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-US")}</p>

        <p>
          This policy explains what information {config.appName} collects and
          how it is used.
        </p>

        <h2>1. Information we collect</h2>
        <ul>
          <li>Account information: email address, and name if provided.</li>
          <li>
            Birth data you choose to enter (birth date, time, and location),
            used only to generate your astrology, numerology, and Human
            Design results.
          </li>
          <li>
            App activity: reminders, saved affirmations, and personality-test
            results you save.
          </li>
        </ul>

        <h2>2. How we use it</h2>
        <p>
          Your data is used solely to provide {config.appName}&apos;s
          features to you. Birth data is sent to third-party astrology and
          Human Design providers only when you request a live chart, and only
          to compute that result — it is not sold or used for advertising.
        </p>

        <h2>3. Data storage</h2>
        <p>
          Your data is stored in Supabase (PostgreSQL), protected by
          row-level security so that only you can access your own records.
        </p>

        <h2>4. Your choices</h2>
        <p>
          You can edit or remove your birth data, reminders, and saved
          affirmations at any time from your dashboard, and you can request
          full account deletion by contacting{" "}
          <a href={`mailto:${config.resend.supportEmail}`}>
            {config.resend.supportEmail}
          </a>
          .
        </p>

        <h2>5. Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will
          be reflected here with an updated date.
        </p>
      </main>
      <Footer />
    </>
  );
}
