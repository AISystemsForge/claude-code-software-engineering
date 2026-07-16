"use client";

import { useEffect, useMemo, useState } from "react";
import { useCloudExport } from "@/context/CloudExportContext";
import { CATEGORY_META } from "@/lib/categories";
import { selectExpenses } from "@/lib/cloud/builders";
import { EXPORT_TEMPLATES, getTemplate, templateDefaultFilters } from "@/lib/cloud/templates";
import {
  DESTINATIONS,
  DESTINATION_META,
  EXPORT_FORMATS,
  PROVIDER_META,
  type Destination,
  type ExportFilters,
  type ExportFormat,
  type ExportHistoryEntry,
  type Provider,
  type TemplateId,
} from "@/lib/cloud/types";
import { useExpenses } from "@/context/ExpenseContext";
import { formatCurrency } from "@/lib/format";
import { CATEGORIES } from "@/lib/types";
import { ConnectModal } from "./ConnectModal";
import { CheckIcon, CloseIcon, DESTINATION_ICONS, SpinnerIcon, TEMPLATE_ICONS } from "./icons";
import { ShareResult } from "./ShareResult";

type WizardStep = "template" | "filters" | "destination" | "review" | "processing" | "done";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "template", label: "Template" },
  { id: "filters", label: "Filters" },
  { id: "destination", label: "Destination" },
  { id: "review", label: "Review" },
];

