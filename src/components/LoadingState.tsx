export function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
            </div>
            <div className="mt-4 h-7 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="card p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
