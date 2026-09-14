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

/** Frageschlüssel → exakter Fragetext aus dem Meta-Formular. */
export type FormLabels = Record<string, string>;

/** Aus "wie_viele_monteure_sind_bei_ihnen_im_einsatz" wird lesbarer Text. */
function humanizeKey(key: string): string {
  const text = key.replace(/_/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export type UpsertOutcome = "neu" | "aktualisiert" | "uebersprungen";

/**
 * Legt einen Lead aus Graph-API-Daten an oder frischt einen vorhandenen auf.
 * `labels` liefert die Originalfragen des Formulars; fehlen sie, wird der
 * Feldschlüssel lesbar gemacht.
 *
 * Der Bearbeitungsstatus bleibt beim Aktualisieren unangetastet — nur die
 * Formulardaten kommen frisch aus Meta.
 */
export async function upsertGraphLead(
  lead: GraphLead,
  labels: FormLabels = {},
): Promise<UpsertOutcome> {
  const leadId = lead.id;
  if (!leadId) return "uebersprungen";

  const existing = await prisma.lead.findUnique({
    where: { metaLeadId: leadId },
    select: { id: true },
  });

  // Antworten in Formularreihenfolge behalten — das ist die Ansicht im CRM.
  const answers: Array<{ key: string; label: string; value: string }> = [];
  const fields: Record<string, string> = {};
  for (const f of lead.field_data ?? []) {
    if (!f.name) continue;
    const key = f.name.toLowerCase();
    const value = (f.values ?? []).join(", ");
    fields[key] = value;
    answers.push({ key, label: labels[key] ?? humanizeKey(f.name), value });
  }

  // Jedes Feld wird nur einmal vergeben, sonst landet z. B. "company_name"
  // über den Teiltreffer "name" fälschlich als Personenname im CRM.
  const used = new Set<string>();
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      if (fields[k] && !used.has(k)) {
        used.add(k);
        return fields[k];
      }
    }
    // Teiltreffer für individuell benannte Formularfragen
    for (const key of Object.keys(fields)) {
      if (used.has(key) || !fields[key]) continue;
      if (keys.some((k) => key.includes(k))) {
        used.add(key);
        return fields[key];
      }
    }
    return undefined;
  };

  // Reihenfolge ist wichtig: erst Firma, dann Person.
  const company = pick("company_name", "firma", "unternehmen", "betriebsname");
  const companyType = pick(
    "betriebstyp",
    "beschreibt_ihren_betrieb",
    "gewerk",
    "branche",
    "company_type",
  );
  const fullName =
    pick("full_name", "vollstaendiger_name", "vollständiger_name", "ansprechpartner") ||
    [pick("first_name", "vorname"), pick("last_name", "nachname")]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    pick("name");

  const data = {
    name: fullName || company || `Meta-Lead ${leadId}`,
    email: pick("email", "e-mail") ?? null,
    phone: pick("phone_number", "phone", "telefon") ?? null,
    city: pick("city", "ort", "stadt", "wohnort") ?? null,
    postalCode: pick("zip_code", "zip", "plz", "postal_code", "postleitzahl") ?? null,
    currentHeating: pick("aktuelle_heizung", "heizung", "heizsystem", "current_heating") ?? null,
    timeframe: pick("realisierungszeitraum", "zeitraum", "wann", "timeframe", "umsetzung") ?? null,
    segment: resolveSegment(lead.form_id, company, companyType),
    company: company ?? null,
    metaFormId: lead.form_id ?? null,
    raw: answers,
  };

  if (existing) {
    await prisma.lead.update({ where: { id: existing.id }, data });
    return "aktualisiert";
  }

  await prisma.lead.create({
    data: {
      ...data,
      source: LeadSource.META,
      metaLeadId: leadId,
      createdAt: lead.created_time ? new Date(lead.created_time) : undefined,
    },
  });
  return "neu";
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
  const graphLead = (await res.json()) as GraphLead;
  const labels = graphLead.form_id ? await fetchFormLabels(graphLead.form_id, token) : {};
  await upsertGraphLead(graphLead, labels);
}

