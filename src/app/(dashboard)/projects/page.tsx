import Link from "next/link";
import { Prisma, ProjectStatus } from "@prisma/client";
import { ProjectTable } from "@/components/project-table";
import { PageHeader, Input, Select } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectStatusLabels } from "@/lib/utils";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: ProjectStatus }>;
}) {
  const session = await requireRole(["SALES", "ADMIN"]);
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status = params.status;

  const where: Prisma.ProjectWhereInput = {
    ...(session.user.role === "SALES" ? { createdById: session.user.id } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { projectNumber: { contains: q, mode: "insensitive" } },
            { customer: { firstName: { contains: q, mode: "insensitive" } } },
            { customer: { lastName: { contains: q, mode: "insensitive" } } },
            { customer: { city: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const projects = await prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      customer: true,
      installer: { include: { user: true } },
      salesPartner: { include: { user: true } },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projektliste"
        description="Suche, Filter und Übersicht über laufende Varmi Projekte."
        action={
          <Link href="/projects/new" className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-medium text-white">
            Neues Projekt
          </Link>
        }
      />

      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_160px]">
        <Input name="q" defaultValue={q} placeholder="Suche nach Projektnummer, Kunde oder Ort" />
        <Select name="status" defaultValue={status ?? ""}>
          <option value="">Alle Status</option>
          {Object.entries(projectStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <button className="rounded-xl bg-slate-900 px-4 text-sm font-medium text-white">Filtern</button>
      </form>

      <ProjectTable projects={projects} />
    </div>
  );
}
