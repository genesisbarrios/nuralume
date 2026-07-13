"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import LikertQuiz from "@/components/dashboard/LikertQuiz";
import QuizIntro from "@/components/dashboard/QuizIntro";
import {
  ARCHETYPE_INFO,
  ARCHETYPE_QUESTIONS,
  type ArchetypeResult,
} from "@/libs/archetype";
import { submitArchetypeQuiz } from "./actions";

type Stage = "intro" | "quiz" | "result";

export default function ArchetypeView({
  initialResult,
}: {
  initialResult: ArchetypeResult | null;
}) {
  const [result, setResult] = useState(initialResult);
  const [stage, setStage] = useState<Stage>(result ? "result" : "intro");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (answers: Record<string, number>) => {
    startTransition(async () => {
      const next = await submitArchetypeQuiz(answers);
      setResult(next);
      setStage("result");
    });
  };

  if (stage === "intro") {
    return (
      <QuizIntro
        title="Jungian Archetype"
        blurb="Based on Carol Pearson's 12 archetypes (Innocent, Hero, Sage, Rebel, and more), this finds which core character your personality most closely embodies — and your closest runner-up."
        questionCount={ARCHETYPE_QUESTIONS.length}
        onStart={() => setStage("quiz")}
      />
    );
  }

  if (stage === "quiz") {
    return (
      <LikertQuiz
        questions={ARCHETYPE_QUESTIONS}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    );
  }

  const primary = ARCHETYPE_INFO[result!.primary];
  const secondary = ARCHETYPE_INFO[result!.secondary];

  return (
    <div>
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center">
        <p className="font-handwritten text-3xl text-primary">
          {primary.name}
        </p>
        <p className="mt-3 text-sm text-base-content/70">
          {primary.description}
        </p>
      </div>

      <div className="mt-3 rounded-xl bg-base-200 p-4">
        <p className="text-xs font-semibold text-base-content/60">
          Runner-up: {secondary.name}
        </p>
        <p className="mt-1 text-sm text-base-content/70">
          {secondary.description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setStage("intro")}
        disabled={isPending}
        className="btn btn-ghost btn-xs mt-3 gap-1"
      >
        <RefreshCw className="h-3 w-3" />
        Retake quiz
      </button>
    </div>
  );
}
