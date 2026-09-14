import { Section, SectionHeader, Card } from "../components/primitives";
import { FeatureCard } from "../components/FeatureCard";
import { VarmiCutaway } from "../svg/VarmiCutaway";
import { useReveal } from "../motion/useReveal";

const LEGEND = [
  ["1", "Tank (Thermofluid)"],
  ["2", "Pumpe"],
  ["3", "Wärmetauscher"],
  ["4", "Steuerung"],
  ["5", "Schaltschrank"],
];

export function Technologie() {
  const imgRef = useReveal<HTMLDivElement>();
  return (
    <Section id="technologie">
      <SectionHeader
        eyebrow="Technologie"
        eyebrowIcon="cpu"
        title="Wie Varmi Wärme macht"
        subline="Strom rein, Wärme raus — mit einem Thermofluid-Tank (ISOTHERM 100/S), der Wärme puffert und über einen integrierten Wärmetauscher gleichmäßig an Ihren wassergeführten Heizkreis abgibt."
      />

      <div ref={imgRef} className="varmi-reveal" style={{ maxWidth: 780, margin: "44px auto 0" }}>
        <Card style={{ padding: "clamp(16px,3vw,28px)" }}>
          <div style={{ aspectRatio: "760 / 460" }}>
            <VarmiCutaway />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", marginTop: 12 }}>
            {LEGEND.map(([n, label]) => (
              <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--mist-60)", fontSize: "0.8rem" }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid var(--copper)", color: "var(--copper)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>{n}</span>
                {label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        <FeatureCard icon="bolt" number="1" title="Erzeugen" delay={0}>
          Vier Heizstäbe erhitzen das Wärmeträgerfluid im Tank. Strom wird direkt in Wärme
          umgesetzt — robust und wartungsarm.
        </FeatureCard>
        <FeatureCard icon="swap" number="2" title="Übergeben" delay={100}>
          Ein Wärmetauscher überträgt die Wärme an Ihren wassergeführten Heizkreis. Heizkörper
          oder Fußboden — beides möglich.
        </FeatureCard>
        <FeatureCard icon="sliders" number="3" title="Steuern" delay={200}>
          Eine intelligente Regelung entscheidet, wann geheizt und gespeichert wird — abgestimmt
          auf Tarif, PV und Bedarf. Bedienung &amp; Übersicht bequem per App.
        </FeatureCard>
      </div>
    </Section>
  );
}
