import { LeadSegment, LeadSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Gemeinsame Import-Logik für Meta Lead Ads.
 *
 * Zwei Wege führen hier herein:
 *  - Webhook (/api/leads/meta): Meta meldet jeden neuen Lead sofort.
 *  - Abruf (/api/leads/meta/import): das Portal holt Leads aktiv über die
 *    Graph API — funktioniert auch rückwirkend und ohne Webhook-Setup.
 *
 * Beide legen Leads idempotent über metaLeadId an (kein Duplikat bei
 * Wiederholungen oder wenn beide Wege parallel laufen).
 */

export const GRAPH = "https://graph.facebook.com/v21.0";

type GraphLead = {
  id?: string;
  form_id?: string;
  created_time?: string;
  field_data?: Array<{ name?: string; values?: string[] }>;
};

/** Segment bestimmen: Formular-ID → Inhalt → Default. */
export function resolveSegment(
  formId: string | undefined,
  company: string | undefined,
  companyType: string | undefined,
): LeadSegment {
  const ids = (value: string | undefined) =>
    (value ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  if (formId) {
    if (ids(process.env.META_B2B_FORM_IDS).includes(formId)) return LeadSegment.B2B;
    if (ids(process.env.META_B2C_FORM_IDS).includes(formId)) return LeadSegment.B2C;
  }
  if (company || companyType) return LeadSegment.B2B;
  return process.env.META_DEFAULT_SEGMENT?.toUpperCase() === "B2C"
    ? LeadSegment.B2C
    : LeadSegment.B2B;
}

/** Legt einen Lead aus Graph-API-Daten an. Liefert true, wenn er neu war. */
export async function upsertGraphLead(lead: GraphLead): Promise<boolean> {
  const leadId = lead.id;
  if (!leadId) return false;

  const existing = await prisma.lead.findUnique({
    where: { metaLeadId: leadId },
    select: { id: true },
  });
  if (existing) return false;

  const fields: Record<string, string> = {};
  for (const f of lead.field_data ?? []) {
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

  const fullName =
    pick("full_name", "name") ||
    [pick("first_name", "vorname"), pick("last_name", "nachname")].filter(Boolean).join(" ");
  const company = pick("company_name", "firma", "unternehmen", "betrieb");
  const companyType = pick("betriebstyp", "betrieb_beschreibt", "gewerk", "branche", "company_type");

  await prisma.lead.create({
    data: {
      name: fullName || `Meta-Lead ${leadId}`,
      email: pick("email", "e-mail"),
      phone: pick("phone_number", "phone", "telefon"),
      city: pick("city", "ort", "stadt", "wohnort"),
      postalCode: pick("zip_code", "zip", "plz", "postal_code", "postleitzahl"),
      currentHeating: pick("aktuelle_heizung", "heizung", "heizsystem", "current_heating"),
      timeframe: pick("realisierungszeitraum", "zeitraum", "wann", "timeframe", "umsetzung"),
      segment: resolveSegment(lead.form_id, company, companyType),
      company: company ?? null,
      source: LeadSource.META,
      metaLeadId: leadId,
      metaFormId: lead.form_id ?? null,
      raw: fields,
      createdAt: lead.created_time ? new Date(lead.created_time) : undefined,
    },
  });
  return true;
}

/** Einen einzelnen Lead über seine ID nachladen (Webhook-Weg). */
export async function importMetaLeadById(leadId: string): Promise<void> {
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
    `${GRAPH}/${leadId}?fields=id,field_data,form_id,created_time&access_token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Graph API ${res.status}: ${await res.text()}`);
  await upsertGraphLead((await res.json()) as GraphLead);
}

export type ImportResult = { imported: number; seen: number; forms: number };

/**
 * Holt alle Leads der verbundenen Seite aktiv ab (Pull statt Push).
 * Ohne META_PAGE_ID werden die Seiten des Tokens automatisch ermittelt.
 */
export async function importAllMetaLeads(limitPerForm = 200): Promise<ImportResult> {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) throw new Error("META_ACCESS_TOKEN ist nicht gesetzt.");

  const pageIds = await resolvePageIds(token);
  if (pageIds.length === 0) {
    throw new Error("Keine Facebook-Seite gefunden. META_PAGE_ID setzen oder Token prüfen.");
  }

  let imported = 0;
  let seen = 0;
  let forms = 0;

  for (const pageId of pageIds) {
    const formRes = await fetch(
      `${GRAPH}/${pageId}/leadgen_forms?fields=id,name&limit=100&access_token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    if (!formRes.ok) throw new Error(`Formulare laden fehlgeschlagen: ${await formRes.text()}`);
    const formData = (await formRes.json()) as { data?: Array<{ id: string }> };

    for (const form of formData.data ?? []) {
      forms += 1;
      let url:
        | string
        | undefined = `${GRAPH}/${form.id}/leads?fields=id,form_id,created_time,field_data&limit=${limitPerForm}&access_token=${encodeURIComponent(token)}`;

      // Graph paginiert; wir folgen den next-Links bis zum Ende.
      while (url) {
        const leadRes = await fetch(url, { cache: "no-store" });
        if (!leadRes.ok) throw new Error(`Leads laden fehlgeschlagen: ${await leadRes.text()}`);
        const payload = (await leadRes.json()) as {
          data?: GraphLead[];
          paging?: { next?: string };
        };
        for (const lead of payload.data ?? []) {
          seen += 1;
          if (await upsertGraphLead(lead)) imported += 1;
        }
        url = payload.paging?.next;
      }
    }
  }

  return { imported, seen, forms };
}

async function resolvePageIds(token: string): Promise<string[]> {
  const configured = (process.env.META_PAGE_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (configured.length > 0) return configured;

  const res = await fetch(
    `${GRAPH}/me/accounts?fields=id,name&limit=50&access_token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { data?: Array<{ id: string }> };
  return (data.data ?? []).map((p) => p.id);
}
