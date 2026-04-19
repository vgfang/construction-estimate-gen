import type { Section, LineItem } from "../types";
import { formatMoney, sectionSubtotal } from "../utils/calc";
import { newId } from "../utils/id";
import { Button } from "./ui/Button";
import { FullHeightX } from "./ui/IconButton";
import { TextInput } from "./ui/TextInput";
import { LineItemRow } from "./LineItemRow";

type Props = {
  section: Section;
  onChange: (section: Section) => void;
  onRemove: () => void;
  taxRate: number;
};

export function newLineItem(): LineItem {
  return {
    id: newId(),
    description: "",
    quantity: 1,
    rate: 0,
    taxable: false,
  };
}

export function SectionEditor({ section, onChange, onRemove, taxRate }: Props) {
  const updateItem = (index: number, item: LineItem) => {
    const items = section.items.slice();
    items[index] = item;
    onChange({ ...section, items });
  };

  const removeItem = (index: number) => {
    onChange({
      ...section,
      items: section.items.filter((_, i) => i !== index),
    });
  };

  const addItem = () => {
    onChange({ ...section, items: [...section.items, newLineItem()] });
  };

  return (
    <div className="flex items-stretch overflow-hidden rounded-md border-2 border-slate-400 bg-slate-100">
      <FullHeightX label="Remove section" onClick={onRemove} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex-1">
            <TextInput
              value={section.title}
              onChange={(v) => onChange({ ...section, title: v })}
              placeholder="Section title (e.g. Demo, Framing, Electrical)"
            />
          </div>
          <div className="whitespace-nowrap text-xs text-slate-500">
            Subtotal:{" "}
            <span className="font-semibold text-slate-900">
              {formatMoney(sectionSubtotal(section))}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-3 pb-3">
          {section.items.map((item, i) => (
            <LineItemRow
              key={item.id}
              item={item}
              onChange={(next) => updateItem(i, next)}
              onRemove={() => removeItem(i)}
              taxRate={taxRate}
            />
          ))}
          {section.items.length === 0 && (
            <div className="rounded-md border border-dashed border-slate-300 bg-white p-3 text-center text-sm text-slate-500">
              No line items yet.
            </div>
          )}
          <div>
            <Button size="sm" onClick={addItem}>
              + Add list item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function newSection(title = ""): Section {
  return {
    id: newId(),
    title,
    items: [newLineItem()],
  };
}
