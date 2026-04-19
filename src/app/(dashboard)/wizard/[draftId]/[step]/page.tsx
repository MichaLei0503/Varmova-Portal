import { redirect } from "next/navigation";
import { saveStepAction } from "@/app/(dashboard)/wizard/actions";
import { Card, CardTitle } from "@/components/ui";
import { StepRenderer } from "@/components/wizard/step-renderer";
import { WizardNavButtons } from "@/components/wizard/nav-buttons";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loadDraft, WizardDraftData } from "@/lib/wizard/draft";
import { getStep, isValidStepId } from "@/lib/wizard/steps";

export default async function WizardStepPage({
  params,
}: {
  params: Promise<{ draftId: string; step: string }>;
}) {
  const session = await requireAuth();
  const { draftId, step } = await params;

  if (!isValidStepId(step)) redirect(`/wizard/${draftId}`);

  const draft = await loadDraft(prisma, draftId);
  if (!draft) redirect("/projects");

  const isOwner = draft.userId === session.user.id;
  const isVpAdminOfOrg = session.user.role === "VP_ADMIN" && draft.vpOrgId === session.user.organizationId;
  const isVarmovaAdmin = session.user.role === "VARMOVA_ADMIN";
  if (!isOwner && !isVpAdminOfOrg && !isVarmovaAdmin) redirect("/unauthorized");

  const stepConfig = getStep(step)!;
  const draftData = (draft.data as WizardDraftData) ?? {};

  return (
    <Card className="space-y-6">
      <CardTitle>{stepConfig.title}</CardTitle>
      <form action={saveStepAction} className="space-y-6">
        <input type="hidden" name="draftId" value={draft.id} />
        <input type="hidden" name="stepId" value={stepConfig.id} />
        <StepRenderer step={stepConfig.id} draftData={draftData} />
        <WizardNavButtons step={stepConfig.id} />
      </form>
    </Card>
  );
}
