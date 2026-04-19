import type { ButtonHTMLAttributes } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  variant?: "default" | "danger";
};

export function IconButton({
  label,
  variant = "default",
  className = "",
  ...rest
}: Props) {
  const color =
    variant === "danger"
      ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100";
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 ${color} ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M5 5L15 15M15 5L5 15" />
      </svg>
    </button>
  );
}

type FullHeightXProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
};

export function FullHeightX({
  label,
  className = "",
  ...rest
}: FullHeightXProps) {
  return (
    <div
      className={`flex w-10 shrink-0 items-start justify-center self-stretch border-r-2 border-slate-400 bg-slate-50 pt-3 ${className}`}
    >
      <button
        {...rest}
        aria-label={label}
        title={label}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M5 5L15 15M15 5L5 15" />
        </svg>
      </button>
    </div>
  );
}
