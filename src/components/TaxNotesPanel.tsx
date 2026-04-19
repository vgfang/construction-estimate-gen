import { NumberInput } from "./ui/NumberInput";
import { Panel } from "./ui/Panel";
import { TextArea } from "./ui/TextArea";

type Props = {
  taxRate: number;
  notes: string;
  onTaxRateChange: (value: number) => void;
  onNotesChange: (value: string) => void;
};

export function TaxNotesPanel({
  taxRate,
  notes,
  onTaxRateChange,
  onNotesChange,
}: Props) {
  return (
    <Panel title="Tax &amp; Notes">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <NumberInput
          label="Tax rate (%)"
          value={taxRate}
          onChange={onTaxRateChange}
          step={0.01}
          className="md:col-span-1"
        />
        <TextArea
          label="Notes / scope / payment terms"
          value={notes}
          onChange={onNotesChange}
          rows={4}
          placeholder={
            "e.g. 50% deposit required to begin work. Balance due on completion.\nPermits not included."
          }
          className="md:col-span-2"
        />
      </div>
    </Panel>
  );
}
