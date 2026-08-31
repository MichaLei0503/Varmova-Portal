import Link from "next/link";
import { Calculator, GraduationCap, ChevronRight } from "lucide-react";
import { CALCULATOR_URL } from "@/lib/tools";

/** Schnellzugriff auf Academy-Werkzeuge — auf allen Dashboards eingeblendet. */
export function ToolCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link
        href="/academy/montage-trainer"
        className="group flex items-center justify-between gap-4 rounded-2xl bg-night p-5 shadow-soft transition hover:shadow-md [background-image:radial-gradient(ellipse_280px_160px_at_90%_0%,rgba(232,162,96,0.18),transparent_70%)]"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-copper">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-white">Montage-Trainer</p>
            <p className="text-sm text-white/60">Die Varmi-Montage in 12 Schritten — mit Prüfpunkten</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-copper transition group-hover:translate-x-0.5" />
      </Link>

      {CALCULATOR_URL ? (
        <a
          href={CALCULATOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-night text-copper">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-night">Wirtschaftlichkeitsrechner</p>
              <p className="text-sm text-slate-500">Report und Angebot für das Kundengespräch</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-copper transition group-hover:translate-x-0.5" />
        </a>
      ) : (
        <Link
          href="/academy"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-night text-copper">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-night">Wirtschaftlichkeitsrechner</p>
              <p className="text-sm text-slate-500">Alle Werkzeuge in der Varmi Academy</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-copper transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
