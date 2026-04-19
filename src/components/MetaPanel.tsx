import { Panel } from "./ui/Panel";
import { TextInput } from "./ui/TextInput";

type Props = {
  number: string;
  date: string;
  onNumberChange: (value: string) => void;
  onDateChange: (value: string) => void;
};

export function MetaPanel({
  number,
  date,
  onNumberChange,
  onDateChange,
}: Props) {
  return (
    <Panel title="Estimate Details">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TextInput
          label="Estimate number"
          value={number}
          onChange={onNumberChange}
        />
        <TextInput
          label="Date"
          type="date"
          value={date}
          onChange={onDateChange}
        />
      </div>
    </Panel>
  );
}
