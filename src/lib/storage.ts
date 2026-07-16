import { CATEGORIES, type Category, type Expense } from "./types";

const STORAGE_KEY = "expense-tracker-ai:expenses:v1";

/** Type guard that validates an unknown record is a well-formed Expense. */
function isValidExpense(value: unknown): value is Expense {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.date === "string" &&
    typeof e.amount === "number" &&
    Number.isFinite(e.amount) &&
    typeof e.category === "string" &&
    CATEGORIES.includes(e.category as Category) &&
    typeof e.description === "string" &&
    typeof e.createdAt === "number"
  );
}

/** Load and validate expenses from localStorage. Returns [] on any problem. */
export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidExpense);
  } catch {
    return [];
  }
}

/** Persist expenses to localStorage. Swallows quota / serialization errors. */
export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage may be full or unavailable (private mode) — fail silently.
  }
}

/** Generate a reasonably unique id without external dependencies. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
