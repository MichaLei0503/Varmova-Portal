import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { WizardProgress } from "@/components/wizard/progress-bar";
import { requireAuth } from "@/lib/auth";
import { loadDraft } from "@/lib/wizard/draft";
import { WIZARD_STEPS, WizardStepId } from "@/lib/wizard/steps";
import { prisma } from "@/lib/prisma";

export default async function WizardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ draftId: string }>;
}) {
  const session = await requireAuth();
  const { draftId } = await params;
  const draft = await loadDraft(prisma, draftId);

  if (!draft) redirect("/projects");

  const isOwner = draft.userId === session.user.id;
  const isVpAdminOfOrg = session.user.role === "VP_ADMIN" && draft.vpOrgId === session.user.organizationId;
  const isVarmovaAdmin = session.user.role === "VARMOVA_ADMIN";
  if (!isOwner && !isVpAdminOfOrg && !isVarmovaAdmin) redirect("/unauthorized");

  const filledSteps = Object.keys((draft.data as Record<string, unknown>) ?? {}) as WizardStepId[];
  const completed = filledSteps.filter((id) => WIZARD_STEPS.some((s) => s.id === id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Neues Projekt"
        description="8-Schritt-Wizard für das Varmi-Angebot. Der Fortschritt wird automatisch gespeichert."
      />
      <WizardProgress
        draftId={draft.id}
        currentStep={draft.currentStep as WizardStepId}
        completedSteps={completed}
      />
      {children}
    </div>
  );
}
