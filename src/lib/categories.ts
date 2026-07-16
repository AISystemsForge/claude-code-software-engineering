import type { Category } from "./types";

export interface CategoryMeta {
  /** Tailwind text color class */
  text: string;
  /** Tailwind background color class (solid) */
  bg: string;
  /** Tailwind soft background for badges */
  softBg: string;
  /** Tailwind soft text for badges */
  softText: string;
  /** Raw hex used for inline SVG / chart fills */
  hex: string;
  /** Emoji icon */
  icon: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Food: {
    text: "text-emerald-700",
    bg: "bg-emerald-500",
    softBg: "bg-emerald-50",
    softText: "text-emerald-700",
    hex: "#10b981",
    icon: "🍽️",
  },
  Transportation: {
    text: "text-sky-700",
    bg: "bg-sky-500",
    softBg: "bg-sky-50",
    softText: "text-sky-700",
    hex: "#0ea5e9",
    icon: "🚗",
  },
  Entertainment: {
    text: "text-fuchsia-700",
    bg: "bg-fuchsia-500",
    softBg: "bg-fuchsia-50",
    softText: "text-fuchsia-700",
    hex: "#d946ef",
    icon: "🎬",
  },
  Shopping: {
    text: "text-amber-700",
    bg: "bg-amber-500",
    softBg: "bg-amber-50",
    softText: "text-amber-700",
    hex: "#f59e0b",
    icon: "🛍️",
  },
  Bills: {
    text: "text-rose-700",
    bg: "bg-rose-500",
    softBg: "bg-rose-50",
    softText: "text-rose-700",
    hex: "#f43f5e",
    icon: "🧾",
  },
  Other: {
    text: "text-slate-700",
    bg: "bg-slate-500",
    softBg: "bg-slate-100",
    softText: "text-slate-700",
    hex: "#64748b",
    icon: "📦",
  },
};
