"use client";

import { useState } from "react";

const SCALE = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

export default function LikertQuiz({
  questions,
  onSubmit,
  isSubmitting,
}: {
  questions: { id: string; text: string }[];
  onSubmit: (answers: Record<string, number>) => void;
  isSubmitting: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  return (
    <div>
      <p className="mb-4 text-xs text-base-content/50">
        {answeredCount} / {questions.length} answered
      </p>

      <div className="space-y-5">
        {questions.map((q, index) => (
          <div key={q.id}>
            <p className="mb-2 text-sm font-medium">
              {index + 1}. {q.text}
            </p>
            <div className="flex justify-between gap-1">
              {SCALE.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  title={option.label}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: option.value }))
                  }
                  className={`flex-1 rounded-md py-2 text-xs transition-colors ${
                    answers[q.id] === option.value
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 hover:bg-base-300"
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-base-content/40">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>

      <button
        type="button"
        disabled={!isComplete || isSubmitting}
        onClick={() => onSubmit(answers)}
        className="btn btn-primary btn-sm mt-5 w-full"
      >
        {isSubmitting ? "Scoring..." : "See my results"}
      </button>
    </div>
  );
}
