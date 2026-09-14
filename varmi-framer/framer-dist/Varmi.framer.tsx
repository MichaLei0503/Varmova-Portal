import { addPropertyControls, ControlType, RenderTarget } from "framer";
import { useState as useState3, useEffect as useEffect2, useRef as useRef2, useState, useEffect, useRef, useEffect as useEffect3, useState as useState2, useEffect as useEffect4, useRef as useRef3, useState as useState4, useState as useState5 } from "react";

// src/framer-entry.tsx

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

// src/varmi/sections/Hero.tsx

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

// src/varmi/svg/VLogo.tsx
var LEFT_WING = "M26 38 C 36 54, 42 68, 49 88 C 59 122, 75 151, 96 173 C 102 179, 108 175, 104 165 C 87 139, 71 111, 62 86 C 55 63, 47 49, 39 42 C 34 38, 29 37, 26 38 Z";
var RIGHT_WING = "M174 38 C 164 54, 158 68, 151 88 C 141 122, 125 151, 104 173 C 98 179, 92 175, 96 165 C 113 139, 129 111, 138 86 C 145 63, 153 49, 161 42 C 166 38, 171 37, 174 38 Z";
var LEFT_INNER = "M56 64 C 62 96, 76 132, 96 160";
var RIGHT_INNER = "M144 64 C 138 96, 124 132, 104 160";
function VMark({
  fill = "url(#vlogo-gold)",
  animate = false,
  delay = 0.35,
  glow = false
}) {
  const wingAnim = (i) => animate ? { style: { opacity: 0, animation: `varmi-in-fade .7s ease ${delay + i * 0.12}s both` } } : {};
  const lineAnim = (i) => animate ? { pathLength: 1, strokeDasharray: 1, style: { animation: `varmi-draw 1s ease ${delay + 0.5 + i * 0.1}s both` } } : {};
  return <g>
      {glow && <g fill={fill} opacity="0.35" style={{ filter: "blur(4px)" }}>
          <path d={LEFT_WING} />
          <path d={RIGHT_WING} />
        </g>}
      <g fill={fill}>
        <path d={LEFT_WING} {...wingAnim(0)} />
        <path d={RIGHT_WING} {...wingAnim(1)} />
      </g>
      <g fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d={LEFT_INNER} {...lineAnim(0)} />
        <path d={RIGHT_INNER} {...lineAnim(1)} />
      </g>
    </g>;
}

// src/varmi/svg/VarmiProduct.tsx
var FX = 116;
var FY = 150;
var FS = 420;
var DX = 46;
var DY = -34;
var CXF = FX + FS / 2;
var VW = 150;
var VS = VW / 200;
var VTX = CXF - VW / 2;
var VTY = FY + 50;
function VarmiProduct() {
  return <svg viewBox="0 0 720 620" width="100%" height="100%" role="img" aria-label="Varmi Heizsystem — mattschwarzes Gehäuse mit goldenem V-Logo und Touch-Display" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="vp-front" x1="0.05" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#1e222b" />
          <stop offset="40%" stopColor="#12151c" />
          <stop offset="100%" stopColor="#0a0c11" />
        </linearGradient>
        <linearGradient id="vp-top" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#2b303a" />
          <stop offset="100%" stopColor="#181b22" />
        </linearGradient>
        <linearGradient id="vp-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c0f15" />
          <stop offset="100%" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id="vp-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8CE93" />
          <stop offset="48%" stopColor="#E8A260" />
          <stop offset="100%" stopColor="#B4742F" />
        </linearGradient>
        <linearGradient id="vp-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="vp-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id="vp-face">
          <polygon points={`${FX},${FY} ${FX + FS},${FY} ${FX + FS},${FY + FS} ${FX},${FY + FS}`} />
        </clipPath>
      </defs>

      {
    /* contact shadow + ambient */
  }
      <ellipse cx={CXF + 20} cy="585" rx="250" ry="30" fill="rgba(0,0,0,0.7)" filter="url(#vp-soft)" />
      <circle cx={CXF} cy="320" r="250" fill="rgba(232,162,96,0.05)" filter="url(#vp-soft)" />

      {
    /* top face */
  }
      <polygon points={`${FX},${FY} ${FX + FS},${FY} ${FX + FS + DX},${FY + DY} ${FX + DX},${FY + DY}`} fill="url(#vp-top)" stroke="rgba(216,231,242,0.10)" strokeWidth="1" />
      {
    /* right face */
  }
      <polygon points={`${FX + FS},${FY} ${FX + FS + DX},${FY + DY} ${FX + FS + DX},${FY + FS + DY} ${FX + FS},${FY + FS}`} fill="url(#vp-right)" stroke="rgba(216,231,242,0.07)" strokeWidth="1" />

      {
    /* front face */
  }
      <rect x={FX} y={FY} width={FS} height={FS} fill="url(#vp-front)" stroke="rgba(216,231,242,0.10)" strokeWidth="1.5" />
      {
    /* edge highlights */
  }
      <line x1={FX} y1={FY + 1} x2={FX + FS} y2={FY + 1} stroke="rgba(207,231,255,0.16)" strokeWidth="1.5" />
      <line x1={FX + 1} y1={FY} x2={FX + 1} y2={FY + FS} stroke="rgba(207,231,255,0.08)" strokeWidth="1.5" />

      {
    /* fasteners */
  }
      {[FY + 70, FY + FS - 70].map((cy) => <g key={cy}>
          <circle cx={FX + FS - 40} cy={cy} r="10" fill="#070a0e" stroke="rgba(216,231,242,0.16)" strokeWidth="1.2" />
          <circle cx={FX + FS - 40} cy={cy} r="3" fill="rgba(213,219,230,0.4)" />
        </g>)}

      {
    /* gold V — correct brand mark, fades/draws on */
  }
      <g transform={`translate(${VTX} ${VTY}) scale(${VS})`}>
        <VMark fill="url(#vp-gold)" glow animate />
      </g>

      {
    /* touch display — recessed, lights up */
  }
      <g style={{ animation: "varmi-screen 1s ease 1.15s both" }}>
        <rect x={CXF - 66} y={FY + 250} width="132" height="86" rx="8" fill="#04060a" stroke="rgba(232,162,96,0.3)" strokeWidth="1.5" />
        <rect x={CXF - 60} y={FY + 256} width="120" height="60" rx="5" fill="rgba(232,162,96,0.06)" />
        <path d={`M${CXF - 44} ${FY + 300} L${CXF - 22} ${FY + 280} L${CXF - 2} ${FY + 294} L${CXF + 32} ${FY + 266}`} fill="none" stroke="#E8A260" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={CXF + 32} cy={FY + 266} r="2.8" fill="#F0B27A" />
        <text x={CXF} y={FY + 330} textAnchor="middle" fill="rgba(213,219,230,0.4)" fontSize="7.5" fontFamily="Inter, sans-serif" letterSpacing="1.5">XM13</text>
      </g>

      {
    /* specular light sweep across the face */
  }
      <g clipPath="url(#vp-face)">
        <rect x="-180" y={FY} width="150" height={FS} fill="url(#vp-sweep)" style={{ animation: "varmi-sweep 5.5s ease-in-out 1.7s infinite" }} />
      </g>
    </svg>;
}

