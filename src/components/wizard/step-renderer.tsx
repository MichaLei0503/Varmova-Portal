import type { WizardDraftData } from "@/lib/wizard/draft";
import { WizardStepId } from "@/lib/wizard/steps";
import { AuswahlStep } from "./steps/auswahl";
import { HausStep } from "./steps/haus";
import { HeizungStep } from "./steps/heizung";
import { KundeStep } from "./steps/kunde";
import { PlaceholderStep } from "./steps/placeholder";
import { ProjekttypStep } from "./steps/projekttyp";
import { ProjektStep } from "./steps/projekt";
import { PruefungStep } from "./steps/pruefung";

// Ein-Punkt-Dispatch für Step-Inhalte. Neue Steps = neuer Case.
// AP 1.7 tauscht den verbleibenden Platzhalter (Bestätigung) aus.
export function StepRenderer({
  step,
  draftId,
  draftData,
  sort,
}: {
  step: WizardStepId;
  draftId: string;
  draftData: WizardDraftData;
  sort?: string;
}) {
  const ownData = (draftData[step] ?? {}) as Record<string, unknown>;

  switch (step) {
    case "projekttyp":
      return <ProjekttypStep selected={ownData.productLine as "varmi" | undefined} />;
    case "kunde":
      return <KundeStep stepData={ownData} />;
    case "haus":
      return <HausStep stepData={ownData} />;
    case "heizung":
      return <HeizungStep stepData={ownData} />;
    case "projekt":
      return <ProjektStep draftData={draftData} />;
    case "auswahl":
      return <AuswahlStep draftId={draftId} draftData={draftData} sort={sort} />;
    case "pruefung":
      return <PruefungStep draftId={draftId} draftData={draftData} />;
    case "bestaetigung":
      return <PlaceholderStep stepTitle="Angebot erstellen & versenden" nextAp="AP 1.7" />;
  }
}
