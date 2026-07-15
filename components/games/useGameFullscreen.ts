"use client";

import { useCallback, useEffect, useState } from "react";

// Purely CSS-driven "fill the viewport" toggle rather than the real
// Fullscreen API. That API is unsupported for arbitrary elements on iOS
// Safari (so it silently does nothing on mobile), and on desktop, invoking
// it *alongside* our own fixed/inset-0 overlay classes produced a squashed,
// "flattened" render — the browser's native fullscreen sizing and our CSS
// override were fighting over the element's box. A CSS-only overlay avoids
// both problems and behaves identically on every device.
export function useGameFullscreen() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMaximized ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMaximized]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
  }, []);

  return { isMaximized, toggleMaximize };
}
