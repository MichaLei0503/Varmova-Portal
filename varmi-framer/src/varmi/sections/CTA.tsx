import { Section, Eyebrow, Button } from "../components/primitives";
import { useReveal } from "../motion/useReveal";
import type { VarmiProps } from "../types";

export function CTA({ onContactClick, contactUrl }: Pick<VarmiProps, "onContactClick"> & { contactUrl: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section id="cta" style={{ position: "relative", overflow: "hidden" }}>
      {/* SectionGlow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "120%",
          transform: "translate(-50%,-50%) rotate(-13deg)",
          background: "radial-gradient(50% 50% at 50% 50%, var(--copper-glow), transparent 70%)",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />
      <div
        ref={ref}
        className="varmi-reveal"
        style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 640, margin: "0 auto" }}
      >
        <Eyebrow label="Beratung" serif />
        <h2
          className="varmi-fill-h2"
          style={{ fontSize: "var(--t-h2)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em" }}
        >
          Interesse an der Varmi Heiztechnologie?
        </h2>
        <p style={{ color: "var(--mist-70)", maxWidth: 520 }}>
          Schildern Sie uns kurz Ihr Gebäude — wir sagen Ihnen ehrlich, ob Varmi passt.
        </p>
        <div style={{ marginTop: 6 }}>
          <Button variant="dark" onClick={onContactClick} href={onContactClick ? undefined : contactUrl} newTab>
            Beratung anfragen
          </Button>
        </div>
        <a href="mailto:info@varmova.de" style={{ color: "var(--mist-60)", fontSize: "0.9rem", marginTop: 4 }}>
          info@varmova.de
        </a>
      </div>
    </Section>
  );
}
