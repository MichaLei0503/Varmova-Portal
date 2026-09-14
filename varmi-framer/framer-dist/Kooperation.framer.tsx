import { addPropertyControls, ControlType, RenderTarget } from "framer";
import { useState as useState2, useEffect as useEffect2, useRef as useRef2, useState, useEffect, useRef } from "react";

// src/framer-entry-kooperation.tsx

// src/varmi/kooperation/Kooperation.tsx

// src/varmi/tokens.ts
var color = {
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
  copperGlow: "rgba(232,162,96,0.35)"
};
var gradient = {
  /** Outer hero block (top color band behind the fold). */
  heroOuter: "linear-gradient(180deg, #911106 0%, #B05800 100%)",
  /** Inner hero glow fading to night. */
  heroInnerGlow: "linear-gradient(180deg, #E8A260 14%, #FF5E00 28.6%, #04070D 29.7%)",
  /** H1 text-fill (radial white → night). */
  h1TextFill: "radial-gradient(99% 86% at 50% 50%, #FFFFFF 28%, #04070D 100%)",
  /** Section H2 text-fill (linear mist → night). */
  h2TextFill: "linear-gradient(161deg, #D5DBE6 52%, #04070D 166%)",
  /** Gradient border for the secondary (light) button. */
  buttonBorder: "linear-gradient(124deg,#AAB9CF,#E8A260 35%,#D5DBE6 92%)",
  /** Card corner glow (used at low opacity). */
  cardCornerGlow: "radial-gradient(50% 50% at 93.7% 8.1%, rgba(184,199,217,0.50) 0%, rgba(4,7,13,0) 100%)"
};
var shadow = {
  /** Inset highlight on the top edge of cards/panels. */
  cardInset: "inset 0 2px 1px rgba(207,231,255,0.20)"
};
var type = {
  hero: "clamp(2.75rem, 1.2rem + 7vw, 5rem)",
  // H1 44→80
  h2: "clamp(2rem, 1.4rem + 2.6vw, 2.75rem)",
  // 32→44
  card: "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)",
  // 18→20
  body: "clamp(1rem, 0.97rem + 0.15vw, 1rem)",
  // 16
  stat: "clamp(1.75rem, 1.2rem + 2.5vw, 2rem)",
  // 28→32
  eye: "0.75rem",
  // 12
  meta: "0.875rem"
  // 14
};
var font = {
  sans: '"Inter","Inter Variable",Arial,sans-serif',
  serif: '"Instrument Serif",Georgia,serif',
  featureSettings: '"cv01","cv05","cv09","cv11","ss03"'
};
var layout = {
  maxWidth: 1200,
  padX: "clamp(18px, 4vw, 40px)",
  padY: "clamp(80px, 7vw, 100px)",
  gap: 30,
  radiusCard: 20,
  radiusPill: 60,
  radiusButton: 8
};
var bp = {
  tablet: 1199,
  mobile: 809
};