// src/varmi/components/WistiaBackground.tsx
function extractId(input) {
  const m = input.match(/(?:medias\/|embed\/iframe\/|wistia_async_)([a-z0-9]+)/i);
  return (m ? m[1] : input).trim();
}
function WistiaBackground({ id }) {
  const mediaId = extractId(id);
  const [mount, setMount] = useState2(false);
  const [loaded, setLoaded] = useState2(false);
  useEffect3(() => {
    if (window.matchMedia("(max-width: 809px)").matches) return;
    const w = window;
    const start = () => setMount(true);
    let idleHandle = 0;
    if (typeof w.requestIdleCallback === "function") {
      idleHandle = w.requestIdleCallback(start, { timeout: 2e3 });
    }
    const timeoutHandle = window.setTimeout(start, 1500);
    return () => {
      if (idleHandle) w.cancelIdleCallback?.(idleHandle);
      window.clearTimeout(timeoutHandle);
    };
  }, []);
  const params = [
    "autoPlay=true",
    "silentAutoPlay=true",
    "muted=true",
    "endVideoBehavior=loop",
    "controlsVisibleOnLoad=false",
    "playbar=false",
    "playButton=false",
    "fullscreenButton=false",
    "smallPlayButton=false",
    "volumeControl=false",
    "settingsControl=false",
    "playSuspendedOffScreen=false",
    "videoFoam=false",
    "wmode=transparent",
    "qualityMax=1080"
  ].join("&");
  const src = `https://fast.wistia.net/embed/iframe/${mediaId}?${params}`;
  return <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: "#04070D" }}>
      {mount && <iframe
    src={src}
    title="Varmi"
    allow="autoplay; fullscreen"
    scrolling="no"
    onLoad={() => setLoaded(true)}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "max(100%, 177.78vh)",
      height: "max(100%, 56.25vw)",
      transform: "translate(-50%, -50%)",
      border: 0,
      opacity: loaded ? 1 : 0,
      transition: "opacity 1.2s ease"
    }}
  />}
    </div>;
}

// src/varmi/sections/Hero.tsx
var HEIZUNGEN = ["\xD6l", "Gas", "Nachtspeicher", "Hybrid"];
var anim = (name, dur, delay, ease = "cubic-bezier(.16,1,.3,1)") => ({
  animation: `${name} ${dur}s ${ease} ${delay}s both`
});
function Hero({
  onContactClick,
  contactUrl,
  heroImage,
  heroVideoId
}) {
  const [aktuell, setAktuell] = useState3(null);
  const hasVideo = !!heroVideoId;
  return <section
    id="hero"
    style={{
      position: "relative",
      overflow: "hidden",
      paddingTop: 96,
      ...hasVideo ? { minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center" } : null
    }}
  >
      {hasVideo ? <>
          {
    /* Background video */
  }
          <WistiaBackground id={heroVideoId} />
          {
    /* Legibility overlay — dark vignette + copper top band to blend with the header */
  }
          <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(4,7,13,0.78) 0%, rgba(4,7,13,0.30) 26%, rgba(4,7,13,0.45) 62%, rgba(4,7,13,0.92) 92%, #04070D 100%)",
      pointerEvents: "none"
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
      pointerEvents: "none"
    }}
  />
        </> : <>
          {
    /* Sunrise band — copper/orange glow fading to night (live-site look) */
  }
          <div
    aria-hidden
    style={{
      position: "absolute",
      inset: "0 0 auto 0",
      height: "clamp(96px, 16vh, 190px)",
      background: "linear-gradient(180deg, #E8A260 0%, #E07A26 40%, rgba(176,88,0,0.22) 68%, rgba(4,7,13,0) 100%)",
      opacity: 0.82,
      pointerEvents: "none"
    }}
  />
          <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(60% 50% at 50% 6%, rgba(232,162,96,0.18), rgba(4,7,13,0) 60%)",
      pointerEvents: "none"
    }}
  />
        </>}

      <Shell style={{ position: "relative" }}>
        <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      paddingTop: "clamp(40px, 8vh, 90px)",
      gap: 22
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
      ...anim("varmi-in-scale", 1.6, 0)
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
            <Button variant="dark" onClick={onContactClick} href={onContactClick ? void 0 : contactUrl} newTab>
              Beratung anfragen
            </Button>
            <Button variant="gradient" href="#technologie" icon="chevronDown">
              Wie es funktioniert
            </Button>
          </div>

          {
    /* Micro-selector — pre-context for the contact form */
  }
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8, ...anim("varmi-in-fade", 1, 0.7) }}>
            <span style={{ fontSize: 13, color: "var(--mist-60)" }}>Womit heizen Sie aktuell?</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {HEIZUNGEN.map((h) => {
    const active = aktuell === h;
    return <button
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
        transition: "all .2s ease"
      }}
    >
                    {h}
                  </button>;
  })}
            </div>
          </div>
        </div>

        {
    /* Product — animated vector unit (or the client's photo). Hidden when a hero video is set. */
  }
        {!hasVideo && <div style={{ marginTop: 48, maxWidth: 620, marginInline: "auto", ...anim("varmi-in-scale", 1.4, 0.5) }}>
          <div style={{ animation: "varmi-float 6s ease-in-out 2s infinite" }}>
            {heroImage ? <div style={{ position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", inset: "-6%", background: "radial-gradient(50% 44% at 50% 46%, rgba(232,162,96,0.12), rgba(4,7,13,0) 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}>
                  <img src={heroImage} alt="Varmi Heizsystem — Produktbild" loading="eager" decoding="async" style={{ display: "block", width: "100%", height: "auto" }} />
                  <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.30) 50%, transparent)", mixBlendMode: "screen", pointerEvents: "none", animation: "varmi-photo-sweep 6.5s ease-in-out 2.2s infinite" }} />
                </div>
              </div> : <div style={{ aspectRatio: "660 / 560" }}>
                <VarmiProduct />
              </div>}
          </div>
        </div>}

        {
    /* Scroll chevron */
  }
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <a href="#energiefluss" aria-label="Weiter scrollen" style={{ color: "var(--mist-60)" }}>
            <span style={{ display: "inline-block", animation: "varmi-bounce 1.8s ease-in-out infinite" }}>
              <Icon name="chevronDown" size={26} />
            </span>
          </a>
        </div>
      </Shell>
    </section>;
}

// src/varmi/sections/Energiefluss.tsx

