export const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  /** ISO date string, e.g. "2026-07-14" */
  date: string;
  /** Amount in the major currency unit (e.g. dollars). Always positive. */
  amount: number;
  category: Category;
  description: string;
  /** Epoch ms of when the record was created — used for stable sorting. */
  createdAt: number;
}

export type ExpenseDraft = Omit<Expense, "id" | "createdAt">;
