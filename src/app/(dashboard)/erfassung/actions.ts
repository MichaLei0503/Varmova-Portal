"use server";

import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { LeadSource, Role } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CAPTURE_ROLES: Role[] = ["VP", "VP_ADMIN", "VARMOVA_ADMIN"];

/**
 * Schnellerfassung vor Ort (FA-CRM): Aufmaß-Basisdaten + Fotos in unter zwei
 * Minuten. Legt einen Lead an — das vollständige Angebot entsteht danach im
 * 8-Schritte-Wizard, der Kunde nimmt es digital an, erst dann geht der
 * Auftrag an den Monteur.
 */
export async function quickCaptureAction(formData: FormData) {
  const session = await requireAuth();
  if (!CAPTURE_ROLES.includes(session.user.role)) throw new Error("Keine Berechtigung.");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const photoUrls: string[] = [];
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files.slice(0, 20)) {
    try {
      const blob = await put(
        `leads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`,
        file,
        { access: "public" },
      );
      photoUrls.push(blob.url);
    } catch (error) {
      console.warn("[erfassung] Foto-Upload fehlgeschlagen", error);
    }
  }

  const num = (key: string) => {
    const v = Number(String(formData.get(key) ?? "").trim());
    return Number.isFinite(v) && v > 0 ? Math.round(v) : null;
  };

  const lead = await prisma.lead.create({
    data: {
      name,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      postalCode: String(formData.get("postalCode") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || null,
      currentHeating: String(formData.get("currentHeating") ?? "").trim() || null,
      timeframe: String(formData.get("timeframe") ?? "").trim() || null,
      buildingYear: num("buildingYear"),
      livingAreaSqm: num("livingAreaSqm"),
      message: String(formData.get("message") ?? "").trim() || null,
      photoUrls,
      source: LeadSource.MANUELL,
      status: "QUALIFIZIERT",
    },
  });

  redirect(`/leads?erfasst=${lead.id}`);
}
