"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import LikertQuiz from "@/components/dashboard/LikertQuiz";
import QuizIntro from "@/components/dashboard/QuizIntro";
import { BIG_FIVE_QUESTIONS, TRAIT_LABELS, type BigFiveResult } from "@/libs/bigFive";
import { submitBigFiveQuiz } from "./actions";

type Stage = "intro" | "quiz" | "result";

export default function BigFiveView({
  initialResult,
}: {
  initialResult: BigFiveResult | null;
}) {
  const [result, setResult] = useState(initialResult);
  const [stage, setStage] = useState<Stage>(result ? "result" : "intro");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (answers: Record<string, number>) => {
    startTransition(async () => {
      const next = await submitBigFiveQuiz(answers);
      setResult(next);
      setStage("result");
    });
  };

  if (stage === "intro") {
    return (
      <QuizIntro
        title="Big Five (OCEAN)"
        blurb="The most widely validated framework in personality psychology. It scores you across five core traits — Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism — rather than sorting you into a single type."
        questionCount={BIG_FIVE_QUESTIONS.length}
        onStart={() => setStage("quiz")}
      />
    );
  }

  if (stage === "quiz") {
    return (
      <LikertQuiz
        questions={BIG_FIVE_QUESTIONS}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {result!.traits.map((t) => (
          <div key={t.trait} className="rounded-xl bg-base-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-handwritten text-lg text-primary">
                {TRAIT_LABELS[t.trait]}
              </p>
              <span className="badge badge-outline capitalize">
                {t.level}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-base-300">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(t.score / 5) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-base-content/70">
              {t.description}
            </p>
          </div>
        ))}
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
