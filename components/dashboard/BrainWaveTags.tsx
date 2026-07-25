"use client";

import { BRAIN_WAVE_TAGS } from "@/libs/trackCategories";

function buildWavePoints(cycles: number, width = 64, height = 20, samples = 48) {
  const midY = height / 2;
  const amplitude = height / 2 - 2;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * width;
    const t = (i / samples) * cycles * Math.PI * 2;
    const y = midY - Math.sin(t) * amplitude;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function BrainWaveTags() {
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2">
      {BRAIN_WAVE_TAGS.map((tag) => (
        <div
          key={tag.subcategory}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${tag.className}`}
        >
          <svg viewBox="0 0 64 20" className="h-4 w-10 shrink-0" preserveAspectRatio="none">
            <polyline
              points={buildWavePoints(tag.cycles)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="leading-tight">
            <div className="text-xs font-bold">{tag.label}</div>
            <div className="text-[10px] font-normal opacity-90">{tag.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
