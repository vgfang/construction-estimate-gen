import type { Company, Estimate } from "../types";
import {
  formatMoney,
  lineAmount,
  sectionSubtotal,
  subtotal,
  taxAmount,
  taxableSubtotal,
  total,
} from "./calc";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildEstimateHtml(
  company: Company,
  estimate: Estimate,
  taxRate: number,
): string {
  const logoImg = company.logo
    ? `<img src="${company.logo}" alt="" class="logo"/>`
    : "";

  const sectionsHtml = estimate.sections
    .map((section) => {
      const rows = section.items
        .map(
          (item) => `
            <tr>
              <td class="desc">${nl2br(item.description)}</td>
              <td class="num">${Number(item.quantity) || 0}</td>
              <td class="num">${formatMoney(Number(item.rate) || 0)}</td>
              <td class="num">${formatMoney(lineAmount(item))}</td>
            </tr>`,
        )
        .join("");

      return `
        <section class="section">
          <h3>${escapeHtml(section.title || "Section")}</h3>
          <table class="items">
            <thead>
              <tr>
                <th class="desc">Description</th>
                <th class="num">Qty</th>
                <th class="num">Rate</th>
                <th class="num">Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="subtotal-label">Section subtotal</td>
                <td class="num">${formatMoney(sectionSubtotal(section))}</td>
              </tr>
            </tfoot>
          </table>
        </section>`;
    })
    .join("");

  const sub = subtotal(estimate.sections);
  const taxSub = taxableSubtotal(estimate.sections);
  const tax = taxAmount(estimate.sections, taxRate);
  const grand = total(estimate.sections, taxRate);

  const notesBlock = estimate.notes.trim()
    ? `<section class="notes">
         <h3>Notes &amp; Terms</h3>
         <p>${nl2br(estimate.notes)}</p>
       </section>`
    : "";

  const companyLine = [company.phone, company.email, company.license]
    .filter((x): x is string => !!x)
    .map(escapeHtml)
    .join(" &middot; ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Estimate ${escapeHtml(estimate.number)}</title>
<style>
  @page {
    size: letter;
    margin: 0.5in;
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 9pt;
      color: #555;
    }
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  table.doc { width: 100%; border-collapse: collapse; }
  table.doc > thead { display: table-header-group; }
  table.doc > tbody { display: table-row-group; }
  table.doc td { padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    color: #111;
    font-size: 11pt;
    line-height: 1.35;
  }
  .page { padding: 0; }
  header.top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #111;
    padding-bottom: 12px;
    margin-bottom: 18px;
  }
  .company { display: flex; gap: 14px; align-items: flex-start; }
  .logo { max-width: 110px; max-height: 110px; object-fit: contain; }
  .company-text .name { font-size: 16pt; font-weight: 700; }
  .company-text .line { color: #333; white-space: pre-line; }
  .title-block { text-align: right; }
  .title-block .title { font-size: 24pt; font-weight: 800; letter-spacing: 3px; }
  .title-block .meta { margin-top: 6px; color: #333; }
  .title-block .meta div { margin: 2px 0; }
  .client-block {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 18px;
  }
  .client-block .label {
    text-transform: uppercase;
    font-size: 9pt;
    letter-spacing: 1px;
    color: #666;
    margin-bottom: 4px;
  }
  .section { margin-bottom: 14px; page-break-inside: avoid; }
  .section h3 {
    margin: 0 0 6px 0;
    font-size: 12pt;
    background: #f2f2f2;
    padding: 6px 10px;
    border-left: 3px solid #111;
  }
  table.items {
    width: 100%;
    border-collapse: collapse;
  }
  table.items th, table.items td {
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
    vertical-align: top;
  }
  table.items thead th {
    text-align: left;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #555;
    border-bottom: 1px solid #111;
  }
  table.items .num { text-align: right; white-space: nowrap; }
  table.items .desc { width: 60%; }
  table.items tfoot td {
    border-bottom: none;
    border-top: 1px solid #111;
    font-weight: 600;
  }
  .subtotal-label { text-align: right; }
  .totals {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .totals table {
    min-width: 280px;
    border-collapse: collapse;
  }
  .totals td { padding: 5px 10px; }
  .totals .label { text-align: right; color: #333; }
  .totals .val { text-align: right; white-space: nowrap; }
  .totals .grand td {
    border-top: 2px solid #111;
    font-size: 13pt;
    font-weight: 700;
    padding-top: 8px;
  }
  .notes {
    margin-top: 18px;
    page-break-inside: avoid;
  }
  .notes h3 {
    font-size: 11pt;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #555;
  }
  .notes p { margin: 0; white-space: pre-wrap; }
  .disclaimer {
    margin-top: 18px;
    padding: 10px;
    background: #f7f7f7;
    border-left: 3px solid #666;
    font-size: 10pt;
    color: #333;
  }
  .signature {
    margin-top: 32px;
    page-break-inside: avoid;
    display: flex;
    gap: 40px;
  }
  .signature .line {
    flex: 1;
    border-bottom: 1px solid #111;
    padding-bottom: 2px;
    font-size: 9pt;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .signature .line span { display: block; margin-top: 28px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <table class="doc">
    <thead>
      <tr><td>
        <header class="top">
          <div class="company">
            ${logoImg}
            <div class="company-text">
              <div class="name">${escapeHtml(company.name || "Your Company")}</div>
              <div class="line">${nl2br(company.address || "")}</div>
              <div class="line">${companyLine}</div>
            </div>
          </div>
          <div class="title-block">
            <div class="title">ESTIMATE</div>
            <div class="meta">
              <div><strong>No.</strong> ${escapeHtml(estimate.number)}</div>
              <div><strong>Date:</strong> ${escapeHtml(formatDate(estimate.date))}</div>
            </div>
          </div>
        </header>
      </td></tr>
    </thead>
    <tbody>
      <tr><td>
        <section class="client-block">
          <div>
            <div class="label">Prepared For</div>
            <div><strong>${escapeHtml(estimate.client.name || "")}</strong></div>
            <div>${nl2br(estimate.client.address || "")}</div>
            <div>${escapeHtml(estimate.client.phone || "")}</div>
            <div>${escapeHtml(estimate.client.email || "")}</div>
          </div>
        </section>

        ${sectionsHtml}

        <div class="totals">
          <table>
            <tr>
              <td class="label">Subtotal</td>
              <td class="val">${formatMoney(sub)}</td>
            </tr>
            <tr>
              <td class="label">Taxable subtotal</td>
              <td class="val">${formatMoney(taxSub)}</td>
            </tr>
            <tr>
              <td class="label">Tax (${Number(taxRate) || 0}%)</td>
              <td class="val">${formatMoney(tax)}</td>
            </tr>
            <tr class="grand">
              <td class="label">Total</td>
              <td class="val">${formatMoney(grand)}</td>
            </tr>
          </table>
        </div>

        ${notesBlock}

        ${company.disclaimer ? `<div class="disclaimer">${nl2br(company.disclaimer)}</div>` : ""}

        <div class="signature">
          <div class="line"><span>Accepted by (client signature)</span></div>
          <div class="line"><span>Date</span></div>
        </div>
      </td></tr>
    </tbody>
  </table>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 100);
    });
  </script>
</body>
</html>`;
}
