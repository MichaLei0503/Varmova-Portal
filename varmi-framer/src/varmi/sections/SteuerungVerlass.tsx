import { Section, SectionHeader } from "../components/primitives";
import { FeatureCard } from "../components/FeatureCard";
import { useReveal } from "../motion/useReveal";

export function SteuerungVerlass() {
  const closeRef = useReveal<HTMLDivElement>();
  return (
    <Section id="steuerung-verlass">
      <SectionHeader
        eyebrow="Steuerung & Verlässlichkeit"
        eyebrowIcon="sliders"
        title="Sicherheit. Ruhe. Kontrolle."
      />

      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        <FeatureCard icon="smartphone" title="App & Automationen" delay={0}>
          Über LAN/App steuern Sie Zeiten und Temperaturen und sehen jederzeit, was Varmi gerade
          tut. Den Rest optimiert die Regelung selbst.
        </FeatureCard>
        <FeatureCard icon="shieldCheck" title="Wartungsarm & robust" delay={100}>
          Gebaut für den Dauerbetrieb: ohne Außeneinheit, ohne Lärm, mit minimalem Serviceaufwand.
        </FeatureCard>
        <FeatureCard icon="activity" title="Sicher überwacht" delay={200}>
          Selbst-Monitoring meldet Auffälligkeiten früh; Fernwartung möglich. Garantie bis 5 Jahre².
        </FeatureCard>
      </div>

      <div ref={closeRef} className="varmi-reveal" style={{ textAlign: "center", marginTop: 40 }}>
        <p style={{ color: "var(--mist-70)", maxWidth: 620, margin: "0 auto", fontSize: "1.0625rem" }}>
          Sie bekommen Wärme, wenn Sie sie brauchen — und behalten Anlage und Kosten jederzeit im
          Blick.
        </p>
        <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", marginTop: 14 }}>
          ² Je nach Paket/Vertrag.
        </p>
      </div>
    </Section>
  );
}
