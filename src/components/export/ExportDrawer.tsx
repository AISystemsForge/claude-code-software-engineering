"use client";

import { useEffect } from "react";
import { EXPORT_FORMAT_META } from "@/lib/export/types";
import { sanitizeFilename } from "@/lib/export/download";
import { formatCurrency } from "@/lib/format";
import type { Expense } from "@/lib/types";
import { useExportBuilder } from "./useExportBuilder";
import { FormatPicker } from "./FormatPicker";
import { CategoryFilterChips } from "./CategoryFilterChips";
import { ExportPreviewTable } from "./ExportPreviewTable";

interface ExportDrawerProps {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
  onExported: (count: number, format: string) => void;
}

export function ExportDrawer({
  open,
  onClose,
  expenses,
  onExported,
}: ExportDrawerProps) {
  const {
    state,
    selected,
    summary,
    setFormat,
    setDateFrom,
    setDateTo,
    toggleCategory,
    clearCategories,
    setFilename,
    submit,
  } = useExportBuilder(expenses, open);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.status !== "generating") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, state.status]);

  // Report success back to the caller, then auto-close shortly after.
  useEffect(() => {
    if (state.status !== "done") return;
    onExported(summary.count, state.format);
    const timer = setTimeout(onClose, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  if (!open) return null;

  const meta = EXPORT_FORMAT_META[state.format];
  const isGenerating = state.status === "generating";
  const isDone = state.status === "done";
  const canExport = summary.count > 0 && !isGenerating;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={() => !isGenerating && onClose()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Export data"
        className="relative z-10 flex h-full w-full max-w-md animate-slide-in-right flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Export data</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose a format, filter your records, and preview before you
              download.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
            aria-label="Close export dialog"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section>
            <SectionLabel>Format</SectionLabel>
            <FormatPicker value={state.format} onChange={setFormat} />
          </section>

          <section>
            <SectionLabel>Date range</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  From
                </label>
                <input
                  type="date"
                  value={state.dateFrom}
                  max={state.dateTo || undefined}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-base"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  To
                </label>
                <input
                  type="date"
                  value={state.dateTo}
                  min={state.dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-base"
                />
              </div>
            </div>
          </section>

          <section>
            <SectionLabel>Categories</SectionLabel>
            <CategoryFilterChips
              selected={state.categories}
              onToggle={toggleCategory}
              onClear={clearCategories}
            />
          </section>

          <section>
            <SectionLabel>Filename</SectionLabel>
            <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
              <input
                type="text"
                value={state.filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full border-0 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-0"
                placeholder="expenses-export"
              />
              <span className="whitespace-nowrap bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
                .{meta.extension}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Saved as &ldquo;{sanitizeFilename(state.filename)}.{meta.extension}
              &rdquo;
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Records selected
                </p>
                <p className="text-lg font-bold tabular-nums text-slate-900">
                  {summary.count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500">Total</p>
                <p className="text-lg font-bold tabular-nums text-slate-900">
                  {formatCurrency(summary.total)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionLabel>Preview</SectionLabel>
            <ExportPreviewTable expenses={selected} />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          {state.status === "error" && (
            <p className="mr-auto text-xs font-medium text-rose-600">
              {state.error}
            </p>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary min-w-[9.5rem]"
            onClick={submit}
            disabled={!canExport}
          >
            {isGenerating ? (
              <>
                <Spinner />
                Generating…
              </>
            ) : isDone ? (
              <>
                <CheckIcon />
                Exported
              </>
            ) : (
              <>
                <DownloadIcon />
                Export {summary.count > 0 ? summary.count : ""} as{" "}
                {meta.label}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </h3>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin-slow"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
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
  );
}
