"use client";

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-7 w-7"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
          <path d="M3 6v11a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4" />
          <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{message}</p>
      {(actionLabel || secondaryLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button type="button" className="btn-primary" onClick={onAction}>
              {actionLabel}
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
