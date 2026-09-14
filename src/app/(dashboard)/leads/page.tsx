import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { redirect } from "next/navigation";
import { LeadSegment, LeadSource, LeadStatus, Role } from "@prisma/client";
import { PageHeader, Card, CardTitle, Button, Input } from "@/components/ui";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLeadAction, importMetaLeadsAction, updateLeadStatusAction } from "./actions";

const CRM_ROLES: Role[] = ["VP", "VP_ADMIN", "VARMOVA_ADMIN", "VARMOVA_PRODUCTION"];

const STATUS_LABEL: Record<LeadStatus, string> = {
  NEU: "Neu",
  KONTAKTIERT: "Kontaktiert",
  QUALIFIZIERT: "Qualifiziert",
  TERMIN_VEREINBART: "Termin vereinbart",
  GEWONNEN: "Gewonnen",
  VERLOREN: "Verloren",
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  MANUELL: "Manuell",
  META: "Meta Ads",
  WEBSEITE: "Webseite",
  EMPFEHLUNG: "Empfehlung",
  FUNNEL: "Funnel",
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  NEU: "bg-copper/15 text-[#8a5a2a]",
  KONTAKTIERT: "bg-slate-100 text-slate-700",
  QUALIFIZIERT: "bg-sky-100 text-sky-800",
  TERMIN_VEREINBART: "bg-indigo-100 text-indigo-800",
  GEWONNEN: "bg-emerald-100 text-emerald-800",
  VERLOREN: "bg-rose-100 text-rose-700",
};

type Answer = { key: string; label: string; value: string };

/**
 * Formularantworten aus dem Lead lesen. Neue Meta-Importe speichern eine
 * geordnete Liste mit Originalfrage; ältere Datensätze eine flache Map.
 */
function readAnswers(raw: unknown): Answer[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (a): a is Answer =>
        !!a && typeof a === "object" && typeof (a as Answer).value === "string",
    );
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) => ({
      key,
      label: key.replace(/_/g, " "),
      value: String(value ?? ""),
    }));
  }
  return [];
}

