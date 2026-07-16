const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Format a number as USD currency, e.g. 1234.5 -> "$1,234.50". */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/** Compact currency for tight spaces, e.g. 12345 -> "$12.3K". */
export function formatCompactCurrency(amount: number): string {
  return compactCurrencyFormatter.format(amount);
}

/** Format an ISO date string ("2026-07-14") as "Jul 14, 2026". */
export function formatDate(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format an ISO date string as a short label, e.g. "Jul 14". */
export function formatShortDate(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Today's date as an ISO date string in the user's local timezone. */
export function todayISO(): string {
  const now = new Date();
  return toISODate(now);
}

/** Convert a Date to an ISO date string ("YYYY-MM-DD") in local time. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse an ISO date string as a local Date (avoids UTC off-by-one). */
export function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "2026-07" style month key for grouping. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** Human label for a month key, e.g. "2026-07" -> "July 2026". */
export function formatMonthLabel(key: string): string {
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** The month key for the current month. */
export function currentMonthKey(): string {
  return monthKey(todayISO());
}
