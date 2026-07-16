import { formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

function escapeCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Build a CSV string (with header row) from a list of expenses. */
export function buildCsv(expenses: Expense[]): string {
  const header = ["Date", "Category", "Description", "Amount"];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.description,
    e.amount.toFixed(2),
  ]);
  return [header, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
}
