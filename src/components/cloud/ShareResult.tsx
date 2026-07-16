"use client";

import { useEffect, useState } from "react";
import { useCloudExport } from "@/context/CloudExportContext";
import { buildQrDataUrl } from "@/lib/cloud/qr";
import { shareUrlFor } from "@/lib/cloud/share";
import { CheckIcon, CopyIcon } from "./icons";

export function ShareResult({ shareId }: { shareId: string }) {
  const { getHistoryByShareId } = useCloudExport();
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const url = shareUrlFor(shareId);
  const entry = getHistoryByShareId(shareId);

  useEffect(() => {
    let cancelled = false;
    buildQrDataUrl(url).then((dataUrl) => {
      if (!cancelled) setQr(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the URL is still visible to copy by hand.
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR code linking to the shared export" className="h-full w-full" />
          ) : (
            <span className="text-xs text-slate-400">Generating…</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Shareable link
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm">
              {url}
            </code>
            <button
              type="button"
              onClick={copy}
              className="btn-secondary shrink-0 gap-1.5 px-3 py-1.5 text-xs"
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-600" /> : <CopyIcon className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Opens a read-only summary in this browser · {entry?.shareViews ?? 0} view
            {(entry?.shareViews ?? 0) === 1 ? "" : "s"} so far
          </p>
        </div>
      </div>
    </div>
  );
}
