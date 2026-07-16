import { currentMonthKey, monthKey, parseISODate, toISODate } from "./format";
import { CATEGORIES, type Category, type Expense } from "./types";

export interface CategoryTotal {
  category: Category;
  total: number;
  count: number;
  /** Share of the grand total, 0..1 */
  share: number;
}

export interface MonthlyPoint {
  key: string;
  label: string;
  total: number;
}

/** Sum of all expense amounts. */
export function sumAmount(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

/** Total spent in the current calendar month. */
export function currentMonthTotal(expenses: Expense[]): number {
  const key = currentMonthKey();
  return sumAmount(expenses.filter((e) => monthKey(e.date) === key));
}

/** Totals grouped by category, sorted descending by amount. */
export function categoryTotals(expenses: Expense[]): CategoryTotal[] {
  const grand = sumAmount(expenses);
  const totals = new Map<Category, { total: number; count: number }>();
  for (const category of CATEGORIES) {
    totals.set(category, { total: 0, count: 0 });
  }
  for (const e of expenses) {
    const entry = totals.get(e.category);
    if (entry) {
      entry.total += e.amount;
      entry.count += 1;
    }
  }
  return Array.from(totals.entries())
    .map(([category, { total, count }]) => ({
      category,
      total,
      count,
      share: grand > 0 ? total / grand : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/** The single top-spending category, or null if there are no expenses. */
export function topCategory(expenses: Expense[]): CategoryTotal | null {
  const totals = categoryTotals(expenses).filter((c) => c.total > 0);
  return totals.length > 0 ? totals[0] : null;
}

/**
 * Spend totals for the last `months` calendar months (including the current
 * one), oldest first. Empty months are included with a total of 0.
 */
export function monthlyTrend(expenses: Expense[], months = 6): MonthlyPoint[] {
  const now = new Date();
  const points: MonthlyPoint[] = [];
  const byMonth = new Map<string, number>();
  for (const e of expenses) {
    const key = monthKey(e.date);
    byMonth.set(key, (byMonth.get(key) ?? 0) + e.amount);
  }
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(toISODate(d));
    points.push({
      key,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      total: byMonth.get(key) ?? 0,
    });
  }
  return points;
}

/** Average amount per expense, or 0 when empty. */
export function averageExpense(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  return sumAmount(expenses) / expenses.length;
}

/** Comparator that sorts expenses newest-first, breaking ties by createdAt. */
export function byDateDesc(a: Expense, b: Expense): number {
  const da = parseISODate(a.date)?.getTime() ?? 0;
  const db = parseISODate(b.date)?.getTime() ?? 0;
  if (db !== da) return db - da;
  return b.createdAt - a.createdAt;
}
