"use client";

import { useMemo, useState } from "react";
import { CATEGORY_META } from "@/lib/categories";
import { todayISO } from "@/lib/format";
import { CATEGORIES, type Category, type Expense, type ExpenseDraft } from "@/lib/types";
import {
  isFormValid,
  validateExpenseForm,
  type ExpenseFormErrors,
  type ExpenseFormValues,
} from "@/lib/validation";

interface ExpenseFormProps {
  /** When provided, the form edits this expense instead of creating one. */
  initial?: Expense;
  onSubmit: (draft: ExpenseDraft) => void;
  onCancel: () => void;
}

export function ExpenseForm({ initial, onSubmit, onCancel }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(() => ({
    date: initial?.date ?? todayISO(),
    amount: initial ? String(initial.amount) : "",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
  }));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo<ExpenseFormErrors>(
    () => validateExpenseForm(values),
    [values],
  );

  const showError = (field: keyof ExpenseFormValues) =>
    (touched[field] || submitted) && errors[field];

  const setField = (field: keyof ExpenseFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const markTouched = (field: keyof ExpenseFormValues) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isFormValid(errors)) return;
    onSubmit({
      date: values.date,
      amount: Math.round(Number(values.amount) * 100) / 100,
      category: values.category as Category,
      description: values.description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Amount */}
      <Field label="Amount" htmlFor="amount" error={showError("amount")}>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-medium text-slate-400">
            $
          </span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={values.amount}
            onChange={(e) => setField("amount", e.target.value)}
            onBlur={() => markTouched("amount")}
            className={`input-base pl-7 ${showError("amount") ? "input-error" : ""}`}
          />
        </div>
      </Field>

      {/* Category */}
      <Field label="Category" htmlFor="category" error={showError("category")}>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((category) => (
            <CategoryOption
              key={category}
              category={category}
              selected={values.category === category}
              onSelect={() => {
                setField("category", category);
                markTouched("category");
              }}
            />
          ))}
        </div>
      </Field>

      {/* Date */}
      <Field label="Date" htmlFor="date" error={showError("date")}>
        <input
          id="date"
          type="date"
          max={todayISO()}
          value={values.date}
          onChange={(e) => setField("date", e.target.value)}
          onBlur={() => markTouched("date")}
          className={`input-base ${showError("date") ? "input-error" : ""}`}
        />
      </Field>

      {/* Description */}
      <Field
        label="Description"
        htmlFor="description"
        error={showError("description")}
        hint={`${values.description.trim().length}/120`}
      >
        <input
          id="description"
          type="text"
          maxLength={120}
          placeholder="e.g. Lunch with team"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          onBlur={() => markTouched("description")}
          className={`input-base ${showError("description") ? "input-error" : ""}`}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initial ? "Save changes" : "Add expense"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | false;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function CategoryOption({
  category,
  selected,
  onSelect,
}: {
  category: Category;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = CATEGORY_META[category];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition ${
        selected
          ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className="text-lg" aria-hidden="true">
        {meta.icon}
      </span>
      {category}
    </button>
  );
}