export function ExportWizard({
  open,
  onClose,
  initialTemplateId,
}: {
  open: boolean;
  onClose: () => void;
  initialTemplateId?: TemplateId;
}) {
  const { expenses } = useExpenses();
  const { connections, connect, runExport } = useCloudExport();

  const [step, setStep] = useState<WizardStep>("template");
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplateId ?? "custom");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [filters, setFilters] = useState<ExportFilters>({ dateFrom: "", dateTo: "", categories: [] });
  const [destination, setDestination] = useState<Destination | null>(null);
  const [connecting, setConnecting] = useState<Provider | null>(null);
  const [result, setResult] = useState<ExportHistoryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const id = initialTemplateId ?? "custom";
    const template = getTemplate(id);
    setStep("template");
    setTemplateId(id);
    setFormat(template.format);
    setFilters({ ...templateDefaultFilters(id), categories: [] });
    setDestination(null);
    setResult(null);
    setError(null);
  }, [open, initialTemplateId]);

  const selected = useMemo(() => selectExpenses(expenses, filters), [expenses, filters]);

  if (!open) return null;

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const chooseTemplate = (id: TemplateId) => {
    const template = getTemplate(id);
    setTemplateId(id);
    setFormat(template.format);
    setFilters({ ...templateDefaultFilters(id), categories: [] });
  };

  const chooseDestination = (d: Destination) => {
    const meta = DESTINATION_META[d];
    if (meta.provider) {
      const conn = connections.find((c) => c.provider === meta.provider);
      if (!conn?.connected) {
        setConnecting(meta.provider);
        return;
      }
    }
    setDestination(d);
  };

  const runTheExport = async () => {
    if (!destination) return;
    setStep("processing");
    setError(null);
    const entry = await runExport({ templateId, format, filters, destination, triggeredBy: "manual" });
    if (entry.status === "failed") {
      setError(entry.note ?? "Export failed");
      setStep("review");
      return;
    }
    setResult(entry);
    setStep("done");
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
          onClick={step === "processing" ? undefined : onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New cloud export"
          className="relative z-10 flex max-h-[90vh] w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header with step progress */}
          <div className="border-b border-slate-100 px-6 pb-4 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">New cloud export</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Set up a one-off export or the seed of a recurring backup.
                </p>
              </div>
              <button
                type="button"
                onClick={step === "processing" ? undefined : onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                disabled={step === "processing"}
                aria-label="Close"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            {step !== "processing" && step !== "done" && (
              <ol className="mt-5 flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <li key={s.id} className="flex flex-1 items-center gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        i < stepIndex
                          ? "bg-brand-600 text-white"
                          : i === stepIndex
                            ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {i < stepIndex ? <CheckIcon className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className={`text-xs font-medium ${i <= stepIndex ? "text-slate-700" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-100" />}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {step === "template" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {EXPORT_TEMPLATES.map((t) => {
                  const Icon = TEMPLATE_ICONS[t.id];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => chooseTemplate(t.id)}
                      className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition ${
                        templateId === t.id
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.accentSoftBg} ${t.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                      <span className={`text-xs font-medium ${t.accent}`}>{t.tagline}</span>
                      <span className="text-xs leading-snug text-slate-500">{t.description}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === "filters" && (
              <div className="space-y-5">
                {templateId === "custom" && (
                  <div>
                    <SectionLabel>Format</SectionLabel>
                    <div className="flex gap-2">
                      {EXPORT_FORMATS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormat(f)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                            format === f
                              ? "border-brand-500 bg-brand-50 text-brand-700"
                              : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <SectionLabel>Date range</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                      className="input-base"
                    />
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                </div>
                <div>
                  <SectionLabel>Categories</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, categories: [] }))}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        filters.categories.length === 0
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      All categories
                    </button>
                    {CATEGORIES.map((c) => {
                      const meta = CATEGORY_META[c];
                      const active = filters.categories.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setFilters((f) => ({
                              ...f,
                              categories: active
                                ? f.categories.filter((x) => x !== c)
                                : [...f.categories, c],
                            }))
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            active ? `border-transparent ${meta.bg} text-white` : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span aria-hidden="true">{meta.icon}</span>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold tabular-nums text-slate-900">{selected.length}</span> record
                  {selected.length === 1 ? "" : "s"} match · total{" "}
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatCurrency(selected.reduce((sum, e) => sum + e.amount, 0))}
                  </span>
                </div>
              </div>
            )}

            {step === "destination" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DESTINATIONS.map((d) => {
                  const meta = DESTINATION_META[d];
                  const Icon = DESTINATION_ICONS[d];
                  const conn = meta.provider ? connections.find((c) => c.provider === meta.provider) : null;
                  const active = destination === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => chooseDestination(d)}
                      className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition ${
                        active
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-white text-brand-600" : "bg-slate-100 text-slate-500"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{meta.shortLabel}</span>
                      {meta.provider && (
                        <span className={`text-[11px] font-medium ${conn?.connected ? "text-emerald-600" : "text-slate-400"}`}>
                          {conn?.connected ? `Connected · ${conn.accountLabel}` : "Tap to connect"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <ReviewRow label="Template" value={getTemplate(templateId).name} />
                <ReviewRow label="Format" value={format.toUpperCase()} />
                <ReviewRow
                  label="Date range"
                  value={filters.dateFrom || filters.dateTo ? `${filters.dateFrom || "…"} → ${filters.dateTo || "today"}` : "All dates"}
                />
                <ReviewRow
                  label="Categories"
                  value={filters.categories.length > 0 ? filters.categories.join(", ") : "All categories"}
                />
                <ReviewRow
                  label="Destination"
                  value={destination ? DESTINATION_META[destination].label : "—"}
                />
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold tabular-nums text-slate-900">{selected.length}</span> record
                  {selected.length === 1 ? "" : "s"} ready · total{" "}
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatCurrency(selected.reduce((sum, e) => sum + e.amount, 0))}
                  </span>
                </div>
                {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
              </div>
            )}

            {step === "processing" && (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <SpinnerIcon className="h-10 w-10 text-brand-500" />
                <p className="text-sm font-medium text-slate-700">
                  {destination && DESTINATION_META[destination].provider
                    ? `Sending to ${DESTINATION_META[destination].label}…`
                    : "Generating your export…"}
                </p>
              </div>
            )}

            {step === "done" && result && destination && (
              <DoneScreen entry={result} destination={destination} onClose={onClose} />
            )}
          </div>

          {/* Footer */}
          {step !== "processing" && step !== "done" && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (step === "template") onClose();
                  else setStep(STEPS[stepIndex - 1].id);
                }}
              >
                {step === "template" ? "Cancel" : "Back"}
              </button>
              {step === "review" ? (
                <button type="button" className="btn-primary" onClick={runTheExport} disabled={selected.length === 0}>
                  Run export
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(STEPS[stepIndex + 1].id)}
                  disabled={step === "destination" && !destination}
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConnectModal
        provider={connecting}
        onClose={() => setConnecting(null)}
        onConnected={(provider, accountLabel) => {
          connect(provider, accountLabel);
          setConnecting(null);
          const match = DESTINATIONS.find((d) => DESTINATION_META[d].provider === provider);
          if (match) setDestination(match);
        }}
      />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</h3>;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function DoneScreen({
  entry,
  destination,
  onClose,
}: {
  entry: ExportHistoryEntry;
  destination: Destination;
  onClose: () => void;
}) {
  const meta = DESTINATION_META[destination];
  return (
    <div className="space-y-5 py-2 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckIcon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-base font-bold text-slate-900">
          {destination === "download" ? "Downloaded" : "Export complete"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {destinationConfirmation(entry, destination)}
        </p>
      </div>

      {destination === "link" && entry.shareId && <ShareResult shareId={entry.shareId} />}

      {meta.provider && (
        <p className="text-xs text-slate-400">
          {PROVIDER_META[meta.provider].label} last synced just now — check the Integrations panel any time.
        </p>
      )}

      <button type="button" className="btn-primary" onClick={onClose}>
        Done
      </button>
    </div>
  );
}

function destinationConfirmation(entry: ExportHistoryEntry, destination: Destination): string {
  switch (destination) {
    case "download":
      return `${entry.filename} saved to your device (${entry.sizeLabel}).`;
    case "email":
      return `Sent ${entry.filename} as an attachment.`;
    case "google-sheets":
      return `Added ${entry.recordCount} rows to a new Google Sheet.`;
    case "dropbox":
      return `Synced ${entry.filename} into your Dropbox.`;
    case "onedrive":
      return `Synced ${entry.filename} into your OneDrive.`;
    case "link":
      return "Your shareable link is ready below.";
    default:
      return "";
  }
}
