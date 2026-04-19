"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, toActor } from "@/lib/auth";
import { can } from "@/lib/rbac/can";
import { prisma } from "@/lib/prisma";
import { createDraft, loadDraft, updateStepData } from "@/lib/wizard/draft";
import { finalizeWizard, WizardIncompleteError } from "@/lib/wizard/finalize";
import { FIRST_STEP, getStep, isValidStepId, nextStepId, prevStepId, WizardStepId } from "@/lib/wizard/steps";

export async function startWizardAction() {
  const session = await requireRole(["VP", "VP_ADMIN", "VARMOVA_ADMIN"]);
  const actor = toActor(session);

  if (!can(actor, "project:create")) {
    redirect("/unauthorized");
  }

  const draft = await createDraft(prisma, session.user.id, session.user.organizationId);
  redirect(`/wizard/${draft.id}/${FIRST_STEP}`);
}

async function loadOwnedDraft(draftId: string) {
  const session = await requireRole(["VP", "VP_ADMIN", "VARMOVA_ADMIN"]);
  const draft = await loadDraft(prisma, draftId);
  if (!draft) redirect("/projects");

  const isOwner = draft.userId === session.user.id;
  const isVpAdminOfOrg = session.user.role === "VP_ADMIN" && draft.vpOrgId === session.user.organizationId;
  const isVarmovaAdmin = session.user.role === "VARMOVA_ADMIN";
  if (!isOwner && !isVpAdminOfOrg && !isVarmovaAdmin) {
    redirect("/unauthorized");
  }

  return { session, draft };
}

// Speichert die Daten des aktuellen Schritts und navigiert. Beim "Weiter"-Klick
// auf dem letzten Schritt ruft die Action stattdessen den Finalizer auf.
export async function saveStepAction(formData: FormData) {
  const draftId = String(formData.get("draftId") ?? "");
  const stepId = String(formData.get("stepId") ?? "");
  const direction = String(formData.get("direction") ?? "next");

  if (!isValidStepId(stepId)) redirect("/projects");

  const step = getStep(stepId)!;
  const { draft } = await loadOwnedDraft(draftId);

  const rawPayload: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "draftId" || key === "stepId" || key === "direction") continue;
    if (key in rawPayload) {
      const existing = rawPayload[key];
      rawPayload[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      rawPayload[key] = value;
    }
  }

  const parsed = step.schema.safeParse(rawPayload);
  if (!parsed.success) {
    // AP 1.8 ergänzt Fehlerdarstellung via useActionState; aktuell redirect zum Step.
    console.warn("Wizard step validation failed", { step: step.id, errors: parsed.error.flatten() });
    redirect(`/wizard/${draftId}/${step.id}`);
  }

  const target =
    direction === "prev"
      ? prevStepId(step.id as WizardStepId) ?? step.id
      : nextStepId(step.id as WizardStepId);

  const nextStep: WizardStepId = (target ?? step.id) as WizardStepId;
  await updateStepData(prisma, draft, step.id as WizardStepId, parsed.data as Record<string, unknown>, nextStep);

  // Letzter Schritt + Weiter → Finalisierung.
  if (target === null && direction === "next") {
    const refreshed = await loadDraft(prisma, draftId);
    if (!refreshed) redirect("/projects");

    try {
      const result = await finalizeWizard(refreshed);
      revalidatePath("/dashboard");
      revalidatePath("/projects");
      redirect(`/projects/${result.projectId}`);
    } catch (error) {
      if (error instanceof WizardIncompleteError) {
        redirect(`/wizard/${draftId}/${error.missingStep}`);
      }
      throw error;
    }
  }

  revalidatePath(`/wizard/${draftId}`);
  redirect(`/wizard/${draftId}/${nextStep}`);
}
