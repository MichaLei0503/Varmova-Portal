import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { LeadSegment, LeadSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendDoiMail, sendTeamNotification } from "@/lib/leadMail";

/**
 * Öffentliche Lead-Annahme des Varmova-Funnels (FA-FUNNEL).
 *
 * POST /api/leads/funnel — legt den Lead im CRM an (Status NEU, Source FUNNEL)
 * und versendet die Double-Opt-in-Mail. Der Lead ist damit sofort im
 * Partnerportal sichtbar; die werbliche Kontaktaufnahme erfolgt erst nach
 * Bestätigung (doiConfirmedAt).
 */

const payloadSchema = z.object({
  segment: z.enum(["B2C", "B2B"]),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  postalCode: z.string().trim().max(10).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  consent: z.literal(true),
  // B2C-Qualifizierung
  buildingType: z.string().trim().max(80).optional().default(""),
  currentHeating: z.string().trim().max(80).optional().default(""),
  hasPv: z.string().trim().max(30).optional().default(""),
  timeframe: z.string().trim().max(80).optional().default(""),
  // B2B-Qualifizierung
  company: z.string().trim().max(160).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
  companyType: z.string().trim().max(80).optional().default(""),
  contactRole: z.string().trim().max(80).optional().default(""),
  projectsPerYear: z.string().trim().max(40).optional().default(""),
  // Honeypot — muss leer bleiben (Bots füllen es aus)
  fax: z.string().max(0).optional().default(""),
});

// Best-effort-Rate-Limit pro IP (in-memory; pro Serverless-Instanz).
const hits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 8;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function summarize(d: z.infer<typeof payloadSchema>): string {
  const lines: string[] = [];
  if (d.segment === "B2C") {
    if (d.buildingType) lines.push(`Gebäude: ${d.buildingType}`);
    if (d.currentHeating) lines.push(`Aktuelle Heizung: ${d.currentHeating}`);
    if (d.hasPv) lines.push(`PV-Anlage: ${d.hasPv}`);
    if (d.timeframe) lines.push(`Zeitraum: ${d.timeframe}`);
  } else {
    if (d.company) lines.push(`Firma: ${d.company}`);
    if (d.companyType) lines.push(`Betriebstyp: ${d.companyType}`);
    if (d.contactRole) lines.push(`Rolle: ${d.contactRole}`);
    if (d.projectsPerYear) lines.push(`Heizungs-/Energieprojekte pro Jahr: ${d.projectsPerYear}`);
    if (d.website) lines.push(`Website: ${d.website}`);
  }
  if (d.message) lines.push(`Nachricht: ${d.message}`);
  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const d = parsed.data;

  // Honeypot getroffen → Bot. Bewusst 200 zurückgeben, nichts speichern.
  if (d.fax !== "") {
    return NextResponse.json({ ok: true });
  }

  const now = new Date();
  const lead = await prisma.lead.create({
    data: {
      name: `${d.firstName} ${d.lastName}`.trim(),
      email: d.email,
      phone: d.phone || null,
      postalCode: d.postalCode || null,
      city: d.city || null,
      currentHeating: d.currentHeating || null,
      timeframe: d.timeframe || null,
      message: summarize(d) || null,
      source: LeadSource.FUNNEL,
      segment: d.segment === "B2B" ? LeadSegment.B2B : LeadSegment.B2C,
      company: d.company || null,
      website: d.website || null,
      contactRole: d.contactRole || null,
      buildingType: d.buildingType || null,
      hasPv: d.hasPv || null,
      consentAt: now,
      raw: {
        funnel: parsed.data,
        ip,
        userAgent: request.headers.get("user-agent") ?? null,
        submittedAt: now.toISOString(),
      },
    },
  });

  const doi = await sendDoiMail({ to: d.email, firstName: d.firstName, leadId: lead.id });
  if (doi.sent) {
    await prisma.lead.update({ where: { id: lead.id }, data: { doiSentAt: new Date() } });
  }

  // Interne Benachrichtigung ist best effort — Fehler dürfen den Funnel nie brechen.
  sendTeamNotification({
    leadId: lead.id,
    segment: d.segment,
    name: lead.name,
    email: d.email,
    summary: summarize(d),
  }).catch((err) => console.error("[funnel] Team-Benachrichtigung fehlgeschlagen:", err));

  return NextResponse.json({ ok: true, doiSent: doi.sent });
}
