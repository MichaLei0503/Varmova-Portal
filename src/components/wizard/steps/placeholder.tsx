// Generischer Platzhalter für die AP-1.3-Zwischenphase.
// AP 1.4 ersetzt diese Komponenten durch echte Formulare mit Lastenheft-Feldern.
export function PlaceholderStep({ stepTitle, nextAp }: { stepTitle: string; nextAp: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-lg font-semibold text-night">{stepTitle}</p>
      <p className="mt-2 text-sm text-slate-600">
        Dieser Schritt erhält sein vollständiges Formular in {nextAp}.<br />
        Du kannst aktuell durchklicken, um die Wizard-Navigation zu prüfen.
      </p>
    </div>
  );
}