// src/varmi/styles.tsx
var css = `
.varmi {
  --night: ${color.night};
  --white: ${color.white};
  --mist: ${color.mist};
  --mist-70: ${color.mist70};
  --mist-60: ${color.mist60};
  --mist-40: ${color.mist40};
  --panel: ${color.panel};
  --hairline: ${color.hairline};
  --hairline-strong: ${color.hairlineStrong};
  --glow-blue: ${color.glowBlue};
  --accent-ice: ${color.accentIce};
  --copper: ${color.copper};
  --copper-hover: ${color.copperHover};
  --copper-glow: ${color.copperGlow};

  --t-hero: ${type.hero};
  --t-h2: ${type.h2};
  --t-card: ${type.card};
  --t-stat: ${type.stat};

  position: relative;
  width: 100%;
  background: var(--night);
  color: var(--mist-70);
  font-family: ${font.sans};
  font-feature-settings: ${font.featureSettings};
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: clip;
}
/* Full-bleed: span the whole viewport even inside a constrained Framer frame.
   ONLY applied outside the Framer editor canvas \u2014 on the canvas 100vw is the
   EDITOR window width, which blew the component out of the breakpoint frame
   (content clipped on both sides in the Phone view). See framer-entry.tsx. */
.varmi.varmi--bleed {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
.varmi *, .varmi *::before, .varmi *::after { box-sizing: border-box; }
.varmi h1, .varmi h2, .varmi h3, .varmi p, .varmi ul, .varmi figure { margin: 0; }
.varmi ul { list-style: none; padding: 0; }
.varmi button { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; }
.varmi a { color: inherit; text-decoration: none; }
.varmi img { display: block; max-width: 100%; }

/* Content rhythm */
.varmi-shell { width: 100%; max-width: ${layout.maxWidth}px; margin: 0 auto; padding-inline: ${layout.padX}; }
.varmi-section { padding-block: ${layout.padY}; position: relative; }

/* Gradient text-fill */
.varmi-fill-h1 {
  background-image: ${gradient.h1TextFill};
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.varmi-fill-h2 {
  background-image: ${gradient.h2TextFill};
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.varmi-serif { font-family: ${font.serif}; font-style: italic; font-weight: 400; }

/* Reveal (Layer A) \u2014 fail-safe: content is visible by default. JS "arms"
   below-the-fold elements (hides them) and the observer reveals them again.
   Without JS / before hydration nothing is ever hidden. */
.varmi-reveal.varmi-armed { opacity: 0; transform: translateY(40px); }
.varmi-reveal.is-in {
  opacity: 1; transform: none;
  transition: opacity .8s cubic-bezier(.53,.27,.4,1), transform .8s cubic-bezier(.53,.27,.4,1);
}

/* Focus ring (visible on light & dark) */
.varmi :focus-visible { outline: 2px solid var(--copper); outline-offset: 3px; border-radius: 4px; }

/* Form fields */
.varmi input, .varmi select, .varmi textarea { font: inherit; }
.varmi input::placeholder, .varmi textarea::placeholder { color: var(--mist-40); }

/* Keyframes */
@keyframes varmi-pulse {
  0% { box-shadow: 0 0 0 0 rgba(166,218,255,0.45); }
  70% { box-shadow: 0 0 0 6px rgba(166,218,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(166,218,255,0); }
}
@keyframes varmi-bounce {
  0%,100% { transform: translateY(0); opacity: .7; }
  50% { transform: translateY(6px); opacity: 1; }
}
@keyframes varmi-spin { to { transform: rotate(360deg); } }
@keyframes varmi-in-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes varmi-in-scale { from { opacity: 0; transform: scale(0.82); } to { opacity: 1; transform: none; } }
@keyframes varmi-in-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes varmi-rod { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
@keyframes varmi-flow { to { stroke-dashoffset: -28; } }
@keyframes varmi-rise { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: .8; } 100% { opacity: 0; transform: translateY(-26px); } }
@keyframes varmi-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes varmi-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes varmi-sweep { 0% { transform: translateX(-140%) skewX(-16deg); opacity: 0; } 12% { opacity: .5; } 50% { opacity: .18; } 88% { opacity: 0; } 100% { transform: translateX(140%) skewX(-16deg); opacity: 0; } }
@keyframes varmi-screen { from { opacity: 0; } to { opacity: 1; } }
@keyframes varmi-photo-sweep { 0% { transform: translateX(-160%) skewX(-12deg); opacity: 0; } 12% { opacity: .5; } 60% { opacity: .15; } 90% { opacity: 0; } 100% { transform: translateX(280%) skewX(-12deg); opacity: 0; } }
@keyframes varmi-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ---- Components ---- */

/* Eyebrow pill */
.varmi-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: ${layout.radiusPill}px;
  border: 1px solid var(--hairline); background: var(--night);
  font-size: 0.75rem; line-height: 1.3; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--mist);
}
.varmi-eyebrow svg { color: var(--copper); }
.varmi-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--accent-ice);
  animation: varmi-pulse 2.2s ease-out infinite;
}

/* Card */
.varmi-card {
  position: relative; background: var(--night);
  border: 1px solid var(--hairline); border-radius: ${layout.radiusCard}px;
  box-shadow: ${shadow.cardInset}; overflow: hidden;
  transition: transform .5s cubic-bezier(.53,.27,.4,1), border-color .5s ease;
}
.varmi-card::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: ${gradient.cardCornerGlow}; opacity: 0.1; transition: opacity .5s ease;
}
.varmi-card--hover:hover { transform: translateY(-4px); }
.varmi-card--hover:hover::after { opacity: 0.18; }
.varmi-card--accent { border-color: rgba(232,162,96,0.35); }

/* Buttons */
/* All button rules are prefixed with .varmi so they BEAT the ".varmi button"
   element reset above (0,1,1). Without the prefix, <button>-rendered CTAs lost
   their background & border entirely and looked like bare text. */
.varmi .varmi-btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; padding: 13px 22px; border-radius: ${layout.radiusButton}px;
  font-size: 0.95rem; font-weight: 500; letter-spacing: -0.01em; white-space: nowrap;
  transition: transform .25s ease, box-shadow .35s ease, background .25s ease;
}
.varmi .varmi-btn:active { transform: translateY(1px); }
.varmi .varmi-btn--dark {
  background: var(--panel); color: var(--white);
  border: 1px solid var(--hairline-strong);
  box-shadow: 0 0 0 0 transparent;
}
.varmi .varmi-btn--dark::before {
  content: ""; position: absolute; left: 50%; bottom: -2px; transform: translateX(-50%);
  width: 60%; height: 22px; pointer-events: none;
  background: radial-gradient(50% 100% at 50% 100%, rgba(255,255,255,0.55), transparent 70%);
  filter: blur(15px); opacity: .7; transition: opacity .35s ease;
}
.varmi .varmi-btn--dark:hover::before { opacity: 1; }
.varmi .varmi-btn--dark:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
.varmi .varmi-btn--gradient {
  background:
    linear-gradient(var(--night), var(--night)) padding-box,
    ${gradient.buttonBorder} border-box;
  border: 2px solid transparent; color: var(--mist);
}
.varmi .varmi-btn--gradient:hover { color: var(--white); }
.varmi .varmi-btn--copper { background: var(--copper); color: var(--night); font-weight: 600; border: 0; }
.varmi .varmi-btn--copper:hover { background: var(--copper-hover); }

/* Stat */
.varmi-stat-value { font-size: ${type.stat}; font-weight: 700; color: var(--white); line-height: 1; letter-spacing: -0.02em; }
.varmi-stat-label { color: var(--mist-60); font-size: 0.9rem; margin-top: 8px; }

/* Timeline steps (Installation / Ablauf).
   Desktop: number on top, text below, shared horizontal line through the row.
   Mobile: number left, text right, vertical connector line \u2014 a real timeline
   instead of orphaned circles. */
.varmi-step { position: relative; flex: 1; min-width: 220px; }
.varmi-step-num {
  width: 36px; height: 36px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--night); border: 1px solid var(--copper); color: var(--copper);
  font-weight: 600; font-size: 15px; position: relative; z-index: 1;
}
.varmi-step-title { margin-top: 18px; font-size: ${type.card}; font-weight: 500; color: var(--mist); letter-spacing: -0.01em; }
.varmi-step-body { margin-top: 8px; color: var(--mist-60); font-size: 0.975rem; max-width: 280px; }
@media (max-width: ${bp.mobile}px) {
  .varmi-step {
    display: grid; grid-template-columns: 36px 1fr; column-gap: 18px;
    min-width: 100%; padding-bottom: 6px;
  }
  .varmi-step-num { grid-row: 1 / span 2; }
  .varmi-step-title { margin-top: 6px; grid-column: 2; }
  .varmi-step-body { grid-column: 2; max-width: none; }
  /* vertical connector between the numbers */
  .varmi-step::before {
    content: ""; position: absolute; left: 17.5px; top: 44px; bottom: -32px;
    width: 1px; background: linear-gradient(180deg, var(--copper), transparent);
    opacity: 0.45;
  }
  .varmi-step:last-child::before { display: none; }
}

/* Hairline */
.varmi-hairline { height: 1px; border: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 50%, transparent); }

/* Responsive helpers */
.varmi-grid { display: grid; gap: ${layout.gap}px; }
.varmi-grid-3 { grid-template-columns: repeat(3, 1fr); }
.varmi-grid-2 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: ${bp.tablet}px) {
  .varmi-grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: ${bp.mobile}px) {
  .varmi-grid-3, .varmi-grid-2 { grid-template-columns: 1fr; }
  .varmi-hide-mobile { display: none !important; }

  /* tighter vertical rhythm on phones */
  .varmi-section { padding-block: 58px; }

  /* CTAs: full-width tap targets (capped so they stay elegant) */
  .varmi .varmi-btn { width: 100%; max-width: 400px; padding-block: 15px; }

  /* data tables \u2192 stacked key/value lists (no horizontal overflow) */
  .varmi-dtable, .varmi-dtable tbody, .varmi-dtable tr, .varmi-dtable th, .varmi-dtable td { display: block; width: 100%; }
  .varmi-dtable tr { border-top: 1px solid var(--hairline); padding: 11px 0; }
  .varmi-dtable th { text-align: left !important; color: var(--mist-60) !important; padding: 0 !important; font-size: 0.85rem !important; }
  .varmi-dtable td { text-align: left !important; white-space: normal !important; padding: 3px 0 0 !important; font-weight: 500; }
}

/* \xA7B Energiefluss stage.
   The 300vh pinned runway exists ONLY on pointer-fine desktop/tablet widths.
   On mobile the stage is static PURELY VIA CSS \u2014 never via a JS class \u2014 so the
   layout (and the height Framer measures) is identical before and after
   hydration. A JS-toggled height caused Framer to measure the tall pre-hydration
   layout and leave a huge empty black band at the end of the page. */
.varmi-ef-track { height: 300vh; position: relative; }
.varmi-ef-stage {
  position: sticky; top: 0; min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  overflow: hidden; padding-block: clamp(60px, 7vw, 90px);
}
.varmi-ef-static { height: auto !important; }
.varmi-ef-static .varmi-ef-stage { position: static !important; min-height: auto !important; padding-block: clamp(56px, 7vw, 90px) !important; }
@media (max-width: ${bp.mobile}px) {
  .varmi-ef-track { height: auto !important; }
  .varmi-ef-stage { position: static !important; min-height: auto !important; justify-content: flex-start; padding-block: 56px 40px !important; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .varmi-reveal, .varmi-reveal.varmi-armed { opacity: 1 !important; transform: none !important; transition: opacity .3s ease !important; }
  .varmi *, .varmi *::before, .varmi *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`;
