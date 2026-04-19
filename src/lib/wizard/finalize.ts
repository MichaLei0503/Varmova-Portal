import { NoteVisibility, OfferStatus, Prisma, WizardDraft } from "@prisma/client";
import { getEmailProvider } from "@/lib/integrations/email";
import { getPdfProvider } from "@/lib/integrations/pdf";
import { generateOfferNumber } from "@/lib/offer/offer-number";
import { prisma } from "@/lib/prisma";
import { calculateOffer } from "@/lib/pricing";
import { generateProjectNumber } from "@/lib/project";
import {
  auswahlSchema,
  hausSchema,
  heizungSchema,
  kundeSchema,
  projektSchema,
  WizardStepId,
} from "./steps";
import { WizardDraftData } from "./draft";

// Gültigkeit (FA-ANG-071): Standard 14 Tage ab Erstellung.
const OFFER_VALIDITY_DAYS = 14;
const VAT_RATE_PERCENT = 19;

export type FinalizeResult = {
  projectId: string;
  offerId: string;
  offerNumber: string;
  pdfUrl: string;
};

export class WizardIncompleteError extends Error {
  constructor(public readonly missingStep: WizardStepId, cause?: unknown) {
    super(`Wizard-Step "${missingStep}" ist unvollständig.`);
    if (cause !== undefined) (this as { cause?: unknown }).cause = cause;
  }
}

