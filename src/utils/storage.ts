import type { Company } from "../types";

const COMPANY_KEY = "invoice-gen:company";
const COUNTER_KEY = "invoice-gen:estimateCounter";
const TAX_RATE_KEY = "invoice-gen:taxRate";

export const DEFAULT_DISCLAIMER =
  "This is an estimate only. Prices are subject to change if scope of work changes. Signature below indicates acceptance of the scope and pricing above.";

const EMPTY_COMPANY: Company = {
  name: "",
  address: "",
  phone: "",
  email: "",
  license: "",
  disclaimer: DEFAULT_DISCLAIMER,
};

export function loadCompany(): Company {
  try {
    const raw = localStorage.getItem(COMPANY_KEY);
    if (!raw) return EMPTY_COMPANY;
    return { ...EMPTY_COMPANY, ...JSON.parse(raw) };
  } catch {
    return EMPTY_COMPANY;
  }
}

export function saveCompany(company: Company): void {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
}

function readCounter(): number {
  const raw = localStorage.getItem(COUNTER_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function peekEstimateNumber(): string {
  const next = readCounter() + 1;
  return format(next);
}

export function consumeEstimateNumber(): string {
  const next = readCounter() + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return format(next);
}

function format(n: number): string {
  return `EST-${String(n).padStart(4, "0")}`;
}

export function loadTaxRate(): number {
  const raw = localStorage.getItem(TAX_RATE_KEY);
  if (!raw) return 0;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export function saveTaxRate(rate: number): void {
  localStorage.setItem(TAX_RATE_KEY, String(rate));
}
