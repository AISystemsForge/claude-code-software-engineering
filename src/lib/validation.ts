import { parseISODate, todayISO } from "./format";
import { CATEGORIES, type Category } from "./types";

export interface ExpenseFormValues {
  date: string;
  amount: string;
  category: string;
  description: string;
}

export type ExpenseFormErrors = Partial<
  Record<keyof ExpenseFormValues, string>
>;

export const MAX_AMOUNT = 1_000_000_000;

/** Validate raw form values. Returns a map of field -> error message. */
export function validateExpenseForm(
  values: ExpenseFormValues,
): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  // Date
  const parsedDate = parseISODate(values.date);
  if (!values.date.trim()) {
    errors.date = "Date is required.";
  } else if (!parsedDate) {
    errors.date = "Enter a valid date.";
  } else if (values.date > todayISO()) {
    errors.date = "Date cannot be in the future.";
  }

  // Amount
  const amount = Number(values.amount);
  if (!values.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (Number.isNaN(amount)) {
    errors.amount = "Amount must be a number.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (amount > MAX_AMOUNT) {
    errors.amount = "Amount is unrealistically large.";
  }

  // Category
  if (!values.category.trim()) {
    errors.category = "Select a category.";
  } else if (!CATEGORIES.includes(values.category as Category)) {
    errors.category = "Choose a valid category.";
  }

  // Description
  const description = values.description.trim();
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > 120) {
    errors.description = "Keep the description under 120 characters.";
  }

  return errors;
}

/** True when the errors object has no entries. */
export function isFormValid(errors: ExpenseFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
