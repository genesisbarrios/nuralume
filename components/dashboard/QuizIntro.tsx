export default function QuizIntro({
  title,
  blurb,
  questionCount,
  onStart,
}: {
  title: string;
  blurb: string;
  questionCount: number;
  onStart: () => void;
}) {
  return (
    <div className="rounded-xl bg-base-200 p-6 text-center">
      <p className="font-handwritten text-2xl text-primary">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-base-content/70">
        {blurb}
      </p>
      <p className="mt-3 text-xs text-base-content/50">
        {questionCount} quick questions &middot; about{" "}
        {Math.max(1, Math.round(questionCount / 5))} minutes
      </p>
      <button
        type="button"
        onClick={onStart}
        className="btn btn-primary btn-sm mt-5"
      >
        Start test
      </button>
    </div>
  );
}
