import { startWizardAction } from "@/app/(dashboard)/wizard/actions";
import { Button, Card, CardTitle, PageHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth";

// /projects/new startet den 8-Schritt-Wizard.
// Der Stub aus AP 1.0 (NewProjectForm) ist damit abgelöst — der Wizard
// erzeugt bei Abschluss Project + Offer mit Snapshot (Finalisierung folgt in AP 1.7).
export default async function NewProjectPage() {
  await requireRole(["VP", "VP_ADMIN", "VARMOVA_ADMIN"]);

  return (
    <div className="space-y-6">
      <PageHeader title="Neues Projekt" description="Starte den geführten 8-Schritt-Wizard für das Varmi-Angebot." />
      <Card className="space-y-4">
        <CardTitle>Bereit für das nächste Angebot?</CardTitle>
        <p className="text-sm text-slate-600">
          Der Wizard führt dich durch Projekttyp, Kunden- und Gebäudedaten, Heizungsaufnahme,
          Varmi-Konfiguration, Installationspartner-Auswahl, Prüfung und Versand.
          Dein Fortschritt wird nach jedem Schritt automatisch gespeichert.
        </p>
        <form action={startWizardAction}>
          <Button type="submit">Wizard starten</Button>
        </form>
      </Card>
    </div>
  );
}
