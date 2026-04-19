import Link from "next/link";
import { OfferStatus, Prisma } from "@prisma/client";
import { ProjectTable } from "@/components/project-table";
import { PageHeader, Input, Select } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { offerStatusLabels } from "@/lib/utils";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: OfferStatus }>;
}) {
  const session = await requireRole(["VP", "VP_ADMIN", "VARMOVA_ADMIN"]);
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const status = params.status;

  // Scope je nach Rolle: VP nur eigene, VP_ADMIN seine Org, VARMOVA_ADMIN alle.
  const scopeFilter: Prisma.ProjectWhereInput =
    session.user.role === "VP"
      ? { createdById: session.user.id }
      : session.user.role === "VP_ADMIN"
        ? { vpOrgId: session.user.organizationId }
        : {};

  const where: Prisma.ProjectWhereInput = {
    ...scopeFilter,
    ...(status ? { offer: { status } } : {}),
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
      vpOrg: true,
      ipOrg: true,
      offer: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projektliste"
        description="Suche, Filter und Übersicht über laufende Varmi Projekte."
        action={
          <Link href="/projects/new" className="inline-flex h-10 items-center rounded-xl bg-copper px-4 text-sm font-medium text-night">
            Neues Projekt
          </Link>
        }
      />

      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_160px]">
        <Input name="q" defaultValue={q} placeholder="Suche nach Projektnummer, Kunde oder Ort" />
        <Select name="status" defaultValue={status ?? ""}>
          <option value="">Alle Status</option>
          {Object.entries(offerStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <button className="rounded-xl bg-night px-4 text-sm font-medium text-white">Filtern</button>
      </form>

      <ProjectTable projects={projects} />
    </div>
  );
}
