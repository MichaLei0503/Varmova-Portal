import { ProjectScope } from "@prisma/client";

// Dimensionierungsregeln als Datenstruktur (FA-ANG-044).
// Aktuell nur eine Stufe — Erweiterung auf weitere kW-Klassen = neue Zeile.
// AP 2.8 verschiebt diese Tabelle in den Admin (DB-gepflegt).
type VarmiRule = { maxAreaSqm: number; varmiSku: string };

const VARMI_RULES: ReadonlyArray<VarmiRule> = [
  { maxAreaSqm: 200, varmiSku: "VARMI-9.2" },
];

export function recommendVarmiSku(areaSqm: number): string | null {
  return VARMI_RULES.find((rule) => areaSqm <= rule.maxAreaSqm)?.varmiSku ?? null;
}

// Pufferspeicher wird nur bei Monovalent mit Speicher ausgegeben.
// Default = Kombi-Speicher 300/100 (Warmwasser + Heizung).
export function recommendBufferSku(scope: ProjectScope, areaSqm: number): string | null {
  if (scope !== "MONOVALENT_WITH_STORAGE") return null;
  return areaSqm > 180 ? "PUFFER-400" : "PUFFER-KOMBI-300-100";
}
