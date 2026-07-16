"use client";

import { useState } from "react";
import { useCloudExport } from "@/context/CloudExportContext";
import { FREQUENCY_META } from "@/lib/cloud/schedule";
import { EXPORT_TEMPLATES, getTemplate } from "@/lib/cloud/templates";
import {
  DESTINATIONS,
  DESTINATION_META,
  SCHEDULE_FREQUENCIES,
  type Destination,
  type ScheduleFrequency,
  type TemplateId,
} from "@/lib/cloud/types";
import { Countdown } from "./Countdown";
import { ClockIcon, DESTINATION_ICONS, PlusIcon, TEMPLATE_ICONS, TrashIcon } from "./icons";
import { SectionHeading } from "./TemplateGallery";

export function ScheduleManager() {
  const { schedules, addSchedule, toggleSchedule, removeSchedule, runScheduleNow } = useCloudExport();
  const [formOpen, setFormOpen] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRunNow = async (id: string) => {
    setRunningId(id);
    try {
      await runScheduleNow(id);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <SectionHeading eyebrow="Automate" title="Automatic backups" />
          <p className="-mt-3 text-sm text-slate-500">
            Recurring exports that run in the background while this tab is open.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
          onClick={() => setFormOpen((v) => !v)}
        >
          {formOpen ? "Cancel" : (
            <>
              <PlusIcon className="h-3.5 w-3.5" /> New schedule
            </>
          )}
        </button>
      </div>

      {formOpen && <ScheduleForm onCreate={(input) => { addSchedule(input); setFormOpen(false); }} />}

      {schedules.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
          <ClockIcon className="h-6 w-6 text-slate-300" />
          <p className="text-sm text-slate-500">No scheduled backups yet. Create one to see automation run live.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {schedules.map((s) => {
            const template = getTemplate(s.templateId);
            const meta = DESTINATION_META[s.destination];
            const TemplateIcon = TEMPLATE_ICONS[s.templateId];
            const DestIcon = DESTINATION_ICONS[s.destination];
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={s.enabled}
                    onChange={() => toggleSchedule(s.id)}
                  />
                  <span className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-brand-600" />
                  <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                </label>

                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${template.accentSoftBg} ${template.accent}`}>
                  <TemplateIcon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                    {template.name}
                    <DestIcon className="ml-1 h-3.5 w-3.5 text-slate-400" />
                    {meta.shortLabel} · {FREQUENCY_META[s.frequency].label}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <p className={`font-semibold tabular-nums ${s.enabled ? "text-slate-900" : "text-slate-400"}`}>
                    {s.enabled ? <Countdown targetMs={s.nextRunAt} /> : "Paused"}
                  </p>
                  <p className="text-slate-400">
                    {s.lastRunAt ? "Last ran a moment ago" : "Never run"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRunNow(s.id)}
                  disabled={runningId === s.id}
                  className="btn-ghost px-2.5 py-1.5 text-xs disabled:opacity-50"
                >
                  {runningId === s.id ? "Running…" : "Run now"}
                </button>
                <button
                  type="button"
                  onClick={() => removeSchedule(s.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Delete schedule ${s.name}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ScheduleForm({
  onCreate,
}: {
  onCreate: (input: { name: string; templateId: TemplateId; destination: Destination; frequency: ScheduleFrequency }) => void;
}) {
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("monthly-summary");
  const [destination, setDestination] = useState<Destination>("download");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("demo-5min");

  return (
    <form
      className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate({ name: name.trim() || "Untitled backup", templateId, destination, frequency });
      }}
    >
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Weekly Sheets backup"
          className="input-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Template</label>
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value as TemplateId)} className="input-base">
          {EXPORT_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Destination</label>
        <select value={destination} onChange={(e) => setDestination(e.target.value as Destination)} className="input-base">
          {DESTINATIONS.filter((d) => d !== "link").map((d) => (
            <option key={d} value={d}>
              {DESTINATION_META[d].label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)} className="input-base">
          {SCHEDULE_FREQUENCIES.map((f) => (
            <option key={f} value={f}>
              {FREQUENCY_META[f].label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end sm:col-span-2">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Create schedule
        </button>
      </div>
    </form>
  );
}
