"use client";

import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { MonthlyPoint } from "@/lib/analytics";

export function BarChart({ data }: { data: MonthlyPoint[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="flex h-52 items-end gap-2 sm:gap-4">
      {data.map((point) => {
        const heightPct = (point.total / max) * 100;
        return (
          <div
            key={point.key}
            className="group flex flex-1 flex-col items-center gap-2"
          >
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="relative w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-400 transition-all duration-500 hover:from-brand-600 hover:to-brand-500"
                style={{ height: `${Math.max(heightPct, point.total > 0 ? 4 : 0)}%` }}
              >
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {formatCurrency(point.total)}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {point.label}
            </span>
            <span className="text-[10px] text-slate-400">
              {point.total > 0 ? formatCompactCurrency(point.total) : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
