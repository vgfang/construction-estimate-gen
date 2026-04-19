import type { Client } from "../types";
import { Panel } from "./ui/Panel";
import { TextArea } from "./ui/TextArea";
import { TextInput } from "./ui/TextInput";

type Props = {
  client: Client;
  onChange: (client: Client) => void;
};

export function ClientPanel({ client, onChange }: Props) {
  const patch = (part: Partial<Client>) => onChange({ ...client, ...part });
  return (
    <Panel title="Prepared For">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TextInput
          label="Client name"
          value={client.name}
          onChange={(v) => patch({ name: v })}
          placeholder="Homeowner name or company"
        />
        <TextInput
          label="Phone"
          value={client.phone}
          onChange={(v) => patch({ phone: v })}
        />
        <TextInput
          label="Email"
          value={client.email}
          onChange={(v) => patch({ email: v })}
          className="md:col-span-1"
        />
        <TextArea
          label="Address"
          value={client.address}
          onChange={(v) => patch({ address: v })}
          rows={2}
          className="md:col-span-2"
        />
      </div>
    </Panel>
  );
}
