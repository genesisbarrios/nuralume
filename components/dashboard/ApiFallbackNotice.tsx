import { Info } from "lucide-react";

export default function ApiFallbackNotice({
  message = "Showing sample data — connect an API key for personalized, live results.",
}: {
  message?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg bg-info/10 p-3 text-xs text-info">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
