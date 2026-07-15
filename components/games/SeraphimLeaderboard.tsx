"use client";

import { useEffect, useState } from "react";
import {
  getSeraphimLeaderboard,
  type LeaderboardData,
} from "@/app/dashboard/games/actions";

export default function SeraphimLeaderboard({
  refreshSignal,
}: {
  refreshSignal: number;
}) {
  const [data, setData] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSeraphimLeaderboard().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshSignal]);

  if (!data || data.top.length === 0) return null;

  const selfInTop = data.self
    ? data.top.some((e) => e.userId === data.self!.userId)
    : false;

  return (
    <div className="mt-4 rounded-2xl bg-base-200 p-4">
      <h3 className="mb-3 text-lg font-bold">💎 Top Crystal Collectors</h3>
      <ol className="flex flex-col gap-1.5">
        {data.top.map((entry, i) => {
          const isSelf = data.self?.userId === entry.userId;
          return (
            <li
              key={entry.userId}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${
                isSelf ? "bg-primary/15 font-semibold" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-5 text-base-content/50">#{i + 1}</span>
                {entry.name}
                {isSelf && (
                  <span className="text-xs text-primary">(you)</span>
                )}
              </span>
              <span className="font-semibold">{entry.score}</span>
            </li>
          );
        })}
      </ol>
      {data.self && !selfInTop && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-base-300 px-3 py-1.5 text-sm">
          <span>
            #{data.self.rank} {data.self.name}{" "}
            <span className="text-xs text-primary">(you)</span>
          </span>
          <span className="font-semibold">{data.self.score}</span>
        </div>
      )}
    </div>
  );
}
