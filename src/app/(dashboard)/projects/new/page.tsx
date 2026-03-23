import { NewProjectForm } from "@/components/new-project-form";
import { PageHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewProjectPage() {
  await requireRole(["SALES", "ADMIN"]);

  const installers = await prisma.installer.findMany({
    include: { user: true },
    orderBy: { companyName: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Neues Projekt" description="Projekt erfassen, Angebot automatisch berechnen und Installateur zuweisen." />
      <NewProjectForm installers={installers} />
    </div>
  );
}
