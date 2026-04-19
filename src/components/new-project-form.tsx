"use client";

import { useActionState } from "react";
import { ProjectScope } from "@prisma/client";
import { createProjectAction } from "@/app/(dashboard)/actions";
import { initialActionState } from "@/lib/action-state";
import { projectScopeLabels } from "@/lib/utils";
import { Button, Card, CardTitle, Input, Label, Select, Textarea } from "@/components/ui";

type InstallerOption = { id: string; name: string };

// AP 1.0 Stub-Formular. Der volle 8-Schritt-Wizard folgt in AP 1.3.
// Diese Form deckt nur das Minimum ab, damit ein Projekt mit Offer angelegt werden kann.
export function NewProjectForm({ installers }: { installers: InstallerOption[] }) {
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
              <Input id={name} name={name} type={type ?? "text"} required={name !== "phone"} />
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
              <option>Zweifamilienhaus</option>
              <option>Mehrfamilienhaus</option>
              <option>Reihenhaus</option>
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
            <Label htmlFor="currentHeatingType">Aktuelle Heizungsart</Label>
            <Select id="currentHeatingType" name="currentHeatingType" defaultValue="Gas-Brennwert">
              <option>Gas-Brennwert</option>
              <option>Gasheizung</option>
              <option>Öl-Heizung</option>
              <option>Ölheizung</option>
              <option>Holzheizung</option>
              <option>Pelletheizung</option>
              <option>Wärmepumpe</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="annualEnergyConsumption">Jährlicher Energieverbrauch (optional)</Label>
            <Input id="annualEnergyConsumption" name="annualEnergyConsumption" type="number" placeholder="z. B. 22000" />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="specialNote">Besonderer Hinweis / Freitext</Label>
          <Textarea id="specialNote" name="specialNote" placeholder="Zugangssituation, Keller, Förderbedarf, Besonderheiten …" />
        </div>
      </Card>

      <Card>
        <CardTitle>Projekt</CardTitle>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label htmlFor="scope">Auftragsumfang</Label>
            <Select id="scope" name="scope" defaultValue={ProjectScope.MONOVALENT_WITH_STORAGE}>
              {Object.entries(projectScopeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="varmiSku">Varmi-Modell</Label>
            <Input id="varmiSku" name="varmiSku" defaultValue="VARMI-9.2" readOnly />
          </div>
          <div>
            <Label htmlFor="bufferSku">Pufferspeicher (nur bei Monovalent mit Speicher)</Label>
            <Select id="bufferSku" name="bufferSku" defaultValue="PUFFER-KOMBI-300-100">
              <option value="">Kein Pufferspeicher</option>
              <option value="PUFFER-KOMBI-300-100">WP-Kombi 300/100 l</option>
              <option value="PUFFER-400">Pufferspeicher 400 l</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="implementationWindow">Umsetzungszeitraum</Label>
            <Input id="implementationWindow" name="implementationWindow" defaultValue="KW 24/2026" required />
          </div>
          <div className="xl:col-span-2">
            <Label htmlFor="ipOrgId">Installationspartner auswählen</Label>
            <Select id="ipOrgId" name="ipOrgId" required defaultValue={installers[0]?.id}>
              {installers.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
            {fieldError("ipOrgId") ? <p className="mt-1 text-xs text-danger">{fieldError("ipOrgId")}</p> : null}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="files">Dateien / Fotos</Label>
            <Input id="files" name="files" type="file" multiple />
          </div>
          <div>
            <Label htmlFor="internalSalesNote">Interne Notiz Vertrieb</Label>
            <Textarea id="internalSalesNote" name="internalSalesNote" placeholder="Interne Hinweise für Installateur oder Admin …" />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Projekt wird erstellt…" : "Projekt anlegen & Angebot erzeugen"}
        </Button>
      </div>
    </form>
  );
}