var FONT_HREF = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@1&display=swap";
var bleedGlobalCss = `html, body { overflow-x: clip; }`;
function VarmiStyles({ bleed = true }) {
  return <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONT_HREF} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {bleed && <style dangerouslySetInnerHTML={{ __html: bleedGlobalCss }} />}
    </>;
}

// src/varmi/components/primitives.tsx

// src/varmi/svg/Icon.tsx
var P = {
  arrowUpRight: <>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </>,
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  check: <polyline points="20 6 9 17 4 12" />,
  x: <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>,
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  cpu: <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </>,
  tool: <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18v3h3l6.5-6.5a4 4 0 0 0 5.2-5.2l-2.9 2.9-2-2 2.9-2.9z" />,
  layers: <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>,
  home: <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>,
  sliders: <>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </>,
  list: <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </>,
  users: <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>,
  help: <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>,
  sun: <>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="23" />
      <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
      <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
      <line x1="1" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="23" y2="12" />
      <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
      <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
    </>,
  battery: <>
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <line x1="23" y1="10" x2="23" y2="14" />
      <polyline points="11 9 8 13 12 13 9 16" />
    </>,
  droplet: <path d="M12 2.7l5.7 5.6a8 8 0 1 1-11.4 0z" />,
  hybrid: <>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </>,
  swap: <>
      <polyline points="16 3 21 8 16 13" />
      <path d="M21 8H8a5 5 0 0 0-5 5" />
      <polyline points="8 21 3 16 8 11" />
      <path d="M3 16h13a5 5 0 0 0 5-5" />
    </>,
  shieldCheck: <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </>,
  smartphone: <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  landmark: <>
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </>,
  building: <>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <path d="M9 22v-4h6v4" />
    </>,
  box: <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.3 7 12 12 20.7 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </>,
  doorClosed: <>
      <path d="M5 22V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v18" />
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="15" y1="12" x2="15" y2="12.5" />
    </>,
  download: <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>,
  mail: <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22 6 12 13 2 6" />
    </>,
  linkedin: <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>,
  instagram: <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.51" />
    </>,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  spark: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
};
function Icon({
  name,
  size = 24,
  strokeWidth = 1.5,
  fill = "none",
  style
}) {
  return <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    style={style}
  >
      {P[name]}
    </svg>;
}

