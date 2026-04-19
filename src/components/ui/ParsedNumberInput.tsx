import { useEffect, useRef, useState } from "react";
import { useId } from "react";

type Props = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
};

export function ParsedNumberInput({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
  id,
}: Props) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const focused = useRef(false);

  const toDisplay = (n: number) => (n === 0 ? "" : String(n));
  const [raw, setRaw] = useState(() => toDisplay(value));

  // Sync display when value changes from outside (and we're not actively editing)
  useEffect(() => {
    if (!focused.current) {
      setRaw(toDisplay(value));
    }
  }, [value]);

  const handleChange = (text: string) => {
    // Allow empty, digits, one leading minus, one decimal point
    if (text !== "" && !/^-?\d*\.?\d*$/.test(text)) return;
    setRaw(text);
    const n = parseFloat(text);
    onChange(Number.isFinite(n) ? n : 0);
  };

  const handleBlur = () => {
    focused.current = false;
    const n = parseFloat(raw);
    const normalized = Number.isFinite(n) ? n : 0;
    setRaw(toDisplay(normalized));
    onChange(normalized);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wide text-slate-600"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        inputMode="decimal"
        value={raw}
        placeholder={placeholder}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        className="rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </div>
  );
}
