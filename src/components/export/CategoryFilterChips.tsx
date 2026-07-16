"use client";

import { CATEGORY_META } from "@/lib/categories";
import { CATEGORIES, type Category } from "@/lib/types";

export function CategoryFilterChips({
  selected,
  onToggle,
  onClear,
}: {
  selected: Category[];
  onToggle: (category: Category) => void;
  onClear: () => void;
}) {
  const allSelected = selected.length === 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={onClear}
        aria-pressed={allSelected}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
          allSelected
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        All categories
      </button>
      {CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const active = selected.includes(category);
        return (
          <button
            key={category}
            type="button"
            onClick={() => onToggle(category)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? `border-transparent ${meta.bg} text-white`
                : `border-slate-200 bg-white text-slate-600 hover:bg-slate-50`
            }`}
          >
            <span aria-hidden="true">{meta.icon}</span>
            {category}
          </button>
        );
      })}
    </div>
  );
}
