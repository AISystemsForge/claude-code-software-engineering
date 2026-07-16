"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  generateId,
  loadExpenses,
  saveExpenses,
} from "@/lib/storage";
import type { Expense, ExpenseDraft } from "@/lib/types";

interface ExpenseContextValue {
  expenses: Expense[];
  /** True until the first load from localStorage completes. */
  loading: boolean;
  addExpense: (draft: ExpenseDraft) => void;
  updateExpense: (id: string, draft: ExpenseDraft) => void;
  deleteExpense: (id: string) => void;
  /** Load a set of demo expenses (used by the empty state). */
  seedSampleData: () => void;
  clearAll: () => void;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage once, after mount (avoids SSR mismatch).
  useEffect(() => {
    setExpenses(loadExpenses());
    setLoading(false);
  }, []);

  // Persist on every change, but not during the initial load.
  useEffect(() => {
    if (loading) return;
    saveExpenses(expenses);
  }, [expenses, loading]);

  const addExpense = useCallback((draft: ExpenseDraft) => {
    setExpenses((prev) => [
      { ...draft, id: generateId(), createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const updateExpense = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...draft } : e)),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const seedSampleData = useCallback(() => {
    setExpenses(buildSampleExpenses());
  }, []);

  const clearAll = useCallback(() => {
    setExpenses([]);
  }, []);

  const value = useMemo<ExpenseContextValue>(
    () => ({
      expenses,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      seedSampleData,
      clearAll,
    }),
    [
      expenses,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      seedSampleData,
      clearAll,
    ],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses(): ExpenseContextValue {
  const ctx = useContext(ExpenseContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return ctx;
}

/** A small, realistic set of expenses spread across recent weeks. */
function buildSampleExpenses(): Expense[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const iso = (offsetDays: number) =>
    new Date(now - offsetDays * day).toISOString().slice(0, 10);

  const raw: Array<Omit<Expense, "id" | "createdAt">> = [
    { date: iso(0), amount: 12.5, category: "Food", description: "Lunch with team" },
    { date: iso(1), amount: 45.0, category: "Transportation", description: "Gas fill-up" },
    { date: iso(2), amount: 89.99, category: "Shopping", description: "New running shoes" },
    { date: iso(3), amount: 15.99, category: "Entertainment", description: "Movie ticket" },
    { date: iso(5), amount: 120.0, category: "Bills", description: "Electricity bill" },
    { date: iso(6), amount: 34.2, category: "Food", description: "Groceries" },
    { date: iso(9), amount: 9.5, category: "Transportation", description: "Subway pass top-up" },
    { date: iso(12), amount: 60.0, category: "Entertainment", description: "Concert tickets" },
    { date: iso(15), amount: 210.75, category: "Shopping", description: "Winter jacket" },
    { date: iso(20), amount: 55.4, category: "Food", description: "Dinner out" },
    { date: iso(28), amount: 75.0, category: "Bills", description: "Internet bill" },
    { date: iso(34), amount: 22.0, category: "Other", description: "Gift for a friend" },
    { date: iso(41), amount: 130.0, category: "Bills", description: "Phone plan" },
    { date: iso(52), amount: 48.6, category: "Food", description: "Weekly groceries" },
  ];

  return raw.map((r, i) => ({
    ...r,
    id: generateId(),
    createdAt: now - i,
  }));
}
