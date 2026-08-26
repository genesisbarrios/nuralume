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
  Gamepad2,
} from "lucide-react";

const tabs = [
  { href: "/dashboard/home", label: "Home", icon: Home },
  { href: "/dashboard/affirmations", label: "Daily Affirmations", icon: Sparkles },
  { href: "/dashboard/reminders", label: "Reminders", icon: BellRing },
  { href: "/dashboard/music", label: "Healing Music", icon: Music2 },
  { href: "/dashboard/astrology", label: "Astrology", icon: Moon },
  { href: "/dashboard/personality", label: "Personality Tests", icon: Fingerprint },
  { href: "/dashboard/games", label: "Grounding Games", icon: Gamepad2 },
];

// Each tab gets its own vivid, distinct color — deliberately more varied
// than the muted brand palette, since the whole point of the "sticky note"
// rail (and the colored dots on mobile) is a playful, easy-to-scan rainbow
// rather than on-brand restraint.
const NAV_COLORS = [
  "#4F7FE8", // blue
  "#F2B705", // yellow
  "#EC6FA0", // pink
  "#3FBF8F", // teal green
  "#F2994A", // orange
  "#8B6FE8", // purple
  "#38BDF8", // sky blue
];

// Desktop "sticky note" per-item rotation so the rail reads as notes stuck to
// the notebook page rather than a plain menu — color comes from NAV_COLORS.
const NOTE_ROTATION = ["lg:-rotate-3", "lg:rotate-2", "lg:-rotate-2", "lg:rotate-3", "lg:-rotate-2", "lg:rotate-2"];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-notebook-cover pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Dashboard navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {tabs.map((tab, index) => {
          const isActive = pathname.startsWith(tab.href);
          const color = NAV_COLORS[index % NAV_COLORS.length];
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                title={tab.label}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-3 transition-opacity ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
                }`}
              >
                <tab.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} style={{ color }} />
                <span
                  className="h-1 w-1 rounded-full transition-colors"
                  style={{ backgroundColor: isActive ? color : "transparent" }}
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
        const color = NAV_COLORS[index % NAV_COLORS.length];
        return (
          <Link
            key={tab.href}
            href={tab.href}
            title={tab.label}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-14 w-16 -mr-4 items-center justify-center rounded-md border-2 shadow-md transition-all hover:-translate-x-1 hover:shadow-lg ${
              NOTE_ROTATION[index % NOTE_ROTATION.length]
            } ${isActive ? "!-mr-6 !rotate-0 bg-base-100" : ""}`}
            style={
              isActive
                ? { borderColor: color, color, boxShadow: `0 0 0 2px ${color}` }
                : { borderColor: color, backgroundColor: `${color}B3`, color: "#2A2233" }
            }
          >
            <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="sr-only">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
