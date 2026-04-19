import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { calculateOffer } from "@/lib/pricing";
import { formatCents } from "@/lib/utils";
import type { WizardDraftData } from "@/lib/wizard/draft";
import { heizungSchema, projektSchema, pruefungSchema } from "@/lib/wizard/steps";

// Step 7 — Prüfung (FA-ANG-060..065).
// Positionsliste + Preisblock werden aus Projekt-/Heizungsdaten und dem aktiven Katalog
// zur Laufzeit berechnet. Persistiert wird nur der Finanzierungswunsch.
export async function PruefungStep({
  draftId,
  draftData,
}: {
  draftId: string;
  draftData: WizardDraftData;
}) {
  const projekt = projektSchema.safeParse(draftData.projekt ?? {});
  const heizung = heizungSchema.safeParse(draftData.heizung ?? {});

  if (!projekt.success || !heizung.success) {
    return <IncompleteWarning draftId={draftId} />;
  }

  const pruefung = pruefungSchema.safeParse(draftData.pruefung ?? {});
  const financingRequested = pruefung.success ? pruefung.data.financingRequested : false;
  const subsidyRequested = projekt.data.requestSubsidy;

  const catalog = await prisma.productCatalog.findMany({ where: { validUntil: null } });

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

  // Förder-Workflow folgt in AP 2.1. Bis dahin ist der Subsidy-Abzug 0 und das Flag
  // erzeugt nur einen Hinweis im UI (FA-FOE-004 ist für Phase 2 spezifiziert).
  const eigenanteilCents = calculation.totalCents;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Die Installation ist für <span className="font-semibold text-night">{projekt.data.implementationWindow}</span> geplant.
      </div>

      <PositionsTable items={calculation.items} />

      <PriceBlock
        subtotalCents={calculation.subtotalCents}
        vatCents={calculation.vatCents}
        totalCents={calculation.totalCents}
        eigenanteilCents={eigenanteilCents}
        subsidyRequested={subsidyRequested}
      />

      <FinancingToggle checked={financingRequested} />
    </div>
  );
}

function PositionsTable({ items }: { items: ReturnType<typeof calculateOffer>["items"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-12 px-4 py-3">Pos.</th>
            <th className="px-4 py-3">Bezeichnung</th>
            <th className="w-20 px-4 py-3 text-right">Menge</th>
            <th className="w-32 px-4 py-3 text-right">Einzelpreis</th>
            <th className="w-32 px-4 py-3 text-right">Gesamt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((item, index) => (
            <tr key={item.sku}>
              <td className="px-4 py-3 align-top font-mono text-xs text-slate-500">{index + 1}</td>
              <td className="px-4 py-3 align-top">
                <p className="font-medium text-night">{item.label}</p>
                {item.description ? (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-xs text-slate-500">Details</summary>
                    <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                  </details>
                ) : null}
              </td>
              <td className="px-4 py-3 text-right align-top">{item.quantity}</td>
              <td className="px-4 py-3 text-right align-top">{formatCents(item.unitCents)}</td>
              <td className="px-4 py-3 text-right align-top font-medium text-night">
                {formatCents(item.totalCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriceBlock({
  subtotalCents,
  vatCents,
  totalCents,
  eigenanteilCents,
  subsidyRequested,
}: {
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  eigenanteilCents: number;
  subsidyRequested: boolean;
}) {
  return (
    <div className="rounded-2xl bg-night p-6 text-white">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Zwischensumme netto</span>
        <span>{formatCents(subtotalCents)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
        <span>Umsatzsteuer 19 %</span>
        <span>{formatCents(vatCents)}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xl font-semibold">
        <span>Gesamtsumme brutto</span>
        <span>{formatCents(totalCents)}</span>
      </div>
      <div className="mt-4 rounded-xl bg-copper/20 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-copper">Ihr Eigenanteil</span>
          <span className="text-lg font-semibold text-copper">{formatCents(eigenanteilCents)}</span>
        </div>
        {subsidyRequested ? (
          <p className="mt-2 text-xs text-copper/80">
            Förderung wurde beantragt — der finale Eigenanteil wird nach Bewilligung aktualisiert (AP 2.1).
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FinancingToggle({ checked }: { checked: boolean }) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
      <input
        type="checkbox"
        name="financingRequested"
        defaultChecked={checked}
        className="mt-1 h-4 w-4 rounded border-slate-300"
      />
      <span>
        <span className="font-medium text-night">Finanzierung erwünscht</span>
        <br />
        <span className="text-xs text-slate-500">
          Finanzierungs-Partner-Anbindung (FA-ANG-064) wird in Phase 2 integriert.
        </span>
      </span>
    </label>
  );
}

function IncompleteWarning({ draftId }: { draftId: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="font-medium text-amber-900">Projekt- oder Heizungsdaten unvollständig</p>
      <p className="mt-2 text-sm text-amber-800">
        Für die Preisberechnung werden die Schritte 4 und 5 vollständig benötigt.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/wizard/${draftId}/heizung`}
          className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-medium text-night ring-1 ring-amber-300"
        >
          Schritt 4 prüfen
        </Link>
        <Link
          href={`/wizard/${draftId}/projekt`}
          className="inline-flex h-10 items-center rounded-xl bg-copper px-4 text-sm font-medium text-night"
        >
          Schritt 5 prüfen
        </Link>
      </div>
    </div>
  );
}
