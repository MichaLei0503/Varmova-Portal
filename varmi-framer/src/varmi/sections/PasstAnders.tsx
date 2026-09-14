import { Section, SectionHeader, Card } from "../components/primitives";
import { Icon, type IconName } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";

const CHIPS: { label: string; icon: IconName }[] = [
  { label: "Altbau", icon: "home" },
  { label: "Denkmalgeschützte Gebäude", icon: "landmark" },
  { label: "Mehrfamilienhäuser", icon: "building" },
  { label: "Bestandsgebäude", icon: "box" },
  { label: "Enge Technikräume", icon: "doorClosed" },
  { label: "Neubau", icon: "home" },
];

const PRO = [
  "Einfache, schnelle Installation",
  "Kompatibel mit PV & Speicher",
  "Günstig in der Anschaffung",
  "Für Altbau, Denkmal, MFH & Neubau geeignet",
  "Außentemperaturunabhängiger Betrieb",
  "Keine Abhängigkeit von Vorlauftemperaturen",
  "Smarte Steuerung inklusive",
];

const CON = [
  "Komplexe Installation",
  "Nicht immer PV-kompatibel",
  "Oft nur mit Förderung bezahlbar",
  "Einschränkungen bei der Umsetzbarkeit",
  "Leistung sinkt mit der Außentemperatur",
  "Auf niedrige Vorlauftemperaturen angewiesen",
  "Aufwändige Inbetriebnahme",
];

function CompareList({
  title,
  items,
  positive,
}: {
  title: string;
  items: string[];
  positive: boolean;
}) {
  const ref = useReveal<HTMLDivElement>(positive ? 0 : 100);
  return (
    <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card accent={positive} style={{ height: "100%", padding: "28px 30px" }}>
        <h3 style={{ fontSize: "var(--t-card)", fontWeight: 500, color: positive ? "var(--mist)" : "var(--mist-70)", marginBottom: 20, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <ul style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => (
            <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: positive ? "rgba(232,162,96,0.14)" : "rgba(213,219,230,0.06)",
                  color: positive ? "var(--copper)" : "var(--mist-40)",
                }}
              >
                <Icon name={positive ? "check" : "x"} size={13} strokeWidth={2} />
              </span>
              <span style={{ color: positive ? "var(--mist)" : "var(--mist-60)", fontSize: "0.975rem" }}>{it}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function PasstAnders() {
  const chipsRef = useReveal<HTMLDivElement>();
  return (
    <Section id="passt-anders">
      <SectionHeader
        eyebrow="Für jedes Haus"
        eyebrowIcon="home"
        title="Da, wo andere scheitern"
        subline="Ideal für Gebäude, in denen eine Wärmepumpe schwer umzusetzen ist — wegen Platz, Schallschutz, Denkmalschutz oder fehlender Außenfläche."
      />

      <div
        ref={chipsRef}
        className="varmi-reveal"
        style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 40 }}
      >
        {CHIPS.map((c) => (
          <span
            key={c.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 60,
              border: "1px solid var(--hairline)",
              background: "var(--panel)",
              color: "var(--mist-70)",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "var(--copper)", display: "inline-flex" }}>
              <Icon name={c.icon} size={16} />
            </span>
            {c.label}
          </span>
        ))}
      </div>

      <div className="varmi-grid varmi-grid-2" style={{ marginTop: 44 }}>
        <CompareList title="Varmi" items={PRO} positive />
        <CompareList title="Bekannte Heiztechnologien" items={CON} positive={false} />
      </div>
    </Section>
  );
}
