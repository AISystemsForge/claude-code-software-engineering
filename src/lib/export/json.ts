import { sumAmount } from "@/lib/analytics";
import type { Expense } from "@/lib/types";

/** Build a pretty-printed JSON export payload, including summary metadata. */
export function buildJson(expenses: Expense[]): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    recordCount: expenses.length,
    totalAmount: Number(sumAmount(expenses).toFixed(2)),
    expenses: expenses.map((e) => ({
      id: e.id,
      date: e.date,
      category: e.category,
      description: e.description,
      amount: e.amount,
    })),
  };
  return JSON.stringify(payload, null, 2);
}