// src/varmi/svg/EnergieflussScene.tsx
var clamp = (v) => Math.max(0, Math.min(1, v));
var seg = (p, a, b) => clamp((p - a) / (b - a));
function pulse(p) {
  if (p < 0.48) return 0.2;
  if (p < 0.56) return 0.2 + (1 - 0.2) * seg(p, 0.48, 0.56);
  if (p < 0.64) return 1 + (0.55 - 1) * seg(p, 0.56, 0.64);
  return 0.55;
}
function draw(fraction) {
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - fraction };
}
function EnergieflussScene({ progress, reduced }) {
  const p = reduced ? 1 : progress;
  const sunPV = seg(p, 0, 0.22);
  const pvVarmi = seg(p, 0.24, 0.48);
  const pvGlow = seg(p, 0.05, 0.22);
  const varmiOp = pulse(p);
  const roomsDraw = seg(p, 0.62, 0.96);
  const roomsGlow = seg(p, 0.74, 1);
  const pvOpacity = (i) => seg(p, 0.05 + i * 0.03, 0.18 + i * 0.03);
  return <svg viewBox="0 0 800 500" width="100%" height="100%" role="img" aria-label="Energieweg: Solarstrom vom Dach über Varmi in alle Räume" style={{ display: "block" }}>
      <defs>
        <radialGradient id="vf-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0B27A" />
          <stop offset="100%" stopColor="#E8A260" />
        </radialGradient>
        <radialGradient id="vf-room" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(232,162,96,0.55)" />
          <stop offset="100%" stopColor="rgba(232,162,96,0)" />
        </radialGradient>
        <filter id="vf-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {
    /* House outline */
  }
      <g stroke="rgba(213,219,230,0.45)" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M250 250 L440 130 L630 250" />
        <path d="M280 250 L280 430 L600 430 L600 250" />
        <line x1="280" y1="350" x2="600" y2="350" stroke="rgba(213,219,230,0.18)" />
        <line x1="460" y1="350" x2="460" y2="430" stroke="rgba(213,219,230,0.18)" />
      </g>

      {
    /* Sun */
  }
      <g style={{ opacity: pvGlow }}>
        <circle cx="120" cy="100" r="30" fill="url(#vf-sun)" filter="url(#vf-glow)" />
        <g stroke="#E8A260" strokeWidth="2.5" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const rad = a * Math.PI / 180;
    return <line
      key={a}
      x1={120 + 38 * Math.cos(rad)}
      y1={100 + 38 * Math.sin(rad)}
      x2={120 + 50 * Math.cos(rad)}
      y2={100 + 50 * Math.sin(rad)}
    />;
  })}
        </g>
      </g>

      {
    /* PV panels on the left roof slope */
  }
      <g>
        {[0, 1, 2, 3].map((i) => {
    const t = i / 4;
    const x = 270 + t * 150;
    const y = 238 - t * 95;
    return <path
      key={i}
      d={`M${x} ${y} l40 -25 l16 18 l-40 25 z`}
      fill="rgba(232,162,96,0.16)"
      stroke="#E8A260"
      strokeWidth="1.5"
      style={{ opacity: pvOpacity(i) }}
    />;
  })}
      </g>

      {
    /* Path: Sun → PV */
  }
      <path d="M150 120 C 200 180, 230 175, 300 195" fill="none" stroke="#E8A260" strokeWidth="2.5" strokeLinecap="round" filter="url(#vf-glow)" {...draw(sunPV)} />

      {
    /* VARMI unit with the brand V */
  }
      <g style={{ opacity: varmiOp }}>
        <rect x="396" y="360" width="84" height="62" rx="10" fill="#10131C" stroke="#E8A260" strokeWidth="2" filter="url(#vf-glow)" />
        <g transform="translate(416 369) scale(0.22)">
          <VMark fill="#E8A260" />
        </g>
      </g>

      {
    /* Path: PV roof → VARMI */
  }
      <path d="M300 150 C 330 250, 380 300, 430 360" fill="none" stroke="#E8A260" strokeWidth="2.5" strokeLinecap="round" {...draw(pvVarmi)} />

      {
    /* Rooms (radiators) with warm glow */
  }
      {[
    { gx: 360, gy: 300, rx: 330, ry: 286 },
    { gx: 545, gy: 300, rx: 520, ry: 286 },
    { gx: 360, gy: 400, rx: 332, ry: 392 },
    { gx: 545, gy: 400, rx: 520, ry: 392 }
  ].map((pt, i) => <g key={i}>
          <circle cx={pt.gx} cy={pt.gy} r="46" fill="url(#vf-room)" style={{ opacity: roomsGlow }} />
          <g stroke="rgba(213,219,230,0.6)" strokeWidth="1.5" fill="none">
            <rect x={pt.rx} y={pt.ry} width="34" height="26" rx="3" />
            <line x1={pt.rx + 9} y1={pt.ry} x2={pt.rx + 9} y2={pt.ry + 26} />
            <line x1={pt.rx + 18} y1={pt.ry} x2={pt.rx + 18} y2={pt.ry + 26} />
            <line x1={pt.rx + 27} y1={pt.ry} x2={pt.rx + 27} y2={pt.ry + 26} />
          </g>
        </g>)}

      {
    /* Paths: VARMI → rooms */
  }
      {[
    "M438 360 C 420 330, 380 315, 350 300",
    "M460 362 C 500 335, 530 318, 545 305",
    "M440 422 C 420 430, 380 420, 352 405",
    "M462 422 C 500 430, 530 420, 548 405"
  ].map((d, i) => <path key={i} d={d} fill="none" stroke="#E8A260" strokeWidth="2" strokeLinecap="round" {...draw(roomsDraw)} />)}
    </svg>;
}

