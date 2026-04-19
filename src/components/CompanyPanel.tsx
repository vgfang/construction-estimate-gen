import { useRef } from "react";
import type { Company } from "../types";
import { readFileAsDataURL } from "../utils/print";
import { Button } from "./ui/Button";
import { Panel } from "./ui/Panel";
import { TextArea } from "./ui/TextArea";
import { TextInput } from "./ui/TextInput";

type Props = {
  company: Company;
  onChange: (company: Company) => void;
};

const MAX_LOGO_BYTES = 500 * 1024;

export function CompanyPanel({ company, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const patch = (part: Partial<Company>) => onChange({ ...company, ...part });

  async function handleLogoPick(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      alert(
        `Logo is too large (${(file.size / 1024).toFixed(0)} KB). Please choose an image under 500 KB.`,
      );
      return;
    }
    const dataUrl = await readFileAsDataURL(file);
    patch({ logo: dataUrl });
  }

  return (
    <Panel
      title="Your Company"
      action={
        <span className="text-xs text-slate-500">Saved in this browser</span>
      }
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TextInput
          label="Company name"
          value={company.name}
          onChange={(v) => patch({ name: v })}
          placeholder="Acme Construction"
        />
        <TextInput
          label="Contractor license #"
          value={company.license ?? ""}
          onChange={(v) => patch({ license: v })}
          placeholder="Optional"
        />
        <TextInput
          label="Phone"
          value={company.phone}
          onChange={(v) => patch({ phone: v })}
          placeholder="(555) 123-4567"
        />
        <TextInput
          label="Email"
          value={company.email}
          onChange={(v) => patch({ email: v })}
          placeholder="you@company.com"
        />
        <TextArea
          label="Address"
          value={company.address}
          onChange={(v) => patch({ address: v })}
          placeholder={"123 Main St\nCity, ST 12345"}
          rows={2}
          className="md:col-span-2"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        {company.logo ? (
          <img
            src={company.logo}
            alt="Logo"
            className="h-16 w-16 rounded border border-slate-200 object-contain bg-slate-50"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-slate-300 text-xs text-slate-400">
            No logo
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleLogoPick(e.target.files?.[0])}
        />
        <Button onClick={() => fileRef.current?.click()}>
          {company.logo ? "Replace logo" : "Upload logo"}
        </Button>
        {company.logo && (
          <Button variant="danger" onClick={() => patch({ logo: undefined })}>
            Remove
          </Button>
        )}
      </div>
    </Panel>
  );
}
