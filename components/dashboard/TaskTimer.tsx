"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";

const PRESETS = [5, 10, 15, 25, 45];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TaskTimer() {
  const [taskName, setTaskName] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setIsDone(true);
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Time's up!", {
              body: taskName || "Your focus timer is done.",
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, taskName]);

  const start = () => {
    if (remainingSeconds === 0) setRemainingSeconds(minutes * 60);
    setIsDone(false);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setIsDone(false);
    setRemainingSeconds(minutes * 60);
  };

  const selectPreset = (value: number) => {
    setMinutes(value);
    setRemainingSeconds(value * 60);
    setIsRunning(false);
    setIsDone(false);
  };

  const progress =
    minutes > 0 ? 1 - remainingSeconds / (minutes * 60) : 0;

  return (
    <div>
      {!isRunning && remainingSeconds === minutes * 60 && !isDone && (
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="What are you working on? (optional)"
          className="input input-bordered input-sm mb-3 w-full"
        />
      )}

      {taskName && (isRunning || isDone) && (
        <p className="mb-2 text-center text-sm font-medium">{taskName}</p>
      )}

      <div className="rounded-xl bg-base-200 p-6 text-center">
        <p
          className={`font-handwritten text-5xl ${
            isDone ? "text-success" : "text-primary"
          }`}
        >
          {isDone ? "Time's up!" : formatTime(remainingSeconds)}
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-base-300">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>

        <div className="mt-5 flex justify-center gap-3">
          {isRunning ? (
            <button
              type="button"
              onClick={pause}
              className="btn btn-circle btn-primary"
            >
              <Pause className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="btn btn-circle btn-primary"
              aria-label="Start timer"
            >
              <Play className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="btn btn-circle btn-ghost"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => selectPreset(preset)}
            className={`badge gap-1 py-3 ${
              minutes === preset ? "badge-primary" : "badge-outline"
            }`}
          >
            <TimerIcon className="h-3 w-3" />
            {preset}m
          </button>
        ))}
      </div>
    </div>
  );
}
