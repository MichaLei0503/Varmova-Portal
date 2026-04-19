import Link from "next/link";
import { redirect } from "next/navigation";
import { addProjectNoteAction, updateOfferStatusAction, uploadProjectFilesAction } from "@/app/(dashboard)/actions";
import { StatusBadge } from "@/components/status-badge";
import { Button, Card, CardTitle, Input, Label, PageHeader, Select, Textarea } from "@/components/ui";
import { requireAuth, toActor } from "@/lib/auth";
import { canReadProject, canUpdateOfferStatus } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { formatCents, formatDate, offerStatusLabels, projectScopeLabels } from "@/lib/utils";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const actor = toActor(session);
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      vpOrg: true,
      ipOrg: true,
      offer: { include: { items: { orderBy: { sortOrder: "asc" } } } },
      notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
      files: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) {
    redirect("/projects");
  }

  const resource = {
    createdById: project.createdById,
    organizationId: project.vpOrgId,
    assignedOrgIds: project.ipOrgId ? [project.ipOrgId] : [],
  };

  if (!canReadProject(actor, resource)) {
    redirect("/unauthorized");
  }

  const canEditStatus = project.offer ? canUpdateOfferStatus(actor, resource) : false;

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.projectNumber}
        description={`${project.customer.firstName} ${project.customer.lastName} · ${project.customer.city}`}
        action={
          <div className="flex items-center gap-3">
            {project.offer ? <StatusBadge status={project.offer.status} /> : null}
            {project.offer ? (
              <Link href={`/offers/${project.offer.id}`} className="inline-flex h-10 items-center rounded-xl bg-night px-4 text-sm font-medium text-white">
                Angebot öffnen
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle>Kundendaten</CardTitle>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
              <div><p className="text-slate-500">Name</p><p className="font-medium text-night">{project.customer.firstName} {project.customer.lastName}</p></div>
              <div><p className="text-slate-500">E-Mail</p><p className="font-medium text-night">{project.customer.email}</p></div>
              <div><p className="text-slate-500">Telefon</p><p className="font-medium text-night">{project.customer.phone ?? "-"}</p></div>
              <div><p className="text-slate-500">Adresse</p><p className="font-medium text-night">{project.customer.street} {project.customer.houseNumber}, {project.customer.postalCode} {project.customer.city}</p></div>
            </div>
          </Card>

          <Card>
            <CardTitle>Projekt- und Gebäudedaten</CardTitle>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
              <div><p className="text-slate-500">Gebäudetyp</p><p className="font-medium text-night">{project.buildingType}</p></div>
              <div><p className="text-slate-500">Wohnfläche</p><p className="font-medium text-night">{project.livingAreaSqm} m²</p></div>
              <div><p className="text-slate-500">Baujahr</p><p className="font-medium text-night">{project.constructionYear}</p></div>
              <div><p className="text-slate-500">Heizungsart</p><p className="font-medium text-night">{project.currentHeatingType}</p></div>
              <div><p className="text-slate-500">Energieverbrauch</p><p className="font-medium text-night">{project.annualEnergyConsumption ? `${project.annualEnergyConsumption} kWh/Jahr` : "Nicht angegeben"}</p></div>
              <div><p className="text-slate-500">Auftragsumfang</p><p className="font-medium text-night">{projectScopeLabels[project.scope]}</p></div>
              <div><p className="text-slate-500">Varmi-Modell</p><p className="font-medium text-night">{project.varmiSku}</p></div>
              <div><p className="text-slate-500">Pufferspeicher</p><p className="font-medium text-night">{project.bufferSku ?? "-"}</p></div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <p className="text-slate-500">Besonderer Hinweis</p>
                <p className="font-medium text-night">{project.specialNote || "-"}</p>
              </div>
              <div>
                <p className="text-slate-500">Interne Notiz Vertrieb</p>
                <p className="font-medium text-night">{project.internalSalesNote || "-"}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Angebotsüberblick</CardTitle>
            {project.offer ? (
              <div className="mt-4 space-y-3 text-sm">
                {project.offer.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-night">{item.label}</p>
                      {item.description ? <p className="text-xs text-slate-500">{item.description}</p> : null}
                    </div>
                    <p className="font-semibold text-night">{formatCents(item.totalCents)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-copper/10 px-4 py-4 text-sm">
                  <p className="font-medium text-slate-700">Gesamtsumme (brutto)</p>
                  <p className="text-lg font-semibold text-night">{formatCents(project.offer.totalCents)}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Noch kein Angebot erstellt.</p>
            )}
          </Card>

          <Card>
            <CardTitle>Interne Notizen</CardTitle>
            <form action={addProjectNoteAction} className="mt-4 space-y-3">
              <input type="hidden" name="projectId" value={project.id} />
              <Textarea name="content" placeholder="Neue interne Notiz ergänzen …" required />
              <Button type="submit">Notiz speichern</Button>
            </form>
            <div className="mt-6 space-y-3">
              {project.notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-night">{note.author.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                  </div>
                  <p className="mt-2 text-slate-700">{note.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardTitle>Status</CardTitle>
            <div className="mt-4 text-sm text-slate-500">Angelegt am {formatDate(project.createdAt)}</div>
            {project.offer && canEditStatus ? (
              <form action={updateOfferStatusAction} className="mt-4 space-y-3">
                <input type="hidden" name="offerId" value={project.offer.id} />
                <Select name="status" defaultValue={project.offer.status}>
                  {Object.entries(offerStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <Button type="submit" className="w-full">Status aktualisieren</Button>
              </form>
            ) : null}
          </Card>

          <Card>
            <CardTitle>Beteiligte</CardTitle>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-slate-500">Vertriebspartner</p>
                <p className="font-medium text-night">{project.vpOrg.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Installationspartner</p>
                <p className="font-medium text-night">{project.ipOrg?.name ?? "Noch nicht gewählt"}</p>
              </div>
              <div>
                <p className="text-slate-500">Zeitraum</p>
                <p className="font-medium text-night">{project.implementationWindow ?? "-"}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Dateien & Fotos</CardTitle>
            <form action={uploadProjectFilesAction} className="mt-4 space-y-3">
              <input type="hidden" name="projectId" value={project.id} />
              <Label htmlFor="files">Neue Dateien hochladen</Label>
              <Input id="files" name="files" type="file" multiple />
              <Button type="submit" className="w-full">Upload starten</Button>
            </form>
            <div className="mt-5 space-y-2 text-sm">
              {project.files.map((file) => (
                <a key={file.id} href={file.filePath} target="_blank" className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  <span className="truncate pr-4">{file.fileName}</span>
                  <span className="text-xs text-slate-400">{file.fileType || "Datei"}</span>
                </a>
              ))}
              {!project.files.length ? <p className="text-slate-500">Noch keine Uploads vorhanden.</p> : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
