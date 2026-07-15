"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FullscreenButton from "./FullscreenButton";

type PhaseName = "INHALE" | "HOLD" | "EXHALE" | "REST";

interface Phase {
  name: PhaseName;
  duration: number;
  instruction: string;
}

interface Pattern {
  label: string;
  phases: Phase[];
}

const PATTERNS = {
  box: {
    label: "Box (4-4-4-4)",
    phases: [
      { name: "INHALE", duration: 4, instruction: "🌬️ Breathe In..." },
      { name: "HOLD", duration: 4, instruction: "⏸️ Hold..." },
      { name: "EXHALE", duration: 4, instruction: "🌊 Breathe Out..." },
      { name: "REST", duration: 4, instruction: "😌 Rest..." },
    ],
  },
  twoToOne: {
    label: "2-to-1",
    phases: [
      { name: "INHALE", duration: 4, instruction: "🌬️ Breathe In..." },
      { name: "EXHALE", duration: 8, instruction: "🌊 Breathe Out..." },
    ],
  },
  fourSevenEight: {
    label: "4-7-8",
    phases: [
      { name: "INHALE", duration: 4, instruction: "🌬️ Breathe In..." },
      { name: "HOLD", duration: 7, instruction: "⏸️ Hold..." },
      { name: "EXHALE", duration: 8, instruction: "🌊 Breathe Out..." },
    ],
  },
} satisfies Record<string, Pattern>;

type PatternKey = keyof typeof PATTERNS;

const CUBE_BASE_ROTATE = "rotateX(-20deg) rotateY(30deg)";

const CUBE_FACES: { transform: string; background: string }[] = [
  { transform: "translateZ(100px)", background: "rgba(77,208,225,0.85)" },
  { transform: "rotateY(180deg) translateZ(100px)", background: "rgba(77,208,225,0.85)" },
  { transform: "rotateY(90deg) translateZ(100px)", background: "rgba(77,208,225,0.85)" },
  { transform: "rotateY(-90deg) translateZ(100px)", background: "rgba(77,208,225,0.85)" },
  { transform: "rotateX(90deg) translateZ(100px)", background: "rgba(100,220,240,0.9)" },
  { transform: "rotateX(-90deg) translateZ(100px)", background: "rgba(50,180,200,0.9)" },
];

