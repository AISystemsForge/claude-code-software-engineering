"use client";

import { CATEGORY_META } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryTotal } from "@/lib/analytics";

interface DonutChartProps {
  data: CategoryTotal[];
  total: number;
}

const RADIUS = 60;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({ data, total }: DonutChartProps) {
  const segments = data.filter((d) => d.total > 0);

  let offset = 0;
  const arcs = segments.map((seg) => {
    const length = seg.share * CIRCUMFERENCE;
    const arc = {
      category: seg.category,
      color: CATEGORY_META[seg.category].hex,
      dashArray: `${length} ${CIRCUMFERENCE - length}`,
      dashOffset: -offset,
    };
    offset += length;
    return arc;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={STROKE}
          />
          {arcs.map((arc) => (
            <circle
              key={arc.category}
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={STROKE}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-slate-400">Total</span>
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <ul className="w-full flex-1 space-y-2">
        {segments.map((seg) => (
          <li
            key={seg.category}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-slate-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_META[seg.category].hex }}
              />
              {seg.category}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                {formatCurrency(seg.total)}
              </span>
              <span className="w-10 text-right text-xs text-slate-400">
                {(seg.share * 100).toFixed(0)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
