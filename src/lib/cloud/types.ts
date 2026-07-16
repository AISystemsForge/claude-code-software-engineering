import type { Category } from "@/lib/types";

export const EXPORT_FORMATS = ["csv", "json", "pdf"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const DESTINATIONS = [
  "download",
  "email",
  "google-sheets",
  "dropbox",
  "onedrive",
  "link",
] as const;
export type Destination = (typeof DESTINATIONS)[number];

export interface DestinationMeta {
  label: string;
  shortLabel: string;
  description: string;
  /** Providers that need a simulated "Connect" step before they can be used. */
  provider: Provider | null;
}

export const TEMPLATE_IDS = [
  "tax-report",
  "monthly-summary",
  "category-analysis",
  "custom",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export interface ExportFilters {
  dateFrom: string;
  dateTo: string;
  categories: Category[];
}

export type ExportStatus = "queued" | "processing" | "completed" | "failed";

export interface ExportHistoryEntry {
  id: string;
  createdAt: number;
  templateId: TemplateId;
  format: ExportFormat;
  destination: Destination;
  filename: string;
  recordCount: number;
  totalAmount: number;
  status: ExportStatus;
  sizeLabel: string;
  filters: ExportFilters;
  triggeredBy: "manual" | "schedule";
  shareId: string | null;
  shareViews: number;
  note: string | null;
}

export const SCHEDULE_FREQUENCIES = [
  "demo-5min",
  "daily",
  "weekly",
  "monthly",
] as const;
export type ScheduleFrequency = (typeof SCHEDULE_FREQUENCIES)[number];

export interface ScheduledBackup {
  id: string;
  name: string;
  templateId: TemplateId;
  destination: Destination;
  frequency: ScheduleFrequency;
  enabled: boolean;
  createdAt: number;
  lastRunAt: number | null;
  nextRunAt: number;
}

export const PROVIDERS = [
  "google-sheets",
  "dropbox",
  "onedrive",
  "email",
] as const;
export type Provider = (typeof PROVIDERS)[number];

export interface ConnectionState {
  provider: Provider;
  connected: boolean;
  accountLabel: string | null;
  connectedAt: number | null;
  lastSyncAt: number | null;
}

export interface ProviderMeta {
  label: string;
  /** Tailwind text-color class for the provider's icon accent. */
  accent: string;
  /** Tailwind soft background class for the provider's icon chip. */
  accentSoftBg: string;
  description: string;
  accountPlaceholder: string;
}

export const PROVIDER_META: Record<Provider, ProviderMeta> = {
  "google-sheets": {
    label: "Google Sheets",
    accent: "text-emerald-600",
    accentSoftBg: "bg-emerald-50",
    description: "Push new exports straight into a live spreadsheet.",
    accountPlaceholder: "you@gmail.com",
  },
  dropbox: {
    label: "Dropbox",
    accent: "text-blue-600",
    accentSoftBg: "bg-blue-50",
    description: "Sync files into an /Apps/Expenzo folder automatically.",
    accountPlaceholder: "you@dropbox.com",
  },
  onedrive: {
    label: "OneDrive",
    accent: "text-sky-600",
    accentSoftBg: "bg-sky-50",
    description: "Keep a synced copy in your Microsoft 365 storage.",
    accountPlaceholder: "you@outlook.com",
  },
  email: {
    label: "Email delivery",
    accent: "text-amber-600",
    accentSoftBg: "bg-amber-50",
    description: "Verify a sender address to email exports as attachments.",
    accountPlaceholder: "you@example.com",
  },
};

export const DESTINATION_META: Record<Destination, DestinationMeta> = {
  download: {
    label: "Download to device",
    shortLabel: "Download",
    description: "Save the file straight to your computer.",
    provider: null,
  },
  email: {
    label: "Email a copy",
    shortLabel: "Email",
    description: "Send the export as an attachment.",
    provider: "email",
  },
  "google-sheets": {
    label: "Google Sheets",
    shortLabel: "Sheets",
    description: "Push rows into a live spreadsheet.",
    provider: "google-sheets",
  },
  dropbox: {
    label: "Dropbox",
    shortLabel: "Dropbox",
    description: "Sync the file into your Dropbox folder.",
    provider: "dropbox",
  },
  onedrive: {
    label: "OneDrive",
    shortLabel: "OneDrive",
    description: "Sync the file into your OneDrive folder.",
    provider: "onedrive",
  },
  link: {
    label: "Shareable link",
    shortLabel: "Link",
    description: "Generate a link and QR code to share.",
    provider: null,
  },
};
