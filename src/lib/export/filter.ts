import { byDateDesc, sumAmount } from "@/lib/analytics";
import type { Expense } from "@/lib/types";
import type { ExportFilters } from "./types";

/** Apply the export dialog's date range and category filters to a list of expenses. */
export function selectExpensesForExport(
  expenses: Expense[],
  filters: ExportFilters,
): Expense[] {
  const result = expenses.filter((e) => {
    if (filters.dateFrom && e.date < filters.dateFrom) return false;
    if (filters.dateTo && e.date > filters.dateTo) return false;
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(e.category)
    )
      return false;
    return true;
  });
  return result.sort(byDateDesc);
}

export interface ExportSelectionSummary {
  count: number;
  total: number;
}

export function summarizeSelection(expenses: Expense[]): ExportSelectionSummary {
  return { count: expenses.length, total: sumAmount(expenses) };
}
