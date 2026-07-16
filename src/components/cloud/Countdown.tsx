"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/cloud/schedule";

/** A target timestamp that live-updates its countdown label (e.g. "in 3 min" -> "Due now"). */
export function Countdown({ targetMs }: { targetMs: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{formatCountdown(targetMs, now)}</>;
}
