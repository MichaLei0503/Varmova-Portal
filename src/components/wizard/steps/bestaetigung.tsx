import Link from "next/link";
import { AlertTriangle, Check, Mail, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { calculateOffer } from "@/lib/pricing";
import { formatCents } from "@/lib/utils";
import type { WizardDraftData } from "@/lib/wizard/draft";
import { auswahlSchema, heizungSchema, kundeSchema, projektSchema } from "@/lib/wizard/steps";

// Step 8 — Bestätigung. Zeigt eine Zusammenfassung aller Draft-Daten und listet
// die Side-Effects auf, die beim Klick auf "Abschließen" ausgeführt werden.
export async function BestaetigungStep({
  draftId,
  draftData,
}: {
  draftId: string;
  draftData: WizardDraftData;
}) {
  const kunde = kundeSchema.safeParse(draftData.kunde ?? {});
  const heizung = heizungSchema.safeParse(draftData.heizung ?? {});
  const projekt = projektSchema.safeParse(draftData.projekt ?? {});
  const auswahl = auswahlSchema.safeParse(draftData.auswahl ?? {});

  const allValid = kunde.success && heizung.success && projekt.success && auswahl.success;
  if (!allValid) {
    return <IncompleteWarning draftId={draftId} />;
  }

  const [catalog, installer] = await Promise.all([
    prisma.productCatalog.findMany({ where: { validUntil: null } }),
    prisma.organization.findUnique({ where: { id: auswahl.data.ipOrgId } }),
  ]);

  const calculation = calculateOffer(
    {
      scope: projekt.data.scope,
      varmiSku: projekt.data.varmiSku,
      bufferSku: projekt.data.bufferSku,
      newThermostats: projekt.data.newThermostats,
      thermostatSku: projekt.data.thermostatSku,
      replaceHeaters: projekt.data.replaceHeaters,
      heaterReplacementSku: projekt.data.heaterReplacementSku,
      newMeterCabinet: projekt.data.newMeterCabinet,
      currentHeatingType: heizung.data.currentHeatingType,
    },
    catalog,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard title="Kunde">
          <p className="font-medium text-night">
            {kunde.data.salutation} {kunde.data.firstName} {kunde.data.lastName}
          </p>
          <p className="text-sm text-slate-600">{kunde.data.email}</p>
          <p className="mt-2 text-sm text-slate-600">
            {kunde.data.street} {kunde.data.houseNumber}, {kunde.data.postalCode} {kunde.data.city}
          </p>
        </SummaryCard>

        <SummaryCard title="Installationspartner">
          <p className="font-medium text-night">{installer?.name ?? "Nicht gefunden"}</p>
          <p className="text-sm text-slate-600">{installer?.address ?? ""}</p>
        </SummaryCard>

        <SummaryCard title="Projekt">
          <p className="text-sm text-slate-600">Modell: {projekt.data.varmiSku}</p>
          <p className="text-sm text-slate-600">
            Umsetzung: <span className="font-medium text-night">{projekt.data.implementationWindow}</span>
          </p>
        </SummaryCard>

        <SummaryCard title="Gesamtpreis brutto">
          <p className="text-2xl font-semibold text-copper">{formatCents(calculation.totalCents)}</p>
          <p className="text-xs text-slate-500">inkl. 19 % MwSt</p>
        </SummaryCard>
      </div>

      <div className="rounded-2xl border border-copper/30 bg-copper/10 p-5">
        <p className="font-semibold text-night">Was beim Abschließen passiert</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-copper" />
            Projekt und Angebot werden mit einer eindeutigen Nummer (Schema WP{new Date().getFullYear() % 100}xxxxxx) angelegt
          </li>
          <li className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-copper" />
            PDF-Angebot wird generiert (Mock in AP 1.7, React-PDF ab AP 1.8)
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-copper" />
            Link zum Angebot wird an {kunde.data.email} versendet
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-copper" />
            Auftrag wird an {installer?.name} übergeben
          </li>
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function IncompleteWarning({ draftId }: { draftId: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-center gap-2 text-amber-900">
        <AlertTriangle className="h-5 w-5" />
        <p className="font-medium">Wizard ist noch nicht vollständig</p>
      </div>
      <p className="mt-2 text-sm text-amber-800">
        Alle Schritte 2–6 müssen ausgefüllt sein, bevor das Angebot abgeschlossen werden kann.
      </p>
      <Link
        href={`/wizard/${draftId}/kunde`}
        className="mt-4 inline-flex h-10 items-center rounded-xl bg-copper px-4 text-sm font-medium text-night"
      >
        Zum ersten offenen Schritt
      </Link>
    </div>
  );
}
