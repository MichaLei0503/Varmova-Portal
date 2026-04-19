import { OfferStatus } from "@prisma/client";
import { PageHeader, StatCard } from "@/components/ui";
import { ProjectTable } from "@/components/project-table";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InstallerPage() {
  const session = await requireRole(["IP", "IP_ADMIN", "VARMOVA_ADMIN"]);
  const isIp = session.user.role === "IP" || session.user.role === "IP_ADMIN";

  const projects = await prisma.project.findMany({
    where: isIp ? { ipOrgId: session.user.organizationId } : {},
    orderBy: { updatedAt: "desc" },
    include: { customer: true, vpOrg: true, ipOrg: true, offer: true },
  });

  const withOffer = projects.filter((p) => p.offer !== null).length;
  const done = projects.filter((p) => p.offer?.status === OfferStatus.INSTALLATION_DONE).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Installateur-Portal" description="Zugewiesene Projekte, Detailzugriff, Statuspflege und Dokumentenablage." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Gesamt" value={projects.length} />
        <StatCard title="Mit Angebot" value={withOffer} />
        <StatCard title="Abgeschlossen" value={done} />
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
