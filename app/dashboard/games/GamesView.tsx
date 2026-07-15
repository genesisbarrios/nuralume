"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PopItGame = dynamic(() => import("@/components/games/PopItGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-base-content/50">
      Loading...
    </div>
  ),
});

const SeraphimCrystalGame = dynamic(
  () => import("@/components/games/SeraphimCrystalGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-base-content/50">
        Loading...
      </div>
    ),
  }
);

const JellyCubeGame = dynamic(() => import("@/components/games/JellyCubeGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-base-content/50">
      Loading...
    </div>
  ),
});

const GAMES = [
  {
    id: "pop-it",
    label: "Pop It",
    description:
      "A little tactile, screen-based fidgeting — drag to spin, tap a bubble to pop it.",
    Component: PopItGame,
  },
  {
    id: "seraphim",
    label: "Seraphim Crystal Collector",
    description:
      "Wander the sky and gather drifting crystals — WASD or arrow keys to move, R to reset.",
    Component: SeraphimCrystalGame,
  },
  {
    id: "jelly-cube",
    label: "Jelly Cube Breathwork",
    description:
      "A guided breathing cube — pick a pattern and follow the squeeze in and out.",
    Component: JellyCubeGame,
  },
] as const;

export default function GamesView() {
  const [activeId, setActiveId] = useState<(typeof GAMES)[number]["id"]>(
    GAMES[0].id
  );
  const activeGame = GAMES.find((g) => g.id === activeId) ?? GAMES[0];
  const ActiveComponent = activeGame.Component;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => setActiveId(game.id)}
            className={`btn btn-sm ${
              activeId === game.id ? "btn-primary" : "btn-ghost"
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>
      <h2 className="mb-1 text-lg font-bold">{activeGame.label}</h2>
      <p className="mb-4 text-sm text-base-content/70">
        {activeGame.description}
      </p>
      <div className="h-[60vh] min-h-[360px] overflow-hidden rounded-2xl bg-base-200">
        <ActiveComponent />
      </div>
    </div>
  );
}