// src/varmi/svg/Tagesverlauf.tsx
var W = 720;
var H = 230;
var PADL = 16;
var PADR = 16;
var TOP = 24;
var BASE = 176;
var PRICE = [
  [0, 0.36],
  [2, 0.18],
  [4, 0.15],
  [6, 0.46],
  [8, 0.86],
  [10, 0.6],
  [12, 0.3],
  [14, 0.28],
  [16, 0.56],
  [18, 0.96],
  [20, 0.8],
  [22, 0.5],
  [24, 0.36]
];
var xOf = (h) => PADL + h / 24 * (W - PADL - PADR);
var yOf = (p) => BASE - p * (BASE - TOP);
function smoothPath(pts) {
  const P2 = pts.map(([h, p]) => [xOf(h), yOf(p)]);
  let d = `M ${P2[0][0]} ${P2[0][1]}`;
  for (let i = 0; i < P2.length - 1; i++) {
    const [x0, y0] = P2[i];
    const [x1, y1] = P2[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}
var WINDOWS = [
  [2, 6, "Nacht"],
  [11, 15, "PV-Mittag"]
];
function Tagesverlauf() {
  const line = smoothPath(PRICE);
  const area = `${line} L ${xOf(24)} ${BASE} L ${xOf(0)} ${BASE} Z`;
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Tagesverlauf des Strompreises mit günstigen Heizfenstern nachts und mittags" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vf-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(213,219,230,0.18)" />
          <stop offset="100%" stopColor="rgba(213,219,230,0)" />
        </linearGradient>
      </defs>

      {
    /* cheap windows */
  }
      {WINDOWS.map(([a, b, label]) => <g key={label}>
          <rect x={xOf(a)} y={TOP} width={xOf(b) - xOf(a)} height={BASE - TOP} fill="rgba(232,162,96,0.12)" />
          <line x1={xOf(a)} y1={TOP} x2={xOf(a)} y2={BASE} stroke="rgba(232,162,96,0.3)" strokeDasharray="3 4" />
          <line x1={xOf(b)} y1={TOP} x2={xOf(b)} y2={BASE} stroke="rgba(232,162,96,0.3)" strokeDasharray="3 4" />
          <text x={(xOf(a) + xOf(b)) / 2} y={TOP - 8} fill="#E8A260" fontSize="12" textAnchor="middle" fontFamily="Inter, sans-serif">
            {label}
          </text>
        </g>)}

      {
    /* baseline */
  }
      <line x1={PADL} y1={BASE} x2={W - PADR} y2={BASE} stroke="rgba(216,231,242,0.12)" />

      {
    /* area + curve */
  }
      <path d={area} fill="url(#vf-area)" />
      <path d={line} fill="none" stroke="#D5DBE6" strokeWidth="2" strokeLinecap="round" />

      {
    /* hour ticks */
  }
      {[0, 6, 12, 18, 24].map((h) => <text key={h} x={xOf(h)} y={H - 6} fill="rgba(213,219,230,0.5)" fontSize="11" textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} fontFamily="Inter, sans-serif">
          {h}:00
        </text>)}
    </svg>;
}

// src/varmi/sections/Energiefluss.tsx
var PHASES = ["Eigener Solarstrom", "Direkt in Varmi", "Intelligent gesteuert", "W\xE4rme im ganzen Haus"];
var BULLETS = ["Dynamischer Stromtarif", "PV-Eigenverbrauch", "Batteriespeicher-Anbindung", "Lastverschiebung automatisch"];
var WINDOWS2 = [
  [0, 0.04, 0.2, 0.26],
  [0.24, 0.3, 0.44, 0.5],
  [0.48, 0.54, 0.6, 0.66],
  [0.64, 0.72, 1.01, 1.02]
];
var clamp2 = (v) => Math.max(0, Math.min(1, v));
function phaseOpacity(p, i) {
  const [a, b, c, d] = WINDOWS2[i];
  if (p < a) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p < c) return 1;
  if (p < d) return 1 - (p - c) / (d - c);
  return 0;
}
var mq = (q) => typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(q).matches : false;
function Energiefluss() {
  const scrollRef = useRef3(null);
  const [reduced, setReduced] = useState4(() => mq("(prefers-reduced-motion: reduce)"));
  const [isMobile, setIsMobile] = useState4(() => mq("(max-width: 809px)"));
  const [progress, setProgress] = useState4(0);
  const compact = reduced || isMobile;
  useEffect4(() => {
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
  useEffect4(() => {
    if (compact) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const prog = total > 0 ? clamp2(-rect.top / total) : 0;
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
  const closeRef = useReveal();
  const chartRef = useReveal();
  return <section id="energiefluss" style={{ position: "relative" }}>
      {
    /* Pinned scrub stage (or static frame when reduced) */
  }
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

              {
    /* Phase keywords — compact mode: vertical flow (reads like the
       energy path itself; horizontal arrows wrapped awkwardly). */
  }
              {compact ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 18 }}>
                  {PHASES.map((p, i) => <span key={p} style={{ display: "contents" }}>
                      {i > 0 && <span aria-hidden style={{ color: "var(--mist-40)", fontSize: "0.85rem", lineHeight: 1 }}>↓</span>}
                      <span style={{ color: "var(--copper)", fontWeight: 500 }}>{p}</span>
                    </span>)}
                </div> : <div style={{ display: "grid", placeItems: "center", minHeight: "2.4em", marginTop: 8 }}>
                  {PHASES.map((label, i) => <span
    key={label}
    style={{
      gridArea: "1 / 1",
      textAlign: "center",
      color: "var(--copper)",
      fontSize: "clamp(1.1rem, 0.8rem + 1.4vw, 1.6rem)",
      fontWeight: 500,
      letterSpacing: "-0.01em",
      opacity: phaseOpacity(progress, i),
      transition: "opacity .15s linear"
    }}
  >
                      {label}
                    </span>)}
                </div>}
            </div>
          </Shell>
        </div>
      </div>

      {
    /* Static value close (Layer A) */
  }
      <Shell style={{ paddingBottom: "clamp(80px, 7vw, 100px)" }}>
        <div ref={closeRef} className="varmi-reveal" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 22 }}>
          <p style={{ color: "var(--mist-70)", fontSize: "1.0625rem" }}>
            Varmi ist PV- und börsenstrom-ready. Die Regelung verschiebt das Heizen automatisch in
            günstige Zeitfenster — nachts oder mittags bei Sonnenstrom.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {BULLETS.map((b) => <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 60, border: "1px solid var(--hairline)", background: "var(--panel)", color: "var(--mist-70)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--copper)", display: "inline-flex" }}><Icon name="check" size={14} strokeWidth={2} /></span>
                {b}
              </span>)}
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
    </section>;
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

