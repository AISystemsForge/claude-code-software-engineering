import type { Category } from "@/lib/types";

export const EXPORT_FORMATS = ["csv", "json", "pdf"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface ExportFormatMeta {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
}

export const EXPORT_FORMAT_META: Record<ExportFormat, ExportFormatMeta> = {
  csv: {
    label: "CSV",
    extension: "csv",
    mimeType: "text/csv;charset=utf-8;",
    description: "Spreadsheet-friendly, opens in Excel or Sheets.",
  },
  json: {
    label: "JSON",
    extension: "json",
    mimeType: "application/json;charset=utf-8;",
    description: "Structured data for scripts, APIs, and backups.",
  },
  pdf: {
    label: "PDF",
    extension: "pdf",
    mimeType: "application/pdf",
    description: "Formatted report, ready to print or share.",
  },
};

export interface ExportFilters {
  dateFrom: string;
  dateTo: string;
  /** Empty array means "all categories". */
  categories: Category[];
}

export interface ExportOptions extends ExportFilters {
  format: ExportFormat;
  /** Filename without extension. */
  filename: string;
}

export type ExportStatus = "idle" | "generating" | "done" | "error";
