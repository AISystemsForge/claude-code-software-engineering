import { generateId } from "@/lib/storage";
import { PROVIDERS, type ConnectionState, type ExportHistoryEntry, type ScheduledBackup } from "./types";

const CONNECTIONS_KEY = "expense-tracker-ai:cloud:connections:v1";
const SCHEDULES_KEY = "expense-tracker-ai:cloud:schedules:v1";
const HISTORY_KEY = "expense-tracker-ai:cloud:history:v1";
const HISTORY_LIMIT = 50;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or unavailable (private mode) — fail silently.
  }
}

export function loadConnections(): ConnectionState[] {
  const stored = readJson<ConnectionState[]>(CONNECTIONS_KEY, []);
  const byProvider = new Map(stored.map((c) => [c.provider, c]));
  return PROVIDERS.map(
    (provider) =>
      byProvider.get(provider) ?? {
        provider,
        connected: false,
        accountLabel: null,
        connectedAt: null,
        lastSyncAt: null,
      },
  );
}

export function saveConnections(connections: ConnectionState[]): void {
  writeJson(CONNECTIONS_KEY, connections);
}

export function loadSchedules(): ScheduledBackup[] {
  return readJson<ScheduledBackup[]>(SCHEDULES_KEY, []);
}

export function saveSchedules(schedules: ScheduledBackup[]): void {
  writeJson(SCHEDULES_KEY, schedules);
}

export function loadHistory(): ExportHistoryEntry[] {
  return readJson<ExportHistoryEntry[]>(HISTORY_KEY, []);
}

export function saveHistory(history: ExportHistoryEntry[]): void {
  writeJson(HISTORY_KEY, history.slice(0, HISTORY_LIMIT));
}

export { generateId };
