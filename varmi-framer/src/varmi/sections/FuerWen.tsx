import { Section, SectionHeader, Card, Button } from "../components/primitives";
import { Icon, type IconName } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";
import type { VarmiProps } from "../types";

function AudienceCard({
  icon,
  kicker,
  title,
  body,
  cta,
  variant,
  onClick,
  href,
  delay,
  accent,
}: {
  icon: IconName;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  variant: "dark" | "gradient";
  onClick?: () => void;
  href?: string;
  delay: number;
  accent?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card accent={accent} style={{ height: "100%", padding: "36px 34px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 12, display: "grid", placeItems: "center",
            background: "var(--panel)", border: "1px solid var(--hairline)", color: "var(--copper)",
          }}
        >
          <Icon name={icon} size={22} />
        </div>
        <span style={{ color: "var(--mist-60)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{kicker}</span>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", marginTop: -6 }}>{title}</h3>
        <p style={{ color: "var(--mist-70)", flex: 1 }}>{body}</p>
        <div>
          <Button variant={variant} icon={variant === "gradient" ? "chevronDown" : "arrowUpRight"} onClick={onClick} href={onClick ? undefined : href} newTab>
            {cta}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function FuerWen({
  onContactClick,
  onPartnerClick,
  contactUrl,
  partnerUrl,
}: Pick<VarmiProps, "onContactClick" | "onPartnerClick"> & { contactUrl: string; partnerUrl: string }) {
  return (
    <Section id="fuer-wen">
      <SectionHeader eyebrow="Für wen" eyebrowIcon="users" title="Zwei Wege zu Varmi" />
      <div className="varmi-grid varmi-grid-2" style={{ marginTop: 44, alignItems: "stretch" }}>
        <AudienceCard
          icon="home"
          kicker="Hausbesitzer"
          title="Sie heizen ein Zuhause"
          body="Wenn eine Wärmepumpe bei Ihnen schwierig ist, bekommen Sie mit Varmi moderne Wärme — einfach, leise, schnell installiert."
          cta="Beratung anfragen"
          variant="dark"
          onClick={onContactClick}
          href={contactUrl}
          delay={0}
          accent
        />
        <AudienceCard
          icon="tool"
          kicker="Fachpartner"
          title="Sie installieren Heizungen"
          body="Als Heizungs-, Sanitär-, PV- oder Solarbetrieb bieten Sie Ihren Kunden eine schnell umsetzbare Alternative — hoher Durchsatz statt Baustellenchaos."
          cta="Partner werden"
          variant="gradient"
          onClick={onPartnerClick}
          href={partnerUrl}
          delay={100}
        />
      </div>
    </Section>
  );
}
