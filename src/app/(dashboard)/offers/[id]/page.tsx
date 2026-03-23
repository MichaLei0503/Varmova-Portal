import { redirect } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { Card, PageHeader } from "@/components/ui";
import { requireAuth } from "@/lib/auth";
import { canAccessProject } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, projectStatusLabels } from "@/lib/utils";

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      project: {
        include: {
          customer: true,
          installer: { include: { user: true } },
        },
      },
    },
  });

  if (!offer) {
    redirect("/projects");
  }

  const allowed = canAccessProject({
    role: session.user.role,
    userId: session.user.id,
    installerUserId: offer.project.installer?.userId,
    createdById: offer.project.createdById,
  });

  if (!allowed) redirect("/unauthorized");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Angebot ${offer.project.projectNumber}`}
        description="Saubere, druckbare Angebotsansicht für Vertrieb und Kunde."
        action={<div className="print-hidden"><PrintButton /></div>}
      />

      <Card className="space-y-8 bg-white print:shadow-none">
        <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Varmova · Varmi Angebot</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{offer.project.customer.firstName} {offer.project.customer.lastName}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {offer.project.customer.street} {offer.project.customer.houseNumber}, {offer.project.customer.postalCode} {offer.project.customer.city}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p><span className="font-medium">Projektnummer:</span> {offer.project.projectNumber}</p>
            <p><span className="font-medium">Datum:</span> {formatDate(offer.issueDate)}</p>
            <p><span className="font-medium">Status:</span> {projectStatusLabels[offer.project.status]}</p>
            <p><span className="font-medium">Produkt:</span> {offer.project.productName}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-950">Projektbasis</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>Gebäudetyp: {offer.project.buildingType}</p>
              <p>Wohnfläche: {offer.project.livingAreaSqm} m²</p>
              <p>Baujahr: {offer.project.constructionYear}</p>
              <p>Heizungsart: {offer.project.currentHeatingType}</p>
              <p>Umsetzungszeitraum: {offer.project.implementationWindow}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-950">Zuständiger Installateur</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>{offer.project.installer?.companyName ?? "Noch nicht zugewiesen"}</p>
              <p>{offer.project.installer?.user.name ?? "-"}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Beschreibung</th>
                <th className="px-4 py-3 text-right">Betrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {offer.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 font-medium text-slate-950">{item.label}</td>
                  <td className="px-4 py-4">{item.description || "Standardposition im Varmi Angebot"}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-950">{formatCurrency(item.totalPrice.toString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-sm rounded-2xl bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Zwischensumme</span>
              <span>{formatCurrency(offer.subtotal.toString())}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xl font-semibold">
              <span>Gesamtsumme</span>
              <span>{formatCurrency(offer.total.toString())}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5 text-sm text-slate-700">
          <p className="font-medium text-slate-950">Hinweis</p>
          <p className="mt-2">{offer.hintText}</p>
        </div>
      </Card>
    </div>
  );
}
