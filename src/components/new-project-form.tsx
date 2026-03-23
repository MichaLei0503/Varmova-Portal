"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/app/(dashboard)/actions";
import { initialActionState } from "@/lib/action-state";
import { Button, Card, CardTitle, Input, Label, Select, Textarea } from "@/components/ui";

export function NewProjectForm({
  installers,
}: {
  installers: { id: string; companyName: string; user: { name: string } }[];
}) {
  const [state, formAction, pending] = useActionState(createProjectAction, initialActionState);

  const fieldError = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</div>
      ) : null}

      <Card>
        <CardTitle>Kundendaten</CardTitle>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Vorname", "firstName"],
            ["Nachname", "lastName"],
            ["E-Mail", "email", "email"],
            ["Telefon", "phone"],
            ["Straße", "street"],
            ["Hausnummer", "houseNumber"],
            ["PLZ", "postalCode"],
            ["Ort", "city"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} name={name} type={type ?? "text"} required />
              {fieldError(name) ? <p className="mt-1 text-xs text-danger">{fieldError(name)}</p> : null}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Gebäudedaten</CardTitle>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label htmlFor="buildingType">Gebäudetyp</Label>
            <Select id="buildingType" name="buildingType" defaultValue="Einfamilienhaus">
              <option>Einfamilienhaus</option>
              <option>Mehrfamilienhaus</option>
              <option>Doppelhaushälfte</option>
              <option>Reihenhaus</option>
              <option>Gewerbeeinheit</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="livingAreaSqm">Wohnfläche in m²</Label>
            <Input id="livingAreaSqm" name="livingAreaSqm" type="number" min={30} defaultValue={140} required />
          </div>
          <div>
            <Label htmlFor="constructionYear">Baujahr</Label>
            <Input id="constructionYear" name="constructionYear" type="number" defaultValue={1998} required />
          </div>
          <div>
            <Label htmlFor="householdSize">Anzahl Personen</Label>
            <Input id="householdSize" name="householdSize" type="number" min={1} defaultValue={4} required />
          </div>
          <div>
            <Label htmlFor="currentHeatingType">Aktuelle Heizungsart</Label>
            <Input id="currentHeatingType" name="currentHeatingType" defaultValue="Gas-Brennwert" required />
          </div>
          <div>
            <Label htmlFor="annualEnergyConsumption">Jährlicher Energieverbrauch (optional)</Label>
            <Input id="annualEnergyConsumption" name="annualEnergyConsumption" type="number" placeholder="z. B. 22000" />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input id="hasPv" name="hasPv" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            <Label htmlFor="hasPv" className="mb-0">PV vorhanden</Label>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input id="hasStorage" name="hasStorage" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            <Label htmlFor="hasStorage" className="mb-0">Speicher vorhanden</Label>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="specialNote">Besonderer Hinweis / Freitext</Label>
          <Textarea id="specialNote" name="specialNote" placeholder="Zugangssituation, Keller, Förderbedarf, Besonderheiten ..." />
        </div>
      </Card>

      <Card>
        <CardTitle>Projektdaten</CardTitle>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label htmlFor="productName">Produkt</Label>
            <Input id="productName" name="productName" value="Varmi" readOnly />
          </div>
          <div>
            <Label htmlFor="implementationWindow">Umsetzungszeitraum</Label>
            <Input id="implementationWindow" name="implementationWindow" defaultValue="Q2 2026" required />
          </div>
          <div className="xl:col-span-2">
            <Label htmlFor="installerId">Installateur auswählen</Label>
            <Select id="installerId" name="installerId" required defaultValue={installers[0]?.id}>
              {installers.map((installer) => (
                <option key={installer.id} value={installer.id}>
                  {installer.companyName} · {installer.user.name}
                </option>
              ))}
            </Select>
            {fieldError("installerId") ? <p className="mt-1 text-xs text-danger">{fieldError("installerId")}</p> : null}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="files">Dateien / Fotos</Label>
            <Input id="files" name="files" type="file" multiple />
            <p className="mt-2 text-xs text-slate-500">Für das MVP werden Uploads lokal unter /public/uploads vorbereitet.</p>
          </div>
          <div>
            <Label htmlFor="internalSalesNote">Interne Notiz Vertrieb</Label>
            <Textarea id="internalSalesNote" name="internalSalesNote" placeholder="Interne Hinweise für Installateur oder Admin ..." />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Projekt wird erstellt..." : "Projekt anlegen & Angebot erzeugen"}
        </Button>
      </div>
    </form>
  );
}