// src/varmi/svg/VarmiCutaway.tsx
function Badge({ x, y, n }) {
  return <g>
      <circle cx={x} cy={y} r="13" fill="#04070D" stroke="#E8A260" strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#E8A260" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
        {n}
      </text>
    </g>;
}
function VarmiCutaway() {
  const rods = [196, 226, 256, 286];
  return <svg viewBox="0 0 760 460" width="100%" height="100%" role="img" aria-label="Schnitt durch das Varmi-System: Tank mit vier Heizstäben, Wärmetauscher, Pumpe und Steuerung" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vc-fluid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(232,162,96,0.05)" />
          <stop offset="100%" stopColor="rgba(232,162,96,0.28)" />
        </linearGradient>
        <linearGradient id="vc-rod" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0B27A" />
          <stop offset="100%" stopColor="#E8A260" />
        </linearGradient>
        <filter id="vc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="vc-tank">
          <rect x="150" y="92" width="190" height="300" rx="16" />
        </clipPath>
      </defs>

      {
    /* Cabinet (Anlagenschrank) */
  }
      <rect x="60" y="48" width="380" height="372" rx="20" fill="none" stroke="rgba(216,231,242,0.14)" strokeWidth="1.5" />

      {
    /* Tank ① */
  }
      <rect x="150" y="92" width="190" height="300" rx="16" fill="#0B0F18" stroke="rgba(213,219,230,0.5)" strokeWidth="2" />
      {
    /* thermofluid */
  }
      <g clipPath="url(#vc-tank)">
        <rect x="150" y="150" width="190" height="242" fill="url(#vc-fluid)" />
        {
    /* heat shimmer rising */
  }
        {[180, 245, 310].map((x, i) => <circle key={x} cx={x} cy="360" r="3" fill="rgba(232,162,96,0.6)" style={{ animation: `varmi-rise ${3 + i * 0.6}s ease-in ${i * 0.8}s infinite` }} />)}
      </g>
      {
    /* heating rods */
  }
      {rods.map((x, i) => <g key={x}>
          <rect x={x - 5} y="118" width="10" height="250" rx="5" fill="url(#vc-rod)" filter="url(#vc-glow)" style={{ transformOrigin: "center", animation: `varmi-rod ${2.2 + i * 0.3}s ease-in-out ${i * 0.25}s infinite` }} />
          <rect x={x - 9} y="110" width="18" height="12" rx="3" fill="#10131C" stroke="rgba(213,219,230,0.4)" strokeWidth="1" />
        </g>)}

      {
    /* Heat exchanger ③ — coil at the top of the tank */
  }
      <g stroke="#E8A260" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M250 92 V 70 q 0 -14 18 -14 q 18 0 18 -14 q 0 -14 -18 -14 q -18 0 -18 -14 q 0 -14 18 -14 H 345" />
      </g>

      {
    /* Pump ② on the return line */
  }
      <g>
        <circle cx="405" cy="350" r="22" fill="#10131C" stroke="rgba(213,219,230,0.5)" strokeWidth="2" />
        <g stroke="#E8A260" strokeWidth="2" strokeLinecap="round" style={{ transformOrigin: "405px 350px", animation: "varmi-spin 5s linear infinite" }}>
          <line x1="405" y1="338" x2="405" y2="362" />
          <line x1="394" y1="344" x2="416" y2="356" />
          <line x1="394" y1="356" x2="416" y2="344" />
        </g>
      </g>

      {
    /* Pipes: Vorlauf (warm, top) + Rücklauf (cool, bottom) to the heating circuit */
  }
      {
    /* Vorlauf */
  }
      <path d="M345 64 H 460 V 150 H 470" fill="none" stroke="#E8A260" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M345 64 H 460 V 150 H 470" fill="none" stroke="#F0B27A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 22" style={{ animation: "varmi-flow 1.2s linear infinite" }} />
      <polygon points="470,144 482,150 470,156" fill="#E8A260" />
      {
    /* Rücklauf */
  }
      <path d="M470 320 H 460 V 350 H 427" fill="none" stroke="rgba(213,219,230,0.5)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M482 320 H 460 V 350 H 427" fill="none" stroke="rgba(213,219,230,0.7)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 22" style={{ animation: "varmi-flow 1.6s linear infinite reverse" }} />

      {
    /* labels for the circuit */
  }
      <text x="492" y="138" fill="var(--mist-60)" fontSize="12" fontFamily="Inter, sans-serif">Vorlauf</text>
      <text x="492" y="324" fill="var(--mist-60)" fontSize="12" fontFamily="Inter, sans-serif">Rücklauf</text>

      {
    /* Controller ④ + Schaltschrank ⑤ */
  }
      <rect x="560" y="92" width="150" height="220" rx="14" fill="#0B0F18" stroke="rgba(216,231,242,0.14)" strokeWidth="1.5" />
      {
    /* touch display */
  }
      <rect x="584" y="120" width="102" height="64" rx="8" fill="#10131C" stroke="rgba(232,162,96,0.4)" strokeWidth="1.5" filter="url(#vc-glow)" />
      <path d="M598 160 L618 140 L636 154 L660 132" fill="none" stroke="#E8A260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {
    /* relay/indicator rows */
  }
      {[208, 230, 252, 274].map((y) => <g key={y}>
          <rect x="584" y={y} width="78" height="10" rx="3" fill="rgba(213,219,230,0.08)" />
          <circle cx="674" cy={y + 5} r="3.5" fill={y === 208 ? "#A6DAFF" : "rgba(213,219,230,0.4)"} />
        </g>)}

      {
    /* number badges */
  }
      <Badge x={150} y={92} n={1} />
      <Badge x={405} y={350} n={2} />
      <Badge x={398} y={40} n={3} />
      <Badge x={560} y={92} n={4} />
      <Badge x={710} y={92} n={5} />
    </svg>;
}

// src/varmi/sections/Technologie.tsx
var LEGEND = [
  ["1", "Tank (Thermofluid)"],
  ["2", "Pumpe"],
  ["3", "W\xE4rmetauscher"],
  ["4", "Steuerung"],
  ["5", "Schaltschrank"]
];
function Technologie() {
  const imgRef = useReveal();
  return <Section id="technologie">
      <SectionHeader
    eyebrow="Technologie"
    eyebrowIcon="cpu"
    title="Wie Varmi Wärme macht"
    subline="Strom rein, Wärme raus — mit einem Thermofluid-Tank (ISOTHERM 100/S), der Wärme puffert und über einen integrierten Wärmetauscher gleichmäßig an Ihren wassergeführten Heizkreis abgibt."
  />

      <div ref={imgRef} className="varmi-reveal" style={{ maxWidth: 780, margin: "44px auto 0" }}>
        <Card style={{ padding: "clamp(16px,3vw,28px)" }}>
          <div style={{ aspectRatio: "760 / 460" }}>
            <VarmiCutaway />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", marginTop: 12 }}>
            {LEGEND.map(([n, label]) => <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--mist-60)", fontSize: "0.8rem" }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid var(--copper)", color: "var(--copper)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>{n}</span>
                {label}
              </span>)}
          </div>
        </Card>
      </div>

      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        <FeatureCard icon="bolt" number="1" title="Erzeugen" delay={0}>
          Vier Heizstäbe erhitzen das Wärmeträgerfluid im Tank. Strom wird direkt in Wärme
          umgesetzt — robust und wartungsarm.
        </FeatureCard>
        <FeatureCard icon="swap" number="2" title="Übergeben" delay={100}>
          Ein Wärmetauscher überträgt die Wärme an Ihren wassergeführten Heizkreis. Heizkörper
          oder Fußboden — beides möglich.
        </FeatureCard>
        <FeatureCard icon="sliders" number="3" title="Steuern" delay={200}>
          Eine intelligente Regelung entscheidet, wann geheizt und gespeichert wird — abgestimmt
          auf Tarif, PV und Bedarf. Bedienung &amp; Übersicht bequem per App.
        </FeatureCard>
      </div>
    </Section>;
}

// src/varmi/sections/Installation.tsx
var STEPS = [
  {
    t: "Anliefern & Anschlie\xDFen",
    b: "Die vormontierte Anlage wird an Strom und den bestehenden Heizkreis angeschlossen."
  },
  {
    t: "In Betrieb nehmen",
    b: "Bef\xFCllen, Regelung einrichten, testen \u2014 alles am selben Tag."
  },
  {
    t: "Abnahme & Einweisung",
    b: "Funktionstest, Dokumentation, kurze Einweisung. Bei Fragen schneller Support."
  }
];
function Step({ i, t, b }) {
  const ref = useReveal(i * 110);
  return <div ref={ref} className="varmi-reveal varmi-step">
      <div className="varmi-step-num">{i + 1}</div>
      <h3 className="varmi-step-title">{t}</h3>
      <p className="varmi-step-body">{b}</p>
    </div>;
}
function Installation() {
  return <Section id="installation">
      <SectionHeader
    eyebrow="Installation"
    eyebrowIcon="tool"
    title="In einem Tag eingebaut"
    subline="Vormontiert geliefert auf einer Palette. Kein Erdaushub, keine Außeneinheit, kein wochenlanges Chaos im Haus."
  />

      {
    /* Timeline */
  }
      <div style={{ position: "relative", marginTop: 52 }}>
        <div
    aria-hidden
    className="varmi-hide-mobile"
    style={{
      position: "absolute",
      top: 18,
      left: "8%",
      right: "8%",
      height: 1,
      background: "linear-gradient(90deg, transparent, var(--copper), transparent)",
      opacity: 0.5
    }}
  />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
          {STEPS.map((s, i) => <Step key={s.t} i={i} t={s.t} b={s.b} />)}
        </div>
      </div>

      {
    /* Stats */
  }
      <Card style={{ marginTop: 52, padding: "34px clamp(20px,4vw,44px)" }}>
        <div className="varmi-grid varmi-grid-3" style={{ textAlign: "center" }}>
          <StatBadge value="1" label="typische Installationszeit (Werktag)" />
          <StatBadge value="0" label="Außeneinheiten — kein Lärm, keine Genehmigung" />
          <StatBadge value="ca. 90 kg" label="kompakt, vormontiert auf Palette" />
        </div>
      </Card>

      <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, marginTop: 20, maxWidth: 760 }}>
        Die Einbindung in das wassergeführte Heizungsnetz und die elektrische Verdrahtung erfolgen
        bauseits durch qualifiziertes Fachpersonal.
      </p>
    </Section>;
}

