"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

// Browsers cap simultaneous WebGL contexts (commonly 8-16); the birth chart
// tab can show 20+ small 3D icons (hero placements, planets, houses) at
// once, so giving each its own <Canvas> silently loses some of them once
// the cap is hit. Mounting exactly one shared Canvas + View.Port here, and
// having every icon render as a tracked <View> instead of its own <Canvas>,
// keeps everything on one WebGL context regardless of icon count.
export default function AstroSceneRoot() {
  return (
    <Canvas
      // R3F's Canvas sets position/width/height via an inline `style`
      // attribute internally, which always wins over a className (no
      // !important in Tailwind's utilities) — so the override has to go
      // through `style`, not `className`, or it's silently ignored and the
      // canvas stays in normal document flow instead of covering the
      // viewport, which breaks View rendering entirely.
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <View.Port />
    </Canvas>
  );
}
