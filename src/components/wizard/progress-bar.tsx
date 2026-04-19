import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS, WizardStepId } from "@/lib/wizard/steps";

// Der Fortschrittsbalken liest seine Struktur aus WIZARD_STEPS.
// Ein neuer Step im Config-Array = automatisch ein neuer Punkt in der UI.
export function WizardProgress({
  draftId,
  currentStep,
  completedSteps,
}: {
  draftId: string;
  currentStep: WizardStepId;
  completedSteps: ReadonlyArray<WizardStepId>;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-soft">
      {WIZARD_STEPS.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isDone = completedSteps.includes(step.id);
        const canJump = isDone || isCurrent;

        const dot = (
          <span
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              isCurrent && "bg-night text-white",
              !isCurrent && isDone && "bg-emerald-100 text-emerald-700",
              !isCurrent && !isDone && "bg-slate-100 text-slate-500",
            )}
          >
            {isDone ? <Check className="h-4 w-4" /> : index + 1}
          </span>
        );

        const label = (
          <span
            className={cn(
              "text-sm font-medium",
              isCurrent && "text-night",
              !isCurrent && isDone && "text-emerald-700",
              !isCurrent && !isDone && "text-slate-500",
            )}
          >
            {step.title}
          </span>
        );

        const inner = (
          <span className="flex items-center gap-2">
            {dot}
            {label}
          </span>
        );

        return (
          <li key={step.id} className="flex items-center">
            {canJump ? (
              <Link href={`/wizard/${draftId}/${step.id}`} className="rounded-xl px-2 py-1 transition hover:bg-slate-50">
                {inner}
              </Link>
            ) : (
              <span className="px-2 py-1" aria-current={isCurrent}>{inner}</span>
            )}
            {index < WIZARD_STEPS.length - 1 ? (
              <span className="mx-2 h-px w-6 bg-slate-200" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
