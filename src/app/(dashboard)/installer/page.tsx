import { PageHeader, StatCard } from "@/components/ui";
import { ProjectTable } from "@/components/project-table";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InstallerPage() {
  const session = await requireRole(["INSTALLER", "ADMIN"]);
  const installer = session.user.role === "INSTALLER" ? await prisma.installer.findUnique({ where: { userId: session.user.id } }) : null;

  const projects = await prisma.project.findMany({
    where: session.user.role === "INSTALLER" ? { installerId: installer?.id } : {},
    orderBy: { updatedAt: "desc" },
    include: {
      customer: true,
      installer: { include: { user: true } },
      salesPartner: { include: { user: true } },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Installateur-Portal" description="Zugewiesene Projekte, Detailzugriff, Statuspflege und Dokumentenablage." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Gesamt" value={projects.length} />
        <StatCard title="Mit Angebot" value={projects.filter((item) => item.status !== "CREATED").length} />
        <StatCard title="Abgeschlossen" value={projects.filter((item) => item.status === "COMPLETED").length} />
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
