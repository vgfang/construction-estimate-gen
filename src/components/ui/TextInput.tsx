import type { InputHTMLAttributes } from "react";
import { useId } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextInput({
  label,
  value,
  onChange,
  className = "",
  id,
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
        type={rest.type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
