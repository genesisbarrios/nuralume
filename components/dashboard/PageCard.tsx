import type { ReactNode } from "react";

export default function PageCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-base-300/60 bg-base-100/90 p-5 shadow-sm ${className}`}
    >
      {title && (
        <h2 className="mb-3 font-handwritten text-2xl text-base-content">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
