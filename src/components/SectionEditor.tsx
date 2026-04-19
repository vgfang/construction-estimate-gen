import type { Section, LineItem } from "../types";
import { formatMoney, sectionSubtotal } from "../utils/calc";
import { newId } from "../utils/id";
import { Button } from "./ui/Button";
import { TextInput } from "./ui/TextInput";
import { LineItemRow } from "./LineItemRow";

type Props = {
  section: Section;
  onChange: (section: Section) => void;
  onRemove: () => void;
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

export function SectionEditor({ section, onChange, onRemove }: Props) {
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
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex-1">
          <TextInput
            value={section.title}
            onChange={(v) => onChange({ ...section, title: v })}
            placeholder="Section title (e.g. Demo, Framing, Electrical)"
            className="flex-1"
          />
        </div>
        <div className="text-sm text-slate-500 whitespace-nowrap">
          Subtotal:{" "}
          <span className="font-semibold text-slate-900">
            {formatMoney(sectionSubtotal(section))}
          </span>
        </div>
        <Button variant="danger" size="sm" onClick={onRemove}>
          Remove section
        </Button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {section.items.map((item, i) => (
          <LineItemRow
            key={item.id}
            item={item}
            onChange={(next) => updateItem(i, next)}
            onRemove={() => removeItem(i)}
          />
        ))}
        {section.items.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
            No line items yet.
          </div>
        )}
        <div>
          <Button onClick={addItem}>+ Add line item</Button>
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
