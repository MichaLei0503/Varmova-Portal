import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LeadSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Meta Lead Ads Webhook (FA-CRM).
 *
 * GET  — Webhook-Verifizierung durch Meta (hub.challenge-Handshake).
 * POST — leadgen-Events: pro Lead-ID werden die Formularantworten über die
 *        Graph API geladen und als Lead gespeichert (idempotent über metaLeadId).
 *
 * Benötigte Umgebungsvariablen:
 *   META_VERIFY_TOKEN — frei gewähltes Geheimnis für den GET-Handshake
 *   META_ACCESS_TOKEN — Page Access Token mit leads_retrieval
 *   META_APP_SECRET   — optional; wenn gesetzt, wird X-Hub-Signature-256 geprüft
 */

const GRAPH = "https://graph.facebook.com/v21.0";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  const appSecret = process.env.META_APP_SECRET;
  if (appSecret) {
    const signature = request.headers.get("x-hub-signature-256") ?? "";
    const expected =
      "sha256=" + crypto.createHmac("sha256", appSecret).update(body).digest("hex");
    const valid =
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  const leadgenIds: string[] = [];
  const entries = (payload as { entry?: Array<{ changes?: Array<{ field?: string; value?: { leadgen_id?: string } }> }> }).entry ?? [];
  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      if (change.field === "leadgen" && change.value?.leadgen_id) {
        leadgenIds.push(String(change.value.leadgen_id));
      }
    }
  }

  // Meta erwartet schnell eine 200 — Fehler einzelner Leads loggen, nie werfen.
  for (const leadId of leadgenIds) {
    try {
      await importMetaLead(leadId);
    } catch (error) {
      console.error(`[meta-leads] Import fehlgeschlagen für ${leadId}:`, error);
    }
  }

  return NextResponse.json({ received: leadgenIds.length });
}

async function importMetaLead(leadId: string) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) {
    console.error("[meta-leads] META_ACCESS_TOKEN fehlt — Lead wird nur als Referenz gespeichert.");
    await prisma.lead.upsert({
      where: { metaLeadId: leadId },
      update: {},
      create: { name: `Meta-Lead ${leadId}`, source: LeadSource.META, metaLeadId: leadId },
    });
    return;
  }

  const res = await fetch(
    `${GRAPH}/${leadId}?fields=field_data,form_id,created_time&access_token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Graph API ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    field_data?: Array<{ name?: string; values?: string[] }>;
    form_id?: string;
  };

  const fields: Record<string, string> = {};
  for (const f of data.field_data ?? []) {
    if (f.name) fields[f.name.toLowerCase()] = (f.values ?? []).join(", ");
  }
  const pick = (...keys: string[]) => {
    for (const k of keys) if (fields[k]) return fields[k];
    // Teiltreffer für individuell benannte Formularfragen
    for (const key of Object.keys(fields)) {
      if (keys.some((k) => key.includes(k))) return fields[key];
    }
    return undefined;
  };

  const name =
    pick("full_name", "name") ??
    [pick("first_name", "vorname"), pick("last_name", "nachname")].filter(Boolean).join(" ") ??
    `Meta-Lead ${leadId}`;

  await prisma.lead.upsert({
    where: { metaLeadId: leadId },
    update: {},
    create: {
      name: name || `Meta-Lead ${leadId}`,
      email: pick("email", "e-mail"),
      phone: pick("phone_number", "phone", "telefon"),
      city: pick("city", "ort", "stadt", "wohnort"),
      postalCode: pick("zip_code", "zip", "plz", "postal_code", "postleitzahl"),
      currentHeating: pick("aktuelle_heizung", "heizung", "heizsystem", "current_heating"),
      timeframe: pick("realisierungszeitraum", "zeitraum", "wann", "timeframe", "umsetzung"),
      source: LeadSource.META,
      metaLeadId: leadId,
      metaFormId: data.form_id,
      raw: fields,
    },
  });
}
