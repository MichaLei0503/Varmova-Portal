import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { loadDraft } from "@/lib/wizard/draft";
import { FIRST_STEP } from "@/lib/wizard/steps";

// /wizard/<id> ohne Step-Segment springt auf den zuletzt bearbeiteten Schritt.
export default async function WizardIndexPage({ params }: { params: Promise<{ draftId: string }> }) {
  const { draftId } = await params;
  const draft = await loadDraft(prisma, draftId);
  if (!draft) redirect("/projects");
  redirect(`/wizard/${draftId}/${draft.currentStep || FIRST_STEP}`);
}
