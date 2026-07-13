"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import LikertQuiz from "@/components/dashboard/LikertQuiz";
import QuizIntro from "@/components/dashboard/QuizIntro";
import { MBTI_QUESTIONS, type MbtiResult } from "@/libs/mbti";
import { submitMbtiQuiz } from "./actions";

type Stage = "intro" | "quiz" | "result";

export default function MbtiView({
  initialResult,
}: {
  initialResult: MbtiResult | null;
}) {
  const [result, setResult] = useState(initialResult);
  const [stage, setStage] = useState<Stage>(result ? "result" : "intro");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (answers: Record<string, number>) => {
    startTransition(async () => {
      const next = await submitMbtiQuiz(answers);
      setResult(next);
      setStage("result");
    });
  };

  if (stage === "intro") {
    return (
      <QuizIntro
        title="Myers-Briggs Type Indicator"
        blurb="MBTI sorts personality into 16 types across four dimensions: where you focus your energy, how you take in information, how you make decisions, and how you approach the outside world."
        questionCount={MBTI_QUESTIONS.length}
        onStart={() => setStage("quiz")}
      />
    );
  }

  if (stage === "quiz") {
    return (
      <LikertQuiz
        questions={MBTI_QUESTIONS}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    );
  }

  return (
    <div>
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center">
        <p className="font-handwritten text-4xl text-primary">
          {result!.type}
        </p>
        <p className="mt-1 text-sm font-semibold">{result!.info.nickname}</p>
        <p className="mt-3 text-sm text-base-content/70">
          {result!.info.description}
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
