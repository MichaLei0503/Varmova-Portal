import type { ReactNode } from "react";
import { Card } from "./primitives";
import { Icon, type IconName } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";

/** Icon container + title + body. The workhorse content card. */
export function FeatureCard({
  icon,
  number,
  title,
  children,
  delay = 0,
  accent = false,
}: {
  icon?: IconName;
  number?: string;
  title: ReactNode;
  children: ReactNode;
  delay?: number;
  accent?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card hover accent={accent} style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "var(--panel)",
            border: "1px solid var(--hairline)",
            color: "var(--copper)",
            position: "relative",
          }}
        >
          {icon ? <Icon name={icon} size={22} /> : null}
          {number ? (
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--mist)" }}>{number}</span>
          ) : null}
        </div>
        <h3 style={{ fontSize: "var(--t-card)", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ color: "var(--mist-60)", fontSize: "0.975rem" }}>{children}</p>
      </Card>
    </div>
  );
}
