import { Prisma, PrismaClient, WizardDraft } from "@prisma/client";
import { FIRST_STEP, WizardStepId } from "./steps";

type Db = PrismaClient | Prisma.TransactionClient;

// Shape der JSONB-Spalte: pro Step-ID ein Unterobjekt.
export type WizardDraftData = Partial<Record<WizardStepId, Record<string, unknown>>>;

export async function createDraft(db: Db, userId: string, vpOrgId: string) {
  return db.wizardDraft.create({
    data: { userId, vpOrgId, currentStep: FIRST_STEP, data: {} },
  });
}

export async function loadDraft(db: Db, id: string) {
  return db.wizardDraft.findUnique({ where: { id } });
}

export async function updateStepData(
  db: Db,
  draft: WizardDraft,
  step: WizardStepId,
  payload: Record<string, unknown>,
  nextStep: WizardStepId | null,
) {
  const existing = (draft.data as WizardDraftData) ?? {};
  const merged: WizardDraftData = { ...existing, [step]: payload };
  return db.wizardDraft.update({
    where: { id: draft.id },
    data: {
      data: merged as Prisma.InputJsonValue,
      // currentStep zeigt immer auf den Schritt, der als nächstes zu bearbeiten ist.
      // Beim letzten Schritt bleibt er stehen.
      currentStep: nextStep ?? step,
    },
  });
}

