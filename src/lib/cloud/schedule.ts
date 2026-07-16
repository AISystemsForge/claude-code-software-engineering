import type { ScheduleFrequency } from "./types";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const FREQUENCY_MS: Record<ScheduleFrequency, number> = {
  "demo-5min": 5 * MINUTE,
  daily: DAY,
  weekly: 7 * DAY,
  monthly: 30 * DAY,
};

export const FREQUENCY_META: Record<ScheduleFrequency, { label: string; hint: string }> = {
  "demo-5min": {
    label: "Every 5 minutes",
    hint: "Demo cadence — great for watching automation run live.",
  },
  daily: { label: "Daily", hint: "Runs once every 24 hours." },
  weekly: { label: "Weekly", hint: "Runs every 7 days." },
  monthly: { label: "Monthly", hint: "Runs roughly once a month." },
};

export function computeNextRun(frequency: ScheduleFrequency, from: number = Date.now()): number {
  return from + FREQUENCY_MS[frequency];
}

/** Human countdown like "in 3 min" / "in 2 days" / "due now". */
export function formatCountdown(targetMs: number, nowMs: number = Date.now()): string {
  const diff = targetMs - nowMs;
  if (diff <= 0) return "Due now";
  const mins = Math.round(diff / MINUTE);
  if (mins < 1) return "in a few seconds";
  if (mins < 60) return `in ${mins} min${mins === 1 ? "" : "s"}`;
  const hours = Math.round(diff / HOUR);
  if (hours < 48) return `in ${hours} hr${hours === 1 ? "" : "s"}`;
  const days = Math.round(diff / DAY);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}
