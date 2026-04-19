import { useEffect, useState } from "react";
import type { Company, Estimate, Section } from "./types";
import {
  consumeEstimateNumber,
  loadCompany,
  loadTaxRate,
  peekEstimateNumber,
  saveCompany,
  saveTaxRate,
} from "./utils/storage";
import { buildEstimateHtml } from "./utils/printHtml";
import { openPrintWindow } from "./utils/print";
import { ClientPanel } from "./components/ClientPanel";
import { MetaPanel } from "./components/MetaPanel";
import { SectionEditor, newSection } from "./components/SectionEditor";
import { NotesPanel } from "./components/NotesPanel";
import { SettingsModal } from "./components/SettingsModal";
import { TotalsDisplay } from "./components/TotalsDisplay";
import { Button } from "./components/ui/Button";
import { Panel } from "./components/ui/Panel";

function today(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function initialEstimate(): Estimate {
  return {
    number: peekEstimateNumber(),
    date: today(),
    client: { name: "", address: "", phone: "", email: "" },
    sections: [newSection("")],
    notes: "",
  };
}

function App() {
  const [company, setCompany] = useState<Company>(() => loadCompany());
  const [taxRate, setTaxRate] = useState<number>(() => loadTaxRate());
  const [estimate, setEstimate] = useState<Estimate>(() => initialEstimate());
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    saveCompany(company);
  }, [company]);

  useEffect(() => {
    saveTaxRate(taxRate);
  }, [taxRate]);

  const patchEstimate = (part: Partial<Estimate>) =>
    setEstimate((prev) => ({ ...prev, ...part }));

  const updateSection = (index: number, section: Section) => {
    const sections = estimate.sections.slice();
    sections[index] = section;
    patchEstimate({ sections });
  };

  const removeSection = (index: number) => {
    patchEstimate({
      sections: estimate.sections.filter((_, i) => i !== index),
    });
  };

  const addSection = () => {
    patchEstimate({
      sections: [...estimate.sections, newSection("")],
    });
  };

  const handlePrint = () => {
    const number = consumeEstimateNumber();
    const finalized: Estimate = { ...estimate, number };
    const html = buildEstimateHtml(company, finalized, taxRate);
    openPrintWindow(html);
    setEstimate((prev) => ({ ...prev, number: peekEstimateNumber() }));
  };

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900">
      <header className="border-b-2 border-slate-400 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Estimate Generator
            </h1>
            <p className="text-xs text-slate-500">
              Fill out the form, then click Print Estimate to open the printable
              version.
            </p>
          </div>
          <Button
            onClick={() => setSettingsOpen(true)}
            className="border-2 border-slate-400 bg-slate-100 font-semibold text-slate-800 hover:bg-slate-200"
          >
            Company Info &amp; Settings
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 pb-32">
        <ClientPanel
          client={estimate.client}
          onChange={(client) => patchEstimate({ client })}
        />
        <MetaPanel
          number={estimate.number}
          date={estimate.date}
          onNumberChange={(number) => patchEstimate({ number })}
          onDateChange={(date) => patchEstimate({ date })}
        />

        <Panel title="Estimate Sections">
          <div className="flex flex-col gap-3">
            {estimate.sections.map((section, i) => (
              <SectionEditor
                key={section.id}
                section={section}
                onChange={(next) => updateSection(i, next)}
                onRemove={() => removeSection(i)}
                taxRate={taxRate}
              />
            ))}
            {estimate.sections.length === 0 && (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                No sections yet. Click "Add section" to start.
              </div>
            )}
            <div>
              <Button size="sm" onClick={addSection}>
                + Add section
              </Button>
            </div>
          </div>
        </Panel>

        <NotesPanel
          notes={estimate.notes}
          onNotesChange={(notes) => patchEstimate({ notes })}
        />
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t-2 border-slate-400 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <TotalsDisplay sections={estimate.sections} taxRate={taxRate} />
          <Button variant="primary" size="lg" onClick={handlePrint}>
            Print Estimate
          </Button>
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        company={company}
        onCompanyChange={setCompany}
        taxRate={taxRate}
        onTaxRateChange={setTaxRate}
      />
    </div>
  );
}

export default App;
