import Link from "next/link";
import { Project, Customer, Installer, User, SalesPartner } from "@prisma/client";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";

type ProjectRow = Project & {
  customer: Customer;
  installer: (Installer & { user: User }) | null;
  salesPartner: (SalesPartner & { user: User }) | null;
};

export function ProjectTable({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Projekt</th>
              <th className="px-4 py-3">Kunde</th>
              <th className="px-4 py-3">Installateur</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aktualisiert</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-950">{project.projectNumber}</div>
                  <div className="text-xs text-slate-500">{project.productName}</div>
                </td>
                <td className="px-4 py-4">
                  {project.customer.firstName} {project.customer.lastName}
                  <div className="text-xs text-slate-500">{project.customer.city}</div>
                </td>
                <td className="px-4 py-4">
                  {project.installer?.companyName ?? "Nicht zugeordnet"}
                  <div className="text-xs text-slate-500">{project.installer?.user.name ?? "-"}</div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-4">{formatDate(project.updatedAt)}</td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/projects/${project.id}`} className="font-medium text-brand hover:underline">
                    Öffnen
                  </Link>
                </td>
              </tr>
            ))}
            {!projects.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  Keine Projekte für die aktuelle Auswahl gefunden.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