// Finalisierung: validiert alle Draft-Schritte strikt, erzeugt Customer + Project + Offer
// in einer Transaktion, ruft danach PDF- und E-Mail-Adapter und räumt den Draft ab.
// Side-Effects (PDF, Mail) laufen bewusst nach dem Commit — ein gescheiterter Mailversand
// soll das persistierte Angebot nicht zurückrollen.
export async function finalizeWizard(draft: WizardDraft): Promise<FinalizeResult> {
  const data = (draft.data as WizardDraftData) ?? {};

  const kunde = parseOrThrow("kunde", kundeSchema, data.kunde);
  parseOrThrow("haus", hausSchema, data.haus);
  const heizung = parseOrThrow("heizung", heizungSchema, data.heizung);
  const projekt = parseOrThrow("projekt", projektSchema, data.projekt);
  const auswahl = parseOrThrow("auswahl", auswahlSchema, data.auswahl);

  const catalog = await prisma.productCatalog.findMany({ where: { validUntil: null } });
  if (!catalog.length) {
    throw new Error("Kein aktiver Produktkatalog vorhanden.");
  }

  const calculation = calculateOffer(
    {
      scope: projekt.scope,
      varmiSku: projekt.varmiSku,
      bufferSku: projekt.bufferSku,
      newThermostats: projekt.newThermostats,
      thermostatSku: projekt.thermostatSku,
      replaceHeaters: projekt.replaceHeaters,
      heaterReplacementSku: projekt.heaterReplacementSku,
      newMeterCabinet: projekt.newMeterCabinet,
      currentHeatingType: heizung.currentHeatingType,
    },
    catalog,
  );

  const committed = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        salutation: kunde.salutation,
        firstName: kunde.firstName,
        lastName: kunde.lastName,
        email: kunde.email,
        phone: kunde.phone ?? null,
        street: kunde.projectStreet ?? kunde.street,
        houseNumber: kunde.projectHouseNumber ?? kunde.houseNumber,
        postalCode: kunde.projectPostalCode ?? kunde.postalCode,
        city: kunde.projectCity ?? kunde.city,
      },
    });

    const projectNumber = await generateProjectNumber(tx);
    const project = await tx.project.create({
      data: {
        projectNumber,
        buildingType: data.haus?.buildingType as string,
        constructionYear: Number(data.haus?.constructionYear),
        livingAreaSqm: Number(data.haus?.livingAreaSqm),
        units: Number(data.haus?.units ?? 1),
        bathrooms: Number(data.haus?.bathrooms ?? 1),
        bathtubs: Number(data.haus?.bathtubs ?? 0),
        showers: Number(data.haus?.showers ?? 1),
        currentHeatingType: heizung.currentHeatingType,
        currentHeatingInstallYear: heizung.currentHeatingInstallYear ?? null,
        currentHeatingSystem: heizung.currentHeatingSystem ?? null,
        currentHeatingLocation: heizung.currentHeatingLocation ?? null,
        annualEnergyConsumption: heizung.annualEnergyConsumption ?? null,
        heatingCircuits: heizung.heatingCircuits ?? null,
        heaterTypes: heizung.heaterTypes,
        hasPotentialEqualization: heizung.hasPotentialEqualization,
        hasSolarThermal: heizung.hasSolarThermal,
        hasCirculationPump: heizung.hasCirculationPump,
        scope: projekt.scope,
        varmiSku: projekt.varmiSku,
        bufferSku: projekt.bufferSku ?? null,
        newThermostats: projekt.newThermostats,
        thermostatSku: projekt.thermostatSku ?? null,
        replaceHeaters: projekt.replaceHeaters,
        heaterReplacementSku: projekt.heaterReplacementSku ?? null,
        newMeterCabinet: projekt.newMeterCabinet,
        requestSubsidy: projekt.requestSubsidy,
        implementationWindow: projekt.implementationWindow,
        customerId: customer.id,
        vpOrgId: draft.vpOrgId,
        ipOrgId: auswahl.ipOrgId,
        createdById: draft.userId,
      },
    });

    const offerNumber = await generateOfferNumber(tx);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + OFFER_VALIDITY_DAYS);

    const offer = await tx.offer.create({
      data: {
        offerNumber,
        projectId: project.id,
        status: OfferStatus.OFFER_CREATED,
        vatRatePercent: VAT_RATE_PERCENT,
        subtotalCents: calculation.subtotalCents,
        vatCents: calculation.vatCents,
        totalCents: calculation.totalCents,
        priceSnapshot: calculation.snapshot as Prisma.InputJsonValue,
        plannedWeek: projekt.implementationWindow,
        validUntil,
        hintText:
          "Angebot aus dem 8-Schritt-Wizard generiert. Preise und Konfiguration sind beim Erstellen eingefroren (Snapshot).",
        items: {
          create: calculation.items.map((item) => ({
            sku: item.sku,
            label: item.label,
            description: item.description ?? null,
            quantity: item.quantity,
            unitCents: item.unitCents,
            totalCents: item.totalCents,
            sortOrder: item.sortOrder,
          })),
        },
      },
    });

    await tx.auditLog.create({
      data: {
        entity: "Offer",
        entityId: offer.id,
        action: "offer:created-from-wizard",
        actorId: draft.userId,
        diff: { offerNumber, totalCents: calculation.totalCents } as Prisma.InputJsonValue,
      },
    });

    await tx.note.create({
      data: {
        projectId: project.id,
        authorId: draft.userId,
        visibility: NoteVisibility.INTERNAL,
        content: "Projekt und Angebot über den Wizard angelegt.",
      },
    });

    await tx.wizardDraft.delete({ where: { id: draft.id } });

    return { projectId: project.id, offerId: offer.id, offerNumber, customerEmail: customer.email };
  });

  const pdfProvider = getPdfProvider();
  const emailProvider = getEmailProvider();

  // Post-Commit-Side-Effects: Fehlschlag loggen, aber nicht das Angebot zurückrollen.
  let pdfUrl = "";
  try {
    const pdf = await pdfProvider.generateOfferPdf({ offerId: committed.offerId, offerNumber: committed.offerNumber });
    pdfUrl = pdf.url;
    await emailProvider.send({
      to: committed.customerEmail,
      subject: `Ihr Varmi-Angebot ${committed.offerNumber}`,
      bodyText: `Sehr geehrte Kundin, sehr geehrter Kunde,\n\nIhr persönliches Angebot ${committed.offerNumber} steht zur Prüfung und digitalen Unterzeichnung bereit:\n${pdfUrl}\n\nMit freundlichen Grüßen\nIhr Varmova-Team`,
    });
  } catch (error) {
    console.warn("[finalize] post-commit side-effect failed", error);
  }

  return {
    projectId: committed.projectId,
    offerId: committed.offerId,
    offerNumber: committed.offerNumber,
    pdfUrl,
  };
}

function parseOrThrow<T>(step: WizardStepId, schema: { safeParse: (v: unknown) => { success: boolean; data?: T } }, value: unknown): T {
  const result = schema.safeParse(value ?? {});
  if (!result.success || result.data === undefined) {
    throw new WizardIncompleteError(step);
  }
  return result.data;
}
