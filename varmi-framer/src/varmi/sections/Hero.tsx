import { useState, type CSSProperties } from "react";
import { Shell, Button, Eyebrow } from "../components/primitives";
import { VarmiProduct } from "../svg/VarmiProduct";
import { WistiaBackground } from "../components/WistiaBackground";
import { Icon } from "../svg/Icon";
import type { VarmiProps } from "../types";

const HEIZUNGEN = ["Öl", "Gas", "Nachtspeicher", "Hybrid"] as const;

// CSS-based intro animation (no framer-motion → no WAAPI .animate() calls).
const anim = (name: string, dur: number, delay: number, ease = "cubic-bezier(.16,1,.3,1)"): CSSProperties => ({
  animation: `${name} ${dur}s ${ease} ${delay}s both`,
});

export function Hero({
  onContactClick,
  contactUrl,
  heroImage,
  heroVideoId,
}: Pick<VarmiProps, "onContactClick" | "heroImage" | "heroVideoId"> & { contactUrl: string }) {
  const [aktuell, setAktuell] = useState<string | null>(null);
  const hasVideo = !!heroVideoId;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: 96,
        ...(hasVideo ? { minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center" } : null),
      }}
    >
      {hasVideo ? (
        <>
          {/* Background video */}
          <WistiaBackground id={heroVideoId!} />
          {/* Legibility overlay — dark vignette + copper top band to blend with the header */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,7,13,0.78) 0%, rgba(4,7,13,0.30) 26%, rgba(4,7,13,0.45) 62%, rgba(4,7,13,0.92) 92%, #04070D 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: "clamp(90px, 14vh, 170px)",
              background: "linear-gradient(180deg, rgba(232,162,96,0.45) 0%, rgba(176,88,0,0.16) 55%, rgba(4,7,13,0) 100%)",
              mixBlendMode: "screen",
              opacity: 0.7,
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <>
          {/* Sunrise band — copper/orange glow fading to night (live-site look) */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: "clamp(96px, 16vh, 190px)",
              background:
                "linear-gradient(180deg, #E8A260 0%, #E07A26 40%, rgba(176,88,0,0.22) 68%, rgba(4,7,13,0) 100%)",
              opacity: 0.82,
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(60% 50% at 50% 6%, rgba(232,162,96,0.18), rgba(4,7,13,0) 60%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      <Shell style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "clamp(40px, 8vh, 90px)",
            gap: 22,
          }}
        >
          <div style={anim("varmi-in-up", 0.8, 0)}>
            <Eyebrow label="Verfügbar" dot />
          </div>

          <h1
            className="varmi-fill-h1"
            style={{
              fontSize: "var(--t-hero)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
              ...anim("varmi-in-scale", 1.6, 0),
            }}
          >
            Varmi
          </h1>

          <p style={{ fontSize: "clamp(1.25rem, 0.9rem + 1.6vw, 1.75rem)", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", ...anim("varmi-in-up", 1, 0.2) }}>
            Einfach. Intelligent. Warm.
          </p>

          <p style={{ maxWidth: 560, color: "var(--mist-70)", ...anim("varmi-in-up", 1, 0.35) }}>
            Die Wärmewende ohne Großbaustelle. An einem Tag installiert, ohne Außeneinheit,
            kompatibel mit Ihrer bestehenden Anlage — und smart genug, günstige Stromzeiten
            automatisch zu nutzen.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 4, ...anim("varmi-in-scale", 1.2, 0.45) }}>
            <Button variant="dark" onClick={onContactClick} href={onContactClick ? undefined : contactUrl} newTab>
              Beratung anfragen
            </Button>
            <Button variant="gradient" href="#technologie" icon="chevronDown">
              Wie es funktioniert
            </Button>
          </div>

          {/* Micro-selector — pre-context for the contact form */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8, ...anim("varmi-in-fade", 1, 0.7) }}>
            <span style={{ fontSize: 13, color: "var(--mist-60)" }}>Womit heizen Sie aktuell?</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {HEIZUNGEN.map((h) => {
                const active = aktuell === h;
                return (
                  <button
                    key={h}
                    onClick={() => setAktuell(active ? null : h)}
                    aria-pressed={active}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 60,
                      fontSize: 13,
                      border: `1px solid ${active ? "var(--copper)" : "var(--hairline)"}`,
                      background: active ? "rgba(232,162,96,0.12)" : "var(--night)",
                      color: active ? "var(--copper)" : "var(--mist-70)",
                      transition: "all .2s ease",
                    }}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product — animated vector unit (or the client's photo). Hidden when a hero video is set. */}
        {!hasVideo && (
        <div style={{ marginTop: 48, maxWidth: 620, marginInline: "auto", ...anim("varmi-in-scale", 1.4, 0.5) }}>
          <div style={{ animation: "varmi-float 6s ease-in-out 2s infinite" }}>
            {heroImage ? (
              <div style={{ position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", inset: "-6%", background: "radial-gradient(50% 44% at 50% 46%, rgba(232,162,96,0.12), rgba(4,7,13,0) 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}>
                  <img src={heroImage} alt="Varmi Heizsystem — Produktbild" loading="eager" decoding="async" style={{ display: "block", width: "100%", height: "auto" }} />
                  <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.30) 50%, transparent)", mixBlendMode: "screen", pointerEvents: "none", animation: "varmi-photo-sweep 6.5s ease-in-out 2.2s infinite" }} />
                </div>
              </div>
            ) : (
              <div style={{ aspectRatio: "660 / 560" }}>
                <VarmiProduct />
              </div>
            )}
          </div>
        </div>
        )}

        {/* Scroll chevron */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <a href="#energiefluss" aria-label="Weiter scrollen" style={{ color: "var(--mist-60)" }}>
            <span style={{ display: "inline-block", animation: "varmi-bounce 1.8s ease-in-out infinite" }}>
              <Icon name="chevronDown" size={26} />
            </span>
          </a>
        </div>
      </Shell>
    </section>
  );
}
