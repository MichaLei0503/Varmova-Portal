import { Section, SectionHeader, Card, Button } from "../components/primitives";
import { useReveal } from "../motion/useReveal";
import type { VarmiProps } from "../types";

type Row = [string, string, string?]; // [label, value, note?]

// Quelle: Technisches Datenblatt VARMI, Stand 07/2026 (Varmova-Broschüre inkl. Datenblatt).
const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Leistung & Effizienz",
    rows: [
      ["Heizleistung (max.)", "17,8 kW", "Herstellerangabe"],
      ["Heizleistung (Ø erwartet)", "ca. 10,5 kW", "Herstellerangabe"],
      ["Leistungsaufnahme (max.)", "9,2 kW", "elektrisch"],
      ["Effizienzfaktor", "1,8 – 2,2", "variiert nach Einbausituation"],
      ["Energieeffizienzklasse", "A+", "außentemperaturunabhängig"],
    ],
  },
  {
    title: "Elektrische Daten",
    rows: [
      ["Betriebsspannung", "3/N/PE AC 400 V / 50 Hz", "Drehstrom"],
      ["Steuerspannung", "230 V AC"],
      ["Stromaufnahme (max.)", "23 A"],
      ["Absicherung", "25 A", "erforderlich"],
      ["Zuleitung", "5 × 2,5 bis 5 × 16 mm²"],
    ],
  },
  {
    title: "Hydraulik & Medium",
    rows: [
      ["Betriebsmittel", "ISOTHERM 100/S", "Thermofluid, Füllmenge ca. 16 l"],
      ["Anschlüsse Vor-/Rücklauf", "1″ IG"],
      ["Achsabstand Vor-/Rücklauf", "154 mm"],
      ["Mindestvolumenstrom", "1,9 m³/h"],
      ["Restförderhöhe", "6,0 m", "bei Mindestvolumenstrom"],
      ["Betriebsdruck", "0,5 – 3,0 bar"],
    ],
  },
  {
    title: "Abmessungen & Gewicht",
    rows: [
      ["Gesamtanlage (H×B×T)", "780 × 846 × 355 mm", "Anlagen- und Schaltschrank kombiniert"],
      ["Anlagenschrank (H×B×T)", "780 × 700 × 355 mm"],
      ["Schaltschrank (H×B×T)", "780 × 145 × 345 mm"],
      ["Gewicht (betriebsbereit)", "ca. 90 kg"],
      ["Gewicht (unbefüllt)", "ca. 75 kg", "Anlagenschrank 56 kg, Schaltschrank 19 kg"],
      ["Lieferung", "vormontierte Funktionseinheit"],
    ],
  },
  {
    title: "Steuerung & Regelung",
    rows: [
      ["Steuerungstyp", "UVR-16X2S", "Technische Alternative"],
      ["Display", "Farb-Touch-Display"],
      ["Schnittstellen", "CAN-Bus, DL-Bus"],
      ["Ausgänge", "11× Relais, 5× Multifunktion (0–10 V / PWM)"],
      ["Sensorkompatibilität", "PT1000, PT500, Ni1000, KTY, 0–10 V, 4–20 mA"],
    ],
  },
];

function Group({ title, rows, delay }: { title: string; rows: Row[]; delay: number }) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card style={{ height: "100%", padding: "26px 28px" }}>
        <h3 style={{ color: "var(--copper)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
          {title}
        </h3>
        <table className="varmi-dtable" style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {rows.map(([label, value, note]) => (
              <tr key={label} style={{ borderTop: "1px solid var(--hairline)" }}>
                <th
                  scope="row"
                  style={{ textAlign: "left", fontWeight: 400, color: "var(--mist-60)", padding: "11px 12px 11px 0", fontSize: "0.9rem", verticalAlign: "top" }}
                >
                  {label}
                  {note ? (
                    <span style={{ display: "block", color: "var(--mist-40)", fontSize: "0.775rem", marginTop: 3, lineHeight: 1.4 }}>
                      {note}
                    </span>
                  ) : null}
                </th>
                <td
                  style={{
                    textAlign: "right",
                    color: "var(--mist)",
                    padding: "11px 0",
                    fontSize: "0.9rem",
                    verticalAlign: "top",
                    // Long enumerations must wrap; short values stay on one line.
                    whiteSpace: value.length > 24 ? "normal" : "nowrap",
                  }}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function Daten({ datasheetUrl }: Pick<VarmiProps, "datasheetUrl">) {
  const footRef = useReveal<HTMLDivElement>();
  return (
    <Section id="daten">
      <SectionHeader
        eyebrow="Technische Daten"
        eyebrowIcon="list"
        title="Alle Daten auf einen Blick"
      />

      <div className="varmi-grid varmi-grid-2" style={{ marginTop: 44, alignItems: "start" }}>
        {GROUPS.map((g, i) => (
          <Group key={g.title} title={g.title} rows={g.rows} delay={(i % 2) * 90} />
        ))}
      </div>

      <div ref={footRef} className="varmi-reveal" style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
        <p style={{ color: "var(--mist-60)", fontSize: "0.85rem", lineHeight: 1.6 }}>
          Alle Werte nach Technischem Datenblatt VARMI, Stand 07/2026. Die Lieferung erfolgt als
          vormontierte Funktionseinheit; das Thermofluid ISOTHERM 100/S ist integraler Bestandteil
          des Systems.
        </p>

        {datasheetUrl ? (
          <div>
            <Button variant="gradient" href={datasheetUrl} newTab icon="download">
              Technisches Datenblatt (PDF)
            </Button>
          </div>
        ) : null}

        <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, maxWidth: 760 }}>
          Technische Änderungen und Irrtümer vorbehalten. Die angegebenen Leistungsdaten (insb.
          Heizleistung, Effizienzfaktor und Energieeffizienzklasse) basieren auf Herstellerangaben
          und bedürfen vor der finalen Projektierung einer normativen Verifizierung. Die Eignung der
          Anlage für den konkreten Einsatzfall ist kundenseitig zu prüfen. Effizienzwerte beschreiben
          das Gerät und sind keine Aussage über Heizkosten im Betrieb. CE-Konformitätserklärungen und
          Prüfberichte zur Anlagenzertifizierung sind gesondert anzufordern.
        </p>
      </div>
    </Section>
  );
}
