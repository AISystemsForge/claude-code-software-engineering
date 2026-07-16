"use client";

import { CategoryBadge } from "./CategoryBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="group transition hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                  {formatDate(expense.date)}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  {expense.description}
                </td>
                <td className="px-5 py-3.5">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums text-slate-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-60 transition group-hover:opacity-100">
                    <RowActions
                      onEdit={() => onEdit(expense)}
                      onDelete={() => onDelete(expense)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {expenses.map((expense) => (
          <li key={expense.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {expense.description}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(expense.date)}
                </p>
                <div className="mt-2">
                  <CategoryBadge category={expense.category} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold tabular-nums text-slate-900">
                  {formatCurrency(expense.amount)}
                </p>
                <div className="mt-2 flex justify-end gap-1">
                  <RowActions
                    onEdit={() => onEdit(expense)}
                    onDelete={() => onDelete(expense)}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit expense"
        className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete expense"
        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </>
  );
}
