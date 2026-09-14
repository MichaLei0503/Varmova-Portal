/**
 * VARMI Kooperation — B2B partner-recruitment page. Reuses the Varmi design
 * system (scoped .varmi styles, primitives). All CTAs link to the Onepage lead
 * form. Self-contained Framer code component.
 */
import { useState, type CSSProperties } from "react";
import { VarmiStyles } from "../styles";
import { Shell, Section, SectionHeader, Button, Eyebrow, StatBadge } from "../components/primitives";
import { FeatureCard } from "../components/FeatureCard";
import { Icon, type IconName } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";

const DEFAULT_PARTNER_URL = "https://anfrage-varmova.onepage.me/";

export interface KooperationProps {
  /** Onepage lead form for partner inquiries. */
  partnerUrl?: string;
  /** Final-CTA contact email. */
  email?: string;
  /** Full-viewport bleed (default true); the Framer entry disables it on the editor canvas. */
  fullBleed?: boolean;
}

const anim = (name: string, dur: number, delay: number): CSSProperties => ({
  animation: `${name} ${dur}s cubic-bezier(.16,1,.3,1) ${delay}s both`,
});

/* ---------- A · Hero ---------- */
function KoopHero({ url }: { url: string }) {
  return (
    <section id="koop-hero" style={{ position: "relative", overflow: "hidden", paddingTop: 96, minHeight: "78vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: "clamp(96px, 16vh, 190px)", background: "linear-gradient(180deg, #E8A260 0%, #E07A26 40%, rgba(176,88,0,0.22) 68%, rgba(4,7,13,0) 100%)", opacity: 0.82, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 50% 8%, rgba(232,162,96,0.16), rgba(4,7,13,0) 60%)", pointerEvents: "none" }} />
      <Shell style={{ position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "clamp(30px, 6vh, 70px)", gap: 22 }}>
          <div style={anim("varmi-in-up", 0.8, 0)}><Eyebrow label="Kooperation" icon="users" /></div>
          <h1 className="varmi-fill-h1" style={{ fontSize: "var(--t-hero)", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.02em", margin: 0, ...anim("varmi-in-scale", 1.4, 0.05) }}>
            Mehr Aufträge.<br />Weniger Aufwand.
          </h1>
          <p style={{ maxWidth: 600, color: "var(--mist-70)", fontSize: "1.0625rem", ...anim("varmi-in-up", 1, 0.3) }}>
            Werden Sie VARMI-Fachpartner: moderne Wärme an einem Tag installiert — ohne
            Baustellenchaos, mit weniger Personal und zufriedeneren Kunden. Kundenanfragen aus Ihrer
            Region leiten wir direkt an Sie weiter.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 4, ...anim("varmi-in-scale", 1.2, 0.45) }}>
            <Button variant="dark" href={url} newTab>Partner werden</Button>
            <Button variant="gradient" href="#vorteile" icon="chevronDown">Vorteile ansehen</Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 40px", marginTop: 18, ...anim("varmi-in-up", 1, 0.7) }}>
            <StatBadge value="1 Tag" label="typische Installationszeit" />
            <StatBadge value="0" label="Außeneinheiten — kein Erdaushub" />
            <StatBadge value="Direkt" label="Kundenanfragen aus Ihrer Region" />
          </div>
        </div>
      </Shell>
    </section>
  );
}

/* ---------- B · Vorteile ---------- */
const VORTEILE: { icon: IconName; title: string; body: string }[] = [
  { icon: "mail", title: "Direkte Kundenanfragen", body: "Interessenten aus Ihrer Region leiten wir direkt an Sie weiter — Sie installieren, statt zu akquirieren." },
  { icon: "bolt", title: "Schneller Einbau, weniger Personalkosten", body: "Eine Anlage, ein Tag, ein kleines Team. Statt wochenlanger Baustellen sparen Sie spürbar Personal- und Zeitkosten." },
  { icon: "shieldCheck", title: "Zufriedenere Kunden", body: "Sauberer Einbau ohne Erdaushub und Außeneinheit — das begeistert Kunden und bringt Weiterempfehlungen." },
  { icon: "box", title: "Komplettpaket, vormontiert", body: "VARMI kommt anschlussfertig auf der Palette. Weniger Planung, weniger Fehlerquellen, planbare Abläufe." },
  { icon: "home", title: "Differenzierung am Markt", body: "Bieten Sie die Lösung, wo die Wärmepumpe scheitert — Altbau, Denkmal, Mehrfamilienhaus, enge Technikräume." },
  { icon: "sliders", title: "Schulung & Support", body: "Technische Einweisung, Fernsupport und Vertriebsunterlagen. Sie sind nie allein im Projekt." },
];

function Vorteile() {
  return (
    <Section id="vorteile">
      <SectionHeader eyebrow="Ihre Vorteile" eyebrowIcon="spark" title="Warum VARMI-Partner werden" subline="Mehr Umsatz bei weniger Aufwand — VARMI macht den Heizungstausch planbar, schnell und profitabel." />
      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        {VORTEILE.map((v, i) => (
          <FeatureCard key={v.title} icon={v.icon} title={v.title} delay={(i % 3) * 90}>{v.body}</FeatureCard>
        ))}
      </div>
    </Section>
  );
}

/* ---------- C · Ablauf ---------- */
const STEPS = [
  { t: "Anfrage senden", b: "Kurzes Formular ausfüllen — wir melden uns zeitnah bei Ihnen." },
  { t: "Onboarding & Schulung", b: "Sie und Ihr Team werden auf VARMI eingewiesen: Technik, Einbau, Vertrieb." },
  { t: "Erste Installation", b: "Erste Anlage an einem Tag eingebaut — mit Support an Ihrer Seite." },
  { t: "Skalieren", b: "Anfragen erhalten, Aufträge abwickeln, Umsatz ausbauen." },
];
function Step({ i, t, b }: { i: number; t: string; b: string }) {
  const ref = useReveal<HTMLDivElement>(i * 100);
  return (
    <div ref={ref} className="varmi-reveal varmi-step">
      <div className="varmi-step-num">{i + 1}</div>
      <h3 className="varmi-step-title">{t}</h3>
      <p className="varmi-step-body">{b}</p>
    </div>
  );
}
function Ablauf() {
  return (
    <Section id="ablauf">
      <SectionHeader eyebrow="Ablauf" eyebrowIcon="layers" title="In wenigen Schritten Partner" subline="Geringer Einstieg, schneller Start — wir begleiten Sie vom ersten Gespräch bis zur ersten Installation." />
      <div style={{ position: "relative", marginTop: 52 }}>
        <div aria-hidden className="varmi-hide-mobile" style={{ position: "absolute", top: 18, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, var(--copper), transparent)", opacity: 0.5 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
          {STEPS.map((s, i) => <Step key={s.t} i={i} t={s.t} b={s.b} />)}
        </div>
      </div>
    </Section>
  );
}

/* ---------- D · Für welche Betriebe ---------- */
const CHIPS: { label: string; icon: IconName }[] = [
  { label: "Heizungsbau", icon: "tool" },
  { label: "SHK / Sanitär-Heizung", icon: "droplet" },
  { label: "PV-Betriebe", icon: "sun" },
  { label: "Solarbetriebe", icon: "sun" },
  { label: "Elektrobetriebe", icon: "bolt" },
  { label: "Modernisierung im Bestand", icon: "home" },
];
function FuerBetriebe() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section id="fuer-betriebe">
      <SectionHeader eyebrow="Für wen" eyebrowIcon="users" title="Passt zu Ihrem Betrieb" subline="Ob Heizung, SHK, PV, Solar oder Elektro — wenn Sie wassergeführte Systeme installieren, passt VARMI in Ihr Portfolio." />
      <div ref={ref} className="varmi-reveal" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 40 }}>
        {CHIPS.map((c) => (
          <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 60, border: "1px solid var(--hairline)", background: "var(--panel)", color: "var(--mist-70)", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--copper)", display: "inline-flex" }}><Icon name={c.icon} size={17} /></span>
            {c.label}
          </span>
        ))}
      </div>
    </Section>
  );
}

