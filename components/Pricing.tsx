import { Check } from "lucide-react";
import Link from "next/link";
import config from "@/config";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-base-100 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Simple pricing, whenever you&apos;re ready
          </h2>
          <p className="mt-3 text-base-content/70">
            Start free. Upgrade when you want the full library and deeper
            insights.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {config.stripe.plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.price > 0
                  ? "border-primary bg-primary/5"
                  : "border-base-300 bg-base-100"
              }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-base-content/70">
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-2">
                {plan.priceAnchor && (
                  <span className="text-lg text-base-content/40 line-through">
                    ${plan.priceAnchor}
                  </span>
                )}
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="pb-1 text-sm text-base-content/60">/mo</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f.name} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {f.name}
                  </li>
                ))}
              </ul>

              {plan.price > 0 ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-disabled mt-8 w-full"
                >
                  Coming soon
                </button>
              ) : (
                <Link href="/login" className="btn btn-outline mt-8 w-full">
                  Get started
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
