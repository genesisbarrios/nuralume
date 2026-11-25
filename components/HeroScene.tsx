"use client";

import { useEffect, useRef } from "react";

// Animated space backdrop for the homepage hero: purple/blue stardust,
// soundwaves drifting in the background, and neurons (glowing pulses with
// trails) firing out of the brain and across the screen. The brain itself is
// the logo image, pulsing on top (see Hero.tsx); this canvas also draws the
// glow behind it in time with that pulse.

const PULSE_MS = 3200; // keep in sync with the brain's CSS animation

type Star = { x: number; y: number; r: number; hue: number; tw: number; sp: number; vx: number; vy: number };
type Wave = { y: number; amp: number; len: number; speed: number; phase: number; hue: number; alpha: number; width: number };
type Neuron = {
  p0: [number, number]; p1: [number, number]; p2: [number, number];
  t: number; speed: number; hue: number; size: number;
  trail: [number, number][];
};
type Spark = { x: number; y: number; life: number; hue: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Without a brainId (e.g. the dashboard background) there is no brain:
// no glow, and neurons just streak across the sky.
export default function HeroScene({ brainId }: { brainId?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    let stars: Star[] = [];
    let waves: Wave[] = [];
    const neurons: Neuron[] = [];
    const sparks: Spark[] = [];
    let raf = 0;
    let visible = true;
    let lastSpawn = 0;
    const start = performance.now();

    // where the brain image sits, relative to the canvas (measured on resize)
    let b0 = { x: 0, y: 0, r: 100 };
    const measure = () => {
      const el = brainId ? document.getElementById(brainId) : null;
      const c = canvas.getBoundingClientRect();
      if (!el) { b0 = { x: w / 2, y: h * 0.35, r: Math.min(w, h) * 0.18 }; return; }
      const r = el.getBoundingClientRect();
      b0 = { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2, r: Math.max(r.width, r.height) / 2 };
    };
    const brain = () => b0;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(420, (w * h) / 2600));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.92 ? rand(0.3, 1.1) : rand(1.2, 2),
        hue: rand(220, 290), // blue → violet
        tw: Math.random() * Math.PI * 2,
        sp: rand(0.6, 2.2),
        vx: rand(-0.04, 0.04),
        vy: rand(-0.03, 0.01),
      }));

      waves = Array.from({ length: 6 }, (_, i) => ({
        y: h * (0.18 + i * 0.13) + rand(-20, 20),
        amp: rand(10, 34),
        len: rand(160, 360),
        speed: rand(0.15, 0.45) * (i % 2 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        hue: rand(235, 285),
        alpha: rand(0.06, 0.14),
        width: rand(1, 1.8),
      }));
      measure();
    };

    // A neuron leaves the brain (or, sometimes, just crosses the sky) on a
    // curved path and flashes when it lands.
    const spawn = () => {
      const b = brain();
      const fromBrain = !!brainId && Math.random() < 0.7;
      const ang = Math.random() * Math.PI * 2;
      let p0: [number, number], p2: [number, number];
      if (fromBrain) {
        p0 = [b.x + Math.cos(ang) * b.r * 0.45, b.y + Math.sin(ang) * b.r * 0.35];
        const dist = Math.max(w, h) * rand(0.45, 0.8);
        p2 = [b.x + Math.cos(ang) * dist, b.y + Math.sin(ang) * dist * 0.7];
      } else {
        const leftToRight = Math.random() < 0.5;
        p0 = [leftToRight ? -40 : w + 40, rand(0, h)];
        p2 = [leftToRight ? w + 40 : -40, rand(0, h)];
      }
      const mid: [number, number] = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
      const nx = -(p2[1] - p0[1]), ny = p2[0] - p0[0];
      const nl = Math.hypot(nx, ny) || 1;
      const bend = rand(-0.35, 0.35) * Math.hypot(p2[0] - p0[0], p2[1] - p0[1]);
      const p1: [number, number] = [mid[0] + (nx / nl) * bend, mid[1] + (ny / nl) * bend];
      neurons.push({
        p0, p1, p2, t: 0,
        speed: rand(0.0035, 0.0075) * (fromBrain ? 1 : 0.6),
        hue: Math.random() < 0.25 ? rand(25, 40) : rand(235, 290), // mostly violet/blue, some warm gold like the logo's core
        size: rand(1.4, 2.6),
        trail: [],
      });
    };

    const bez = (n: Neuron, t: number): [number, number] => {
      const u = 1 - t;
      return [
        u * u * n.p0[0] + 2 * u * t * n.p1[0] + t * t * n.p2[0],
        u * u * n.p0[1] + 2 * u * t * n.p1[1] + t * t * n.p2[1],
      ];
    };

    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(((now - start) / PULSE_MS) * Math.PI * 2 - Math.PI / 2);
      const b = brain();

      // deep space
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#030208";
      ctx.fillRect(0, 0, w, h);

      // nebula clouds
      const neb = (x: number, y: number, r: number, c: string) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      neb(w * 0.18 + Math.sin(time * 0.05) * 30, h * 0.25, Math.max(w, h) * 0.55, "rgba(88, 46, 170, 0.22)");
      neb(w * 0.85, h * 0.7 + Math.cos(time * 0.04) * 30, Math.max(w, h) * 0.5, "rgba(40, 70, 190, 0.18)");
      neb(w * 0.55, h * 0.95, Math.max(w, h) * 0.4, "rgba(120, 60, 200, 0.12)");

      ctx.globalCompositeOperation = "lighter";

      // stardust
      for (const s of stars) {
        if (!reduced) {
          s.x += s.vx; s.y += s.vy;
          if (s.x < -2) s.x = w + 2; else if (s.x > w + 2) s.x = -2;
          if (s.y < -2) s.y = h + 2; else if (s.y > h + 2) s.y = -2;
        }
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.tw + time * s.sp));
        ctx.fillStyle = `hsla(${s.hue}, 90%, 78%, ${a * 0.85})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.2) {
          ctx.fillStyle = `hsla(${s.hue}, 90%, 70%, ${a * 0.12})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // soundwaves floating in the background, swelling a little with the pulse
      for (const wv of waves) {
        ctx.beginPath();
        const amp = wv.amp * (0.8 + 0.35 * pulse);
        for (let x = -10; x <= w + 10; x += 6) {
          // envelope so each wave fades at the edges like a floating ribbon
          const env = Math.sin(Math.PI * Math.min(1, Math.max(0, x / w)));
          const y = wv.y
            + Math.sin(x / wv.len * Math.PI * 2 + wv.phase + time * wv.speed * 2) * amp * env
            + Math.sin(x / (wv.len * 0.37) + time * wv.speed * 3.1) * amp * 0.25 * env;
          if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${wv.hue}, 85%, 70%, ${wv.alpha})`;
        ctx.lineWidth = wv.width;
        ctx.stroke();
      }

      // glow behind the brain, breathing with its pulse
      if (brainId) {
      const gr = b.r * (1.5 + 0.35 * pulse);
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, gr);
      g.addColorStop(0, `rgba(255, 205, 150, ${0.16 + 0.14 * pulse})`);
      g.addColorStop(0.35, `rgba(140, 90, 230, ${0.16 + 0.1 * pulse})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(b.x - gr, b.y - gr, gr * 2, gr * 2);
      }

      // neurons
      if (!reduced) {
        const interval = w < 640 ? 260 : 150;
        if (now - lastSpawn > interval && neurons.length < (w < 640 ? 18 : 34)) {
          spawn();
          // fire a little burst on each heartbeat
          if (pulse > 0.97) { spawn(); spawn(); }
          lastSpawn = now;
        }
      }
      for (let i = neurons.length - 1; i >= 0; i--) {
        const n = neurons[i];
        n.t += n.speed;
        const [x, y] = bez(n, Math.min(n.t, 1));
        n.trail.push([x, y]);
        if (n.trail.length > 26) n.trail.shift();

        // trail
        for (let k = 1; k < n.trail.length; k++) {
          const f = k / n.trail.length;
          ctx.strokeStyle = `hsla(${n.hue}, 95%, 72%, ${f * 0.55})`;
          ctx.lineWidth = n.size * f;
          ctx.beginPath();
          ctx.moveTo(n.trail[k - 1][0], n.trail[k - 1][1]);
          ctx.lineTo(n.trail[k][0], n.trail[k][1]);
          ctx.stroke();
        }
        // head
        const hg = ctx.createRadialGradient(x, y, 0, x, y, n.size * 7);
        hg.addColorStop(0, `hsla(${n.hue}, 100%, 90%, 0.95)`);
        hg.addColorStop(1, `hsla(${n.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(x, y, n.size * 7, 0, Math.PI * 2);
        ctx.fill();

        if (n.t >= 1) {
          sparks.push({ x, y, life: 1, hue: n.hue });
          neurons.splice(i, 1);
        }
      }

      // synapse flashes where neurons land
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.03;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        const r = 4 + (1 - s.life) * 26;
        ctx.strokeStyle = `hsla(${s.hue}, 100%, 75%, ${s.life * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.stroke();
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2 + s.x;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + Math.cos(a) * r * 0.8, s.y + Math.sin(a) * r * 0.8);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    setup();
    if (reduced) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => { setup(); if (reduced) draw(performance.now()); };
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [brainId]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
