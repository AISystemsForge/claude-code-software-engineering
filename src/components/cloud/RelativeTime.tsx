"use client";

import { useEffect, useState } from "react";

function relativeLabel(ms: number, nowMs: number): string {
  const diff = Math.max(0, nowMs - ms);
  const sec = Math.round(diff / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  return `${days}d ago`;
}

/** A timestamp that live-updates its relative label (e.g. "just now" -> "12s ago"). */
export function RelativeTime({ ms }: { ms: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{relativeLabel(ms, now)}</>;
}
