"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useCloudExport } from "@/context/CloudExportContext";
import { useExpenses } from "@/context/ExpenseContext";
import { selectExpenses } from "@/lib/cloud/builders";
import { getTemplate } from "@/lib/cloud/templates";
import { formatCurrency, formatDate } from "@/lib/format";
import { LinkIcon, TEMPLATE_ICONS } from "./icons";

export function SharedExportView({ shareId }: { shareId: string }) {
  const { getHistoryByShareId, recordShareView, hydrated } = useCloudExport();
  const { expenses } = useExpenses();
  const entry = getHistoryByShareId(shareId);
  const viewed = useRef(false);

  useEffect(() => {
    if (!hydrated || viewed.current) return;
    viewed.current = true;
    recordShareView(shareId);
  }, [hydrated, shareId, recordShareView]);

  if (!hydrated) return null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <LinkIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-slate-900">Link not found in this browser</h1>
        <p className="mt-2 text-sm text-slate-500">
          Shared links in this demo only resolve on the device that created them — there&apos;s no
          real backend behind them. Open the Cloud Export Center to generate a new one.
        </p>
        <Link href="/export" className="btn-primary mt-6 inline-flex">
          Go to Cloud Export Center
        </Link>
      </div>
    );
  }

  const template = getTemplate(entry.templateId);
  const TemplateIcon = TEMPLATE_ICONS[entry.templateId];
  const rows = selectExpenses(expenses, entry.filters);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card flex items-center gap-3 bg-brand-50/60 p-4 text-sm text-brand-700">
        <LinkIcon className="h-5 w-5 shrink-0" />
        Viewing a shared export — read-only.
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${template.accentSoftBg} ${template.accent}`}>
            <TemplateIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{template.name}</h1>
            <p className="text-sm text-slate-500">
              Shared {new Date(entry.createdAt).toLocaleString("en-US")}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Records" value={String(entry.recordCount)} />
          <Stat label="Total" value={formatCurrency(entry.totalAmount)} />
          <Stat label="Format" value={entry.format.toUpperCase()} />
          <Stat label="Views" value={String(entry.shareViews)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Included expenses</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 20).map((e) => (
              <tr key={e.id}>
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{formatDate(e.date)}</td>
                <td className="px-4 py-2.5">
                  <CategoryBadge category={e.category} size="sm" />
                </td>
                <td className="px-4 py-2.5 font-medium text-slate-900">{e.description}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold tabular-nums text-slate-900">
                  {formatCurrency(e.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 20 && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-xs text-slate-500">
            + {rows.length - 20} more rows
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
