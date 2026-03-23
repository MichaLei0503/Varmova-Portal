import { updatePricingConfigAction } from "@/app/(dashboard)/actions";
import { Button, Card, CardTitle, Input, Label, PageHeader, Textarea } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PricingSettingsPage() {
  await requireRole(["ADMIN"]);
  const config = await prisma.pricingConfig.findFirst();

  if (!config) {
    return <div>Keine Pricing-Konfiguration gefunden.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Preislogik & Angebotsparameter" description="Zentral konfigurierbares Pricing-Modul für das Varmi MVP." />
      <Card>
        <CardTitle>PricingConfig</CardTitle>
        <form action={updatePricingConfigAction} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label htmlFor="basePrice">Grundpreis</Label>
            <Input id="basePrice" name="basePrice" type="number" step="0.01" defaultValue={Number(config.basePrice)} required />
          </div>
          <div>
            <Label htmlFor="installationFlatFee">Installationspauschale</Label>
            <Input id="installationFlatFee" name="installationFlatFee" type="number" step="0.01" defaultValue={Number(config.installationFlatFee)} required />
          </div>
          <div>
            <Label htmlFor="pvIntegrationPrice">PV-Integration</Label>
            <Input id="pvIntegrationPrice" name="pvIntegrationPrice" type="number" step="0.01" defaultValue={Number(config.pvIntegrationPrice)} required />
          </div>
          <div>
            <Label htmlFor="storageIntegrationPrice">Speicherintegration</Label>
            <Input id="storageIntegrationPrice" name="storageIntegrationPrice" type="number" step="0.01" defaultValue={Number(config.storageIntegrationPrice)} required />
          </div>
          <div>
            <Label htmlFor="energyAuditPrice">Energieanalyse</Label>
            <Input id="energyAuditPrice" name="energyAuditPrice" type="number" step="0.01" defaultValue={Number(config.energyAuditPrice)} required />
          </div>
          <div>
            <Label htmlFor="largeHouseThreshold">Grenzwert große Objekte (m²)</Label>
            <Input id="largeHouseThreshold" name="largeHouseThreshold" type="number" defaultValue={config.largeHouseThreshold} required />
          </div>
          <div>
            <Label htmlFor="largeHouseSurcharge">Objektzuschlag</Label>
            <Input id="largeHouseSurcharge" name="largeHouseSurcharge" type="number" step="0.01" defaultValue={Number(config.largeHouseSurcharge)} required />
          </div>
          <div className="xl:col-span-4">
            <Label htmlFor="hintText">Hinweistext</Label>
            <Textarea id="hintText" name="hintText" defaultValue={config.hintText} required />
          </div>
          <div className="xl:col-span-4 flex justify-end">
            <Button type="submit">Preislogik speichern</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
