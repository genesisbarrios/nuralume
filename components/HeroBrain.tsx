"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type * as THREE from "three";
import { createClient } from "@/libs/supabase/client";
import { BRAIN_WAVE_INFO } from "@/libs/brainWaveInfo";
import type { BrainWaveTag } from "./Brain3D";

// WebGL only runs in the browser, so the 3D brain loads client-side.
const Brain3D = dynamic(() => import("./Brain3D"), { ssr: false });

// Interactive hero brain: drag to turn it; tap a glowing brain wave node to
// open its card; tap the card to dive into the brain, fade to white and land
// on that wave in Healing Music (or sign up first).
export default function HeroBrain() {
  const router = useRouter();
  const [picked, setPicked] = useState<{ tag: BrainWaveTag; world: THREE.Vector3 } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setSignedIn(!!data.user)).catch(() => setSignedIn(false));
  }, []);

  useEffect(() => {
    if (!picked || leaving) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPicked(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked, leaving]);

  const go = () => {
    if (!picked || leaving) return;
    setLeaving(true);
    const dest = `/dashboard/music?wave=${picked.tag.subcategory}`;
    if (!signedIn) {
      // remembered for after sign-up / sign-in (read by /auth/callback)
      document.cookie = `nl_next=${encodeURIComponent(dest)}; path=/; max-age=900; samesite=lax`;
    }
    window.setTimeout(() => router.push(signedIn ? dest : `/login?next=${encodeURIComponent(dest)}`), 1300);
  };

  const info = picked ? BRAIN_WAVE_INFO[picked.tag.subcategory] : null;

  return (
    <>
      {/* scales up while diving so the canvas edges leave the screen under the white-out */}
      <div className={`absolute inset-0 transition-transform duration-[1300ms] ease-in ${leaving ? "scale-[4]" : "scale-100"}`}>
        <Brain3D
          activeWave={picked?.tag.subcategory ?? null}
          diveTo={leaving ? picked?.world ?? null : null}
          onPickWave={(tag, world) => !leaving && setPicked({ tag, world })}
        />
      </div>

      {!picked && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center md:bottom-10 text-xs text-[#F2E8DC]/55">
          Drag to spin · tap a glowing node
        </p>
      )}

      {picked && info && (
        <button
          type="button"
          onClick={go}
          aria-label={`Listen to ${picked.tag.label} brain wave music`}
          className={`glass-wave-card absolute left-1/2 top-1/2 z-20 w-[min(86vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-white/10 p-5 text-left text-[#F2E8DC] shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
            leaving ? "glass-wave-card--leave" : ""
          }`}
          style={{ boxShadow: `0 8px 40px rgba(0,0,0,.45), 0 0 50px -10px ${picked.tag.color}` }}
        >
          <span
            role="button"
            tabIndex={0}
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setPicked(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setPicked(null); } }}
            className="absolute right-3 top-3 rounded-full p-1.5 text-[#F2E8DC]/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </span>
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full" style={{ background: picked.tag.color, boxShadow: `0 0 12px ${picked.tag.color}` }} />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#F2E8DC]/85">
              {picked.tag.range}
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold">{picked.tag.label} waves</h3>
          <p className="text-sm font-medium text-[#F2CDA6]">{info.state}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#F2E8DC]/80">{info.about}</p>
          <p className="mt-3 text-xs text-[#F2E8DC]/60"><span className="font-semibold text-[#F2E8DC]/80">Listen for:</span> {info.listen}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#fff" }}>
            {signedIn === false ? "Tap to sign up & listen →" : "Tap to listen →"}
          </p>
        </button>
      )}

      {/* white-out on the way into the brain */}
      {leaving && <div aria-hidden className="brain-whiteout fixed inset-0 z-[100] bg-white" />}

      <style>{`
        .glass-wave-card { animation: wave-card-in .35s cubic-bezier(.2,.9,.3,1.2) both; }
        @keyframes wave-card-in { from { opacity: 0; transform: translate(-50%, -46%) scale(.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        .glass-wave-card--leave { animation: wave-card-out .45s ease-in forwards; }
        @keyframes wave-card-out { to { opacity: 0; transform: translate(-50%, -50%) scale(1.25); filter: blur(6px); } }
        .brain-whiteout { animation: brain-white 1.2s ease-in forwards; }
        @keyframes brain-white { 0%, 25% { opacity: 0; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .glass-wave-card, .glass-wave-card--leave, .brain-whiteout { animation-duration: .01s; }
        }
      `}</style>
    </>
  );
}
