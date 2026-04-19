import Link from "next/link";
import { PageHeader, StatCard } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireRole(["VARMOVA_ADMIN"]);

  const [vpCount, ipCount, catalogCount] = await Promise.all([
    prisma.organization.count({ where: { type: "VP" } }),
    prisma.organization.count({ where: { type: "IP" } }),
    prisma.productCatalog.count({ where: { validUntil: null } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Bereich" description="Partner, Produktkatalog und globale Sicht auf das Portal." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Vertriebspartner" value={vpCount} caption="VP-Organisationen im Portal" />
        <StatCard title="Installationspartner" value={ipCount} caption="IP-Organisationen mit Profil" />
        <StatCard title="Aktive Katalogeinträge" value={catalogCount} caption="Produkte, Zubehör und Dienstleistungen" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/users" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-copper">
          <h2 className="text-lg font-semibold text-night">Benutzerverwaltung</h2>
          <p className="mt-2 text-sm text-slate-500">Rollen, Organisationen und Accounts zentral pflegen.</p>
        </Link>
        <Link href="/admin/settings/pricing" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-copper">
          <h2 className="text-lg font-semibold text-night">Produktkatalog</h2>
          <p className="mt-2 text-sm text-slate-500">SKUs, Preise und Gültigkeitszeiträume — Basis aller Angebote.</p>
        </Link>
      </div>
    </div>
  );
}
