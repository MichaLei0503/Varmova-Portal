/**
 * Reusable building blocks: Shell, Section, Card, Eyebrow, SectionHeader,
 * StatBadge, Button, Hairline. All styling via the scoped CSS in styles.tsx.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";

/* ---------- Layout ---------- */

export function Shell({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="varmi-shell" style={style}>{children}</div>;
}

export function Section({
  id,
  children,
  style,
}: {
  id?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section id={id} className="varmi-section" style={style}>
      <Shell>{children}</Shell>
    </section>
  );
}

export function Card({
  children,
  hover = false,
  accent = false,
  style,
  padding = 28,
}: {
  children: ReactNode;
  hover?: boolean;
  accent?: boolean;
  style?: CSSProperties;
  padding?: number | string;
}) {
  const cls = ["varmi-card", hover && "varmi-card--hover", accent && "varmi-card--accent"]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} style={{ padding, ...style }}>
      {children}
    </div>
  );
}

export function Hairline({ style }: { style?: CSSProperties }) {
  return <hr className="varmi-hairline" style={style} />;
}

/* ---------- Eyebrow ---------- */

export function Eyebrow({
  label,
  icon,
  dot = false,
  serif = false,
  style,
}: {
  label: string;
  icon?: IconName;
  dot?: boolean;
  serif?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span className="varmi-eyebrow" style={style}>
      {dot && <span className="varmi-dot" aria-hidden="true" />}
      {icon && <Icon name={icon} size={14} />}
      <span style={serif ? { fontFamily: '"Instrument Serif",serif', fontStyle: "italic", textTransform: "none", fontSize: "1rem", letterSpacing: 0 } : undefined}>
        {label}
      </span>
    </span>
  );
}

/* ---------- SectionHeader ---------- */

export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  eyebrowDot,
  title,
  subline,
  align = "center",
}: {
  eyebrow: string;
  eyebrowIcon?: IconName;
  eyebrowDot?: boolean;
  title: ReactNode;
  subline?: ReactNode;
  align?: "center" | "left";
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="varmi-reveal"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 16,
        maxWidth: align === "center" ? 720 : undefined,
        marginInline: align === "center" ? "auto" : undefined,
      }}
    >
      <Eyebrow label={eyebrow} icon={eyebrowIcon} dot={eyebrowDot} />
      <h2
        className="varmi-fill-h2"
        style={{
          fontSize: "var(--t-h2, clamp(2rem,1.4rem + 2.6vw,2.75rem))",
          fontWeight: 500,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {subline && (
        <p style={{ color: "var(--mist-70)", maxWidth: 640, fontSize: "1.0625rem" }}>{subline}</p>
      )}
    </div>
  );
}

/* ---------- StatBadge ---------- */

function useCountUp(target: number | null, run: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (target == null || !run || started.current) return;
    started.current = true;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(target);
      return;
    }
    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return val;
}

export function StatBadge({
  value,
  label,
  countTo = null,
  prefix = "",
  suffix = "",
}: {
  value?: string;
  label: string;
  countTo?: number | null;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && (setRun(true), io.disconnect())),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const counted = useCountUp(countTo, run);
  const display = countTo != null ? `${prefix}${counted}${suffix}` : value ?? "";
  return (
    <div ref={ref}>
      <div className="varmi-stat-value">{display}</div>
      <div className="varmi-stat-label">{label}</div>
    </div>
  );
}

/* ---------- Button ---------- */

export type ButtonVariant = "dark" | "gradient" | "copper";

export function Button({
  children,
  variant = "dark",
  icon = variant === "dark" ? "arrowUpRight" : undefined,
  onClick,
  href,
  newTab = false,
  ariaLabel,
  style,
  type = "button",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: IconName;
  onClick?: () => void;
  href?: string;
  newTab?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  type?: "button" | "submit";
}) {
  const cls = `varmi-btn varmi-btn--${variant}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </>
  );
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        style={style}
      >
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} aria-label={ariaLabel} style={style}>
      {inner}
    </button>
  );
}
