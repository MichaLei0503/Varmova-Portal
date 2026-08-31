import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { VERTRIEBS_TRAINER_PATH } from "@/lib/tools";

export const metadata = { title: "Vertriebs-Trainer · Varmi Academy" };

export default function VertriebsTrainerPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-night"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zur Academy
        </Link>
        <a
          href={VERTRIEBS_TRAINER_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Im Vollbild öffnen
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-night shadow-soft">
        <iframe
          src={VERTRIEBS_TRAINER_PATH}
          title="Varmi Vertriebs-Trainer — Markt, Systeme, Argumente und Pitch in 10 Kapiteln"
          className="h-[calc(100vh-180px)] min-h-[560px] w-full border-0"
        />
      </div>
    </div>
  );
}
