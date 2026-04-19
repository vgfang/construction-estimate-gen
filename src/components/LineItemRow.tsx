import type { LineItem } from "../types";
import { formatMoney, lineAmount } from "../utils/calc";
import { Checkbox } from "./ui/Checkbox";
import { FullHeightX } from "./ui/IconButton";
import { ParsedNumberInput } from "./ui/ParsedNumberInput";
import { TextArea } from "./ui/TextArea";

type Props = {
  item: LineItem;
  onChange: (item: LineItem) => void;
  onRemove: () => void;
  taxRate: number;
};

export function LineItemRow({ item, onChange, onRemove, taxRate }: Props) {
  const patch = (part: Partial<LineItem>) => onChange({ ...item, ...part });
  return (
    <div className="flex items-stretch overflow-hidden rounded-md border-2 border-slate-400 bg-white">
      <FullHeightX label="Remove item" onClick={onRemove} />
      <div className="grid min-w-0 flex-1 grid-cols-12 items-start gap-2 p-3">
        <div className="col-span-12 md:col-span-6">
          <TextArea
            label="Description"
            rows={2}
            value={item.description}
            onChange={(v) => patch({ description: v })}
            placeholder="e.g. Remove existing drywall in kitchen"
          />
        </div>
        <div className="col-span-3 md:col-span-1">
          <ParsedNumberInput
            label="Qty"
            value={item.quantity}
            onChange={(v) => patch({ quantity: v })}
            placeholder="1"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <ParsedNumberInput
            label="Rate ($)"
            value={item.rate}
            onChange={(v) => patch({ rate: v })}
            placeholder="0.00"
          />
        </div>
        <div className="col-span-5 md:col-span-2 flex flex-col gap-1">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Amount
          </div>
          <div className="flex h-[38px] items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900">
            {formatMoney(lineAmount(item))}
          </div>
        </div>
        <div className="col-span-12 md:col-span-1 flex flex-col gap-1">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Tax
          </div>
          <div className="flex h-[38px] items-center gap-1.5">
            <Checkbox
              checked={item.taxable}
              onChange={(v) => patch({ taxable: v })}
            />
            <span className="text-xs font-medium text-slate-600">
              +{taxRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
