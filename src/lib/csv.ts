import { formatDate } from "./format";
import type { Expense } from "./types";

/** Escape a value for safe inclusion in a CSV cell. */
function escapeCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Build a CSV string from a list of expenses. */
export function expensesToCsv(expenses: Expense[]): string {
  const header = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.amount.toFixed(2),
    e.description,
  ]);
  return [header, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
}

/** Trigger a browser download of the given expenses as a CSV file. */
export function downloadExpensesCsv(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  const csv = expensesToCsv(expenses);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `expenses-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
