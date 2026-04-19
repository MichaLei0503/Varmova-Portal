import { Input, Label, Select } from "@/components/ui";

// Step 2 — Kundendaten (FA-ANG-010..014).
// Die abweichende Projektadresse ist als <details> realisiert: progressive enhancement,
// funktioniert ohne JavaScript, wird optisch aufgeklappt wenn Werte vorhanden sind.
export function KundeStep({ stepData }: { stepData: Record<string, unknown> }) {
  const d = stepData as Record<string, string | undefined>;
  const hasProjectAddress = Boolean(d.projectStreet || d.projectPostalCode);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="salutation">Anrede</Label>
          <Select id="salutation" name="salutation" defaultValue={d.salutation ?? "Herr"} required>
            <option value="Herr">Herr</option>
            <option value="Frau">Frau</option>
            <option value="Divers">Divers</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Titel</Label>
          <Input id="title" name="title" defaultValue={d.title ?? ""} placeholder="Dr., Prof. …" />
        </div>
        <div>
          <Label htmlFor="firstName">Vorname</Label>
          <Input id="firstName" name="firstName" defaultValue={d.firstName ?? ""} required minLength={2} />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname</Label>
          <Input id="lastName" name="lastName" defaultValue={d.lastName ?? ""} required minLength={2} />
        </div>
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" name="email" type="email" defaultValue={d.email ?? ""} required />
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" defaultValue={d.phone ?? ""} />
        </div>
        <div>
          <Label htmlFor="mobile">Mobil</Label>
          <Input id="mobile" name="mobile" defaultValue={d.mobile ?? ""} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-night">Rechnungsadresse</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <Label htmlFor="street">Straße</Label>
            <Input id="street" name="street" defaultValue={d.street ?? ""} required />
          </div>
          <div>
            <Label htmlFor="houseNumber">Hausnummer</Label>
            <Input id="houseNumber" name="houseNumber" defaultValue={d.houseNumber ?? ""} required />
          </div>
          <div>
            <Label htmlFor="addressExtra">Adresszusatz</Label>
            <Input id="addressExtra" name="addressExtra" defaultValue={d.addressExtra ?? ""} />
          </div>
          <div>
            <Label htmlFor="postalCode">PLZ</Label>
            <Input id="postalCode" name="postalCode" defaultValue={d.postalCode ?? ""} required pattern="[0-9]{4,5}" inputMode="numeric" />
          </div>
          <div className="xl:col-span-2">
            <Label htmlFor="city">Ort</Label>
            <Input id="city" name="city" defaultValue={d.city ?? ""} required />
          </div>
        </div>
      </div>

      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open={hasProjectAddress}>
        <summary className="cursor-pointer text-sm font-medium text-night">Abweichende Projektadresse (FA-ANG-012)</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <Label htmlFor="projectStreet">Straße</Label>
            <Input id="projectStreet" name="projectStreet" defaultValue={d.projectStreet ?? ""} />
          </div>
          <div>
            <Label htmlFor="projectHouseNumber">Hausnummer</Label>
            <Input id="projectHouseNumber" name="projectHouseNumber" defaultValue={d.projectHouseNumber ?? ""} />
          </div>
          <div>
            <Label htmlFor="projectPostalCode">PLZ</Label>
            <Input id="projectPostalCode" name="projectPostalCode" defaultValue={d.projectPostalCode ?? ""} pattern="[0-9]{4,5}" />
          </div>
          <div className="xl:col-span-2">
            <Label htmlFor="projectCity">Ort</Label>
            <Input id="projectCity" name="projectCity" defaultValue={d.projectCity ?? ""} />
          </div>
        </div>
      </details>
    </div>
  );
}
