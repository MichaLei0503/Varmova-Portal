"use server";

import { NoteVisibility, ProjectStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireRole } from "@/lib/auth";
import { canAccessProject, canUpdateStatus } from "@/lib/permissions";
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
  const session = await requireRole(["SALES", "ADMIN"]);

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
    householdSize: formData.get("householdSize"),
    currentHeatingType: formData.get("currentHeatingType"),
    annualEnergyConsumption: formData.get("annualEnergyConsumption"),
    hasPv: formData.get("hasPv") === "on",
    hasStorage: formData.get("hasStorage") === "on",
    specialNote: formData.get("specialNote") || undefined,
    implementationWindow: formData.get("implementationWindow"),
    installerId: formData.get("installerId"),
    internalSalesNote: formData.get("internalSalesNote") || undefined,
    productName: "Varmi",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte die markierten Felder prüfen.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const salesPartner = await prisma.salesPartner.findUnique({
    where: { userId: session.user.id },
  });

  const pricingConfig = await prisma.pricingConfig.findFirst();
  if (!pricingConfig) {
    return { success: false, message: "Es ist keine Pricing-Konfiguration vorhanden." };
  }

  const files = formData.getAll("files") as File[];

  const project = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        street: parsed.data.street,
        houseNumber: parsed.data.houseNumber,
        postalCode: parsed.data.postalCode,
        city: parsed.data.city,
      },
    });

    const projectNumber = await generateProjectNumber(tx);
    const status = parsed.data.installerId ? ProjectStatus.HANDED_OVER : ProjectStatus.OFFER_CREATED;

    const createdProject = await tx.project.create({
      data: {
        projectNumber,
        status,
        productName: parsed.data.productName,
        implementationWindow: parsed.data.implementationWindow,
        internalSalesNote: parsed.data.internalSalesNote,
        buildingType: parsed.data.buildingType,
        livingAreaSqm: parsed.data.livingAreaSqm,
        constructionYear: parsed.data.constructionYear,
        householdSize: parsed.data.householdSize,
        currentHeatingType: parsed.data.currentHeatingType,
        annualEnergyConsumption: parsed.data.annualEnergyConsumption,
        hasPv: parsed.data.hasPv,
        hasStorage: parsed.data.hasStorage,
        specialNote: parsed.data.specialNote,
        customerId: customer.id,
        salesPartnerId: salesPartner?.id,
        installerId: parsed.data.installerId,
        createdById: session.user.id,
      },
    });

    const calculation = calculateOffer(
      {
        productName: parsed.data.productName,
        livingAreaSqm: parsed.data.livingAreaSqm,
        annualEnergyConsumption: parsed.data.annualEnergyConsumption,
        hasPv: parsed.data.hasPv,
        hasStorage: parsed.data.hasStorage,
      },
      pricingConfig,
    );

    await tx.offer.create({
      data: {
        projectId: createdProject.id,
        subtotal: calculation.subtotal,
        total: calculation.total,
        hintText: calculation.hintText,
        items: {
          create: calculation.items,
        },
      },
    });

    await tx.note.create({
      data: {
        projectId: createdProject.id,
        authorId: session.user.id,
        visibility: NoteVisibility.INTERNAL,
        content: parsed.data.installerId
          ? "Projekt angelegt, Angebot erzeugt und automatisch an Installateur übergeben."
          : "Projekt angelegt und Angebot erzeugt.",
      },
    });

    return createdProject;
  });

  await persistFiles(project.id, session.user.id, files);

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProjectStatusAction(formData: FormData) {
  const session = await requireAuth();
  if (!canUpdateStatus(session.user.role)) {
    redirect("/unauthorized");
  }

  const projectId = String(formData.get("projectId"));
  const status = String(formData.get("status")) as ProjectStatus;

  await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  await prisma.note.create({
    data: {
      projectId,
      authorId: session.user.id,
      content: `Status auf ${status} geändert.`,
      visibility: NoteVisibility.INTERNAL,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function addProjectNoteAction(formData: FormData) {
  const session = await requireAuth();
  const projectId = String(formData.get("projectId"));
  const content = String(formData.get("content") || "").trim();

  if (!content) return;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { installer: { include: { user: true } } },
  });

  if (!project) return;

  const allowed = canAccessProject({
    role: session.user.role,
    userId: session.user.id,
    installerUserId: project.installer?.userId,
    createdById: project.createdById,
  });

  if (!allowed) {
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

export async function updatePricingConfigAction(formData: FormData) {
  await requireRole(["ADMIN"]);

  const config = await prisma.pricingConfig.findFirst();
  if (!config) return;

  await prisma.pricingConfig.update({
    where: { id: config.id },
    data: {
      basePrice: Number(formData.get("basePrice")),
      installationFlatFee: Number(formData.get("installationFlatFee")),
      pvIntegrationPrice: Number(formData.get("pvIntegrationPrice")),
      storageIntegrationPrice: Number(formData.get("storageIntegrationPrice")),
      energyAuditPrice: Number(formData.get("energyAuditPrice")),
      largeHouseThreshold: Number(formData.get("largeHouseThreshold")),
      largeHouseSurcharge: Number(formData.get("largeHouseSurcharge")),
      hintText: String(formData.get("hintText")),
    },
  });

  revalidatePath("/admin/settings/pricing");
  revalidatePath("/projects");
}

export async function updateUserAccessAction(formData: FormData) {
  await requireRole(["ADMIN"]);

  const userId = String(formData.get("userId"));
  const role = String(formData.get("role"));
  const isActive = formData.get("isActive") === "on";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { salesPartner: true, installer: true },
  });

  if (!user) return;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        role: role as Role,
        isActive,
      },
    });

    if (role === "SALES" && !user.salesPartner) {
      await tx.salesPartner.create({
        data: {
          userId,
          companyName: `${user.name} Vertrieb`,
          partnerCode: `AUTO-SALES-${Date.now()}`,
        },
      });
    }

    if (role === "INSTALLER" && !user.installer) {
      await tx.installer.create({
        data: {
          userId,
          companyName: `${user.name} Installation`,
          installerCode: `AUTO-INSTALL-${Date.now()}`,
        },
      });
    }
  });

  revalidatePath("/admin/users");
}
