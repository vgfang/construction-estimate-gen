import type { Company } from "../types";

const COMPANY_KEY = "invoice-gen:company";
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

export function generateEstimateNumber(): string {
  return Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, "0");
}

export function loadTaxRate(): number {
  const raw = localStorage.getItem(TAX_RATE_KEY);
  if (!raw) return 12;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 12;
}

export function saveTaxRate(rate: number): void {
  localStorage.setItem(TAX_RATE_KEY, String(rate));
}
