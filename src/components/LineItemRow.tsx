import type { LineItem } from "../types";
import { formatMoney, lineAmount } from "../utils/calc";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { NumberInput } from "./ui/NumberInput";
import { TextArea } from "./ui/TextArea";

type Props = {
  item: LineItem;
  onChange: (item: LineItem) => void;
  onRemove: () => void;
};

export function LineItemRow({ item, onChange, onRemove }: Props) {
  const patch = (part: Partial<LineItem>) => onChange({ ...item, ...part });
  return (
    <div className="grid grid-cols-12 gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-3">
      <div className="col-span-12 md:col-span-6">
        <TextArea
          label="Description"
          rows={2}
          value={item.description}
          onChange={(v) => patch({ description: v })}
          placeholder="e.g. Remove existing drywall in kitchen"
        />
      </div>
      <div className="col-span-4 md:col-span-1">
        <NumberInput
          label="Qty"
          value={item.quantity}
          onChange={(v) => patch({ quantity: v })}
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <NumberInput
          label="Rate ($)"
          value={item.rate}
          onChange={(v) => patch({ rate: v })}
        />
      </div>
      <div className="col-span-4 md:col-span-2 flex flex-col gap-1">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Amount
        </div>
        <div className="flex h-[38px] items-center rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900">
          {formatMoney(lineAmount(item))}
        </div>
      </div>
      <div className="col-span-12 md:col-span-1 flex flex-col items-start justify-between gap-2 md:items-end">
        <Checkbox
          label="Tax"
          checked={item.taxable}
          onChange={(v) => patch({ taxable: v })}
        />
        <Button
          variant="danger"
          size="sm"
          onClick={onRemove}
          aria-label="Remove line item"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
