import { useCallback, useEffect, useMemo, useReducer } from "react";
import { selectExpensesForExport, summarizeSelection } from "@/lib/export/filter";
import { runExport } from "@/lib/export/download";
import type { ExportFormat, ExportStatus } from "@/lib/export/types";
import { todayISO } from "@/lib/format";
import type { Category, Expense } from "@/lib/types";

interface BuilderState {
  format: ExportFormat;
  dateFrom: string;
  dateTo: string;
  categories: Category[];
  filename: string;
  status: ExportStatus;
  error: string | null;
}

type BuilderAction =
  | { type: "SET_FORMAT"; format: ExportFormat }
  | { type: "SET_DATE_FROM"; value: string }
  | { type: "SET_DATE_TO"; value: string }
  | { type: "TOGGLE_CATEGORY"; category: Category }
  | { type: "CLEAR_CATEGORIES" }
  | { type: "SET_FILENAME"; value: string }
  | { type: "SET_STATUS"; status: ExportStatus; error?: string | null }
  | { type: "RESET"; initial: BuilderState };

function reducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "SET_FORMAT":
      return { ...state, format: action.format };
    case "SET_DATE_FROM":
      return { ...state, dateFrom: action.value };
    case "SET_DATE_TO":
      return { ...state, dateTo: action.value };
    case "TOGGLE_CATEGORY": {
      const has = state.categories.includes(action.category);
      return {
        ...state,
        categories: has
          ? state.categories.filter((c) => c !== action.category)
          : [...state.categories, action.category],
      };
    }
    case "CLEAR_CATEGORIES":
      return { ...state, categories: [] };
    case "SET_FILENAME":
      return { ...state, filename: action.value };
    case "SET_STATUS":
      return { ...state, status: action.status, error: action.error ?? null };
    case "RESET":
      return action.initial;
    default:
      return state;
  }
}

function buildInitialState(): BuilderState {
  return {
    format: "csv",
    dateFrom: "",
    dateTo: "",
    categories: [],
    filename: `expenses-${todayISO()}`,
    status: "idle",
    error: null,
  };
}

/** Owns all state for the export drawer: filters, format, filename, and generation status. */
export function useExportBuilder(expenses: Expense[], open: boolean) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  // Fresh state each time the drawer is opened.
  useEffect(() => {
    if (open) dispatch({ type: "RESET", initial: buildInitialState() });
  }, [open]);

  const selected = useMemo(
    () =>
      selectExpensesForExport(expenses, {
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
        categories: state.categories,
      }),
    [expenses, state.dateFrom, state.dateTo, state.categories],
  );

  const summary = useMemo(() => summarizeSelection(selected), [selected]);

  const setFormat = useCallback(
    (format: ExportFormat) => dispatch({ type: "SET_FORMAT", format }),
    [],
  );
  const setDateFrom = useCallback(
    (value: string) => dispatch({ type: "SET_DATE_FROM", value }),
    [],
  );
  const setDateTo = useCallback(
    (value: string) => dispatch({ type: "SET_DATE_TO", value }),
    [],
  );
  const toggleCategory = useCallback(
    (category: Category) => dispatch({ type: "TOGGLE_CATEGORY", category }),
    [],
  );
  const clearCategories = useCallback(
    () => dispatch({ type: "CLEAR_CATEGORIES" }),
    [],
  );
  const setFilename = useCallback(
    (value: string) => dispatch({ type: "SET_FILENAME", value }),
    [],
  );

  const submit = useCallback(async () => {
    if (selected.length === 0) return;
    dispatch({ type: "SET_STATUS", status: "generating" });
    try {
      // Yield a frame so the loading state actually paints before the
      // (synchronous, potentially heavy) file generation runs.
      await new Promise((resolve) => setTimeout(resolve, 350));
      await runExport(selected, {
        format: state.format,
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
        categories: state.categories,
        filename: state.filename,
      });
      dispatch({ type: "SET_STATUS", status: "done" });
    } catch (err) {
      dispatch({
        type: "SET_STATUS",
        status: "error",
        error: err instanceof Error ? err.message : "Export failed",
      });
    }
  }, [selected, state.format, state.dateFrom, state.dateTo, state.categories, state.filename]);

  return {
    state,
    selected,
    summary,
    setFormat,
    setDateFrom,
    setDateTo,
    toggleCategory,
    clearCategories,
    setFilename,
    submit,
  };
}
