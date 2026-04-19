import { Panel } from "./ui/Panel";
import { TextArea } from "./ui/TextArea";

type Props = {
  notes: string;
  onNotesChange: (value: string) => void;
};

export function NotesPanel({ notes, onNotesChange }: Props) {
  return (
    <Panel title="Notes">
      <TextArea
        label="Scope / payment terms / exclusions"
        value={notes}
        onChange={onNotesChange}
        rows={4}
        placeholder={
          "e.g. 50% deposit required to begin work. Balance due on completion.\nPermits not included."
        }
      />
    </Panel>
  );
}
