"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/components/Toast";
import { byDateDesc, sumAmount } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import type { Expense, ExpenseDraft } from "@/lib/types";
import { ExpenseList } from "./ExpenseList";
import { ExpenseForm } from "./ExpenseForm";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { ExportDrawer } from "./export/ExportDrawer";
import {
  DEFAULT_FILTERS,
  ExpenseFilters,
  isFiltering,
  type Filters,
} from "./ExpenseFilters";

export function ExpensesManager() {
  const {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    seedSampleData,
  } = useExpenses();
  const { toast } = useToast();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(
    () => applyFilters(expenses, filters),
    [expenses, filters],
  );
  const filteredTotal = useMemo(() => sumAmount(filtered), [filtered]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  const handleSubmit = (draft: ExpenseDraft) => {
    if (editing) {
      updateExpense(editing.id, draft);
      toast("Expense updated");
    } else {
      addExpense(draft);
      toast("Expense added");
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = () => {
    if (deleting) {
      deleteExpense(deleting.id);
      toast("Expense deleted", "info");
    }
    setDeleting(null);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        onAdd={openAdd}
        onExport={() => setExportOpen(true)}
        canExport={expenses.length > 0}
      />

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          message="Start tracking your spending by adding your first expense, or load some sample data to explore the app."
          actionLabel="Add your first expense"
          onAction={openAdd}
          secondaryLabel="Load sample data"
          onSecondary={() => {
            seedSampleData();
            toast("Loaded sample data");
          }}
        />
      ) : (
        <>
          <ExpenseFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />

          <div className="flex items-center justify-between px-1 text-sm">
            <p className="text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>{" "}
              of {expenses.length} expenses
            </p>
            <p className="text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-900">
                {formatCurrency(filteredTotal)}
              </span>
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No matching expenses"
              message={
                isFiltering(filters)
                  ? "Try adjusting or clearing your filters to see more results."
                  : "No expenses to show."
              }
              actionLabel="Clear filters"
              onAction={() => setFilters(DEFAULT_FILTERS)}
            />
          ) : (
            <ExpenseList
              expenses={filtered}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          )}
        </>
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit expense" : "Add expense"}
        description={
          editing
            ? "Update the details of this expense."
            : "Record a new expense with its details below."
        }
      >
        <ExpenseForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete expense?"
        message={
          deleting
            ? `"${deleting.description}" (${formatCurrency(deleting.amount)}) will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <ExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        expenses={expenses}
        onExported={(count, format) =>
          toast(`Exported ${count} expenses as ${format.toUpperCase()}`)
        }
      />
    </div>
  );
}

function PageHeader({
  onAdd,
  onExport,
  canExport,
}: {
  onAdd: () => void;
  onExport: () => void;
  canExport: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Expenses
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add, filter, edit, and export your expenses.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={onExport}
          disabled={!canExport}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export…
        </button>
        <button type="button" className="btn-primary" onClick={onAdd}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add expense
        </button>
      </div>
    </div>
  );
}

function applyFilters(expenses: Expense[], filters: Filters): Expense[] {
  const search = filters.search.trim().toLowerCase();

  const result = expenses.filter((e) => {
    if (search && !e.description.toLowerCase().includes(search)) return false;
    if (filters.category !== "all" && e.category !== filters.category)
      return false;
    if (filters.from && e.date < filters.from) return false;
    if (filters.to && e.date > filters.to) return false;
    return true;
  });

  const sorted = [...result];
  switch (filters.sort) {
    case "date-asc":
      sorted.sort((a, b) => -byDateDesc(a, b));
      break;
    case "amount-desc":
      sorted.sort((a, b) => b.amount - a.amount);
      break;
    case "amount-asc":
      sorted.sort((a, b) => a.amount - b.amount);
      break;
    case "date-desc":
    default:
      sorted.sort(byDateDesc);
      break;
  }
  return sorted;
}
