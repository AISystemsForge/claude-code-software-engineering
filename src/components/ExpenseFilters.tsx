"use client";

import { CATEGORIES } from "@/lib/types";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc";

export interface Filters {
  search: string;
  category: "all" | (typeof CATEGORIES)[number];
  from: string;
  to: string;
  sort: SortOption;
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "all",
  from: "",
  to: "",
  sort: "date-desc",
};

export function isFiltering(filters: Filters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.category !== "all" ||
    filters.from !== "" ||
    filters.to !== ""
  );
}

export function ExpenseFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            Search
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Description…"
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              className="input-base pl-9"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              set("category", e.target.value as Filters["category"])
            }
            className="input-base"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            Sort by
          </label>
          <select
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value as SortOption)}
            className="input-base"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount: high to low</option>
            <option value="amount-asc">Amount: low to high</option>
          </select>
        </div>

        {/* From */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            From
          </label>
          <input
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => set("from", e.target.value)}
            className="input-base"
          />
        </div>

        {/* To */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            To
          </label>
          <input
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => set("to", e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      {isFiltering(filters) && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
