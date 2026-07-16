"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { sumAmount } from "@/lib/analytics";
import { buildCsv, buildJson, buildPdf, estimateSizeLabel, selectExpenses } from "@/lib/cloud/builders";
import { computeNextRun } from "@/lib/cloud/schedule";
import { generateShareId } from "@/lib/cloud/share";
import {
  generateId,
  loadConnections,
  loadHistory,
  loadSchedules,
  saveConnections,
  saveHistory,
  saveSchedules,
} from "@/lib/cloud/storage";
import { getTemplate } from "@/lib/cloud/templates";
import { todayISO } from "@/lib/format";
import type {
  ConnectionState,
  Destination,
  ExportFilters,
  ExportFormat,
  ExportHistoryEntry,
  Provider,
  ScheduleFrequency,
  ScheduledBackup,
  TemplateId,
} from "@/lib/cloud/types";
import { DESTINATION_META } from "@/lib/cloud/types";

const SCHEDULE_TICK_MS = 5_000;

interface RunExportInput {
  templateId: TemplateId;
  format: ExportFormat;
  filters: ExportFilters;
  destination: Destination;
  triggeredBy: "manual" | "schedule";
}

interface AddScheduleInput {
  name: string;
  templateId: TemplateId;
  destination: Destination;
  frequency: ScheduleFrequency;
}

interface CloudExportContextValue {
  connections: ConnectionState[];
  schedules: ScheduledBackup[];
  history: ExportHistoryEntry[];
  /** True once localStorage has been read into state — guards actions that must not run first. */
  hydrated: boolean;
  connect: (provider: Provider, accountLabel: string) => void;
  disconnect: (provider: Provider) => void;
  addSchedule: (input: AddScheduleInput) => void;
  toggleSchedule: (id: string) => void;
  removeSchedule: (id: string) => void;
  runScheduleNow: (id: string) => Promise<void>;
  runExport: (input: RunExportInput) => Promise<ExportHistoryEntry>;
  recordShareView: (shareId: string) => void;
  getHistoryByShareId: (shareId: string) => ExportHistoryEntry | undefined;
}

const CloudExportContext = createContext<CloudExportContextValue | null>(null);

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Rough simulated network latency per destination, so it *feels* like a real service. */
function destinationLatency(destination: Destination): number {
  switch (destination) {
    case "download":
      return 350;
    case "link":
      return 450;
    case "email":
      return 800;
    default:
      return 1100;
  }
}

function buildFilename(templateId: TemplateId, format: ExportFormat): string {
  return `${templateId}-${todayISO()}.${format}`;
}

async function buildContent(
  expenses: ReturnType<typeof selectExpenses>,
  templateId: TemplateId,
  format: ExportFormat,
  filters: ExportFilters,
): Promise<string | Blob> {
  const template = getTemplate(templateId);
  if (format === "csv") return buildCsv(expenses);
  if (format === "json") return buildJson(expenses, template);
  return buildPdf(expenses, template, filters);
}