/** Originalfragen eines Formulars laden (Schlüssel → Fragetext). */
async function fetchFormLabels(formId: string, token: string): Promise<FormLabels> {
  try {
    const res = await fetch(
      `${GRAPH}/${formId}?fields=questions{key,label}&access_token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return {};
    const data = (await res.json()) as { questions?: Array<{ key?: string; label?: string }> };
    return toLabelMap(data.questions);
  } catch {
    return {};
  }
}

function toLabelMap(questions: Array<{ key?: string; label?: string }> | undefined): FormLabels {
  const map: FormLabels = {};
  for (const q of questions ?? []) {
    if (q.key && q.label) map[q.key.toLowerCase()] = q.label;
  }
  return map;
}

export type ImportResult = {
  imported: number;
  updated: number;
  seen: number;
  forms: number;
};

/** Graph-Fehler in eine Meldung übersetzen, die im Portal weiterhilft. */
async function graphError(step: string, res: Response): Promise<string> {
  const body = await res.text();
  let detail = body.slice(0, 200);
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string; code?: number } };
    if (parsed.error?.message) detail = parsed.error.message;
    if (parsed.error?.code === 190) {
      return `${step} fehlgeschlagen: Der Meta-Token ist abgelaufen oder ungültig. Bitte in Vercel einen neuen META_ACCESS_TOKEN hinterlegen.`;
    }
    if (parsed.error?.code === 200 || parsed.error?.code === 10) {
      return `${step} fehlgeschlagen: Dem Token fehlt die Berechtigung leads_retrieval. In der Meta-App den Anwendungsfall "Erfassung und Verwaltung von Ad-Leads" hinzufügen und den Token neu erzeugen.`;
    }
  } catch {
    // Kein JSON — Rohtext verwenden.
  }
  return `${step} fehlgeschlagen: ${detail}`;
}

/**
 * Holt alle Leads der verbundenen Seite aktiv ab (Pull statt Push).
 * Ohne META_PAGE_ID werden die Seiten des Tokens automatisch ermittelt.
 */
export async function importAllMetaLeads(limitPerForm = 200): Promise<ImportResult> {
  const token = process.env.META_ACCESS_TOKEN?.trim();
  if (!token) {
    // Nur Namen melden, nie Werte — hilft beim Unterscheiden von
    // "gar nicht gesetzt" und "gesetzt, aber Deploy noch ohne Variable".
    const vorhanden = Object.keys(process.env)
      .filter((k) => k.startsWith("META_") && process.env[k])
      .sort();
    const hinweis =
      vorhanden.length > 0
        ? `Gefunden wurden nur: ${vorhanden.join(", ")}.`
        : "Es ist keine einzige META_-Variable sichtbar.";
    throw new Error(
      `META_ACCESS_TOKEN ist in diesem Deployment nicht gesetzt. ${hinweis} ` +
        "Variable in Vercel fuer Production anlegen und danach neu deployen — " +
        "bestehende Deployments uebernehmen neue Variablen nicht automatisch.",
    );
  }

  const pages = await resolvePages(token);
  if (pages.length === 0) {
    throw new Error("Keine Facebook-Seite gefunden. META_PAGE_ID setzen oder Token prüfen.");
  }

  let imported = 0;
  let updated = 0;
  let seen = 0;
  let forms = 0;

  for (const page of pages) {
    // Leads liefert Meta zuverlässig nur gegen den Page Access Token aus.
    const pageToken = page.token ?? token;
    const formRes = await fetch(
      `${GRAPH}/${page.id}/leadgen_forms?fields=id,name,questions{key,label}&limit=100&access_token=${encodeURIComponent(pageToken)}`,
      { cache: "no-store" },
    );
    if (!formRes.ok) throw new Error(await graphError("Formulare laden", formRes));
    const formData = (await formRes.json()) as {
      data?: Array<{ id: string; questions?: Array<{ key?: string; label?: string }> }>;
    };

    for (const form of formData.data ?? []) {
      forms += 1;
      // Originalfragen des Formulars — damit im CRM exakt der Wortlaut steht.
      const labels = toLabelMap(form.questions);
      let url:
        | string
        | undefined = `${GRAPH}/${form.id}/leads?fields=id,form_id,created_time,field_data&limit=${limitPerForm}&access_token=${encodeURIComponent(pageToken)}`;

      // Graph paginiert; wir folgen den next-Links bis zum Ende.
      while (url) {
        const leadRes = await fetch(url, { cache: "no-store" });
        if (!leadRes.ok) throw new Error(await graphError("Leads laden", leadRes));
        const payload = (await leadRes.json()) as {
          data?: GraphLead[];
          paging?: { next?: string };
        };
        for (const lead of payload.data ?? []) {
          seen += 1;
          const outcome = await upsertGraphLead(lead, labels);
          if (outcome === "neu") imported += 1;
          else if (outcome === "aktualisiert") updated += 1;
        }
        url = payload.paging?.next;
      }
    }
  }

  return { imported, updated, seen, forms };
}

type ResolvedPage = { id: string; token?: string };

/**
 * Ermittelt die Seiten samt zugehörigem Page Access Token. Der Systemnutzer-
 * Token darf Leads nicht immer selbst lesen — der Page Token schon.
 */
async function resolvePages(token: string): Promise<ResolvedPage[]> {
  const configured = (process.env.META_PAGE_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return Promise.all(
      configured.map(async (id) => ({ id, token: await fetchPageToken(id, token) })),
    );
  }

  const res = await fetch(
    `${GRAPH}/me/accounts?fields=id,name,access_token&limit=50&access_token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { data?: Array<{ id: string; access_token?: string }> };
  return (data.data ?? []).map((p) => ({ id: p.id, token: p.access_token }));
}

/** Page Access Token nachladen; bei Fehlschlag wird der Ausgangstoken genutzt. */
async function fetchPageToken(pageId: string, token: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${GRAPH}/${pageId}?fields=access_token&access_token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return undefined;
    return ((await res.json()) as { access_token?: string }).access_token;
  } catch {
    return undefined;
  }
}
