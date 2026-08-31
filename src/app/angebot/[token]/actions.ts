"use server";

import { revalidatePath } from "next/cache";
import { OfferStatus } from "@prisma/client";
import { getEmailProvider } from "@/lib/integrations/email";
import { notifyInstallerAssigned } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

/**
 * Digitale Annahme des Angebots durch den Kunden (Klick-Signatur, FA-ANG-080).
 * Öffentlich über den unguessbaren signingToken — keine Session nötig.
 */
export async function signOfferAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const signerName = String(formData.get("signerName") ?? "").trim();
  const accepted = formData.get("accept") === "on";
  if (!token || signerName.length < 3 || !accepted) return;

  const offer = await prisma.offer.findUnique({
    where: { signingToken: token },
    include: { project: { include: { customer: true } } },
  });
  if (!offer || offer.signedAt) return;
  if (offer.validUntil && offer.validUntil < new Date()) return;

  await prisma.offer.update({
    where: { id: offer.id },
    data: {
      signedAt: new Date(),
      signatureProvider: "click-signature",
      signatureRef: signerName,
      status: OfferStatus.INSTALLER_ASSIGNED,
    },
  });

  // Side-Effects nach der Annahme: Fehler loggen, Annahme nie zurückrollen.
  try {
    if (offer.project.ipOrgId) {
      await notifyInstallerAssigned({
        ipOrgId: offer.project.ipOrgId,
        projectId: offer.projectId,
        offerNumber: offer.offerNumber,
      });
    }
    await getEmailProvider().send({
      to: offer.project.customer.email,
      subject: `Auftragsbestätigung ${offer.offerNumber ?? ""}`.trim(),
      bodyText: `Sehr geehrte Kundin, sehr geehrter Kunde,\n\nvielen Dank — Sie haben das Angebot ${offer.offerNumber ?? ""} verbindlich angenommen (digital signiert von: ${signerName}).\n\nIhr Installationsbetrieb meldet sich zur Terminplanung bei Ihnen.\n\nMit freundlichen Grüßen\nIhr Varmova-Team`,
    });
  } catch (error) {
    console.warn("[sign] Benachrichtigung nach Annahme fehlgeschlagen", error);
  }

  revalidatePath(`/angebot/${token}`);
}
