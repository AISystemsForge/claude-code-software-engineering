"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { PROVIDER_META, type Provider } from "@/lib/cloud/types";
import { CheckIcon, PROVIDER_ICONS, SpinnerIcon } from "./icons";

const STAGES = ["Redirecting to provider", "Authenticating", "Granting Expenzo access", "Finalizing connection"];

export function ConnectModal({
  provider,
  onClose,
  onConnected,
}: {
  provider: Provider | null;
  onClose: () => void;
  onConnected: (provider: Provider, accountLabel: string) => void;
}) {
  const [accountLabel, setAccountLabel] = useState("");
  const [stage, setStage] = useState<"form" | "authorizing" | "done">("form");
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    setAccountLabel("");
    setStage("form");
    setStageIndex(0);
  }, [provider]);

  useEffect(() => {
    if (stage !== "authorizing") return;
    if (stageIndex >= STAGES.length) {
      setStage("done");
      return;
    }
    const timer = setTimeout(() => setStageIndex((i) => i + 1), 480);
    return () => clearTimeout(timer);
  }, [stage, stageIndex]);

  useEffect(() => {
    if (stage !== "done" || !provider) return;
    const timer = setTimeout(() => onConnected(provider, accountLabel), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (!provider) return null;
  const meta = PROVIDER_META[provider];
  const Icon = PROVIDER_ICONS[provider];

  return (
    <Modal
      open={provider !== null}
      onClose={stage === "authorizing" ? () => {} : onClose}
      title={`Connect ${meta.label}`}
      description={
        stage === "form"
          ? "This is a simulated authorization — no real account is contacted."
          : undefined
      }
    >
      {stage === "form" && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStage("authorizing");
          }}
        >
          <div className={`flex items-center gap-3 rounded-xl ${meta.accentSoftBg} p-4`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ${meta.accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className={`text-sm ${meta.accent}`}>{meta.description}</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Account
            </label>
            <input
              type="text"
              required
              value={accountLabel}
              onChange={(e) => setAccountLabel(e.target.value)}
              placeholder={meta.accountPlaceholder}
              className="input-base"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Continue
            </button>
          </div>
        </form>
      )}

      {(stage === "authorizing" || stage === "done") && (
        <div className="space-y-4 py-2">
          <ul className="space-y-3">
            {STAGES.map((label, i) => {
              const complete = stage === "done" || i < stageIndex;
              const active = stage === "authorizing" && i === stageIndex;
              return (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      complete
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : active
                          ? "border-brand-500 text-brand-500"
                          : "border-slate-200 text-transparent"
                    }`}
                  >
                    {complete ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : active ? (
                      <SpinnerIcon className="h-3 w-3" />
                    ) : (
                      "•"
                    )}
                  </span>
                  <span className={complete || active ? "text-slate-900" : "text-slate-400"}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
          {stage === "done" && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Connected as {accountLabel}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
