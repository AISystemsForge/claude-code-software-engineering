"use client";

import { EXPORT_FORMATS, EXPORT_FORMAT_META, type ExportFormat } from "@/lib/export/types";

export function FormatPicker({
  value,
  onChange,
}: {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {EXPORT_FORMATS.map((format) => {
        const meta = EXPORT_FORMAT_META[format];
        const active = value === format;
        return (
          <button
            key={format}
            type="button"
            onClick={() => onChange(format)}
            aria-pressed={active}
            className={`flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition ${
              active
                ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <FormatIcon format={format} active={active} />
              <span
                className={`text-sm font-semibold ${active ? "text-brand-700" : "text-slate-900"}`}
              >
                {meta.label}
              </span>
            </span>
            <span className="text-xs leading-snug text-slate-500">
              {meta.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FormatIcon({
  format,
  active,
}: {
  format: ExportFormat;
  active: boolean;
}) {
  const color = active ? "text-brand-600" : "text-slate-400";
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    className: `h-4 w-4 ${color}`,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (format === "csv") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M9 10v10M15 10v10" />
      </svg>
    );
  }
  if (format === "json") {
    return (
      <svg {...common}>
        <path d="M8 3a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a2 2 0 0 0 2 2" />
        <path d="M16 3a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a2 2 0 0 1-2 2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M9 15h6M9 18h4" />
    </svg>
  );
}