// src/varmi/sections/Betriebsarten.tsx
function Betriebsarten() {
  return <Section id="betriebsarten">
      <SectionHeader
    eyebrow="Betriebsarten"
    eyebrowIcon="layers"
    title={<>
            Drei Wege, <span className="varmi-serif">warm</span> zu werden
          </>}
  />
      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        <FeatureCard icon="battery" title="Ladebetrieb" delay={0}>
          Varmi lädt Ihren thermischen Wärmespeicher und gibt die Wärme bedarfsgerecht ab — ideal,
          um günstige Stromzeiten zu nutzen.
        </FeatureCard>
        <FeatureCard icon="droplet" title="Durchlauferhitzer" delay={100}>
          Wärme genau dann, wenn sie gebraucht wird — direkt und ohne Vorlauf.
        </FeatureCard>
        <FeatureCard icon="hybrid" title="Hybridbetrieb" delay={200}>
          Varmi erweitert Ihren bestehenden hydraulischen Kreislauf und arbeitet mit Ihrer
          vorhandenen Öl- oder Gasheizung zusammen. Sie behalten die Sicherheit Ihres Bestands.
        </FeatureCard>
      </div>
    </Section>;
}

// src/varmi/sections/PasstAnders.tsx
var CHIPS = [
  { label: "Altbau", icon: "home" },
  { label: "Denkmalgesch\xFCtzte Geb\xE4ude", icon: "landmark" },
  { label: "Mehrfamilienh\xE4user", icon: "building" },
  { label: "Bestandsgeb\xE4ude", icon: "box" },
  { label: "Enge Technikr\xE4ume", icon: "doorClosed" },
  { label: "Neubau", icon: "home" }
];
var PRO = [
  "Einfache, schnelle Installation",
  "Kompatibel mit PV & Speicher",
  "G\xFCnstig in der Anschaffung",
  "F\xFCr Altbau, Denkmal, MFH & Neubau geeignet",
  "Au\xDFentemperaturunabh\xE4ngiger Betrieb",
  "Keine Abh\xE4ngigkeit von Vorlauftemperaturen",
  "Smarte Steuerung inklusive"
];
var CON = [
  "Komplexe Installation",
  "Nicht immer PV-kompatibel",
  "Oft nur mit F\xF6rderung bezahlbar",
  "Einschr\xE4nkungen bei der Umsetzbarkeit",
  "Leistung sinkt mit der Au\xDFentemperatur",
  "Auf niedrige Vorlauftemperaturen angewiesen",
  "Aufw\xE4ndige Inbetriebnahme"
];
function CompareList({
  title,
  items,
  positive
}) {
  const ref = useReveal(positive ? 0 : 100);
  return <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card accent={positive} style={{ height: "100%", padding: "28px 30px" }}>
        <h3 style={{ fontSize: "var(--t-card)", fontWeight: 500, color: positive ? "var(--mist)" : "var(--mist-70)", marginBottom: 20, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <ul style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
    style={{
      flexShrink: 0,
      marginTop: 1,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: positive ? "rgba(232,162,96,0.14)" : "rgba(213,219,230,0.06)",
      color: positive ? "var(--copper)" : "var(--mist-40)"
    }}
  >
                <Icon name={positive ? "check" : "x"} size={13} strokeWidth={2} />
              </span>
              <span style={{ color: positive ? "var(--mist)" : "var(--mist-60)", fontSize: "0.975rem" }}>{it}</span>
            </li>)}
        </ul>
      </Card>
    </div>;
}
function PasstAnders() {
  const chipsRef = useReveal();
  return <Section id="passt-anders">
      <SectionHeader
    eyebrow="Für jedes Haus"
    eyebrowIcon="home"
    title="Da, wo andere scheitern"
    subline="Ideal für Gebäude, in denen eine Wärmepumpe schwer umzusetzen ist — wegen Platz, Schallschutz, Denkmalschutz oder fehlender Außenfläche."
  />

      <div
    ref={chipsRef}
    className="varmi-reveal"
    style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 40 }}
  >
        {CHIPS.map((c) => <span
    key={c.label}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 16px",
      borderRadius: 60,
      border: "1px solid var(--hairline)",
      background: "var(--panel)",
      color: "var(--mist-70)",
      fontSize: "0.9rem"
    }}
  >
            <span style={{ color: "var(--copper)", display: "inline-flex" }}>
              <Icon name={c.icon} size={16} />
            </span>
            {c.label}
          </span>)}
      </div>

      <div className="varmi-grid varmi-grid-2" style={{ marginTop: 44 }}>
        <CompareList title="Varmi" items={PRO} positive />
        <CompareList title="Bekannte Heiztechnologien" items={CON} positive={false} />
      </div>
    </Section>;
}

// src/varmi/sections/SteuerungVerlass.tsx
function SteuerungVerlass() {
  const closeRef = useReveal();
  return <Section id="steuerung-verlass">
      <SectionHeader
    eyebrow="Steuerung & Verlässlichkeit"
    eyebrowIcon="sliders"
    title="Sicherheit. Ruhe. Kontrolle."
  />

      <div className="varmi-grid varmi-grid-3" style={{ marginTop: 44 }}>
        <FeatureCard icon="smartphone" title="App & Automationen" delay={0}>
          Über LAN/App steuern Sie Zeiten und Temperaturen und sehen jederzeit, was Varmi gerade
          tut. Den Rest optimiert die Regelung selbst.
        </FeatureCard>
        <FeatureCard icon="shieldCheck" title="Wartungsarm & robust" delay={100}>
          Gebaut für den Dauerbetrieb: ohne Außeneinheit, ohne Lärm, mit minimalem Serviceaufwand.
        </FeatureCard>
        <FeatureCard icon="activity" title="Sicher überwacht" delay={200}>
          Selbst-Monitoring meldet Auffälligkeiten früh; Fernwartung möglich. Garantie bis 5 Jahre².
        </FeatureCard>
      </div>

      <div ref={closeRef} className="varmi-reveal" style={{ textAlign: "center", marginTop: 40 }}>
        <p style={{ color: "var(--mist-70)", maxWidth: 620, margin: "0 auto", fontSize: "1.0625rem" }}>
          Sie bekommen Wärme, wenn Sie sie brauchen — und behalten Anlage und Kosten jederzeit im
          Blick.
        </p>
        <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", marginTop: 14 }}>
          ² Je nach Paket/Vertrag.
        </p>
      </div>
    </Section>;
}

