"use client";

import { Maximize, Minimize } from "lucide-react";

export default function FullscreenButton({
  isMaximized,
  onToggle,
}: {
  isMaximized: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMaximized ? "Exit fullscreen" : "Enter fullscreen"}
      title={isMaximized ? "Exit fullscreen" : "Enter fullscreen"}
      className="btn btn-circle btn-sm pointer-events-auto absolute right-3 top-3 z-20 border-none bg-black/30 text-white backdrop-blur hover:bg-black/50"
    >
      {isMaximized ? (
        <Minimize className="h-4 w-4" />
      ) : (
        <Maximize className="h-4 w-4" />
      )}
    </button>
  );
}
