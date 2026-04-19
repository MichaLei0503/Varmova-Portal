import { HeatingLocation, HeatingSystem } from "@prisma/client";
import { Input, Label, Select } from "@/components/ui";

const HEATING_SYSTEM_LABELS: Record<HeatingSystem, string> = {
  EINROHR: "Einrohr",
  ZWEIROHR: "Zweirohr",
};

const HEATING_LOCATION_LABELS: Record<HeatingLocation, string> = {
  KG: "Kellergeschoss",
  EG: "Erdgeschoss",
  OG: "Obergeschoss",
  DG: "Dachgeschoss",
  AUSSEN: "Außen",
};

const HEATER_TYPES = ["Heizkörper", "Fußbodenheizung"] as const;

// Step 4 — Bestandsheizung (FA-ANG-030..036).
// "Potentialausgleich vorhanden" bleibt als Info-Feld; laut Produktfreigabe 2026-04-17
// fließt es nicht in die Preiskalkulation ein.
export function HeizungStep({ stepData }: { stepData: Record<string, unknown> }) {
  const d = stepData as Record<string, unknown>;
  const getString = (key: string) => (typeof d[key] === "string" ? (d[key] as string) : "");
  const getBool = (key: string) => d[key] === true || d[key] === "true";
  const selectedHeaterTypes = Array.isArray(d.heaterTypes) ? (d.heaterTypes as string[]) : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="currentHeatingType">Heizungstyp</Label>
          <Select id="currentHeatingType" name="currentHeatingType" defaultValue={getString("currentHeatingType") || "Gas-Brennwert"} required>
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
          <Label htmlFor="currentHeatingInstallYear">Installationsjahr</Label>
          <Input id="currentHeatingInstallYear" name="currentHeatingInstallYear" type="number" min={1950} max={new Date().getFullYear()} defaultValue={getString("currentHeatingInstallYear")} placeholder="z. B. 2000" />
        </div>
        <div>
          <Label htmlFor="currentHeatingSystem">Heizsystem</Label>
          <Select id="currentHeatingSystem" name="currentHeatingSystem" defaultValue={getString("currentHeatingSystem")}>
            <option value="">Nicht angegeben</option>
            {Object.entries(HEATING_SYSTEM_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="currentHeatingLocation">Ort der Heizung</Label>
          <Select id="currentHeatingLocation" name="currentHeatingLocation" defaultValue={getString("currentHeatingLocation")}>
            <option value="">Nicht angegeben</option>
            {Object.entries(HEATING_LOCATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="annualEnergyConsumption">Verbrauch (kWh/Jahr)</Label>
          <Input id="annualEnergyConsumption" name="annualEnergyConsumption" type="number" min={0} defaultValue={getString("annualEnergyConsumption")} placeholder="z. B. 22000" />
        </div>
        <div>
          <Label htmlFor="heatingCircuits">Anzahl Heizkreise</Label>
          <Select id="heatingCircuits" name="heatingCircuits" defaultValue={getString("heatingCircuits")}>
            <option value="">Nicht angegeben</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Select>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-night">Heizkörperart</p>
        <div className="grid gap-3 md:grid-cols-2">
          {HEATER_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" name="heaterTypes" value={type} defaultChecked={selectedHeaterTypes.includes(type)} className="h-4 w-4 rounded border-slate-300" />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-night">Vorhandene Komponenten</p>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" name="hasPotentialEqualization" defaultChecked={getBool("hasPotentialEqualization")} className="h-4 w-4 rounded border-slate-300" />
            Potentialausgleich
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" name="hasSolarThermal" defaultChecked={getBool("hasSolarThermal")} className="h-4 w-4 rounded border-slate-300" />
            Solarthermie
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" name="hasCirculationPump" defaultChecked={getBool("hasCirculationPump")} className="h-4 w-4 rounded border-slate-300" />
            Zirkulationspumpe
          </label>
        </div>
      </div>
    </div>
  );
}