// src/varmi/sections/Daten.tsx
var GROUPS = [
  {
    title: "Leistung & Effizienz",
    rows: [
      ["Heizleistung (max.)", "17,8 kW", "Herstellerangabe"],
      ["Heizleistung (\xD8 erwartet)", "ca. 10,5 kW", "Herstellerangabe"],
      ["Leistungsaufnahme (max.)", "9,2 kW", "elektrisch"],
      ["Effizienzfaktor", "1,8 \u2013 2,2", "variiert nach Einbausituation"],
      ["Energieeffizienzklasse", "A+", "au\xDFentemperaturunabh\xE4ngig"]
    ]
  },
  {
    title: "Elektrische Daten",
    rows: [
      ["Betriebsspannung", "3/N/PE AC 400 V / 50 Hz", "Drehstrom"],
      ["Steuerspannung", "230 V AC"],
      ["Stromaufnahme (max.)", "23 A"],
      ["Absicherung", "25 A", "erforderlich"],
      ["Zuleitung", "5 \xD7 2,5 bis 5 \xD7 16 mm\xB2"]
    ]
  },
  {
    title: "Hydraulik & Medium",
    rows: [
      ["Betriebsmittel", "ISOTHERM 100/S", "Thermofluid, F\xFCllmenge ca. 16 l"],
      ["Anschl\xFCsse Vor-/R\xFCcklauf", "1\u2033 IG"],
      ["Achsabstand Vor-/R\xFCcklauf", "154 mm"],
      ["Mindestvolumenstrom", "1,9 m\xB3/h"],
      ["Restf\xF6rderh\xF6he", "6,0 m", "bei Mindestvolumenstrom"],
      ["Betriebsdruck", "0,5 \u2013 3,0 bar"]
    ]
  },
  {
    title: "Abmessungen & Gewicht",
    rows: [
      ["Gesamtanlage (H\xD7B\xD7T)", "780 \xD7 846 \xD7 355 mm", "Anlagen- und Schaltschrank kombiniert"],
      ["Anlagenschrank (H\xD7B\xD7T)", "780 \xD7 700 \xD7 355 mm"],
      ["Schaltschrank (H\xD7B\xD7T)", "780 \xD7 145 \xD7 345 mm"],
      ["Gewicht (betriebsbereit)", "ca. 90 kg"],
      ["Gewicht (unbef\xFCllt)", "ca. 75 kg", "Anlagenschrank 56 kg, Schaltschrank 19 kg"],
      ["Lieferung", "vormontierte Funktionseinheit"]
    ]
  },
  {
    title: "Steuerung & Regelung",
    rows: [
      ["Steuerungstyp", "UVR-16X2S", "Technische Alternative"],
      ["Display", "Farb-Touch-Display"],
      ["Schnittstellen", "CAN-Bus, DL-Bus"],
      ["Ausg\xE4nge", "11\xD7 Relais, 5\xD7 Multifunktion (0\u201310 V / PWM)"],
      ["Sensorkompatibilit\xE4t", "PT1000, PT500, Ni1000, KTY, 0\u201310 V, 4\u201320 mA"]
    ]
  }
];
function Group({ title, rows, delay }) {
  const ref = useReveal(delay);
  return <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card style={{ height: "100%", padding: "26px 28px" }}>
        <h3 style={{ color: "var(--copper)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
          {title}
        </h3>
        <table className="varmi-dtable" style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {rows.map(([label, value, note]) => <tr key={label} style={{ borderTop: "1px solid var(--hairline)" }}>
                <th
    scope="row"
    style={{ textAlign: "left", fontWeight: 400, color: "var(--mist-60)", padding: "11px 12px 11px 0", fontSize: "0.9rem", verticalAlign: "top" }}
  >
                  {label}
                  {note ? <span style={{ display: "block", color: "var(--mist-40)", fontSize: "0.775rem", marginTop: 3, lineHeight: 1.4 }}>
                      {note}
                    </span> : null}
                </th>
                <td
    style={{
      textAlign: "right",
      color: "var(--mist)",
      padding: "11px 0",
      fontSize: "0.9rem",
      verticalAlign: "top",
      // Long enumerations must wrap; short values stay on one line.
      whiteSpace: value.length > 24 ? "normal" : "nowrap"
    }}
  >
                  {value}
                </td>
              </tr>)}
          </tbody>
        </table>
      </Card>
    </div>;
}
function Daten({ datasheetUrl }) {
  const footRef = useReveal();
  return <Section id="daten">
      <SectionHeader
    eyebrow="Technische Daten"
    eyebrowIcon="list"
    title="Alle Daten auf einen Blick"
  />

      <div className="varmi-grid varmi-grid-2" style={{ marginTop: 44, alignItems: "start" }}>
        {GROUPS.map((g, i) => <Group key={g.title} title={g.title} rows={g.rows} delay={i % 2 * 90} />)}
      </div>

      <div ref={footRef} className="varmi-reveal" style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
        <p style={{ color: "var(--mist-60)", fontSize: "0.85rem", lineHeight: 1.6 }}>
          Alle Werte nach Technischem Datenblatt VARMI, Stand 07/2026. Die Lieferung erfolgt als
          vormontierte Funktionseinheit; das Thermofluid ISOTHERM 100/S ist integraler Bestandteil
          des Systems.
        </p>

        {datasheetUrl ? <div>
            <Button variant="gradient" href={datasheetUrl} newTab icon="download">
              Technisches Datenblatt (PDF)
            </Button>
          </div> : null}

        <p style={{ color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, maxWidth: 760 }}>
          Technische Änderungen und Irrtümer vorbehalten. Die angegebenen Leistungsdaten (insb.
          Heizleistung, Effizienzfaktor und Energieeffizienzklasse) basieren auf Herstellerangaben
          und bedürfen vor der finalen Projektierung einer normativen Verifizierung. Die Eignung der
          Anlage für den konkreten Einsatzfall ist kundenseitig zu prüfen. Effizienzwerte beschreiben
          das Gerät und sind keine Aussage über Heizkosten im Betrieb. CE-Konformitätserklärungen und
          Prüfberichte zur Anlagenzertifizierung sind gesondert anzufordern.
        </p>
      </div>
    </Section>;
}

// src/varmi/sections/FuerWen.tsx
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
  accent
}) {
  const ref = useReveal(delay);
  return <div ref={ref} className="varmi-reveal" style={{ height: "100%" }}>
      <Card accent={accent} style={{ height: "100%", padding: "36px 34px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div
    style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      display: "grid",
      placeItems: "center",
      background: "var(--panel)",
      border: "1px solid var(--hairline)",
      color: "var(--copper)"
    }}
  >
          <Icon name={icon} size={22} />
        </div>
        <span style={{ color: "var(--mist-60)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{kicker}</span>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", marginTop: -6 }}>{title}</h3>
        <p style={{ color: "var(--mist-70)", flex: 1 }}>{body}</p>
        <div>
          <Button variant={variant} icon={variant === "gradient" ? "chevronDown" : "arrowUpRight"} onClick={onClick} href={onClick ? void 0 : href} newTab>
            {cta}
          </Button>
        </div>
      </Card>
    </div>;
}
function FuerWen({
  onContactClick,
  onPartnerClick,
  contactUrl,
  partnerUrl
}) {
  return <Section id="fuer-wen">
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
    </Section>;
}

