"use client";

export type SyncState = "connected" | "syncing" | "disconnected" | "error";

const STYLES: Record<SyncState, { dot: string; ring: string; label: string }> = {
  connected: { dot: "bg-emerald-500", ring: "bg-emerald-400", label: "Connected" },
  syncing: { dot: "bg-sky-500", ring: "bg-sky-400", label: "Syncing" },
  disconnected: { dot: "bg-slate-300", ring: "bg-slate-300", label: "Not connected" },
  error: { dot: "bg-rose-500", ring: "bg-rose-400", label: "Error" },
};

export function SyncStatusDot({
  state,
  showLabel = false,
}: {
  state: SyncState;
  showLabel?: boolean;
}) {
  const s = STYLES[state];
  const animated = state === "syncing" || state === "connected";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {animated && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${s.ring}`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      {showLabel && <span className="text-xs font-medium text-slate-500">{s.label}</span>}
    </span>
  );
}