export default function JellyCubeGame({ className = "" }: { className?: string }) {
  const [patternKey, setPatternKey] = useState<PatternKey>("box");
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [statusText, setStatusText] = useState("Ready");

  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  const animationId = useRef<number | null>(null);
  const scheduledTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseStartTime = useRef(0);
  const runningRef = useRef(false);
  const patternRef = useRef<Pattern>(PATTERNS[patternKey]);

  useEffect(() => {
    patternRef.current = PATTERNS[patternKey];
  }, [patternKey]);

  const applyCubeTransform = useCallback(
    (scaleX: number, scaleYZ: number, glowOpacity: number) => {
      if (cubeRef.current) {
        cubeRef.current.style.transform = `${CUBE_BASE_ROTATE} scale3d(${scaleX}, ${scaleYZ}, ${scaleYZ})`;
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = String(glowOpacity);
      }
    },
    []
  );

  const stopGame = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
    if (scheduledTimeout.current) {
      clearTimeout(scheduledTimeout.current);
      scheduledTimeout.current = null;
    }
    setStatusText("Ready");
    if (timerRef.current) timerRef.current.textContent = "0";
    applyCubeTransform(1, 1, 0);
  }, [applyCubeTransform]);

  const startPhase = useCallback(
    (phaseIndex: number) => {
      if (!runningRef.current) return;

      const phases = patternRef.current.phases;
      let index = phaseIndex;
      if (index >= phases.length) {
        index = 0;
        setCycleCount((c) => c + 1);
      }

      const phase = phases[index];
      const currentPhase = phase.name;
      const duration = phase.duration;
      phaseStartTime.current = performance.now();
      setStatusText(phase.instruction);

      const updateTimer = () => {
        if (!runningRef.current) return;

        const now = performance.now();
        const elapsed = (now - phaseStartTime.current) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        if (timerRef.current) {
          timerRef.current.textContent = String(Math.ceil(remaining));
        }

        const progress = Math.min(1, elapsed / duration);
        let scaleX = 1;
        let scaleYZ = 1;
        let glowOpacity = 0;

        if (currentPhase === "INHALE") {
          scaleX = 1 - progress * 0.6;
          scaleYZ = 1 + progress * 0.15;
          glowOpacity = progress * 0.5;
        } else if (currentPhase === "HOLD") {
          scaleX = 0.4;
          scaleYZ = 1.15;
          glowOpacity = 0.5;
        } else if (currentPhase === "EXHALE") {
          const eased = 1 - Math.pow(1 - progress, 3);
          scaleX = 0.4 + eased * 0.6;
          scaleYZ = 1.15 - eased * 0.15;
          glowOpacity = 0.5 - eased * 0.5;
        } else if (currentPhase === "REST") {
          scaleX = 1;
          scaleYZ = 1;
          glowOpacity = 0;
        }

        applyCubeTransform(scaleX, scaleYZ, glowOpacity);

        if (elapsed < duration && runningRef.current) {
          animationId.current = requestAnimationFrame(updateTimer);
        } else {
          if (timerRef.current) timerRef.current.textContent = "0";
          if (currentPhase === "INHALE") {
            applyCubeTransform(0.4, 1.15, 0.5);
          } else if (currentPhase === "EXHALE" || currentPhase === "REST") {
            applyCubeTransform(1, 1, 0);
          }
          if (runningRef.current) {
            scheduledTimeout.current = setTimeout(() => {
              startPhase(index + 1);
            }, 200);
          }
        }
      };

      updateTimer();
    },
    [applyCubeTransform]
  );

  const startGame = useCallback(() => {
    runningRef.current = true;
    setIsRunning(true);
    setCycleCount(0);
    setStatusText("Starting...");
    startPhase(0);
  }, [startPhase]);

  const handleToggle = () => {
    if (isRunning) stopGame();
    else startGame();
  };

  const handlePatternChange = (key: PatternKey) => {
    if (isRunning) stopGame();
    setPatternKey(key);
    setStatusText("Ready");
    applyCubeTransform(1, 1, 0);
  };

  useEffect(() => {
    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      if (scheduledTimeout.current) clearTimeout(scheduledTimeout.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto bg-gradient-to-br from-[#a4c5c7] to-[#2D3F48] p-6 text-white ${className}`}
    >
      <div className="absolute left-2 right-14 top-2 flex flex-wrap justify-start gap-1.5 sm:left-4 sm:right-16 sm:top-5 sm:gap-2">
        {(Object.keys(PATTERNS) as PatternKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handlePatternChange(key)}
            className={`rounded-full border-2 border-[#4dd0e1] px-2 py-1 text-[10px] font-bold transition-all hover:scale-105 sm:px-4 sm:py-2 sm:text-sm ${
              patternKey === key
                ? "bg-[#4dd0e1] text-[#1a1a2e]"
                : "bg-black/30 text-[#4dd0e1]"
            }`}
          >
            {PATTERNS[key].label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`absolute bottom-2 right-2 min-w-[80px] rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 sm:bottom-4 sm:right-4 sm:min-w-[120px] sm:px-4 sm:py-2 sm:text-sm ${
          isRunning ? "bg-[#4CAF50]" : "bg-[#e94560]"
        }`}
      >
        {isRunning ? "⏹ Stop" : "▶ Start"}
      </button>

      <div
        className="mx-auto my-2 scale-[0.6] sm:scale-100"
        style={{ width: 200, height: 200, perspective: 800 }}
      >
        <div
          ref={cubeRef}
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `${CUBE_BASE_ROTATE} scale3d(1, 1, 1)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {CUBE_FACES.map((face, i) => (
            <div
              key={i}
              className="absolute h-[200px] w-[200px] border-2 border-white/20"
              style={{
                background: face.background,
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)",
                transform: face.transform,
              }}
            />
          ))}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 z-10 rounded-full opacity-0 transition-opacity"
            style={{
              background:
                "radial-gradient(circle, rgba(77,208,225,0.3) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-2 left-2 flex flex-col items-start sm:bottom-4 sm:left-4">
        <div className="min-h-[1.6rem] text-left text-xs font-bold tracking-wide drop-shadow sm:min-h-[2.4rem] sm:text-xl">
          {statusText}
        </div>
        <div
          ref={timerRef}
          className="text-left text-2xl font-extrabold tabular-nums text-[#4dd0e1] drop-shadow sm:text-5xl"
        >
          0
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/15 px-3 py-1 text-center text-[10px] text-white/85 backdrop-blur sm:bottom-4 sm:px-5 sm:py-2 sm:text-sm">
        Cycles Completed: {cycleCount}
      </div>
      <FullscreenButton containerRef={containerRef} />
    </div>
  );
}