// src/varmi/motion/useReveal.ts
function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add("is-in");
      return;
    }
    el.classList.add("varmi-armed");
    let revealed = false;
    let io = null;
    let timeoutId = 0;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.add("is-in");
      cleanup();
    };
    const onScrollCheck = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) reveal();
    };
    function cleanup() {
      io?.disconnect();
      window.removeEventListener("scroll", onScrollCheck);
      window.removeEventListener("resize", onScrollCheck);
      window.clearTimeout(timeoutId);
    }
    io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && reveal()),
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    window.addEventListener("scroll", onScrollCheck, { passive: true });
    window.addEventListener("resize", onScrollCheck);
    timeoutId = window.setTimeout(reveal, 6e3);
    return () => {
      cleanup();
      el.classList.remove("varmi-armed");
    };
  }, [delay]);
  return ref;
}

// src/varmi/components/primitives.tsx
function Shell({ children, style }) {
  return <div className="varmi-shell" style={style}>{children}</div>;
}
function Section({
  id,
  children,
  style
}) {
  return <section id={id} className="varmi-section" style={style}>
      <Shell>{children}</Shell>
    </section>;
}
function Card({
  children,
  hover = false,
  accent = false,
  style,
  padding = 28
}) {
  const cls = ["varmi-card", hover && "varmi-card--hover", accent && "varmi-card--accent"].filter(Boolean).join(" ");
  return <div className={cls} style={{ padding, ...style }}>
      {children}
    </div>;
}
function Eyebrow({
  label,
  icon,
  dot = false,
  serif = false,
  style
}) {
  return <span className="varmi-eyebrow" style={style}>
      {dot && <span className="varmi-dot" aria-hidden="true" />}
      {icon && <Icon name={icon} size={14} />}
      <span style={serif ? { fontFamily: '"Instrument Serif",serif', fontStyle: "italic", textTransform: "none", fontSize: "1rem", letterSpacing: 0 } : void 0}>
        {label}
      </span>
    </span>;
}
function SectionHeader({
  eyebrow,
  eyebrowIcon,
  eyebrowDot,
  title,
  subline,
  align = "center"
}) {
  const ref = useReveal();
  return <div
    ref={ref}
    className="varmi-reveal"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align,
      gap: 16,
      maxWidth: align === "center" ? 720 : void 0,
      marginInline: align === "center" ? "auto" : void 0
    }}
  >
      <Eyebrow label={eyebrow} icon={eyebrowIcon} dot={eyebrowDot} />
      <h2
    className="varmi-fill-h2"
    style={{
      fontSize: "var(--t-h2, clamp(2rem,1.4rem + 2.6vw,2.75rem))",
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: "-0.01em"
    }}
  >
        {title}
      </h2>
      {subline && <p style={{ color: "var(--mist-70)", maxWidth: 640, fontSize: "1.0625rem" }}>{subline}</p>}
    </div>;
}
function useCountUp(target, run, duration = 1200) {
  const [val, setVal] = useState(0);
  const started = useRef2(false);
  useEffect2(() => {
    if (target == null || !run || started.current) return;
    started.current = true;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(target);
      return;
    }
    let raf = 0;
    let startTs = 0;
    const tick = (ts) => {
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
function StatBadge({
  value,
  label,
  countTo = null,
  prefix = "",
  suffix = ""
}) {
  const ref = useRef2(null);
  const [run, setRun] = useState(false);
  useEffect2(() => {
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
  return <div ref={ref}>
      <div className="varmi-stat-value">{display}</div>
      <div className="varmi-stat-label">{label}</div>
    </div>;
}
function Button({
  children,
  variant = "dark",
  icon = variant === "dark" ? "arrowUpRight" : void 0,
  onClick,
  href,
  newTab = false,
  ariaLabel,
  style,
  type: type2 = "button"
}) {
  const cls = `varmi-btn varmi-btn--${variant}`;
  const inner = <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </>;
  if (href) {
    return <a
      className={cls}
      href={href}
      target={newTab ? "_blank" : void 0}
      rel={newTab ? "noopener noreferrer" : void 0}
      aria-label={ariaLabel}
      style={style}
    >
        {inner}
      </a>;
  }
  return <button className={cls} type={type2} onClick={onClick} aria-label={ariaLabel} style={style}>
      {inner}
    </button>;
}

// src/varmi/components/FeatureCard.tsx
function FeatureCard({
  icon,
  number,
  title,
  children,
  delay = 0,
  accent = false
}) {
  const ref = useReveal(delay);
  return <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
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
      position: "relative"
    }}
  >
          {icon ? <Icon name={icon} size={22} /> : null}
          {number ? <span style={{ fontSize: 15, fontWeight: 600, color: "var(--mist)" }}>{number}</span> : null}
        </div>
        <h3 style={{ fontSize: "var(--t-card)", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ color: "var(--mist-60)", fontSize: "0.975rem" }}>{children}</p>
      </Card>
    </div>;
}

// src/varmi/kooperation/Kooperation.tsx
var DEFAULT_PARTNER_URL = "https://anfrage-varmova.onepage.me/";
var anim = (name, dur, delay) => ({
  animation: `${name} ${dur}s cubic-bezier(.16,1,.3,1) ${delay}s both`
});
function KoopHero({ url }) {
  return <section id="koop-hero" style={{ position: "relative", overflow: "hidden", paddingTop: 96, minHeight: "78vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
    </section>;
}
var VORTEILE = [
  { icon: "mail", title: "Direkte Kundenanfragen", body: "Interessenten aus Ihrer Region leiten wir direkt an Sie weiter \u2014 Sie installieren, statt zu akquirieren." },
  { icon: "bolt", title: "Schneller Einbau, weniger Personalkosten", body: "Eine Anlage, ein Tag, ein kleines Team. Statt wochenlanger Baustellen sparen Sie sp\xFCrbar Personal- und Zeitkosten." },
  { icon: "shieldCheck", title: "Zufriedenere Kunden", body: "Sauberer Einbau ohne Erdaushub und Au\xDFeneinheit \u2014 das begeistert Kunden und bringt Weiterempfehlungen." },
  { icon: "box", title: "Komplettpaket, vormontiert", body: "VARMI kommt anschlussfertig auf der Palette. Weniger Planung, weniger Fehlerquellen, planbare Abl\xE4ufe." },
  { icon: "home", title: "Differenzierung am Markt", body: "Bieten Sie die L\xF6sung, wo die W\xE4rmepumpe scheitert \u2014 Altbau, Denkmal, Mehrfamilienhaus, enge Technikr\xE4ume." },
  { icon: "sliders", title: "Schulung & Support", body: "Technische Einweisung, Fernsupport und Vertriebsunterlagen. Sie sind nie allein im Projekt." }
];
function Vorteile() {
  return <Section id="vorteile">
      <SectionHeader eyebrow="Ihre Vorteile" eyebrowIcon="spark" title="Warum VARMI-Partner werden" subline="Mehr Umsatz bei weniger Aufwand — VARMI macht den Heizungstausch planbar, schnell und profitabel." />
      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        {VORTEILE.map((v, i) => <FeatureCard key={v.title} icon={v.icon} title={v.title} delay={i % 3 * 90}>{v.body}</FeatureCard>)}
      </div>
    </Section>;
}
var STEPS = [
  { t: "Anfrage senden", b: "Kurzes Formular ausf\xFCllen \u2014 wir melden uns zeitnah bei Ihnen." },
  { t: "Onboarding & Schulung", b: "Sie und Ihr Team werden auf VARMI eingewiesen: Technik, Einbau, Vertrieb." },
  { t: "Erste Installation", b: "Erste Anlage an einem Tag eingebaut \u2014 mit Support an Ihrer Seite." },
  { t: "Skalieren", b: "Anfragen erhalten, Auftr\xE4ge abwickeln, Umsatz ausbauen." }
];
function Step({ i, t, b }) {
  const ref = useReveal(i * 100);
  return <div ref={ref} className="varmi-reveal varmi-step">
      <div className="varmi-step-num">{i + 1}</div>
      <h3 className="varmi-step-title">{t}</h3>
      <p className="varmi-step-body">{b}</p>
    </div>;
}
function Ablauf() {
  return <Section id="ablauf">
      <SectionHeader eyebrow="Ablauf" eyebrowIcon="layers" title="In wenigen Schritten Partner" subline="Geringer Einstieg, schneller Start — wir begleiten Sie vom ersten Gespräch bis zur ersten Installation." />
      <div style={{ position: "relative", marginTop: 52 }}>
        <div aria-hidden className="varmi-hide-mobile" style={{ position: "absolute", top: 18, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, var(--copper), transparent)", opacity: 0.5 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
          {STEPS.map((s, i) => <Step key={s.t} i={i} t={s.t} b={s.b} />)}
        </div>
      </div>
    </Section>;
}
var CHIPS = [
  { label: "Heizungsbau", icon: "tool" },
  { label: "SHK / Sanit\xE4r-Heizung", icon: "droplet" },
  { label: "PV-Betriebe", icon: "sun" },
  { label: "Solarbetriebe", icon: "sun" },
  { label: "Elektrobetriebe", icon: "bolt" },
  { label: "Modernisierung im Bestand", icon: "home" }
];
function FuerBetriebe() {
  const ref = useReveal();
  return <Section id="fuer-betriebe">
      <SectionHeader eyebrow="Für wen" eyebrowIcon="users" title="Passt zu Ihrem Betrieb" subline="Ob Heizung, SHK, PV, Solar oder Elektro — wenn Sie wassergeführte Systeme installieren, passt VARMI in Ihr Portfolio." />
      <div ref={ref} className="varmi-reveal" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 40 }}>
        {CHIPS.map((c) => <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 60, border: "1px solid var(--hairline)", background: "var(--panel)", color: "var(--mist-70)", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--copper)", display: "inline-flex" }}><Icon name={c.icon} size={17} /></span>
            {c.label}
          </span>)}
      </div>
    </Section>;
}
var FAQS = [
  { q: "Welche Voraussetzungen muss mein Betrieb erf\xFCllen?", a: "Erfahrung mit wassergef\xFChrten Heizsystemen (Heizung, SHK oder Elektro) gen\xFCgt. Alles Weitere zeigen wir Ihnen in der Schulung." },
  { q: "Wie aufwendig ist der Einstieg?", a: "Gering: vormontierte Anlage, kurze Schulung, Support im ersten Projekt. Sie starten schnell und ohne gro\xDFes Risiko." },
  { q: "Bekomme ich wirklich Kundenanfragen?", a: "Ja. Interessenten aus Ihrer Region leiten wir direkt an Sie weiter \u2014 Sie konzentrieren sich auf den Einbau." },
  { q: "Wie schnell ist eine Installation?", a: "In der Regel an einem Tag \u2014 ohne Erdaushub und ohne Au\xDFeneinheit. Das spart Personal- und Zeitkosten." },
  { q: "Was kostet die Partnerschaft?", a: "Schildern Sie uns kurz Ihren Betrieb \u2014 Konditionen besprechen wir transparent im Erstgespr\xE4ch." },
  { q: "Gibt es Gebietsschutz?", a: "Je nach Region und Nachfrage m\xF6glich. Sprechen Sie uns einfach an." }
];
function FaqItem({ q, a, idx, open, onToggle }) {
  const btnId = `koopfaq-q-${idx}`, panelId = `koopfaq-a-${idx}`;
  return <div style={{ borderTop: "1px solid var(--hairline)" }}>
      <h3 style={{ margin: 0 }}>
        <button id={btnId} aria-expanded={open} aria-controls={panelId} onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 4px", textAlign: "left", fontSize: "1.0625rem", fontWeight: 500, color: open ? "var(--mist)" : "var(--mist-70)" }}>
          <span>{q}</span>
          <span style={{ flexShrink: 0, color: "var(--copper)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}><Icon name="chevronDown" size={20} /></span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open} style={{ padding: open ? "0 4px 24px" : 0, color: "var(--mist-60)", maxWidth: 760, fontSize: "0.975rem", lineHeight: 1.65 }}>{a}</div>
    </div>;
}
function KoopFAQ() {
  const [open, setOpen] = useState2(0);
  const ref = useReveal();
  return <Section id="koop-faq">
      <SectionHeader eyebrow="FAQ" eyebrowIcon="help" title={<>Häufige <span className="varmi-serif">Fragen</span></>} />
      <div ref={ref} className="varmi-reveal" style={{ maxWidth: 820, margin: "40px auto 0" }}>
        {FAQS.map((it, i) => <FaqItem key={i} idx={i} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
      </div>
    </Section>;
}
function KoopCTA({ url, email }) {
  const ref = useReveal();
  return <Section id="koop-cta" style={{ position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", width: "80%", height: "120%", transform: "translate(-50%,-50%) rotate(-13deg)", background: "radial-gradient(50% 50% at 50% 50%, var(--copper-glow), transparent 70%)", opacity: 0.12, pointerEvents: "none" }} />
      <div ref={ref} className="varmi-reveal" style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 640, margin: "0 auto" }}>
        <Eyebrow label="Kooperation" serif />
        <h2 className="varmi-fill-h2" style={{ fontSize: "var(--t-h2)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em" }}>Bereit für mehr Aufträge?</h2>
        <p style={{ color: "var(--mist-70)", maxWidth: 520 }}>Werden Sie VARMI-Fachpartner und profitieren Sie von schnellen Einbauten, geringeren Kosten und direkten Kundenanfragen.</p>
        <div style={{ marginTop: 6 }}><Button variant="dark" href={url} newTab>Partner werden</Button></div>
        <a href={`mailto:${email}`} style={{ color: "var(--mist-60)", fontSize: "0.9rem", marginTop: 4 }}>{email}</a>
      </div>
    </Section>;
}
function Kooperation({ partnerUrl, email = "info@varmova.de", fullBleed }) {
  const url = partnerUrl || DEFAULT_PARTNER_URL;
  const bleed = fullBleed !== false;
  return <div className={bleed ? "varmi varmi--bleed" : "varmi"}>
      <VarmiStyles bleed={bleed} />
      <main>
        <KoopHero url={url} />
        <Vorteile />
        <Ablauf />
        <FuerBetriebe />
        <KoopCTA url={url} email={email} />
        <KoopFAQ />
      </main>
    </div>;
}
var Kooperation_default = Kooperation;

// src/framer-entry-kooperation.tsx
function onCanvas() {
  try {
    return RenderTarget.current() === RenderTarget.canvas;
  } catch {
    return false;
  }
}
function KooperationPage(props) {
  return <Kooperation_default {...props} fullBleed={!onCanvas()} />;
}
addPropertyControls(KooperationPage, {
  partnerUrl: { type: ControlType.Link, title: "Partner-URL (Onepage)" },
  email: { type: ControlType.String, title: "Kontakt-E-Mail", defaultValue: "info@varmova.de" }
});
export default KooperationPage;
