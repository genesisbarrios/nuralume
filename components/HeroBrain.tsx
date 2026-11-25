"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const cardRef = useRef<HTMLButtonElement>(null);
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(null);

  // Desktop (text left, brain right): the card sits in the gap between the
  // title and the brain: its right edge 24px before the brain, never closer
  // than 32px to the end of "Tune / your / mind.", vertically level with
  // the brain, and lifted if it would reach the description. Phones keep the
  // default spot.
  useLayoutEffect(() => {
    const place = () => {
      const card = cardRef.current;
      const wrap = card?.offsetParent as HTMLElement | null;
      const title = document.getElementById("hero-title");
      const copy = document.getElementById("hero-copy");
      if (!card || !wrap || !title || window.innerWidth < 1024) return setCardPos(null);
      const w = wrap.getBoundingClientRect();
      const words = Array.from(title.children).map((c) => c.getBoundingClientRect().right);
      const titleRight = Math.max(title.getBoundingClientRect().left, ...words);
      // the brain fills roughly the middle 86% of its canvas, whatever way it's spun
      const brainLeft = w.left + w.width * 0.07;
      const cw = card.offsetWidth;
      const left = Math.max(titleRight + 32, brainLeft - 24 - cw) - w.left;
      let top = (w.height - card.offsetHeight) / 2;
      if (copy) {
        const c = copy.getBoundingClientRect();
        const overlapsCopyX = w.left + left < c.right;
        const bottom = w.top + top + card.offsetHeight;
        if (overlapsCopyX && bottom > c.top - 16) top -= bottom - (c.top - 16);
      }
      setCardPos({ left, top });
    };
    if (!picked) return;
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [picked]);

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
          ref={cardRef}
          type="button"
          onClick={go}
          aria-label={`Listen to ${picked.tag.label} brain wave music`}
          className={`glass-wave-card absolute -top-3 left-0 z-20 sm:top-0 w-[min(66vw,250px)] origin-top-left rounded-2xl border border-white/20 bg-white/10 p-4 text-left text-[#F2E8DC] shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
            leaving ? "glass-wave-card--leave" : ""
          }`}
          style={{
            boxShadow: `0 8px 40px rgba(0,0,0,.45), 0 0 50px -10px ${picked.tag.color}`,
            ...(cardPos ? { left: cardPos.left, top: cardPos.top } : {}),
          }}
        >
          <span
            role="button"
            tabIndex={0}
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setPicked(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setPicked(null); } }}
            className="absolute right-2 top-2 rounded-full p-1 text-[#F2E8DC]/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </span>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: picked.tag.color, boxShadow: `0 0 12px ${picked.tag.color}` }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#F2E8DC]/85">
              {picked.tag.range}
            </span>
          </div>
          <h3 className="mt-1.5 text-lg font-extrabold leading-tight">{picked.tag.label} waves</h3>
          <p className="text-sm font-medium text-[#F2CDA6]">{info.state}</p>
          <p className="mt-2 text-xs leading-relaxed text-[#F2E8DC]/80">{info.about}</p>
          <p className="mt-2 hidden text-[11px] leading-snug text-[#F2E8DC]/60 sm:block"><span className="font-semibold text-[#F2E8DC]/80">Listen for:</span> {info.listen}</p>
          <p className="mt-3 text-xs font-semibold" style={{ color: "#fff" }}>
            {signedIn === false ? "Tap to sign up & listen →" : "Tap to listen →"}
          </p>
        </button>
      )}

      {/* white-out on the way into the brain */}
      {leaving && <div aria-hidden className="brain-whiteout fixed inset-0 z-[100] bg-white" />}

      <style>{`
        .glass-wave-card { animation: wave-card-in .35s cubic-bezier(.2,.9,.3,1.2) both; }
        @keyframes wave-card-in { from { opacity: 0; transform: translate(8px, 8px) scale(.9); } to { opacity: 1; transform: none; } }
        .glass-wave-card--leave { animation: wave-card-out .45s ease-in forwards; }
        @keyframes wave-card-out { to { opacity: 0; transform: scale(1.2); filter: blur(6px); } }
        .brain-whiteout { animation: brain-white 1.2s ease-in forwards; }
        @keyframes brain-white { 0%, 25% { opacity: 0; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .glass-wave-card, .glass-wave-card--leave, .brain-whiteout { animation-duration: .01s; }
        }
      `}</style>
    </>
  );
}
