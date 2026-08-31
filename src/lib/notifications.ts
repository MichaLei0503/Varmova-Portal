import { getEmailProvider } from "@/lib/integrations/email";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://varmova-portal.vercel.app";

/**
 * Benachrichtigt den zugewiesenen Installationspartner über einen
 * verbindlich gewordenen Auftrag (nach digitaler Annahme durch den Kunden).
 * Empfänger: erster aktiver IP_ADMIN (sonst IP) der Organisation.
 */
export async function notifyInstallerAssigned(input: {
  ipOrgId: string;
  projectId: string;
  offerNumber: string | null;
}) {
  const installerUser = await prisma.user.findFirst({
    where: { organizationId: input.ipOrgId, isActive: true, role: { in: ["IP_ADMIN", "IP"] } },
    orderBy: { role: "desc" },
  });
  if (!installerUser) {
    console.warn(`[notify] Kein aktiver IP-Benutzer für Organisation ${input.ipOrgId}.`);
    return;
  }
  await getEmailProvider().send({
    to: installerUser.email,
    subject: `Neuer Varmi-Auftrag ${input.offerNumber ?? ""}`.trim(),
    bodyText: `Hallo ${installerUser.name},\n\nder Kunde hat das Angebot ${input.offerNumber ?? ""} verbindlich angenommen — der Auftrag ist Ihnen zugewiesen.\n\nProjekt: ${BASE_URL}/projects/${input.projectId}\n\nDort finden Sie Aufmaßdaten, Fotos und den Kundenkontakt für die Terminplanung.\n\nIhr Varmova Partner Portal`,
  });
}
