import { byDateDesc, categoryTotals, sumAmount } from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";
import type { ExportTemplate } from "./templates";
import type { ExportFilters } from "./types";

function escapeCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

/** Apply a template/wizard's date range and category filters to a list of expenses. */
export function selectExpenses(expenses: Expense[], filters: ExportFilters): Expense[] {
  const result = expenses.filter((e) => {
    if (filters.dateFrom && e.date < filters.dateFrom) return false;
    if (filters.dateTo && e.date > filters.dateTo) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(e.category))
      return false;
    return true;
  });
  return result.sort(byDateDesc);
}

export function buildCsv(expenses: Expense[]): string {
  const header = ["Date", "Category", "Description", "Amount"];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.description,
    e.amount.toFixed(2),
  ]);
  return [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
}

export function buildJson(expenses: Expense[], template: ExportTemplate): string {
  if (template.id === "category-analysis") {
    const totals = categoryTotals(expenses);
    return JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        recordCount: expenses.length,
        totalAmount: Number(sumAmount(expenses).toFixed(2)),
        categories: totals.map((t) => ({
          category: t.category,
          total: Number(t.total.toFixed(2)),
          count: t.count,
          sharePercent: Number((t.share * 100).toFixed(1)),
        })),
      },
      null,
      2,
    );
  }
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      recordCount: expenses.length,
      totalAmount: Number(sumAmount(expenses).toFixed(2)),
      expenses: expenses.map((e) => ({
        id: e.id,
        date: e.date,
        category: e.category,
        description: e.description,
        amount: e.amount,
      })),
    },
    null,
    2,
  );
}

const BRAND_RGB: [number, number, number] = [79, 70, 229];
const SLATE_RGB: [number, number, number] = [100, 116, 139];

export async function buildPdf(
  expenses: Expense[],
  template: ExportTemplate,
  filters: ExportFilters,
): Promise<Blob> {
  const [{ default: JsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;

  const doc = new JsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(`Expenzo — ${template.name}`, margin, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SLATE_RGB);
  doc.text(`Generated ${new Date().toLocaleString("en-US")}`, margin, 64);

  const rangeLabel =
    filters.dateFrom || filters.dateTo
      ? `${filters.dateFrom ? formatDate(filters.dateFrom) : "the beginning"} → ${
          filters.dateTo ? formatDate(filters.dateTo) : "today"
        }`
      : "All dates";
  const categoryLabel =
    filters.categories.length > 0 ? filters.categories.join(", ") : "All categories";
  doc.text(`Date range: ${rangeLabel}`, margin, 78);
  doc.text(`Categories: ${categoryLabel}`, margin, 91);

  autoTable(doc, {
    startY: 108,
    margin: { left: margin, right: margin },
    head: [["Date", "Category", "Description", "Amount"]],
    body: expenses.map((e) => [
      formatDate(e.date),
      e.category,
      e.description,
      formatCurrency(e.amount),
    ]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: BRAND_RGB, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 3: { halign: "right" } },
  });

  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 108;
  const total = sumAmount(expenses);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Total: ${formatCurrency(total)} across ${expenses.length} record${expenses.length === 1 ? "" : "s"}`,
    pageWidth - margin,
    finalY + 24,
    { align: "right" },
  );

  return doc.output("blob");
}

export function estimateSizeLabel(content: string | Blob): string {
  const bytes = typeof content === "string" ? new Blob([content]).size : content.size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
