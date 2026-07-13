"use client";

import { useState, useTransition } from "react";
import { Heart, Shuffle } from "lucide-react";
import type { Affirmation } from "@/libs/affirmations";
import { getRandomAffirmation } from "@/libs/affirmations";
import { toggleFavoriteAffirmation } from "./actions";

interface FavoriteRow {
  affirmation_id: string;
  affirmation_text: string;
}

export default function AffirmationView({
  dailyAffirmation,
  initialFavoriteIds,
  favorites,
}: {
  dailyAffirmation: Affirmation;
  initialFavoriteIds: string[];
  favorites: FavoriteRow[];
}) {
  const [current, setCurrent] = useState(dailyAffirmation);
  const [favoriteIds, setFavoriteIds] = useState(new Set(initialFavoriteIds));
  const [isPending, startTransition] = useTransition();

  const isFavorite = favoriteIds.has(current.id);

  const handleShuffle = () => {
    setCurrent(getRandomAffirmation(current.id));
  };

  const handleFavorite = () => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
    startTransition(() => {
      toggleFavoriteAffirmation(current);
    });
  };

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 text-center">
        <p className="font-handwritten text-2xl leading-snug text-base-content">
          &ldquo;{current.text}&rdquo;
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={handleShuffle}
            className="btn btn-outline btn-sm gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </button>
          <button
            type="button"
            onClick={handleFavorite}
            disabled={isPending}
            className={`btn btn-sm gap-2 ${
              isFavorite ? "btn-primary" : "btn-outline"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-handwritten text-xl">Your favorites</p>
          <ul className="space-y-2">
            {favorites.map((f) => (
              <li
                key={f.affirmation_id}
                className="rounded-lg bg-base-200 px-3 py-2 text-sm"
              >
                {f.affirmation_text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
