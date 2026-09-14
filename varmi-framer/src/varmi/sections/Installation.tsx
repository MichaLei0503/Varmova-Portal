import { Section, SectionHeader, StatBadge, Card } from "../components/primitives";
import { useReveal } from "../motion/useReveal";

const STEPS = [
  {
    t: "Anliefern & Anschließen",
    b: "Die vormontierte Anlage wird an Strom und den bestehenden Heizkreis angeschlossen.",
  },
  {
    t: "In Betrieb nehmen",
    b: "Befüllen, Regelung einrichten, testen — alles am selben Tag.",
  },
  {
    t: "Abnahme & Einweisung",
    b: "Funktionstest, Dokumentation, kurze Einweisung. Bei Fragen schneller Support.",
  },
];

function Step({ i, t, b }: { i: number; t: string; b: string }) {
  const ref = useReveal<HTMLDivElement>(i * 110);
  return (
    <div ref={ref} className="varmi-reveal varmi-step">
      <div className="varmi-step-num">{i + 1}</div>
      <h3 className="varmi-step-title">{t}</h3>
      <p className="varmi-step-body">{b}</p>
    </div>
  );
}

export function Installation() {
  return (
    <Section id="installation">
      <SectionHeader
        eyebrow="Installation"
        eyebrowIcon="tool"
        title="In einem Tag eingebaut"
        subline="Vormontiert geliefert auf einer Palette. Kein Erdaushub, keine Außeneinheit, kein wochenlanges Chaos im Haus."
      />

      {/* Timeline */}
      <div style={{ position: "relative", marginTop: 52 }}>
        <div
          aria-hidden
          className="varmi-hide-mobile"
          style={{
            position: "absolute",
            top: 18,
            left: "8%",
            right: "8%",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--copper), transparent)",
            opacity: 0.5,
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
          {STEPS.map((s, i) => (
            <Step key={s.t} i={i} t={s.t} b={s.b} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <Card style={{ marginTop: 52, padding: "34px clamp(20px,4vw,44px)" }}>
        <div className="varmi-grid varmi-grid-3" style={{ textAlign: "center" }}>
          <StatBadge value="1" label="typische Installationszeit (Werktag)" />
          <StatBadge value="0" label="Außeneinheiten — kein Lärm, keine Genehmigung" />
          <StatBadge value="ca. 90 kg" label="kompakt, vormontiert auf Palette" />
        </div>
      </Card>

      <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, marginTop: 20, maxWidth: 760 }}>
        Die Einbindung in das wassergeführte Heizungsnetz und die elektrische Verdrahtung erfolgen
        bauseits durch qualifiziertes Fachpersonal.
      </p>
    </Section>
  );
}
