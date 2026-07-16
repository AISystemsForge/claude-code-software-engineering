interface IconProps {
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Receipt with a check badge — for the Tax Report template. */
export function TaxReportIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 3h10a1 1 0 0 1 1 1v16l-2.5-1.5L13 20l-2.5-1.5L8 20l-2.5-1.5L3 20V6a3 3 0 0 1 3-3Z" />
      <path d="M7.5 8.5h6M7.5 12h6" />
      <circle cx="17.5" cy="16.5" r="3.4" fill="currentColor" fillOpacity="0.12" />
      <path d="m16 16.6 1 1 1.8-2" />
    </svg>
  );
}

/** Calendar with a highlighted day — for the Monthly Summary template. */
export function MonthlySummaryIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      <rect x="13.5" y="12.5" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.85" stroke="none" />
    </svg>
  );
}

/** A single pie slice — for the Category Analysis template. */
export function CategoryAnalysisIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12Z" />
      <path d="M15.5 3.9A8.52 8.52 0 0 1 20.1 8.5H12Z" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}

/** Tuning sliders — for the Custom Export template. */
export function CustomExportIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 5v6M5 15v4M12 5v2M12 11v8M19 5v10M19 19v0" />
      <circle cx="5" cy="13" r="2" />
      <circle cx="12" cy="9" r="2" />
      <circle cx="19" cy="17" r="2" />
    </svg>
  );
}

/** Small spreadsheet grid — for the Google Sheets integration. */
export function SpreadsheetIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M3.5 9.5h17M3.5 15h17M10 3.5v17" />
    </svg>
  );
}

/** Open storage box — for the Dropbox integration. */
export function StorageBoxIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 9 12 4l8.5 5" />
      <path d="M3.5 9v9.5a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V9" />
      <path d="M3.5 9 12 13.5 20.5 9" />
      <path d="M12 13.5V20" />
    </svg>
  );
}

/** Cloud with a sync arrow — for the OneDrive integration. */
export function CloudSyncIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6-1.5A4.5 4.5 0 0 0 6.5 19h3" />
      <path d="M12 12.5v6M9.7 16.5 12 18.5l2.3-2" />
    </svg>
  );
}

/** Envelope — for the Email integration. */
export function EnvelopeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.5 6.5 8.5 7 8.5-7" />
    </svg>
  );
}

/** Two interlocking loops — for the shareable-link destination. */
export function LinkIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 14a4.5 4.5 0 0 0 6 0l2.5-2.5a4.24 4.24 0 0 0-6-6L11 7" />
      <path d="M14 10a4.5 4.5 0 0 0-6 0L5.5 12.5a4.24 4.24 0 0 0 6 6L13 17" />
    </svg>
  );
}

export function DownloadIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} strokeWidth={2.5} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} strokeWidth={2.5} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ClockIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function HistoryIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2" />
      <path d="M3 3.5V8h4.5M12 7.5V12l2.8 1.7" />
    </svg>
  );
}

export function CopyIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M6 15H4.5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" />
    </svg>
  );
}

export function QrFrameIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
    </svg>
  );
}

export function SpinnerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={`animate-spin-slow ${className}`}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function SparkleIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9Z" />
      <path d="M19 3.5v3M17.5 5h3" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 4.5h5.5V10M19.5 4.5 11 13" />
      <path d="M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10" />
    </svg>
  );
}

export const TEMPLATE_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  "tax-report": TaxReportIcon,
  "monthly-summary": MonthlySummaryIcon,
  "category-analysis": CategoryAnalysisIcon,
  custom: CustomExportIcon,
};

export const PROVIDER_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  "google-sheets": SpreadsheetIcon,
  dropbox: StorageBoxIcon,
  onedrive: CloudSyncIcon,
  email: EnvelopeIcon,
};

export const DESTINATION_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  ...PROVIDER_ICONS,
  download: DownloadIcon,
  link: LinkIcon,
};
