"use client";

import { useState } from "react";
import { useCloudExport } from "@/context/CloudExportContext";
import { PROVIDERS, PROVIDER_META, type Provider } from "@/lib/cloud/types";
import { ConnectModal } from "./ConnectModal";
import { PROVIDER_ICONS } from "./icons";
import { RelativeTime } from "./RelativeTime";
import { SectionHeading } from "./TemplateGallery";
import { SyncStatusDot } from "./SyncStatusDot";

export function IntegrationsPanel() {
  const { connections, connect, disconnect } = useCloudExport();
  const [connecting, setConnecting] = useState<Provider | null>(null);

  return (
    <section className="card p-5 sm:p-6">
      <SectionHeading eyebrow="Connect" title="Connected apps" />
      <p className="-mt-3 mb-5 text-sm text-slate-500">
        Authorize a destination once, then send exports there in one click.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROVIDERS.map((provider) => {
          const meta = PROVIDER_META[provider];
          const Icon = PROVIDER_ICONS[provider];
          const conn = connections.find((c) => c.provider === provider);
          const connected = conn?.connected ?? false;
          return (
            <div
              key={provider}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                connected ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.accentSoftBg} ${meta.accent}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">{meta.label}</p>
                  <SyncStatusDot state={connected ? "connected" : "disconnected"} />
                </div>
                {connected ? (
                  <>
                    <p className="truncate text-xs text-slate-500">{conn?.accountLabel}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {conn?.lastSyncAt ? (
                        <>
                          Synced <RelativeTime ms={conn.lastSyncAt} />
                        </>
                      ) : (
                        "Not synced yet"
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-xs leading-snug text-slate-500">{meta.description}</p>
                )}
                <button
                  type="button"
                  onClick={() => (connected ? disconnect(provider) : setConnecting(provider))}
                  className={`mt-2.5 text-xs font-semibold ${
                    connected ? "text-slate-400 hover:text-rose-600" : "text-brand-600 hover:text-brand-700"
                  }`}
                >
                  {connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConnectModal
        provider={connecting}
        onClose={() => setConnecting(null)}
        onConnected={(p, label) => {
          connect(p, label);
          setConnecting(null);
        }}
      />
    </section>
  );
}
