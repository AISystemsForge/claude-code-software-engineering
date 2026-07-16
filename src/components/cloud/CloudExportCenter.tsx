"use client";

import { useMemo, useState } from "react";
import { useCloudExport } from "@/context/CloudExportContext";
import type { TemplateId } from "@/lib/cloud/types";
import { EmptyState } from "@/components/EmptyState";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/components/Toast";
import { formatCurrency } from "@/lib/format";
import { ExportHistoryTable } from "./ExportHistoryTable";
import { ExportWizard } from "./ExportWizard";
import { IntegrationsPanel } from "./IntegrationsPanel";
import { PlusIcon } from "./icons";
import { ScheduleManager } from "./ScheduleManager";
import { TemplateGallery } from "./TemplateGallery";

export function CloudExportCenter() {
  const { expenses, seedSampleData } = useExpenses();
  const { toast } = useToast();
  const { connections, schedules, history } = useCloudExport();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardTemplate, setWizardTemplate] = useState<TemplateId | undefined>(undefined);

  const connectedCount = useMemo(() => connections.filter((c) => c.connected).length, [connections]);
  const activeSchedules = useMemo(() => schedules.filter((s) => s.enabled).length, [schedules]);
  const totalExported = useMemo(
    () => history.filter((h) => h.status === "completed").reduce((sum, h) => sum + h.totalAmount, 0),
    [history],
  );

  const openWizard = (templateId?: TemplateId) => {
    setWizardTemplate(templateId);
    setWizardOpen(true);
  };

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Nothing to export yet"
        message="Add a few expenses, or load sample data, before setting up cloud exports and integrations."
        actionLabel="Load sample data"
        onAction={() => {
          seedSampleData();
          toast("Loaded sample data");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Hero
        exportsRun={history.length}
        connectedCount={connectedCount}
        activeSchedules={activeSchedules}
        totalExported={totalExported}
        onNewExport={() => openWizard()}
      />

      <TemplateGallery onUseTemplate={openWizard} />
      <IntegrationsPanel />
      <ScheduleManager />
      <ExportHistoryTable />

      <p className="px-1 text-center text-xs text-slate-400">
        This is a demo cloud layer — integrations, emails, and sync are simulated locally. Nothing
        leaves your device.
      </p>

      <ExportWizard open={wizardOpen} onClose={() => setWizardOpen(false)} initialTemplateId={wizardTemplate} />
    </div>
  );
}

function Hero({
  exportsRun,
  connectedCount,
  activeSchedules,
  totalExported,
  onNewExport,
}: {
  exportsRun: number;
  connectedCount: number;
  activeSchedules: number;
  totalExported: number;
  onNewExport: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-700 to-violet-800 px-6 py-8 shadow-lg sm:px-9 sm:py-10">
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Cloud Export
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Cloud Export Center
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Templates, integrations, scheduled backups, and sharing — all in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={onNewExport}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-white/90"
          >
            <PlusIcon className="h-4 w-4" />
            New export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatChip label="Exports run" value={String(exportsRun)} />
          <StatChip label="Connected apps" value={`${connectedCount}/4`} />
          <StatChip label="Active backups" value={String(activeSchedules)} />
          <StatChip label="Total exported" value={formatCurrency(totalExported)} />
        </div>
      </div>
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-sm">
      <p className="text-xs font-medium text-white/60">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}
