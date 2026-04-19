import { useId } from "react";

type Props = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
};

export function Checkbox({
  label,
  checked,
  onChange,
  id,
  className = "",
}: Props) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-400 text-slate-900 focus:ring-slate-400"
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
