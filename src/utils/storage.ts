import type { Company } from "../types";

const COMPANY_KEY = "invoice-gen:company";
const COUNTER_KEY = "invoice-gen:estimateCounter";

const EMPTY_COMPANY: Company = {
  name: "",
  address: "",
  phone: "",
  email: "",
  license: "",
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
