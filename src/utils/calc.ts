import type { LineItem, Section } from "../types";

export function lineAmount(item: LineItem): number {
  return (Number(item.quantity) || 0) * (Number(item.rate) || 0);
}

export function sectionSubtotal(section: Section): number {
  return section.items.reduce((sum, item) => sum + lineAmount(item), 0);
}

export function subtotal(sections: Section[]): number {
  return sections.reduce((sum, s) => sum + sectionSubtotal(s), 0);
}

export function taxableSubtotal(sections: Section[]): number {
  return sections.reduce(
    (sum, s) =>
      sum +
      s.items.reduce(
        (inner, item) => inner + (item.taxable ? lineAmount(item) : 0),
        0,
      ),
    0,
  );
}

export function taxAmount(sections: Section[], taxRate: number): number {
  const rate = Number(taxRate) || 0;
  return (taxableSubtotal(sections) * rate) / 100;
}

export function total(sections: Section[], taxRate: number): number {
  return subtotal(sections) + taxAmount(sections, taxRate);
}

export function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
