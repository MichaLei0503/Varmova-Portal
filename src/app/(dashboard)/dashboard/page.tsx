import Link from "next/link";
import { ProjectStatus } from "@prisma/client";
import { PageHeader, StatCard } from "@/components/ui";
import { ProjectTable } from "@/components/project-table";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await requireAuth();

  if (session.user.role === "SALES") {
    const [totalProjects, handedOver, inProgress, recentProjects] = await Promise.all([
      prisma.project.count({ where: { createdById: session.user.id } }),
      prisma.project.count({ where: { createdById: session.user.id, status: ProjectStatus.HANDED_OVER } }),
      prisma.project.count({ where: { createdById: session.user.id, status: ProjectStatus.IN_PROGRESS } }),
      prisma.project.findMany({
        where: { createdById: session.user.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          customer: true,
          installer: { include: { user: true } },
          salesPartner: { include: { user: true } },
        },
      }),
    ]);

    return (
      <div className="space-y-6">
        <PageHeader
          title="Vertriebs-Dashboard"
          description="Eigene Varmi Projekte, Angebotsstatus und Übergaben im Blick."
          action={
            <Link href="/projects/new" className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-medium text-white">
              Neues Projekt anlegen
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Eigene Projekte" value={totalProjects} caption="Alle erfassten Leads und Projekte" />
          <StatCard title="An Installateur übergeben" value={handedOver} caption="Automatisch zugewiesene Fälle" />
          <StatCard title="In Bearbeitung" value={inProgress} caption="Aktive Projekte beim Installateur" />
        </div>
        <ProjectTable projects={recentProjects} />
      </div>
    );
  }

  if (session.user.role === "INSTALLER") {
    const installer = await prisma.installer.findUnique({ where: { userId: session.user.id } });
    const [assigned, active, completed, projects] = await Promise.all([
      prisma.project.count({ where: { installerId: installer?.id } }),
      prisma.project.count({ where: { installerId: installer?.id, status: ProjectStatus.IN_PROGRESS } }),
      prisma.project.count({ where: { installerId: installer?.id, status: ProjectStatus.COMPLETED } }),
      prisma.project.findMany({
        where: { installerId: installer?.id },
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: {
          customer: true,
          installer: { include: { user: true } },
          salesPartner: { include: { user: true } },
        },
      }),
    ]);

    return (
      <div className="space-y-6">
        <PageHeader title="Installateur-Dashboard" description="Zugewiesene Projekte, Bearbeitungsstände und nächste Schritte." />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Zugewiesene Projekte" value={assigned} caption="Automatisch aus dem Vertrieb übergeben" />
          <StatCard title="Aktiv in Bearbeitung" value={active} caption="Status In Bearbeitung" />
          <StatCard title="Abgeschlossen" value={completed} caption="Erledigte Projekte" />
        </div>
        <ProjectTable projects={projects} />
      </div>
    );
  }

  const [projects, users, openOffers, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.user.count(),
    prisma.offer.count(),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: {
        customer: true,
        installer: { include: { user: true } },
        salesPartner: { include: { user: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin-Dashboard" description="Globale Übersicht über Nutzer, Preise, Projekte und Angebotslage." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Gesamtprojekte" value={projects} caption="Alle aktuellen Varmi Projekte" />
        <StatCard title="Benutzer" value={users} caption="Admin, Vertriebspartner und Installateure" />
        <StatCard title="Erzeugte Angebote" value={openOffers} caption="Aktive Angebotsdatensätze im System" />
      </div>
      <ProjectTable projects={recentProjects} />
    </div>
  );
}
