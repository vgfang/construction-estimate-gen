import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 border border-slate-900",
  secondary:
    "bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400 border border-slate-300",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 border border-transparent",
  danger:
    "bg-white text-red-700 hover:bg-red-50 focus:ring-red-400 border border-red-300",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-2.5 py-1",
  md: "text-sm px-3.5 py-2",
  lg: "text-base px-5 py-2.5",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
