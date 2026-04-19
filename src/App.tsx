import { useEffect, useState } from "react";
import type { Company, Estimate, Section } from "./types";
import {
  consumeEstimateNumber,
  loadCompany,
  peekEstimateNumber,
  saveCompany,
} from "./utils/storage";
import { buildEstimateHtml } from "./utils/printHtml";
import { openPrintWindow } from "./utils/print";
import { CompanyPanel } from "./components/CompanyPanel";
import { ClientPanel } from "./components/ClientPanel";
import { MetaPanel } from "./components/MetaPanel";
import { SectionEditor, newSection } from "./components/SectionEditor";
import { TaxNotesPanel } from "./components/TaxNotesPanel";
import { TotalsDisplay } from "./components/TotalsDisplay";
import { Button } from "./components/ui/Button";

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
    sections: [newSection("Scope of work")],
    taxRate: 0,
    notes: "",
  };
}

function App() {
  const [company, setCompany] = useState<Company>(() => loadCompany());
  const [estimate, setEstimate] = useState<Estimate>(() => initialEstimate());

  useEffect(() => {
    saveCompany(company);
  }, [company]);

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
    const html = buildEstimateHtml(company, finalized);
    openPrintWindow(html);
    setEstimate((prev) => ({ ...prev, number: peekEstimateNumber() }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Estimate Generator
            </h1>
            <p className="text-xs text-slate-500">
              Fill out the form, then click Print Estimate to open the printable
              version.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 pb-32">
        <CompanyPanel company={company} onChange={setCompany} />
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

        <div className="flex flex-col gap-4">
          {estimate.sections.map((section, i) => (
            <SectionEditor
              key={section.id}
              section={section}
              onChange={(next) => updateSection(i, next)}
              onRemove={() => removeSection(i)}
            />
          ))}
          <div>
            <Button onClick={addSection}>+ Add section</Button>
          </div>
        </div>

        <TaxNotesPanel
          taxRate={estimate.taxRate}
          notes={estimate.notes}
          onTaxRateChange={(taxRate) => patchEstimate({ taxRate })}
          onNotesChange={(notes) => patchEstimate({ notes })}
        />
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <TotalsDisplay
            sections={estimate.sections}
            taxRate={estimate.taxRate}
          />
          <Button variant="primary" size="lg" onClick={handlePrint}>
            Print Estimate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
