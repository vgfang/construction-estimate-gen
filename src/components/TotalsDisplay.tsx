import type { Section } from "../types";
import {
  formatMoney,
  subtotal,
  taxAmount,
  taxableSubtotal,
  total,
} from "../utils/calc";

type Props = {
  sections: Section[];
  taxRate: number;
};

export function TotalsDisplay({ sections, taxRate }: Props) {
  const sub = subtotal(sections);
  const taxSub = taxableSubtotal(sections);
  const tax = taxAmount(sections, taxRate);
  const grand = total(sections, taxRate);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
      <Row label="Subtotal" value={formatMoney(sub)} />
      <Row label="Taxable" value={formatMoney(taxSub)} />
      <Row label={`Tax (${taxRate || 0}%)`} value={formatMoney(tax)} />
      <Row label="Total" value={formatMoney(grand)} emphasize />
    </div>
  );
}

function Row({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span
        className={
          emphasize
            ? "text-lg font-bold text-slate-900"
            : "text-sm font-medium text-slate-800"
        }
      >
        {value}
      </span>
    </div>
  );
}
