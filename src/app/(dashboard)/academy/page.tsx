import Link from "next/link";
import { BadgeEuro, Calculator, CheckCircle2, ExternalLink, GraduationCap, Wrench } from "lucide-react";
import { PageHeader, Card, CardTitle } from "@/components/ui";
import { CALCULATOR_URL, EIGNUNGSCHECK_URL } from "@/lib/tools";

export default function AcademyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Varmi Academy"
        description="Schulung und Werkzeuge für Vertrieb und Montage — direkt aus dem Portal."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-night text-copper">
              <BadgeEuro className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Vertriebs-Trainer</CardTitle>
              <p className="text-sm text-slate-500">Markt, Systeme, Argumente und Pitch — in 10 Kapiteln</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Heizungsmarkt 2026 und alle Systeme im ehrlichen Vergleich</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Die Thermoskannen-Erklärung, der 60-Sekunden-Pitch, Einwandbehandlung</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Mit Abschluss-Quiz — der „Kind-Test"</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 pt-2">
            <Link
              href="/academy/vertriebs-trainer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-night transition hover:bg-[#C5854A]"
            >
              <GraduationCap className="h-4 w-4" /> Training starten
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-night text-copper">
              <Wrench className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Montage-Trainer</CardTitle>
              <p className="text-sm text-slate-500">Die Varmi-Montage in 12 animierten Schritten</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Vom Aufmaß bis zur Abnahme — mit Prüfpunkten je Schritt</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Gewerke-Hinweise (Elektro nur durch die Elektrofachkraft)</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Ideal zur Vorbereitung auf die Fachpartner-Zertifizierung</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 pt-2">
            <Link
              href="/academy/montage-trainer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-night transition hover:bg-[#C5854A]"
            >
              <GraduationCap className="h-4 w-4" /> Training starten
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-night text-copper">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Wirtschaftlichkeitsrechner</CardTitle>
              <p className="text-sm text-slate-500">Verbrauch, Kosten und Amortisation live berechnen</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Kundenfertiger, teilbarer Report für das Verkaufsgespräch</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Aufmaß → Angebot mit hinterlegtem Leistungskatalog</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> Szenarien: konservativ, ausgewogen, performant</li>
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
            {CALCULATOR_URL ? (
              <a
                href={CALCULATOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-night transition hover:bg-[#C5854A]"
              >
                <ExternalLink className="h-4 w-4" /> Rechner öffnen
              </a>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xs text-slate-500">
                Noch nicht verknüpft — Rechner-URL in <code>NEXT_PUBLIC_CALCULATOR_URL</code> hinterlegen.
              </p>
            )}
            <a
              href={EIGNUNGSCHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" /> Eignungs-Check (Endkunde)
            </a>
          </div>
        </Card>
      </div>

      <p className="text-xs text-slate-400">
        Hinweis: Der Montage-Trainer ist ein Schulungsmodul — rechtlich maßgeblich bleibt die schriftliche Montage- &
        Inbetriebnahmeanleitung.
      </p>
    </div>
  );
}
