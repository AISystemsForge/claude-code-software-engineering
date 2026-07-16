"use client";

import { EXPORT_TEMPLATES } from "@/lib/cloud/templates";
import type { TemplateId } from "@/lib/cloud/types";
import { ChevronRightIcon, TEMPLATE_ICONS } from "./icons";

export function TemplateGallery({ onUseTemplate }: { onUseTemplate: (id: TemplateId) => void }) {
  return (
    <section className="card p-5 sm:p-6">
      <SectionHeading eyebrow="Start fast" title="Export templates" />
      <p className="-mt-3 mb-5 text-sm text-slate-500">
        Pick a preset built for a purpose, then fine-tune it in the wizard.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXPORT_TEMPLATES.map((t) => {
          const Icon = TEMPLATE_ICONS[t.id];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onUseTemplate(t.id)}
              className="group flex flex-col items-start gap-2.5 rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.accentSoftBg} ${t.accent}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className={`mt-0.5 text-xs font-medium ${t.accent}`}>{t.tagline}</p>
              </div>
              <p className="text-xs leading-snug text-slate-500">{t.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-semibold text-slate-400 transition group-hover:text-brand-600">
                Use template
                <ChevronRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
  );
}
