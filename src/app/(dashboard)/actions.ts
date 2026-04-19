"use server";

import { NoteVisibility, OfferStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireRole, toActor } from "@/lib/auth";
import { canReadProject, canUpdateOfferStatus } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { storeProjectFiles } from "@/lib/storage";

async function persistFiles(projectId: string, uploadedById: string, files: File[]) {
  const storedFiles = await storeProjectFiles(projectId, files);
  if (!storedFiles.length) return;

  await prisma.fileUpload.createMany({
    data: storedFiles.map((file) => ({
      projectId,
      uploadedById,
      fileName: file.fileName,
      filePath: file.filePath,
      fileType: file.fileType,
      fileSize: file.fileSize,
    })),
  });
}

export async function updateOfferStatusAction(formData: FormData) {
  const session = await requireAuth();
  const actor = toActor(session);

  const offerId = String(formData.get("offerId"));
  const status = String(formData.get("status")) as OfferStatus;

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { project: true },
  });
  if (!offer) return;

  const resource = {
    createdById: offer.project.createdById,
    organizationId: offer.project.vpOrgId,
    assignedOrgIds: offer.project.ipOrgId ? [offer.project.ipOrgId] : [],
  };

  if (!canUpdateOfferStatus(actor, resource)) {
    redirect("/unauthorized");
  }

  await prisma.offer.update({
    where: { id: offerId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      entity: "Offer",
      entityId: offerId,
      action: `status:${status}`,
      actorId: session.user.id,
    },
  });

  revalidatePath(`/projects/${offer.projectId}`);
  revalidatePath("/dashboard");
}

export async function addProjectNoteAction(formData: FormData) {
  const session = await requireAuth();
  const actor = toActor(session);

  const projectId = String(formData.get("projectId"));
  const content = String(formData.get("content") || "").trim();

  if (!content) return;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;

  const resource = {
    createdById: project.createdById,
    organizationId: project.vpOrgId,
    assignedOrgIds: project.ipOrgId ? [project.ipOrgId] : [],
  };

  if (!canReadProject(actor, resource)) {
    redirect("/unauthorized");
  }

  await prisma.note.create({
    data: {
      projectId,
      authorId: session.user.id,
      content,
      visibility: NoteVisibility.INTERNAL,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function uploadProjectFilesAction(formData: FormData) {
  const session = await requireAuth();
  const projectId = String(formData.get("projectId"));
  const files = formData.getAll("files") as File[];
  await persistFiles(projectId, session.user.id, files);
  revalidatePath(`/projects/${projectId}`);
}

export async function updateUserAccessAction(formData: FormData) {
  await requireRole(["VARMOVA_ADMIN"]);

  const userId = String(formData.get("userId"));
  const role = String(formData.get("role")) as Role;
  const isActive = formData.get("isActive") === "on";

  await prisma.user.update({
    where: { id: userId },
    data: { role, isActive },
  });

  revalidatePath("/admin/users");
}
