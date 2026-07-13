"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Music2,
  Sparkles,
  BellRing,
  Moon,
  Fingerprint,
} from "lucide-react";

const tabs = [
  { href: "/dashboard/home", label: "Home", icon: Home },
  { href: "/dashboard/affirmations", label: "Daily Affirmations", icon: Sparkles },
  { href: "/dashboard/reminders", label: "Reminders", icon: BellRing },
  { href: "/dashboard/music", label: "Healing Music", icon: Music2 },
  { href: "/dashboard/astrology", label: "Astrology", icon: Moon },
  { href: "/dashboard/personality", label: "Personality Tests", icon: Fingerprint },
];

// Desktop "sticky note" per-item styling — a light rotation + tint so the rail
// reads as notes stuck to the notebook page rather than a plain menu.
const NOTE_STYLES = [
  "lg:bg-primary/40 lg:-rotate-3",
  "lg:bg-secondary/40 lg:rotate-2",
  "lg:bg-accent/40 lg:-rotate-2",
  "lg:bg-warning/40 lg:rotate-3",
  "lg:bg-info/40 lg:-rotate-2",
  "lg:bg-success/40 lg:rotate-2",
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-notebook-cover pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Dashboard navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                title={tab.label}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-1 py-3 text-white/50 transition-colors hover:text-white/80"
              >
                <tab.icon
                  className={`h-6 w-6 ${isActive ? "text-primary" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`h-1 w-1 rounded-full transition-colors ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                />
                <span className="sr-only">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="z-10 hidden shrink-0 lg:sticky lg:top-24 lg:flex lg:w-20 lg:flex-col lg:items-end lg:self-start lg:gap-5 lg:py-10"
      aria-label="Dashboard navigation"
    >
      {tabs.map((tab, index) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            title={tab.label}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-14 w-16 -mr-4 items-center justify-center rounded-md text-base-content/70 shadow-md transition-all hover:-translate-x-1 hover:shadow-lg ${
              NOTE_STYLES[index % NOTE_STYLES.length]
            } ${isActive ? "!-mr-6 !rotate-0 bg-base-100 text-primary ring-2 ring-primary" : ""}`}
          >
            <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="sr-only">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
