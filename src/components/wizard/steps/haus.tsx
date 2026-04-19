import { WindowType } from "@prisma/client";
import { Input, Label, Select } from "@/components/ui";

const WINDOW_TYPE_LABELS: Record<WindowType, string> = {
  EINFACH: "Einfachverglasung",
  DOPPEL: "Doppelverglasung",
  DREIFACH: "Dreifachverglasung",
};

// Step 3 — Haus (FA-ANG-020..023).
export function HausStep({ stepData }: { stepData: Record<string, unknown> }) {
  const str = (key: string) => (typeof stepData[key] === "string" ? (stepData[key] as string) : "");
  const bool = (key: string) => stepData[key] === true || stepData[key] === "true";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="buildingType">Gebäudetyp</Label>
          <Select id="buildingType" name="buildingType" defaultValue={str("buildingType") || "Einfamilienhaus"} required>
            <option>Einfamilienhaus</option>
            <option>Zweifamilienhaus</option>
            <option>Mehrfamilienhaus</option>
            <option>Reihenhaus</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="constructionYear">Baujahr</Label>
          <Input id="constructionYear" name="constructionYear" type="number" min={1800} max={new Date().getFullYear()} defaultValue={str("constructionYear")} required />
        </div>
        <div>
          <Label htmlFor="livingAreaSqm">Beheizte Wohnfläche (m²)</Label>
          <Input id="livingAreaSqm" name="livingAreaSqm" type="number" min={30} defaultValue={str("livingAreaSqm")} required />
        </div>
        <div>
          <Label htmlFor="units">Anzahl Wohneinheiten</Label>
          <Input id="units" name="units" type="number" min={1} defaultValue={str("units") || "1"} />
        </div>
        <div>
          <Label htmlFor="bathrooms">Anzahl Badezimmer</Label>
          <Input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={str("bathrooms") || "1"} />
        </div>
        <div>
          <Label htmlFor="bathtubs">Anzahl Badewannen</Label>
          <Input id="bathtubs" name="bathtubs" type="number" min={0} defaultValue={str("bathtubs") || "0"} />
        </div>
        <div>
          <Label htmlFor="showers">Anzahl Duschen</Label>
          <Input id="showers" name="showers" type="number" min={0} defaultValue={str("showers") || "1"} />
        </div>
        <div>
          <Label htmlFor="windowType">Fensterart</Label>
          <Select id="windowType" name="windowType" defaultValue={str("windowType")}>
            <option value="">Nicht angegeben</option>
            {Object.entries(WINDOW_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" name="roofInsulated" defaultChecked={bool("roofInsulated")} className="h-4 w-4 rounded border-slate-300" />
          Dach gedämmt
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" name="exteriorInsulated" defaultChecked={bool("exteriorInsulated")} className="h-4 w-4 rounded border-slate-300" />
          Außendämmung vorhanden
        </label>
      </div>
    </div>
  );
}