function triggerBrowserDownload(content: string | Blob, filename: string, format: ExportFormat): void {
  const mime =
    format === "csv"
      ? "text/csv;charset=utf-8;"
      : format === "json"
        ? "application/json;charset=utf-8;"
        : "application/pdf";
  const blob = typeof content === "string" ? new Blob([content], { type: mime }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CloudExportProvider({ children }: { children: React.ReactNode }) {
  const { expenses } = useExpenses();
  const [connections, setConnections] = useState<ConnectionState[]>([]);
  const [schedules, setSchedules] = useState<ScheduledBackup[]>([]);
  const [history, setHistory] = useState<ExportHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const runningSchedules = useRef<Set<string>>(new Set());
  const expensesRef = useRef(expenses);
  expensesRef.current = expenses;

  // Hydrate from localStorage once, after mount (avoids SSR mismatch). Consumers
  // that persist on mount (e.g. share-view tracking) must wait for `hydrated` —
  // child effects fire before this provider's own effect, so writing state to
  // localStorage any earlier would clobber it with the still-empty initial state.
  useEffect(() => {
    setConnections(loadConnections());
    setSchedules(loadSchedules());
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  const connect = useCallback((provider: Provider, accountLabel: string) => {
    setConnections((prev) => {
      const now = Date.now();
      const next = prev.map((c) =>
        c.provider === provider
          ? { ...c, connected: true, accountLabel, connectedAt: now, lastSyncAt: now }
          : c,
      );
      saveConnections(next);
      return next;
    });
  }, []);

  const disconnect = useCallback((provider: Provider) => {
    setConnections((prev) => {
      const next = prev.map((c) =>
        c.provider === provider
          ? { ...c, connected: false, accountLabel: null, connectedAt: null, lastSyncAt: null }
          : c,
      );
      saveConnections(next);
      return next;
    });
  }, []);

  const runExport = useCallback(
    async (input: RunExportInput): Promise<ExportHistoryEntry> => {
      const meta = DESTINATION_META[input.destination];
      const selected = selectExpenses(expensesRef.current, input.filters);
      const filename = buildFilename(input.templateId, input.format);

      const notConnected = Boolean(
        meta.provider && !connections.find((c) => c.provider === meta.provider)?.connected,
      );

      await wait(destinationLatency(input.destination));

      const randomFailure =
        !notConnected && input.triggeredBy === "schedule" && Math.random() < 0.12;
      const failed = notConnected || randomFailure;

      let sizeLabel = "—";
      if (!failed) {
        const content = await buildContent(selected, input.templateId, input.format, input.filters);
        sizeLabel = estimateSizeLabel(content);
        if (input.destination === "download") {
          triggerBrowserDownload(content, filename, input.format);
        }
      }

      const entry: ExportHistoryEntry = {
        id: generateId(),
        createdAt: Date.now(),
        templateId: input.templateId,
        format: input.format,
        destination: input.destination,
        filename,
        recordCount: selected.length,
        totalAmount: sumAmount(selected),
        status: failed ? "failed" : "completed",
        sizeLabel,
        filters: input.filters,
        triggeredBy: input.triggeredBy,
        shareId: input.destination === "link" && !failed ? generateShareId() : null,
        shareViews: 0,
        note: notConnected
          ? `${meta.label} isn't connected.`
          : randomFailure
            ? "Simulated network hiccup — will retry next cycle."
            : null,
      };

      setHistory((prev) => {
        const next = [entry, ...prev];
        saveHistory(next);
        return next;
      });

      if (meta.provider && !failed) {
        setConnections((prev) => {
          const next = prev.map((c) =>
            c.provider === meta.provider ? { ...c, lastSyncAt: Date.now() } : c,
          );
          saveConnections(next);
          return next;
        });
      }

      return entry;
    },
    [connections],
  );

  const addSchedule = useCallback((input: AddScheduleInput) => {
    setSchedules((prev) => {
      const now = Date.now();
      const schedule: ScheduledBackup = {
        id: generateId(),
        name: input.name,
        templateId: input.templateId,
        destination: input.destination,
        frequency: input.frequency,
        enabled: true,
        createdAt: now,
        lastRunAt: null,
        nextRunAt: computeNextRun(input.frequency, now),
      };
      const next = [schedule, ...prev];
      saveSchedules(next);
      return next;
    });
  }, []);

  const toggleSchedule = useCallback((id: string) => {
    setSchedules((prev) => {
      const next = prev.map((s) =>
        s.id === id
          ? {
              ...s,
              enabled: !s.enabled,
              nextRunAt: !s.enabled ? computeNextRun(s.frequency) : s.nextRunAt,
            }
          : s,
      );
      saveSchedules(next);
      return next;
    });
  }, []);

  const removeSchedule = useCallback((id: string) => {
    setSchedules((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSchedules(next);
      return next;
    });
  }, []);

  const runScheduleNow = useCallback(
    async (id: string) => {
      const schedule = schedules.find((s) => s.id === id);
      if (!schedule || runningSchedules.current.has(id)) return;
      runningSchedules.current.add(id);
      try {
        const template = getTemplate(schedule.templateId);
        const filters: ExportFilters = { dateFrom: "", dateTo: "", categories: [] };
        await runExport({
          templateId: schedule.templateId,
          format: template.format,
          filters,
          destination: schedule.destination,
          triggeredBy: "schedule",
        });
      } finally {
        const now = Date.now();
        setSchedules((prev) => {
          const next = prev.map((s) =>
            s.id === id ? { ...s, lastRunAt: now, nextRunAt: computeNextRun(s.frequency, now) } : s,
          );
          saveSchedules(next);
          return next;
        });
        runningSchedules.current.delete(id);
      }
    },
    [schedules, runExport],
  );

  // Background scheduler: fire any due, enabled schedule while the tab is open.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const schedule of schedules) {
        if (schedule.enabled && schedule.nextRunAt <= now && !runningSchedules.current.has(schedule.id)) {
          void runScheduleNow(schedule.id);
        }
      }
    }, SCHEDULE_TICK_MS);
    return () => clearInterval(interval);
  }, [schedules, runScheduleNow]);

  const recordShareView = useCallback(
    (shareId: string) => {
      // Guard against writing before localStorage has been read into state —
      // otherwise this would persist the still-empty initial history array.
      if (!hydrated) return;
      setHistory((prev) => {
        const next = prev.map((h) => (h.shareId === shareId ? { ...h, shareViews: h.shareViews + 1 } : h));
        saveHistory(next);
        return next;
      });
    },
    [hydrated],
  );

  const getHistoryByShareId = useCallback(
    (shareId: string) => history.find((h) => h.shareId === shareId),
    [history],
  );

  const value = useMemo<CloudExportContextValue>(
    () => ({
      connections,
      schedules,
      history,
      hydrated,
      connect,
      disconnect,
      addSchedule,
      toggleSchedule,
      removeSchedule,
      runScheduleNow,
      runExport,
      recordShareView,
      getHistoryByShareId,
    }),
    [
      connections,
      schedules,
      history,
      hydrated,
      connect,
      disconnect,
      addSchedule,
      toggleSchedule,
      removeSchedule,
      runScheduleNow,
      runExport,
      recordShareView,
      getHistoryByShareId,
    ],
  );

  return <CloudExportContext.Provider value={value}>{children}</CloudExportContext.Provider>;
}

export function useCloudExport(): CloudExportContextValue {
  const ctx = useContext(CloudExportContext);
  if (!ctx) throw new Error("useCloudExport must be used within a CloudExportProvider");
  return ctx;
}
