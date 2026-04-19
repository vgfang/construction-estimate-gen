import type { ReactNode } from "react";

type Props = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, action, children, className = "" }: Props) {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {title}
        </h2>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
