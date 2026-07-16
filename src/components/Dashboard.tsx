"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/components/Toast";
import {
  byDateDesc,
  categoryTotals,
  monthlyTrend,
  sumAmount,
} from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/format";
import { SummaryCards } from "./SummaryCards";
import { DonutChart } from "./charts/DonutChart";
import { BarChart } from "./charts/BarChart";
import { CategoryBadge } from "./CategoryBadge";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { ExportDrawer } from "./export/ExportDrawer";

export function Dashboard() {
  const { expenses, loading, seedSampleData } = useExpenses();
  const { toast } = useToast();
  const [exportOpen, setExportOpen] = useState(false);

  const total = useMemo(() => sumAmount(expenses), [expenses]);
  const catTotals = useMemo(() => categoryTotals(expenses), [expenses]);
  const trend = useMemo(() => monthlyTrend(expenses, 6), [expenses]);
  const recent = useMemo(
    () => [...expenses].sort(byDateDesc).slice(0, 5),
    [expenses],
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            An overview of your spending at a glance.
          </p>
        </div>
        {expenses.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setExportOpen(true)}
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export data
          </button>
        )}
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title="Welcome to Expenzo"
          message="Your dashboard will come to life once you add expenses. Add one now or load sample data to explore."
          actionLabel="Load sample data"
          onAction={() => {
            seedSampleData();
            toast("Loaded sample data");
          }}
        />
      ) : (
        <>
          <SummaryCards expenses={expenses} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Category breakdown */}
            <section className="card p-5 lg:col-span-3">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Spending by category
                  </h2>
                  <p className="text-xs text-slate-400">
                    Share of total spending
                  </p>
                </div>
              </div>
              <DonutChart data={catTotals} total={total} />
            </section>

            {/* Monthly trend */}
            <section className="card p-5 lg:col-span-2">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Monthly trend
                </h2>
                <p className="text-xs text-slate-400">Last 6 months</p>
              </div>
              <BarChart data={trend} />
            </section>
          </div>

          {/* Recent expenses */}
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recent expenses
              </h2>
              <Link
                href="/expenses"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all →
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {recent.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {expense.description}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={expense.category} size="sm" />
                    <span className="w-20 text-right font-semibold tabular-nums text-slate-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <ExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        expenses={expenses}
        onExported={(count, format) =>
          toast(`Exported ${count} expenses as ${format.toUpperCase()}`)
        }
      />
    </div>
  );
}
