"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useCloudExport } from "@/context/CloudExportContext";
import { useExpenses } from "@/context/ExpenseContext";
import { buildCsv, buildJson, buildPdf, selectExpenses } from "@/lib/cloud/builders";
import { getTemplate } from "@/lib/cloud/templates";
import { DESTINATION_META, type ExportHistoryEntry } from "@/lib/cloud/types";
import { formatCurrency } from "@/lib/format";
import { DESTINATION_ICONS, HistoryIcon, TEMPLATE_ICONS } from "./icons";
import { RelativeTime } from "./RelativeTime";
import { ShareResult } from "./ShareResult";
import { SectionHeading } from "./TemplateGallery";

export function ExportHistoryTable() {
  const { history, runExport } = useCloudExport();
  const { expenses } = useExpenses();
  const [sharing, setSharing] = useState<ExportHistoryEntry | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const downloadAgain = async (entry: ExportHistoryEntry) => {
    setBusyId(entry.id);
    try {
      const template = getTemplate(entry.templateId);
      const selected = selectExpenses(expenses, entry.filters);
      const content =
        entry.format === "csv"
          ? buildCsv(selected)
          : entry.format === "json"
            ? buildJson(selected, template)
            : await buildPdf(selected, template, entry.filters);
      const mime =
        entry.format === "csv"
          ? "text/csv;charset=utf-8;"
          : entry.format === "json"
            ? "application/json;charset=utf-8;"
            : "application/pdf";
      const blob = typeof content === "string" ? new Blob([content], { type: mime }) : content;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = entry.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setBusyId(null);
    }
  };

  const retry = async (entry: ExportHistoryEntry) => {
    setBusyId(entry.id);
    try {
      await runExport({
        templateId: entry.templateId,
        format: entry.format,
        filters: entry.filters,
        destination: entry.destination,
        triggeredBy: "manual",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="card p-5 sm:p-6">
      <SectionHeading eyebrow="Activity" title="Export history" />
      <p className="-mt-3 mb-5 text-sm text-slate-500">Every export from this browser, newest first.</p>

      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
          <HistoryIcon className="h-6 w-6 text-slate-300" />
          <p className="text-sm text-slate-500">No exports yet — run one from a template above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Export</th>
                <th className="py-2 pr-3">Destination</th>
                <th className="py-2 pr-3 text-right">Records</th>
                <th className="py-2 pr-3">When</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((entry) => {
                const template = getTemplate(entry.templateId);
                const meta = DESTINATION_META[entry.destination];
                const TemplateIcon = TEMPLATE_ICONS[entry.templateId];
                const DestIcon = DESTINATION_ICONS[entry.destination];
                const busy = busyId === entry.id;
                return (
                  <tr key={entry.id} className="transition hover:bg-slate-50/70">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${template.accentSoftBg} ${template.accent}`}>
                          <TemplateIcon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{template.name}</p>
                          <p className="truncate text-xs text-slate-400">
                            {entry.filename} · {entry.sizeLabel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <DestIcon className="h-4 w-4 text-slate-400" />
                        {meta.shortLabel}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-right tabular-nums text-slate-900">
                      {entry.recordCount}
                      <span className="block text-xs text-slate-400">
                        {formatCurrency(entry.totalAmount)}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-xs text-slate-500">
                      <RelativeTime ms={entry.createdAt} />
                    </td>
                    <td className="py-3 pr-3">
                      <StatusPill status={entry.status} note={entry.note} />
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {entry.status === "failed" ? (
                        <button
                          type="button"
                          onClick={() => retry(entry)}
                          disabled={busy}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-50"
                        >
                          {busy ? "Retrying…" : "Retry"}
                        </button>
                      ) : entry.destination === "link" && entry.shareId ? (
                        <button
                          type="button"
                          onClick={() => setSharing(entry)}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                          View share
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => downloadAgain(entry)}
                          disabled={busy}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-50"
                        >
                          {busy ? "Preparing…" : "Download again"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={sharing !== null} onClose={() => setSharing(null)} title="Shared export">
        {sharing?.shareId && <ShareResult shareId={sharing.shareId} />}
      </Modal>
    </section>
  );
}

function StatusPill({ status, note }: { status: ExportHistoryEntry["status"]; note: string | null }) {
  const styles: Record<ExportHistoryEntry["status"], string> = {
    completed: "bg-emerald-50 text-emerald-700",
    failed: "bg-rose-50 text-rose-700",
    processing: "bg-sky-50 text-sky-700",
    queued: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      title={note ?? undefined}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