const TABS = [
  { key: "alle", label: "Alle" },
  { key: "b2b", label: "B2B" },
  { key: "b2c", label: "B2C" },
] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string; import?: string; neu?: string; aktualisiert?: string; gesamt?: string; formulare?: string; meldung?: string }>;
}) {
  const session = await requireAuth();
  if (!CRM_ROLES.includes(session.user.role)) redirect("/unauthorized");

  const sp = await searchParams;
  const { segment: segmentParam } = sp;
  const activeTab = TABS.find((t) => t.key === segmentParam)?.key ?? "alle";
  const segmentFilter =
    activeTab === "b2b" ? LeadSegment.B2B : activeTab === "b2c" ? LeadSegment.B2C : undefined;
  const where = segmentFilter ? { segment: segmentFilter } : {};

  const [leads, statusCounts, segmentCounts] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.lead.groupBy({ by: ["status"], where, _count: true }),
    prisma.lead.groupBy({ by: ["segment"], _count: true }),
  ]);
  const count = (s: LeadStatus) => statusCounts.find((c) => c.status === s)?._count ?? 0;
  const segCount = (s: LeadSegment | null) =>
    segmentCounts.find((c) => c.segment === s)?._count ?? 0;
  const tabCount = (key: (typeof TABS)[number]["key"]) =>
    key === "b2b" ? segCount(LeadSegment.B2B)
    : key === "b2c" ? segCount(LeadSegment.B2C)
    : segmentCounts.reduce((sum, c) => sum + c._count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Anfragen aus Funnel, Meta Ads, Webseite und manueller Erfassung — vom Erstkontakt bis zum Termin."
        action={
          <form action={importMetaLeadsAction}>
            <Button type="submit" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Meta-Leads abrufen
            </Button>
          </form>
        }
      />

      {sp.import === "ok" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          <strong>
            {sp.neu ?? "0"} neue Leads importiert, {sp.aktualisiert ?? "0"} aktualisiert.
          </strong>{" "}
          {sp.gesamt ?? "0"} Leads aus {sp.formulare ?? "0"} Formular(en) geprüft.
        </div>
      ) : null}
      {sp.import === "fehler" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
          <strong>Abruf fehlgeschlagen.</strong> {sp.meldung ?? "Unbekannter Fehler"}
          <span className="mt-1 block text-xs text-rose-700">
            Prüfen: Ist META_ACCESS_TOKEN in Vercel gesetzt und hat der Token die Berechtigung
            leads_retrieval?
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Link
              key={tab.key}
              href={tab.key === "alle" ? "/leads" : `/leads?segment=${tab.key}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-night text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
              <span className={isActive ? "text-copper" : "text-slate-400"}>{tabCount(tab.key)}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Neu</p><p className="mt-1 text-2xl font-semibold text-night">{count("NEU")}</p></Card>
        <Card className="p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Kontaktiert</p><p className="mt-1 text-2xl font-semibold text-night">{count("KONTAKTIERT")}</p></Card>
        <Card className="p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Termin</p><p className="mt-1 text-2xl font-semibold text-night">{count("TERMIN_VEREINBART")}</p></Card>
        <Card className="p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Gewonnen</p><p className="mt-1 text-2xl font-semibold text-night">{count("GEWONNEN")}</p></Card>
      </div>

      <Card>
        <CardTitle>Lead manuell erfassen</CardTitle>
        <form action={createLeadAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <Input name="name" placeholder="Kundenname *" required />
          <Input name="phone" placeholder="Telefon" />
          <Input name="email" type="email" placeholder="E-Mail" />
          <Input name="postalCode" placeholder="PLZ" />
          <Input name="city" placeholder="Ort" />
          <Input name="currentHeating" placeholder="Aktuelle Heizung (z. B. Öl, 25 Jahre)" />
          <Input name="timeframe" placeholder="Realisierungszeitraum (z. B. 0–3 Monate)" />
          <Input name="message" placeholder="Notiz" className="md:col-span-2" />
          <div className="md:col-span-3"><Button type="submit">Lead anlegen</Button></div>
        </form>
      </Card>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Kunde</th>
                <th className="px-5 py-3">Ort</th>
                <th className="px-5 py-3">PLZ</th>
                <th className="px-5 py-3">Aktuelle Heizung</th>
                <th className="px-5 py-3">Zeitraum</th>
                <th className="px-5 py-3">Quelle</th>
                <th className="px-5 py-3">Eingang</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                  {activeTab === "alle"
                    ? "Noch keine Leads. Sobald die Meta-Schnittstelle verbunden ist, laufen Anfragen hier automatisch ein."
                    : `Keine ${activeTab.toUpperCase()}-Leads in dieser Ansicht.`}
                </td></tr>
              ) : leads.map((lead) => {
                const answers = readAnswers(lead.raw);
                return (
                <tr key={lead.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-night">
                      {lead.name}
                      {lead.segment ? (
                        <span className={`ml-2 inline-block rounded-full px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide ${lead.segment === "B2B" ? "bg-night text-copper" : "bg-copper/15 text-[#8a5a2a]"}`}>
                          {lead.segment}
                        </span>
                      ) : null}
                    </p>
                    {lead.company ? <p className="text-xs text-slate-500">{lead.company}</p> : null}
                    <p className="text-xs text-slate-400">{[lead.phone, lead.email].filter(Boolean).join(" · ") || "—"}</p>
                    {lead.source === "FUNNEL" ? (
                      <p className={`mt-0.5 text-[11px] font-medium ${lead.doiConfirmedAt ? "text-emerald-600" : "text-amber-600"}`}>
                        {lead.doiConfirmedAt ? "E-Mail bestätigt (Double-Opt-in)" : "E-Mail-Bestätigung ausstehend"}
                      </p>
                    ) : null}
                    {lead.photoUrls.length > 0 ? (
                      <a href={lead.photoUrls[0]} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-medium text-[#8a5a2a] underline underline-offset-2">
                        {lead.photoUrls.length} Foto{lead.photoUrls.length > 1 ? "s" : ""} ansehen
                      </a>
                    ) : null}
                    {answers.length > 0 ? (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs font-medium text-[#8a5a2a] underline underline-offset-2">
                          Alle Formularantworten ({answers.length})
                        </summary>
                        <dl className="mt-2 max-w-md space-y-2 rounded-xl bg-slate-50 p-3">
                          {answers.map((answer) => (
                            <div key={answer.key}>
                              <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                                {answer.label}
                              </dt>
                              <dd className="text-xs font-medium text-night">
                                {answer.value || "—"}
                              </dd>
                            </div>
                          ))}
                          {lead.metaFormId ? (
                            <p className="border-t border-slate-200 pt-2 text-[11px] text-slate-400">
                              Lead-Formular-ID {lead.metaFormId}
                            </p>
                          ) : null}
                        </dl>
                      </details>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{lead.city ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.postalCode ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.currentHeating ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.timeframe ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${lead.source === "META" || lead.source === "FUNNEL" ? "bg-night text-copper" : "bg-slate-100 text-slate-600"}`}>
                      {SOURCE_LABEL[lead.source]}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-500">
                    {new Intl.DateTimeFormat("de-DE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(lead.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <form action={updateLeadStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium ${STATUS_STYLE[lead.status]}`}
                      >
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <Button type="submit" variant="ghost" className="h-8 px-3 text-xs">OK</Button>
                    </form>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-400">
        Meta-Schnittstelle: Webhook-URL <code>/api/leads/meta</code> · Einrichtung siehe .env.example (META_VERIFY_TOKEN, META_ACCESS_TOKEN, META_APP_SECRET).
      </p>
    </div>
  );
}
