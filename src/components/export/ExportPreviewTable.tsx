"use client";

import { CategoryBadge } from "@/components/CategoryBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

const PREVIEW_LIMIT = 6;

export function ExportPreviewTable({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        No expenses match these filters.
      </div>
    );
  }

  const visible = expenses.slice(0, PREVIEW_LIMIT);
  const remaining = expenses.length - visible.length;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {visible.map((e) => (
            <tr key={e.id}>
              <td className="whitespace-nowrap px-3 py-2 text-slate-500">
                {formatDate(e.date)}
              </td>
              <td className="px-3 py-2">
                <CategoryBadge category={e.category} size="sm" />
              </td>
              <td className="max-w-[10rem] truncate px-3 py-2 font-medium text-slate-900">
                {e.description}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
                {formatCurrency(e.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {remaining > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
          + {remaining} more row{remaining === 1 ? "" : "s"} in the full export
        </div>
      )}
    </div>
  );
}
