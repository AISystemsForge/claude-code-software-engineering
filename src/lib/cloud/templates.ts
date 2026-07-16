import { toISODate, todayISO } from "@/lib/format";
import type { ExportFormat, ExportFilters, TemplateId } from "./types";

export interface ExportTemplate {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  format: ExportFormat;
  columns: string[];
  /** Tailwind text-color class for the template's icon accent. */
  accent: string;
  accentSoftBg: string;
}

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: "tax-report",
    name: "Tax Report",
    tagline: "Year-to-date, accountant-ready",
    description:
      "Every expense since January 1st, formatted as a clean PDF with category subtotals — ready to forward to an accountant.",
    format: "pdf",
    columns: ["Date", "Category", "Description", "Amount"],
    accent: "text-rose-600",
    accentSoftBg: "bg-rose-50",
  },
  {
    id: "monthly-summary",
    name: "Monthly Summary",
    tagline: "Last 30 days, spreadsheet-ready",
    description:
      "A CSV snapshot of the last month's spending — drop it straight into a budgeting spreadsheet.",
    format: "csv",
    columns: ["Date", "Category", "Amount"],
    accent: "text-sky-600",
    accentSoftBg: "bg-sky-50",
  },
  {
    id: "category-analysis",
    name: "Category Analysis",
    tagline: "Structured JSON with totals & shares",
    description:
      "Per-category totals and percentage shares as structured JSON — built for dashboards and scripts.",
    format: "json",
    columns: ["Category", "Total", "Share"],
    accent: "text-violet-600",
    accentSoftBg: "bg-violet-50",
  },
  {
    id: "custom",
    name: "Custom Export",
    tagline: "Pick your own format & filters",
    description:
      "Start from a blank slate and choose exactly the format, date range, and categories you want.",
    format: "csv",
    columns: ["Date", "Category", "Description", "Amount"],
    accent: "text-slate-600",
    accentSoftBg: "bg-slate-100",
  },
];

export function getTemplate(id: TemplateId): ExportTemplate {
  const template = EXPORT_TEMPLATES.find((t) => t.id === id);
  if (!template) throw new Error(`Unknown export template: ${id}`);
  return template;
}

/** Sensible default date-range filters for a template, computed relative to today. */
export function templateDefaultFilters(id: TemplateId): Pick<ExportFilters, "dateFrom" | "dateTo"> {
  const today = todayISO();
  if (id === "tax-report") {
    return { dateFrom: `${today.slice(0, 4)}-01-01`, dateTo: today };
  }
  if (id === "monthly-summary") {
    const from = toISODate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return { dateFrom: from, dateTo: today };
  }
  return { dateFrom: "", dateTo: "" };
}
