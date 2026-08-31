import { redirect } from "next/navigation";
import { Camera } from "lucide-react";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/ui";
import { requireAuth } from "@/lib/auth";
import { quickCaptureAction } from "./actions";

const CAPTURE_ROLES: Role[] = ["VP", "VP_ADMIN", "VARMOVA_ADMIN"];

export const metadata = { title: "Schnellerfassung · Varmova Partner Portal" };

// Mobile-first: der 2-Minuten-Flow für die Haustür. Große Touch-Ziele,
// ein Formular, ein Knopf. Das vollständige Angebot entsteht später im Wizard.
export default async function ErfassungPage() {
  const session = await requireAuth();
  if (!CAPTURE_ROLES.includes(session.user.role)) redirect("/unauthorized");

  const field = "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-copper";
  const label = "mt-4 mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <PageHeader
        title="Schnellerfassung"
        description="Aufmaß-Basisdaten und Fotos direkt vor Ort — in unter zwei Minuten. Angebot und Monteur-Zuweisung folgen danach im Büro."
      />

      <form action={quickCaptureAction} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <label className={label} htmlFor="name">Kundenname *</label>
        <input id="name" name="name" required className={field} placeholder="Vor- und Nachname" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="phone">Telefon</label>
            <input id="phone" name="phone" type="tel" className={field} placeholder="0151 …" />
          </div>
          <div>
            <label className={label} htmlFor="email">E-Mail</label>
            <input id="email" name="email" type="email" className={field} placeholder="optional" />
          </div>
          <div>
            <label className={label} htmlFor="postalCode">PLZ</label>
            <input id="postalCode" name="postalCode" inputMode="numeric" className={field} placeholder="85435" />
          </div>
          <div>
            <label className={label} htmlFor="city">Ort</label>
            <input id="city" name="city" className={field} placeholder="Erding" />
          </div>
        </div>

        <label className={label} htmlFor="currentHeating">Aktuelle Heizung</label>
        <select id="currentHeating" name="currentHeating" className={field} defaultValue="">
          <option value="">Bitte wählen …</option>
          <option>Ölheizung</option>
          <option>Gasheizung</option>
          <option>Nachtspeicher</option>
          <option>Pelletheizung</option>
          <option>Wärmepumpe</option>
          <option>Fernwärme</option>
          <option>Sonstiges</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="buildingYear">Baujahr Haus</label>
            <input id="buildingYear" name="buildingYear" inputMode="numeric" className={field} placeholder="1985" />
          </div>
          <div>
            <label className={label} htmlFor="livingAreaSqm">Wohnfläche m²</label>
            <input id="livingAreaSqm" name="livingAreaSqm" inputMode="numeric" className={field} placeholder="140" />
          </div>
        </div>

        <label className={label} htmlFor="timeframe">Realisierungszeitraum</label>
        <select id="timeframe" name="timeframe" className={field} defaultValue="">
          <option value="">Bitte wählen …</option>
          <option>So schnell wie möglich</option>
          <option>0–3 Monate</option>
          <option>3–6 Monate</option>
          <option>6–12 Monate</option>
          <option>Nur Information</option>
        </select>

        <label className={label} htmlFor="photos">Fotos (Heizraum, Anschlüsse, Zählerschrank)</label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-copper hover:text-night">
          <Camera className="h-5 w-5 text-copper" />
          Fotos aufnehmen oder auswählen
          <input id="photos" name="photos" type="file" accept="image/*" multiple className="hidden" />
        </label>
        <p className="mt-1 text-xs text-slate-400">Mehrfachauswahl möglich · bis 20 Fotos</p>

        <label className={label} htmlFor="message">Notiz</label>
        <textarea id="message" name="message" rows={2} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-copper" placeholder="Besonderheiten vor Ort …" />

        <button
          type="submit"
          className="mt-6 h-14 w-full rounded-full bg-copper text-base font-semibold text-night transition hover:bg-[#C5854A] active:scale-[0.99]"
        >
          Erfassung speichern
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Landet sofort in den Leads — das Angebot erstellt ihr danach im Wizard.
        </p>
      </form>
    </div>
  );
}
