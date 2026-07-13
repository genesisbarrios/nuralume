"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { Track } from "@/libs/trackCategories";
import { SUBCATEGORY_FALLBACK_IMAGE } from "@/libs/trackCategories";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TrackArt({ track, className }: { track: Track; className: string }) {
  const fallback = track.subcategory
    ? SUBCATEGORY_FALLBACK_IMAGE[track.subcategory]
    : null;
  const [src, setSrc] = useState(track.albumArt ?? fallback);

  useEffect(() => {
    setSrc(track.albumArt ?? fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  if (!src) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-md bg-base-300 text-base-content/40 ${className}`}
      >
        <Music2 className="h-1/2 w-1/2" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`shrink-0 rounded-md object-cover ${className}`}
      onError={() => setSrc(null)}
    />
  );
}

export default function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const current = tracks[currentIndex];

  useEffect(() => {
    setProgress(0);
    setDuration(0);
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (tracks.length === 0) {
    return (
      <p className="rounded-lg bg-base-200 p-4 text-center text-sm text-base-content/60">
        No tracks yet — add some in Supabase to fill this category.
      </p>
    );
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const playIndex = (index: number) => {
    const nextIndex = (index + tracks.length) % tracks.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={current.url}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => playIndex(currentIndex + 1)}
      />

      <div className="rounded-xl bg-base-200 p-4">
        <div className="flex items-center gap-3">
          <TrackArt track={current} className="h-14 w-14" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{current.title}</p>
            <p className="truncate text-xs text-base-content/60">
              {current.artist ? `${current.artist} • ${current.label}` : current.label}
            </p>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = value;
            setProgress(value);
          }}
          className="range range-primary range-xs mt-3"
        />
        <div className="flex justify-between text-[10px] text-base-content/50">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous track"
            onClick={() => playIndex(currentIndex - 1)}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
            className="btn btn-circle btn-primary"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={() => playIndex(currentIndex + 1)}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-base-content/50" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="range range-xs"
          />
        </div>
      </div>

      <ul className="mt-4 space-y-1">
        {tracks.map((track, index) => (
          <li key={track.id}>
            <button
              type="button"
              onClick={() => playIndex(index)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                index === currentIndex
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-base-200"
              }`}
            >
              <TrackArt track={track} className="h-9 w-9" />
              <span className="min-w-0 flex-1 truncate">
                {track.title}{" "}
                <span className="text-base-content/50">
                  — {track.artist ? `${track.artist} • ${track.label}` : track.label}
                </span>
              </span>
              {index === currentIndex && isPlaying && (
                <span className="text-xs">▶</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
