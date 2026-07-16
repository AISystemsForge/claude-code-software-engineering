import { sumAmount } from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

const BRAND_RGB: [number, number, number] = [79, 70, 229];
const SLATE_RGB: [number, number, number] = [100, 116, 139];

export interface PdfReportMeta {
  filters: {
    dateFrom: string;
    dateTo: string;
    categories: string[];
  };
}

/** Build a formatted PDF report (title, filter summary, table, totals) as a Blob. */
export async function buildPdf(
  expenses: Expense[],
  meta: PdfReportMeta,
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
  doc.text("Expenzo — Expense Report", margin, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SLATE_RGB);
  doc.text(`Generated ${new Date().toLocaleString("en-US")}`, margin, 64);

  const rangeLabel =
    meta.filters.dateFrom || meta.filters.dateTo
      ? `${meta.filters.dateFrom ? formatDate(meta.filters.dateFrom) : "the beginning"} → ${
          meta.filters.dateTo ? formatDate(meta.filters.dateTo) : "today"
        }`
      : "All dates";
  const categoryLabel =
    meta.filters.categories.length > 0
      ? meta.filters.categories.join(", ")
      : "All categories";
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
    headStyles: {
      fillColor: BRAND_RGB,
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      3: { halign: "right" },
    },
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
