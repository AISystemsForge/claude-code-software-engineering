"use client";

import {
  averageExpense,
  currentMonthTotal,
  sumAmount,
  topCategory,
} from "@/lib/analytics";
import { CATEGORY_META } from "@/lib/categories";
import { formatCurrency, formatMonthLabel, currentMonthKey } from "@/lib/format";
import type { Expense } from "@/lib/types";

export function SummaryCards({ expenses }: { expenses: Expense[] }) {
  const total = sumAmount(expenses);
  const monthTotal = currentMonthTotal(expenses);
  const top = topCategory(expenses);
  const avg = averageExpense(expenses);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total spending"
        value={formatCurrency(total)}
        sub={`${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}`}
        accent="from-brand-500 to-brand-600"
        icon="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      />
      <StatCard
        label={`This month (${formatMonthLabel(currentMonthKey())})`}
        value={formatCurrency(monthTotal)}
        sub="Spent in the current month"
        accent="from-sky-500 to-sky-600"
        icon="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      />
      <StatCard
        label="Top category"
        value={top ? top.category : "—"}
        sub={top ? `${formatCurrency(top.total)} spent` : "No expenses yet"}
        emoji={top ? CATEGORY_META[top.category].icon : "📊"}
        accent="from-fuchsia-500 to-fuchsia-600"
      />
      <StatCard
        label="Average expense"
        value={formatCurrency(avg)}
        sub="Per transaction"
        accent="from-emerald-500 to-emerald-600"
        icon="M3 3v18h18M7 15l4-4 3 3 5-6"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
  emoji,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  icon?: string;
  emoji?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${accent}`}
        >
          {emoji ? (
            <span className="text-base" aria-hidden="true">
              {emoji}
            </span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icon} />
            </svg>
          )}
        </span>
      </div>
      <p className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-slate-400">{sub}</p>
    </div>
  );
}
