import Link from "next/link";
import config from "@/config";

export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-primary to-secondary py-20 text-primary-content">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to {config.tagline.replace(/\.$/, "")}?
        </h2>
        <p className="mt-4 text-primary-content/90">
          Create your free {config.appName} account and open your dashboard
          in under a minute.
        </p>
        <Link
          href="/login"
          className="btn btn-lg mt-8 border-none bg-base-100 text-base-content hover:bg-base-200"
        >
          Start for free
        </Link>
      </div>
    </section>
  );
}
