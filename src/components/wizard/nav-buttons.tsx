import { Button } from "@/components/ui";
import { nextStepId, prevStepId, WizardStepId } from "@/lib/wizard/steps";

// Prev/Next-Buttons als zwei separate Submit-Targets desselben Formulars.
// Der `direction`-Hidden-Input wird vom jeweiligen Button via formNoValidate
// nicht überschrieben — wir nutzen `name="direction" value="prev|next"` pro Button.
export function WizardNavButtons({ step }: { step: WizardStepId }) {
  const hasPrev = prevStepId(step) !== null;
  const hasNext = nextStepId(step) !== null;
  const nextLabel = hasNext ? "Weiter" : "Abschließen";

  return (
    <div className="flex items-center justify-between">
      <Button
        type="submit"
        name="direction"
        value="prev"
        variant="outline"
        disabled={!hasPrev}
        formNoValidate
      >
        Zurück
      </Button>
      <Button type="submit" name="direction" value="next">
        {nextLabel}
      </Button>
    </div>
  );
}
