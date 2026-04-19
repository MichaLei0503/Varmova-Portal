import type { WizardDraftData } from "@/lib/wizard/draft";
import { WizardStepId } from "@/lib/wizard/steps";
import { HausStep } from "./steps/haus";
import { HeizungStep } from "./steps/heizung";
import { KundeStep } from "./steps/kunde";
import { PlaceholderStep } from "./steps/placeholder";
import { ProjekttypStep } from "./steps/projekttyp";
import { ProjektStep } from "./steps/projekt";

// Ein-Punkt-Dispatch für Step-Inhalte. Neue Steps = neuer Case.
// AP 1.5/1.6/1.7 tauschen die verbleibenden Platzhalter (Auswahl/Prüfung/Bestätigung) aus.
export function StepRenderer({
  step,
  draftData,
}: {
  step: WizardStepId;
  draftData: WizardDraftData;
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
      return <PlaceholderStep stepTitle="Installationspartner-Auswahl" nextAp="AP 1.5" />;
    case "pruefung":
      return <PlaceholderStep stepTitle="Prüfung & Positionsliste" nextAp="AP 1.6" />;
    case "bestaetigung":
      return <PlaceholderStep stepTitle="Angebot erstellen & versenden" nextAp="AP 1.7" />;
  }
}
