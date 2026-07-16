import { CATEGORY_META } from "@/lib/categories";
import type { Category } from "@/lib/types";

export function CategoryBadge({
  category,
  size = "md",
}: {
  category: Category;
  size?: "sm" | "md";
}) {
  const meta = CATEGORY_META[category];
  const sizeClass =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${meta.softBg} ${meta.softText} ${sizeClass}`}
    >
      <span aria-hidden="true">{meta.icon}</span>
      {category}
    </span>
  );
}
