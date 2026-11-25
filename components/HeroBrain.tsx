"use client";

import dynamic from "next/dynamic";

// WebGL only runs in the browser, so the 3D brain loads client-side.
const Brain3D = dynamic(() => import("./Brain3D"), { ssr: false });

export default function HeroBrain() {
  return <Brain3D />;
}
