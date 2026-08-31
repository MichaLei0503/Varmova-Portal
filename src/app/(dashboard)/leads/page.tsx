import { redirect } from "next/navigation";
import { LeadSource, LeadStatus, Role } from "@prisma/client";
import { PageHeader, Card, CardTitle, Button, Input } from "@/components/ui";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLeadAction, updateLeadStatusAction } from "./actions";

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
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  NEU: "bg-copper/15 text-[#8a5a2a]",
  KONTAKTIERT: "bg-slate-100 text-slate-700",
  QUALIFIZIERT: "bg-sky-100 text-sky-800",
  TERMIN_VEREINBART: "bg-indigo-100 text-indigo-800",
  GEWONNEN: "bg-emerald-100 text-emerald-800",
  VERLOREN: "bg-rose-100 text-rose-700",
};

export default async function LeadsPage() {
  const session = await requireAuth();
  if (!CRM_ROLES.includes(session.user.role)) redirect("/unauthorized");

  const [leads, statusCounts] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (s: LeadStatus) => statusCounts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Anfragen aus Meta Ads, Webseite und manueller Erfassung — vom Erstkontakt bis zum Termin."
      />

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
                  Noch keine Leads. Sobald die Meta-Schnittstelle verbunden ist, laufen Anfragen hier automatisch ein.
                </td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-night">{lead.name}</p>
                    <p className="text-xs text-slate-400">{[lead.phone, lead.email].filter(Boolean).join(" · ") || "—"}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{lead.city ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.postalCode ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.currentHeating ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.timeframe ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${lead.source === "META" ? "bg-night text-copper" : "bg-slate-100 text-slate-600"}`}>
                      {SOURCE_LABEL[lead.source]}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-500">
                    {new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(lead.createdAt)}
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
              ))}
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
