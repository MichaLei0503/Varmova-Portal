import Link from "next/link";
import { PageHeader, StatCard } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);

  const [salesCount, installerCount, pricingConfig] = await Promise.all([
    prisma.salesPartner.count(),
    prisma.installer.count(),
    prisma.pricingConfig.findFirst(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Bereich" description="Benutzer, Preislogik und globale Sicht auf den MVP-Prozess." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Vertriebspartner" value={salesCount} caption="Aktive Sales-Accounts im Portal" />
        <StatCard title="Installateure" value={installerCount} caption="Zugeordnete Ausführungspartner" />
        <StatCard title="Varmi Grundpreis" value={`${Number(pricingConfig?.basePrice ?? 0)} €`} caption="Aktuelle Pricing-Konfiguration" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/users" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-brand">
          <h2 className="text-lg font-semibold text-slate-950">Benutzerverwaltung</h2>
          <p className="mt-2 text-sm text-slate-500">Rollenübersicht, Ansprechpartner und Account-Liste.</p>
        </Link>
        <Link href="/admin/settings/pricing" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-brand">
          <h2 className="text-lg font-semibold text-slate-950">Preislogik</h2>
          <p className="mt-2 text-sm text-slate-500">Zentrale Angebotsparameter für Varmi modular pflegen.</p>
        </Link>
      </div>
    </div>
  );
}
