import type { InputHTMLAttributes } from "react";
import { useId } from "react";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  label?: string;
  value: number;
  onChange: (value: number) => void;
};

export function NumberInput({
  label,
  value,
  onChange,
  className = "",
  id,
  step = "any",
  min = 0,
  ...rest
}: Props) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-slate-600 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        id={inputId}
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const next = e.target.value === "" ? 0 : parseFloat(e.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
