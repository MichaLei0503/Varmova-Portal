import { NewProjectForm } from "@/components/new-project-form";
import { PageHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewProjectPage() {
  await requireRole(["VP", "VP_ADMIN", "VARMOVA_ADMIN"]);

  const installers = await prisma.organization.findMany({
    where: { type: "IP", status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Neues Projekt" description="Projekt erfassen, Angebot automatisch berechnen und Installationspartner zuweisen." />
      <NewProjectForm installers={installers} />
    </div>
  );
}
