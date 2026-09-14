"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LeadSource, LeadStatus, Role } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CRM_ROLES: Role[] = ["VP", "VP_ADMIN", "VARMOVA_ADMIN", "VARMOVA_PRODUCTION"];

async function requireCrmAccess() {
  const session = await requireAuth();
  if (!CRM_ROLES.includes(session.user.role)) {
    throw new Error("Keine Berechtigung für das Lead-CRM.");
  }
  return session;
}

export async function createLeadAction(formData: FormData) {
  await requireCrmAccess();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.lead.create({
    data: {
      name,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || null,
      postalCode: String(formData.get("postalCode") ?? "").trim() || null,
      currentHeating: String(formData.get("currentHeating") ?? "").trim() || null,
      timeframe: String(formData.get("timeframe") ?? "").trim() || null,
      message: String(formData.get("message") ?? "").trim() || null,
      source: LeadSource.MANUELL,
    },
  });
  revalidatePath("/leads");
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireCrmAccess();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(status in LeadStatus)) return;

  await prisma.lead.update({ where: { id }, data: { status: status as LeadStatus } });
  revalidatePath("/leads");
}

/**
 * Holt Leads aktiv aus Meta ab (Pull). Funktioniert auch rückwirkend für
 * Leads, die vor der Webhook-Einrichtung eingegangen sind.
 */
export async function importMetaLeadsAction() {
  await requireCrmAccess();
  try {
    const { importAllMetaLeads } = await import("@/lib/meta-leads");
    const result = await importAllMetaLeads();
    revalidatePath("/leads");
    redirect(
      `/leads?import=ok&neu=${result.imported}&gesamt=${result.seen}&formulare=${result.forms}`,
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error; // Next-Redirect
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    console.error("[meta-import]", message);
    redirect(`/leads?import=fehler&meldung=${encodeURIComponent(message.slice(0, 180))}`);
  }
}
