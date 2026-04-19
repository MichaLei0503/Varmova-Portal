"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, toActor } from "@/lib/auth";
import { can } from "@/lib/rbac/can";
import { prisma } from "@/lib/prisma";
import { createDraft, loadDraft, updateStepData } from "@/lib/wizard/draft";
import { FIRST_STEP, getStep, isValidStepId, nextStepId, prevStepId, WizardStepId } from "@/lib/wizard/steps";

// Startet einen neuen Wizard-Draft für den eingeloggten User
// und leitet auf den ersten Schritt weiter.
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

  // Scope-Check: Owner des Drafts oder Admin.
  const isOwner = draft.userId === session.user.id;
  const isVpAdminOfOrg = session.user.role === "VP_ADMIN" && draft.vpOrgId === session.user.organizationId;
  const isVarmovaAdmin = session.user.role === "VARMOVA_ADMIN";
  if (!isOwner && !isVpAdminOfOrg && !isVarmovaAdmin) {
    redirect("/unauthorized");
  }

  return { session, draft };
}

// Speichert die Daten des aktuellen Schritts und navigiert zum nächsten.
// Payload wird per zod validiert — Schema kommt aus WIZARD_STEPS.
export async function saveStepAction(formData: FormData) {
  const draftId = String(formData.get("draftId") ?? "");
  const stepId = String(formData.get("stepId") ?? "");
  const direction = String(formData.get("direction") ?? "next");

  if (!isValidStepId(stepId)) redirect("/projects");

  const step = getStep(stepId)!;
  const { draft } = await loadOwnedDraft(draftId);

  // FormData → POJO. Mehrfach-Keys (Gruppen-Checkboxes) werden zu Arrays aggregiert;
  // die Step-Schemas übernehmen Coercion (z.coerce.number, checkbox, stringArray).
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
      : nextStepId(step.id as WizardStepId) ?? step.id;

  await updateStepData(prisma, draft, step.id as WizardStepId, parsed.data as Record<string, unknown>, target as WizardStepId);

  revalidatePath(`/wizard/${draftId}`);
  redirect(`/wizard/${draftId}/${target}`);
}
