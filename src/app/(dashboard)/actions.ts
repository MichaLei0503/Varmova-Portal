"use server";

import { NoteVisibility, OfferStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireRole, toActor } from "@/lib/auth";
import { canReadProject, canUpdateOfferStatus } from "@/lib/permissions";
import { calculateOffer } from "@/lib/pricing";
import { generateProjectNumber } from "@/lib/project";
import { prisma } from "@/lib/prisma";
import { storeProjectFiles } from "@/lib/storage";
import { projectSchema } from "@/lib/validators";
import type { ActionState } from "@/lib/action-state";

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

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireRole(["VP", "VP_ADMIN", "VARMOVA_ADMIN"]);

  const parsed = projectSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    houseNumber: formData.get("houseNumber"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    buildingType: formData.get("buildingType"),
    livingAreaSqm: formData.get("livingAreaSqm"),
    constructionYear: formData.get("constructionYear"),
    currentHeatingType: formData.get("currentHeatingType"),
    annualEnergyConsumption: formData.get("annualEnergyConsumption"),
    scope: formData.get("scope"),
    varmiSku: formData.get("varmiSku") || "VARMI-9.2",
    bufferSku: formData.get("bufferSku") || undefined,
    specialNote: formData.get("specialNote") || undefined,
    implementationWindow: formData.get("implementationWindow"),
    ipOrgId: formData.get("ipOrgId"),
    internalSalesNote: formData.get("internalSalesNote") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte die markierten Felder prüfen.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const catalog = await prisma.productCatalog.findMany({ where: { validUntil: null } });
  if (!catalog.length) {
    return { success: false, message: "Kein aktiver Produktkatalog vorhanden." };
  }

  const files = formData.getAll("files") as File[];

  const project = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        street: parsed.data.street,
        houseNumber: parsed.data.houseNumber,
        postalCode: parsed.data.postalCode,
        city: parsed.data.city,
      },
    });

    const projectNumber = await generateProjectNumber(tx);

    const createdProject = await tx.project.create({
      data: {
        projectNumber,
        buildingType: parsed.data.buildingType,
        livingAreaSqm: parsed.data.livingAreaSqm,
        constructionYear: parsed.data.constructionYear,
        currentHeatingType: parsed.data.currentHeatingType,
        annualEnergyConsumption: parsed.data.annualEnergyConsumption,
        scope: parsed.data.scope,
        varmiSku: parsed.data.varmiSku,
        bufferSku: parsed.data.bufferSku,
        implementationWindow: parsed.data.implementationWindow,
        internalSalesNote: parsed.data.internalSalesNote,
        specialNote: parsed.data.specialNote,
        customerId: customer.id,
        vpOrgId: session.user.organizationId,
        ipOrgId: parsed.data.ipOrgId,
        createdById: session.user.id,
      },
    });

    const calculation = calculateOffer(
      {
        scope: parsed.data.scope,
        varmiSku: parsed.data.varmiSku,
        bufferSku: parsed.data.bufferSku,
        currentHeatingType: parsed.data.currentHeatingType,
      },
      catalog,
    );

    await tx.offer.create({
      data: {
        projectId: createdProject.id,
        status: OfferStatus.OFFER_CREATED,
        vatRatePercent: 19,
        subtotalCents: calculation.subtotalCents,
        vatCents: calculation.vatCents,
        totalCents: calculation.totalCents,
        priceSnapshot: calculation.snapshot,
        hintText: "Angebot aus Wizard-Stub generiert (AP 1.0 — voller 8-Schritt-Wizard folgt in AP 1.3).",
        items: {
          create: calculation.items.map((item) => ({
            sku: item.sku,
            label: item.label,
            description: item.description,
            quantity: item.quantity,
            unitCents: item.unitCents,
            totalCents: item.totalCents,
            sortOrder: item.sortOrder,
          })),
        },
      },
    });

    await tx.note.create({
      data: {
        projectId: createdProject.id,
        authorId: session.user.id,
        visibility: NoteVisibility.INTERNAL,
        content: "Projekt angelegt und Angebot erzeugt.",
      },
    });

    return createdProject;
  });

  await persistFiles(project.id, session.user.id, files);

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
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
