import { useEffect, useRef, useState } from "react";
import { Shell, Eyebrow, StatBadge } from "../components/primitives";
import { EnergieflussScene } from "../svg/EnergieflussScene";
import { Tagesverlauf } from "../svg/Tagesverlauf";
import { Icon } from "../svg/Icon";
import { useReveal } from "../motion/useReveal";

const PHASES = ["Eigener Solarstrom", "Direkt in Varmi", "Intelligent gesteuert", "Wärme im ganzen Haus"];
const BULLETS = ["Dynamischer Stromtarif", "PV-Eigenverbrauch", "Batteriespeicher-Anbindung", "Lastverschiebung automatisch"];

// fade windows per phase keyword: [in-start, in-end, out-start, out-end]
const WINDOWS: [number, number, number, number][] = [
  [0.0, 0.04, 0.2, 0.26],
  [0.24, 0.3, 0.44, 0.5],
  [0.48, 0.54, 0.6, 0.66],
  [0.64, 0.72, 1.01, 1.02],
];

const clamp = (v: number) => Math.max(0, Math.min(1, v));

function phaseOpacity(p: number, i: number) {
  const [a, b, c, d] = WINDOWS[i];
  if (p < a) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p < c) return 1;
  if (p < d) return 1 - (p - c) / (d - c);
  return 0;
}

const mq = (q: string) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(q).matches
    : false;

export function Energiefluss() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Synchronous initializers: the very first client render already matches the
  // device, so the layout never flips (Framer measures a stable height).
  const [reduced, setReduced] = useState(() => mq("(prefers-reduced-motion: reduce)"));
  const [isMobile, setIsMobile] = useState(() => mq("(max-width: 809px)"));
  const [progress, setProgress] = useState(0);

  // Compact = no pinned scroll-scrub (reduced-motion OR mobile, where pinning
  // is finicky and the long runway just adds empty space). Shows the final frame.
  // NOTE: on mobile the static layout is ALSO enforced purely via CSS media
  // query, so even the pre-hydration HTML lays out correctly.
  const compact = reduced || isMobile;

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mob = window.matchMedia("(max-width: 809px)");
    const apply = () => {
      setReduced(rm.matches);
      setIsMobile(mob.matches);
    };
    apply();
    rm.addEventListener?.("change", apply);
    mob.addEventListener?.("change", apply);
    return () => {
      rm.removeEventListener?.("change", apply);
      mob.removeEventListener?.("change", apply);
    };
  }, []);

  useEffect(() => {
    if (compact) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const prog = total > 0 ? clamp(-rect.top / total) : 0;
      setProgress(prog);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [compact]);

  const closeRef = useReveal<HTMLDivElement>();
  const chartRef = useReveal<HTMLDivElement>();

  return (
    <section id="energiefluss" style={{ position: "relative" }}>
      {/* Pinned scrub stage (or static frame when reduced) */}
      <div ref={scrollRef} className={`varmi-ef-track${compact ? " varmi-ef-static" : ""}`}>
        <div className="varmi-ef-stage">
          <Shell>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <Eyebrow label="Smart heizen" icon="sun" />
              <h2 className="varmi-fill-h2" style={{ fontSize: "var(--t-h2)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em", maxWidth: 760 }}>
                Strom vom eigenen Dach. Wärme fürs ganze Haus.
              </h2>
            </div>

            <div style={{ maxWidth: 760, margin: "0 auto", width: "100%" }}>
              <div style={{ aspectRatio: "800 / 500" }}>
                <EnergieflussScene progress={progress} reduced={compact} />
              </div>

              {/* Phase keywords — compact mode: vertical flow (reads like the
                  energy path itself; horizontal arrows wrapped awkwardly). */}
              {compact ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 18 }}>
                  {PHASES.map((p, i) => (
                    <span key={p} style={{ display: "contents" }}>
                      {i > 0 && <span aria-hidden style={{ color: "var(--mist-40)", fontSize: "0.85rem", lineHeight: 1 }}>↓</span>}
                      <span style={{ color: "var(--copper)", fontWeight: 500 }}>{p}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", placeItems: "center", minHeight: "2.4em", marginTop: 8 }}>
                  {PHASES.map((label, i) => (
                    <span
                      key={label}
                      style={{
                        gridArea: "1 / 1",
                        textAlign: "center",
                        color: "var(--copper)",
                        fontSize: "clamp(1.1rem, 0.8rem + 1.4vw, 1.6rem)",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        opacity: phaseOpacity(progress, i),
                        transition: "opacity .15s linear",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Shell>
        </div>
      </div>

      {/* Static value close (Layer A) */}
      <Shell style={{ paddingBottom: "clamp(80px, 7vw, 100px)" }}>
        <div ref={closeRef} className="varmi-reveal" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 22 }}>
          <p style={{ color: "var(--mist-70)", fontSize: "1.0625rem" }}>
            Varmi ist PV- und börsenstrom-ready. Die Regelung verschiebt das Heizen automatisch in
            günstige Zeitfenster — nachts oder mittags bei Sonnenstrom.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {BULLETS.map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 60, border: "1px solid var(--hairline)", background: "var(--panel)", color: "var(--mist-70)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--copper)", display: "inline-flex" }}><Icon name="check" size={14} strokeWidth={2} /></span>
                {b}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 6 }}>
            <StatBadge value="bis zu 30–50 %¹" label="geringere Stromkosten durch Lastverschiebung" />
          </div>
        </div>

        <div ref={chartRef} className="varmi-reveal" style={{ maxWidth: 760, margin: "40px auto 0" }}>
          <Tagesverlauf />
          <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, marginTop: 18, textAlign: "center" }}>
            ¹ Abhängig von Stromtarif, Gebäude und Nutzungsverhalten. Keine garantierte Einsparung.
          </p>
        </div>
      </Shell>
    </section>
  );
}
