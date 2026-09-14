/**
 * VARMI design tokens — single source of truth.
 * Extracted from the live varmova.de site (verified against screenshot) and
 * the VARMI v3 build spec §1.1–§1.3. No hard-coded hex outside this file.
 */

export const color = {
  night: "#04070D",
  white: "#FFFFFF",
  mist: "#D5DBE6",
  mist70: "rgba(213,219,230,0.70)",
  mist60: "rgba(213,219,230,0.60)",
  mist40: "rgba(213,219,230,0.40)",
  panel: "#10131C",
  hairline: "rgba(216,231,242,0.07)",
  hairlineStrong: "rgba(216,231,242,0.14)",
  glowBlue: "rgba(184,199,217,0.50)",
  accentIce: "#A6DAFF",
  copper: "#E8A260",
  copperHover: "#F0B27A",
  copperGlow: "rgba(232,162,96,0.35)",
} as const;

export const gradient = {
  /** Outer hero block (top color band behind the fold). */
  heroOuter: "linear-gradient(180deg, #911106 0%, #B05800 100%)",
  /** Inner hero glow fading to night. */
  heroInnerGlow:
    "linear-gradient(180deg, #E8A260 14%, #FF5E00 28.6%, #04070D 29.7%)",
  /** H1 text-fill (radial white → night). */
  h1TextFill:
    "radial-gradient(99% 86% at 50% 50%, #FFFFFF 28%, #04070D 100%)",
  /** Section H2 text-fill (linear mist → night). */
  h2TextFill: "linear-gradient(161deg, #D5DBE6 52%, #04070D 166%)",
  /** Gradient border for the secondary (light) button. */
  buttonBorder:
    "linear-gradient(124deg,#AAB9CF,#E8A260 35%,#D5DBE6 92%)",
  /** Card corner glow (used at low opacity). */
  cardCornerGlow:
    "radial-gradient(50% 50% at 93.7% 8.1%, rgba(184,199,217,0.50) 0%, rgba(4,7,13,0) 100%)",
} as const;

export const shadow = {
  /** Inset highlight on the top edge of cards/panels. */
  cardInset: "inset 0 2px 1px rgba(207,231,255,0.20)",
} as const;

/** Fluid type scale (clamp) — closes the tablet gap. */
export const type = {
  hero: "clamp(2.75rem, 1.2rem + 7vw, 5rem)", // H1 44→80
  h2: "clamp(2rem, 1.4rem + 2.6vw, 2.75rem)", // 32→44
  card: "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)", // 18→20
  body: "clamp(1rem, 0.97rem + 0.15vw, 1rem)", // 16
  stat: "clamp(1.75rem, 1.2rem + 2.5vw, 2rem)", // 28→32
  eye: "0.75rem", // 12
  meta: "0.875rem", // 14
} as const;

export const font = {
  sans: '"Inter","Inter Variable",Arial,sans-serif',
  serif: '"Instrument Serif",Georgia,serif',
  featureSettings: '"cv01","cv05","cv09","cv11","ss03"',
} as const;

export const layout = {
  maxWidth: 1200,
  padX: "clamp(18px, 4vw, 40px)",
  padY: "clamp(80px, 7vw, 100px)",
  gap: 30,
  radiusCard: 20,
  radiusPill: 60,
  radiusButton: 8,
} as const;

/** Breakpoints (max-width queries). */
export const bp = {
  tablet: 1199,
  mobile: 809,
} as const;

export type ColorToken = keyof typeof color;
