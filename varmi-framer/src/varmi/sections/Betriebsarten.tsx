import { Section, SectionHeader } from "../components/primitives";
import { FeatureCard } from "../components/FeatureCard";

export function Betriebsarten() {
  return (
    <Section id="betriebsarten">
      <SectionHeader
        eyebrow="Betriebsarten"
        eyebrowIcon="layers"
        title={
          <>
            Drei Wege, <span className="varmi-serif">warm</span> zu werden
          </>
        }
      />
      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        <FeatureCard icon="battery" title="Ladebetrieb" delay={0}>
          Varmi lädt Ihren thermischen Wärmespeicher und gibt die Wärme bedarfsgerecht ab — ideal,
          um günstige Stromzeiten zu nutzen.
        </FeatureCard>
        <FeatureCard icon="droplet" title="Durchlauferhitzer" delay={100}>
          Wärme genau dann, wenn sie gebraucht wird — direkt und ohne Vorlauf.
        </FeatureCard>
        <FeatureCard icon="hybrid" title="Hybridbetrieb" delay={200}>
          Varmi erweitert Ihren bestehenden hydraulischen Kreislauf und arbeitet mit Ihrer
          vorhandenen Öl- oder Gasheizung zusammen. Sie behalten die Sicherheit Ihres Bestands.
        </FeatureCard>
      </div>
    </Section>
  );
}
