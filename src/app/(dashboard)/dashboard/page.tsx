import Link from "next/link";
import { OfferStatus, Role } from "@prisma/client";
import { PageHeader, StatCard } from "@/components/ui";
import { ProjectTable } from "@/components/project-table";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VP_ROLES: Role[] = ["VP", "VP_ADMIN"];
const IP_ROLES: Role[] = ["IP", "IP_ADMIN"];

export default async function DashboardPage() {
  const session = await requireAuth();
  const { role, id: userId, organizationId } = session.user;

  if (VP_ROLES.includes(role)) {
    // VP: eigene Projekte; VP_ADMIN: alle seiner Org.
    const scope = role === "VP_ADMIN" ? { vpOrgId: organizationId } : { createdById: userId };
    const [totalProjects, installerAssigned, installationDone, recentProjects] = await Promise.all([
      prisma.project.count({ where: scope }),
      prisma.project.count({ where: { ...scope, offer: { status: OfferStatus.INSTALLER_ASSIGNED } } }),
      prisma.project.count({ where: { ...scope, offer: { status: OfferStatus.INSTALLATION_DONE } } }),
      prisma.project.findMany({
        where: scope,
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { customer: true, vpOrg: true, ipOrg: true, offer: true },
      }),
    ]);

    return (
      <div className="space-y-6">
        <PageHeader
          title="Vertriebs-Dashboard"
          description="Eigene Varmi Projekte, Angebotsstatus und Übergaben im Blick."
          action={
            <Link href="/projects/new" className="inline-flex h-10 items-center rounded-xl bg-copper px-4 text-sm font-medium text-night">
              Neues Projekt anlegen
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Projekte" value={totalProjects} caption="Alle erfassten Leads und Projekte" />
          <StatCard title="An Installateur übergeben" value={installerAssigned} caption="Status „Installateur“" />
          <StatCard title="Installation abgeschlossen" value={installationDone} caption="Status „Installation abgeschlossen“" />
        </div>
        <ProjectTable projects={recentProjects} />
      </div>
    );
  }

  if (IP_ROLES.includes(role)) {
    const scope = { ipOrgId: organizationId };
    const [assigned, scheduled, done, projects] = await Promise.all([
      prisma.project.count({ where: scope }),
      prisma.project.count({ where: { ...scope, offer: { status: OfferStatus.INSTALLATION_SCHEDULED } } }),
      prisma.project.count({ where: { ...scope, offer: { status: OfferStatus.INSTALLATION_DONE } } }),
      prisma.project.findMany({
        where: scope,
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: { customer: true, vpOrg: true, ipOrg: true, offer: true },
      }),
    ]);

    return (
      <div className="space-y-6">
        <PageHeader title="Installateur-Dashboard" description="Zugewiesene Projekte, Bearbeitungsstände und nächste Schritte." />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Zugewiesene Projekte" value={assigned} caption="Alle aus dem Vertrieb übergebenen Aufträge" />
          <StatCard title="Installation geplant" value={scheduled} caption="Termin fixiert" />
          <StatCard title="Abgeschlossen" value={done} caption="Montage erfolgt" />
        </div>
        <ProjectTable projects={projects} />
      </div>
    );
  }

  // VARMOVA_ADMIN / VARMOVA_PRODUCTION / ENERGY_ADVISOR: globale Sicht.
  const [projects, users, offers, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.user.count(),
    prisma.offer.count(),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { customer: true, vpOrg: true, ipOrg: true, offer: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin-Dashboard" description="Globale Übersicht über Nutzer, Partner und Angebotslage." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Gesamtprojekte" value={projects} caption="Alle aktuellen Varmi Projekte" />
        <StatCard title="Benutzer" value={users} caption="Über alle Rollen und Organisationen" />
        <StatCard title="Erzeugte Angebote" value={offers} caption="Aktive Angebotsdatensätze im System" />
      </div>
      <ProjectTable projects={recentProjects} />
    </div>
  );
}
