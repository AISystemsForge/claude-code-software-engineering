import type { Expense } from "@/lib/types";
import { buildCsv } from "./csv";
import { buildJson } from "./json";
import { buildPdf } from "./pdf";
import type { ExportOptions } from "./types";
import { EXPORT_FORMAT_META } from "./types";

/** Sanitize user input into a filesystem-safe filename stem. */
export function sanitizeFilename(name: string): string {
  const trimmed = name.trim().replace(/[\\/:*?"<>|]+/g, "-");
  return trimmed || "export";
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Generate the export file for the given format and trigger a browser download. */
export async function runExport(
  expenses: Expense[],
  options: ExportOptions,
): Promise<void> {
  const meta = EXPORT_FORMAT_META[options.format];
  const filename = `${sanitizeFilename(options.filename)}.${meta.extension}`;

  if (options.format === "csv") {
    const blob = new Blob([buildCsv(expenses)], { type: meta.mimeType });
    saveBlob(blob, filename);
    return;
  }

  if (options.format === "json") {
    const blob = new Blob([buildJson(expenses)], { type: meta.mimeType });
    saveBlob(blob, filename);
    return;
  }

  const blob = await buildPdf(expenses, {
    filters: {
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
      categories: options.categories,
    },
  });
  saveBlob(blob, filename);
}