/* ---------- E · FAQ ---------- */
const FAQS: { q: string; a: string }[] = [
  { q: "Welche Voraussetzungen muss mein Betrieb erfüllen?", a: "Erfahrung mit wassergeführten Heizsystemen (Heizung, SHK oder Elektro) genügt. Alles Weitere zeigen wir Ihnen in der Schulung." },
  { q: "Wie aufwendig ist der Einstieg?", a: "Gering: vormontierte Anlage, kurze Schulung, Support im ersten Projekt. Sie starten schnell und ohne großes Risiko." },
  { q: "Bekomme ich wirklich Kundenanfragen?", a: "Ja. Interessenten aus Ihrer Region leiten wir direkt an Sie weiter — Sie konzentrieren sich auf den Einbau." },
  { q: "Wie schnell ist eine Installation?", a: "In der Regel an einem Tag — ohne Erdaushub und ohne Außeneinheit. Das spart Personal- und Zeitkosten." },
  { q: "Was kostet die Partnerschaft?", a: "Schildern Sie uns kurz Ihren Betrieb — Konditionen besprechen wir transparent im Erstgespräch." },
  { q: "Gibt es Gebietsschutz?", a: "Je nach Region und Nachfrage möglich. Sprechen Sie uns einfach an." },
];
function FaqItem({ q, a, idx, open, onToggle }: { q: string; a: string; idx: number; open: boolean; onToggle: () => void }) {
  const btnId = `koopfaq-q-${idx}`, panelId = `koopfaq-a-${idx}`;
  return (
    <div style={{ borderTop: "1px solid var(--hairline)" }}>
      <h3 style={{ margin: 0 }}>
        <button id={btnId} aria-expanded={open} aria-controls={panelId} onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 4px", textAlign: "left", fontSize: "1.0625rem", fontWeight: 500, color: open ? "var(--mist)" : "var(--mist-70)" }}>
          <span>{q}</span>
          <span style={{ flexShrink: 0, color: "var(--copper)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}><Icon name="chevronDown" size={20} /></span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open} style={{ padding: open ? "0 4px 24px" : 0, color: "var(--mist-60)", maxWidth: 760, fontSize: "0.975rem", lineHeight: 1.65 }}>{a}</div>
    </div>
  );
}
function KoopFAQ() {
  const [open, setOpen] = useState(0);
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section id="koop-faq">
      <SectionHeader eyebrow="FAQ" eyebrowIcon="help" title={<>Häufige <span className="varmi-serif">Fragen</span></>} />
      <div ref={ref} className="varmi-reveal" style={{ maxWidth: 820, margin: "40px auto 0" }}>
        {FAQS.map((it, i) => <FaqItem key={i} idx={i} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
      </div>
    </Section>
  );
}

/* ---------- F · Final CTA ---------- */
function KoopCTA({ url, email }: { url: string; email: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section id="koop-cta" style={{ position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", width: "80%", height: "120%", transform: "translate(-50%,-50%) rotate(-13deg)", background: "radial-gradient(50% 50% at 50% 50%, var(--copper-glow), transparent 70%)", opacity: 0.12, pointerEvents: "none" }} />
      <div ref={ref} className="varmi-reveal" style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 640, margin: "0 auto" }}>
        <Eyebrow label="Kooperation" serif />
        <h2 className="varmi-fill-h2" style={{ fontSize: "var(--t-h2)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em" }}>Bereit für mehr Aufträge?</h2>
        <p style={{ color: "var(--mist-70)", maxWidth: 520 }}>Werden Sie VARMI-Fachpartner und profitieren Sie von schnellen Einbauten, geringeren Kosten und direkten Kundenanfragen.</p>
        <div style={{ marginTop: 6 }}><Button variant="dark" href={url} newTab>Partner werden</Button></div>
        <a href={`mailto:${email}`} style={{ color: "var(--mist-60)", fontSize: "0.9rem", marginTop: 4 }}>{email}</a>
      </div>
    </Section>
  );
}

/* ---------- Page ---------- */
export function Kooperation({ partnerUrl, email = "info@varmova.de", fullBleed }: KooperationProps) {
  const url = partnerUrl || DEFAULT_PARTNER_URL;
  const bleed = fullBleed !== false;
  return (
    <div className={bleed ? "varmi varmi--bleed" : "varmi"}>
      <VarmiStyles bleed={bleed} />
      <main>
        <KoopHero url={url} />
        <Vorteile />
        <Ablauf />
        <FuerBetriebe />
        <KoopCTA url={url} email={email} />
        <KoopFAQ />
      </main>
    </div>
  );
}

export default Kooperation;
