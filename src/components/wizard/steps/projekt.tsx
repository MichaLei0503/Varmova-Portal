import { ProjectScope } from "@prisma/client";
import { Input, Label, Select } from "@/components/ui";
import { projectScopeLabels } from "@/lib/utils";
import { recommendBufferSku, recommendVarmiSku } from "@/lib/wizard/sizing";
import type { WizardDraftData } from "@/lib/wizard/draft";

// Step 5 — Varmi-Konfiguration (FA-ANG-040..044).
// Die Varmi-Empfehlung stützt sich auf die in Step 3 erfasste Wohnfläche (FA-ANG-041).
export function ProjektStep({ draftData }: { draftData: WizardDraftData }) {
  const d = (draftData.projekt ?? {}) as Record<string, unknown>;
  const haus = (draftData.haus ?? {}) as Record<string, unknown>;
  const areaSqm = typeof haus.livingAreaSqm === "string" ? Number(haus.livingAreaSqm) : Number(haus.livingAreaSqm ?? 0);

  const scope = (typeof d.scope === "string" ? d.scope : ProjectScope.MONOVALENT_WITH_STORAGE) as ProjectScope;
  const recommendedVarmi = recommendVarmiSku(areaSqm) ?? "VARMI-9.2";
  const recommendedBuffer = recommendBufferSku(scope, areaSqm);
  const showUnsupportedWarning = areaSqm > 0 && recommendVarmiSku(areaSqm) === null;

  const getString = (key: string) => (typeof d[key] === "string" ? (d[key] as string) : "");
  const getBool = (key: string) => d[key] === true || d[key] === "true";

  return (
    <div className="space-y-6">
      {showUnsupportedWarning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Für die aktuelle Wohnfläche ({areaSqm} m²) existiert noch kein passendes Varmi-Modell.
          Bitte Varmova kontaktieren — wir erweitern das kW-Spektrum fortlaufend.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="scope">Auftragsumfang</Label>
          <Select id="scope" name="scope" defaultValue={scope} required>
            {Object.entries(projectScopeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="implementationWindow">Umsetzungszeitraum</Label>
          <Input id="implementationWindow" name="implementationWindow" defaultValue={getString("implementationWindow") || "KW 24/2026"} required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="varmiSku">Varmi-Modell (Empfehlung aus Wohnfläche)</Label>
          <Input id="varmiSku" name="varmiSku" defaultValue={getString("varmiSku") || recommendedVarmi} readOnly />
        </div>
        <div>
          <Label htmlFor="bufferSku">Pufferspeicher</Label>
          <Select id="bufferSku" name="bufferSku" defaultValue={getString("bufferSku") || recommendedBuffer || ""}>
            <option value="">Kein Pufferspeicher</option>
            <option value="PUFFER-KOMBI-300-100">WP-Kombi 300/100 l</option>
            <option value="PUFFER-400">Pufferspeicher 400 l</option>
          </Select>
          <p className="mt-1 text-xs text-slate-500">Wird nur bei „Monovalent mit Speicher" ausgewiesen.</p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-night">Neue Thermostate</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="newThermostats">Anzahl</Label>
            <Input id="newThermostats" name="newThermostats" type="number" min={0} defaultValue={getString("newThermostats") || "0"} />
          </div>
          <div>
            <Label htmlFor="thermostatSku">Typ</Label>
            <Select id="thermostatSku" name="thermostatSku" defaultValue={getString("thermostatSku")}>
              <option value="">Keine Auswahl</option>
              <option value="THERMOSTAT-KLASSISCH">Klassisch (35 €/Stück)</option>
              <option value="THERMOSTAT-SMART">Smart (85 €/Stück)</option>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-night">Heizkörper ersetzen</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="replaceHeaters">Anzahl</Label>
            <Input id="replaceHeaters" name="replaceHeaters" type="number" min={0} defaultValue={getString("replaceHeaters") || "0"} />
          </div>
          <div>
            <Label htmlFor="heaterReplacementSku">Typ</Label>
            <Select id="heaterReplacementSku" name="heaterReplacementSku" defaultValue={getString("heaterReplacementSku")}>
              <option value="">Keine Auswahl</option>
              <option value="HEIZKOERPER-STD">Standard (400 €/Stück)</option>
              <option value="HEIZKOERPER-NT">Niedertemperatur (750 €/Stück)</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" name="newMeterCabinet" defaultChecked={getBool("newMeterCabinet")} className="h-4 w-4 rounded border-slate-300" />
          Neuer Zählerschrank (2.500 € Pauschale)
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" name="requestSubsidy" defaultChecked={getBool("requestSubsidy")} className="h-4 w-4 rounded border-slate-300" />
          Förderung beantragen (BAFA/KfW)
        </label>
      </div>
    </div>
  );
}
