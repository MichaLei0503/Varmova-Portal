import { Flame } from "lucide-react";

// Schritt 1 — Projekttyp. Laut Lastenheft (FA-ANG-001) aktuell nur Varmi;
// die Kachel-Struktur bleibt erhalten, damit PV/Lüftung später einfach ergänzt werden können.
export function ProjekttypStep({ selected }: { selected?: "varmi" }) {
  const value = selected ?? "varmi";
  return (
    <div className="space-y-4">
      <input type="hidden" name="productLine" value={value} />
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex cursor-pointer flex-col items-start gap-3 rounded-2xl border-2 border-copper bg-copper/5 p-6">
          <Flame className="h-8 w-8 text-copper" />
          <div>
            <p className="text-lg font-semibold text-night">Varmi Heiztechnologie</p>
            <p className="mt-1 text-sm text-slate-600">Komplettsystem inkl. Montage und Elektroinstallation.</p>
          </div>
        </label>
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">
          Photovoltaik (folgt)
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">
          Lüftung (folgt)
        </div>
      </div>
    </div>
  );
}
