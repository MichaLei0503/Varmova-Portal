import { useState } from "react";
import { Section, SectionHeader, Card, Button } from "../components/primitives";
import { Icon } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";
import type { VarmiProps } from "../types";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Passt Varmi in mein Haus / meine Wohnung?",
    a: "Varmi ist ideal, wenn eine Wärmepumpe schwer umzusetzen ist — wegen Platz, Schallschutz, Denkmalschutz oder fehlender Außenfläche. Nach einem kurzen Check (Gebäudetyp, Heizsystem, Warmwasser, Stromanschluss) sagen wir Ihnen ehrlich, ob es passt.",
  },
  {
    q: "Wie schnell ist die Installation — und wie läuft sie ab?",
    a: "Varmi kommt vormontiert. In der Regel an einem Tag angeschlossen, in Betrieb genommen und abgenommen — ohne Erdaushub und ohne Außeneinheit.",
  },
  {
    q: "Was kostet Varmi und wann rechnet es sich?",
    a: "Die Kosten hängen von Gebäude und Einbindung ab (Speicher, Warmwasser, Heizkreise). Besonders attraktiv durch die Nutzung günstiger Stromzeiten (PV & Börsenstrom). Nach dem Check erhalten Sie ein transparentes Angebot.",
  },
  {
    q: "Funktioniert Varmi mit PV, Speicher und dynamischem Tarif?",
    a: "Ja. Varmi ist PV- & börsenstrom-ready und kann günstige Zeiten automatisch nutzen.",
  },
  {
    q: "Ist das System sicher, zuverlässig und wartungsarm?",
    a: "Varmi ist für den Dauerbetrieb gebaut: ohne Außeneinheit, ohne Lärm, mit minimalem Wartungsaufwand. Garantie je nach Paket bis 5 Jahre, dazu Selbst-Monitoring und Service-Support.",
  },
  {
    q: "Wie fühlt sich das im Alltag an?",
    a: "Sie bekommen Wärme, wenn Sie sie brauchen, und steuern alles bequem per App. Zeiten und Temperaturen einstellen — den Rest optimiert Varmi selbst.",
  },
];

function Item({ q, a, idx, open, onToggle }: { q: string; a: string; idx: number; open: boolean; onToggle: () => void }) {
  const btnId = `faq-q-${idx}`;
  const panelId = `faq-a-${idx}`;
  return (
    <div style={{ borderTop: "1px solid var(--hairline)" }}>
      <h3 style={{ margin: 0 }}>
        <button
          id={btnId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, padding: "22px 4px", textAlign: "left",
            fontSize: "1.0625rem", fontWeight: 500, color: open ? "var(--mist)" : "var(--mist-70)",
          }}
        >
          <span>{q}</span>
          <span style={{ flexShrink: 0, color: "var(--copper)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}>
            <Icon name="chevronDown" size={20} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        hidden={!open}
        style={{ padding: open ? "0 4px 24px" : 0, color: "var(--mist-60)", maxWidth: 760, fontSize: "0.975rem", lineHeight: 1.65 }}
      >
        {a}
      </div>
    </div>
  );
}

export function FAQ({ onContactClick, contactUrl }: Pick<VarmiProps, "onContactClick"> & { contactUrl: string }) {
  const [open, setOpen] = useState(0);
  const listRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  return (
    <Section id="faq">
      <SectionHeader
        eyebrow="FAQ"
        eyebrowIcon="help"
        title={<>Häufige <span className="varmi-serif">Fragen</span></>}
      />

      <div ref={listRef} className="varmi-reveal" style={{ maxWidth: 820, margin: "40px auto 0" }}>
        {ITEMS.map((it, i) => (
          <Item key={i} idx={i} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>

      <div ref={ctaRef} className="varmi-reveal" style={{ maxWidth: 820, margin: "28px auto 0" }}>
        <Card style={{ padding: "26px 30px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "var(--mist)", fontWeight: 500, fontSize: "1.0625rem" }}>Weitere Fragen?</div>
            <div style={{ color: "var(--mist-60)", fontSize: "0.95rem" }}>Schreiben Sie uns gerne.</div>
          </div>
          <Button variant="gradient" onClick={onContactClick} href={onContactClick ? undefined : contactUrl} newTab icon="arrowUpRight">
            Frage stellen
          </Button>
        </Card>
      </div>
    </Section>
  );
}