// src/varmi/sections/CTA.tsx
function CTA({ onContactClick, contactUrl }) {
  const ref = useReveal();
  return <Section id="cta" style={{ position: "relative", overflow: "hidden" }}>
      {
    /* SectionGlow */
  }
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
      pointerEvents: "none"
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
          <Button variant="dark" onClick={onContactClick} href={onContactClick ? void 0 : contactUrl} newTab>
            Beratung anfragen
          </Button>
        </div>
        <a href="mailto:info@varmova.de" style={{ color: "var(--mist-60)", fontSize: "0.9rem", marginTop: 4 }}>
          info@varmova.de
        </a>
      </div>
    </Section>;
}

// src/varmi/sections/FAQ.tsx
var ITEMS = [
  {
    q: "Passt Varmi in mein Haus / meine Wohnung?",
    a: "Varmi ist ideal, wenn eine W\xE4rmepumpe schwer umzusetzen ist \u2014 wegen Platz, Schallschutz, Denkmalschutz oder fehlender Au\xDFenfl\xE4che. Nach einem kurzen Check (Geb\xE4udetyp, Heizsystem, Warmwasser, Stromanschluss) sagen wir Ihnen ehrlich, ob es passt."
  },
  {
    q: "Wie schnell ist die Installation \u2014 und wie l\xE4uft sie ab?",
    a: "Varmi kommt vormontiert. In der Regel an einem Tag angeschlossen, in Betrieb genommen und abgenommen \u2014 ohne Erdaushub und ohne Au\xDFeneinheit."
  },
  {
    q: "Was kostet Varmi und wann rechnet es sich?",
    a: "Die Kosten h\xE4ngen von Geb\xE4ude und Einbindung ab (Speicher, Warmwasser, Heizkreise). Besonders attraktiv durch die Nutzung g\xFCnstiger Stromzeiten (PV & B\xF6rsenstrom). Nach dem Check erhalten Sie ein transparentes Angebot."
  },
  {
    q: "Funktioniert Varmi mit PV, Speicher und dynamischem Tarif?",
    a: "Ja. Varmi ist PV- & b\xF6rsenstrom-ready und kann g\xFCnstige Zeiten automatisch nutzen."
  },
  {
    q: "Ist das System sicher, zuverl\xE4ssig und wartungsarm?",
    a: "Varmi ist f\xFCr den Dauerbetrieb gebaut: ohne Au\xDFeneinheit, ohne L\xE4rm, mit minimalem Wartungsaufwand. Garantie je nach Paket bis 5 Jahre, dazu Selbst-Monitoring und Service-Support."
  },
  {
    q: "Wie f\xFChlt sich das im Alltag an?",
    a: "Sie bekommen W\xE4rme, wenn Sie sie brauchen, und steuern alles bequem per App. Zeiten und Temperaturen einstellen \u2014 den Rest optimiert Varmi selbst."
  }
];
function Item({ q, a, idx, open, onToggle }) {
  const btnId = `faq-q-${idx}`;
  const panelId = `faq-a-${idx}`;
  return <div style={{ borderTop: "1px solid var(--hairline)" }}>
      <h3 style={{ margin: 0 }}>
        <button
    id={btnId}
    aria-expanded={open}
    aria-controls={panelId}
    onClick={onToggle}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "22px 4px",
      textAlign: "left",
      fontSize: "1.0625rem",
      fontWeight: 500,
      color: open ? "var(--mist)" : "var(--mist-70)"
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
    </div>;
}
function FAQ({ onContactClick, contactUrl }) {
  const [open, setOpen] = useState5(0);
  const listRef = useReveal();
  const ctaRef = useReveal();
  return <Section id="faq">
      <SectionHeader
    eyebrow="FAQ"
    eyebrowIcon="help"
    title={<>Häufige <span className="varmi-serif">Fragen</span></>}
  />

      <div ref={listRef} className="varmi-reveal" style={{ maxWidth: 820, margin: "40px auto 0" }}>
        {ITEMS.map((it, i) => <Item key={i} idx={i} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
      </div>

      <div ref={ctaRef} className="varmi-reveal" style={{ maxWidth: 820, margin: "28px auto 0" }}>
        <Card style={{ padding: "26px 30px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "var(--mist)", fontWeight: 500, fontSize: "1.0625rem" }}>Weitere Fragen?</div>
            <div style={{ color: "var(--mist-60)", fontSize: "0.95rem" }}>Schreiben Sie uns gerne.</div>
          </div>
          <Button variant="gradient" onClick={onContactClick} href={onContactClick ? void 0 : contactUrl} newTab icon="arrowUpRight">
            Frage stellen
          </Button>
        </Card>
      </div>
    </Section>;
}

// src/varmi/Varmi.tsx
var CONTACT_URL = "https://anfrage-varmova.onepage.me/";
function Varmi(props) {
  const contactUrl = props.fallbackContactUrl || CONTACT_URL;
  const partnerUrl = props.fallbackPartnerUrl || CONTACT_URL;
  const onContact = props.onContactClick;
  const onPartner = props.onPartnerClick;
  const bleed = props.fullBleed !== false;
  return <div className={bleed ? "varmi varmi--bleed" : "varmi"}>
      <VarmiStyles bleed={bleed} />
      <main>
        <Hero onContactClick={onContact} contactUrl={contactUrl} heroImage={props.heroImage} heroVideoId={props.heroVideoId ?? "efseenjfgh"} />
        <Energiefluss />
        <Technologie />
        <Installation />
        <Betriebsarten />
        <PasstAnders />
        <SteuerungVerlass />
        <Daten datasheetUrl={props.datasheetUrl} />
        <FuerWen onContactClick={onContact} onPartnerClick={onPartner} contactUrl={contactUrl} partnerUrl={partnerUrl} />
        <CTA onContactClick={onContact} contactUrl={contactUrl} />
        <FAQ onContactClick={onContact} contactUrl={contactUrl} />
      </main>
    </div>;
}
var Varmi_default = Varmi;

// src/framer-entry.tsx
function onCanvas() {
  try {
    return RenderTarget.current() === RenderTarget.canvas;
  } catch {
    return false;
  }
}
function VarmiPage(props) {
  return <Varmi_default {...props} fullBleed={!onCanvas()} />;
}
addPropertyControls(VarmiPage, {
  heroVideoId: { type: ControlType.String, title: "Hero-Video (Wistia-ID)", placeholder: "leer = Vektor-Grafik", defaultValue: "efseenjfgh" },
  heroImage: { type: ControlType.Image, title: "Hero-Render (ohne Video)" },
  datasheetUrl: { type: ControlType.File, title: "Datenblatt (PDF)", allowedFileTypes: ["pdf"] },
  fallbackContactUrl: { type: ControlType.Link, title: "Kontakt-URL (Formular)" },
  fallbackPartnerUrl: { type: ControlType.Link, title: "Partner-URL" }
});
export default VarmiPage;
