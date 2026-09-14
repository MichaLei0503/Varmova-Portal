// src/framer-entry.tsx
import { addPropertyControls, ControlType } from "framer";

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
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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

/* Reveal (Layer A) */
.varmi-reveal { opacity: 0; transform: translateY(40px); }
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
.varmi-btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; padding: 13px 22px; border-radius: ${layout.radiusButton}px;
  font-size: 0.95rem; font-weight: 500; letter-spacing: -0.01em; white-space: nowrap;
  transition: transform .25s ease, box-shadow .35s ease, background .25s ease;
}
.varmi-btn:active { transform: translateY(1px); }
.varmi-btn--dark {
  background: var(--night); color: var(--white);
  border: 1px solid var(--hairline-strong);
  box-shadow: 0 0 0 0 transparent;
}
.varmi-btn--dark::before {
  content: ""; position: absolute; left: 50%; bottom: -2px; transform: translateX(-50%);
  width: 60%; height: 22px; pointer-events: none;
  background: radial-gradient(50% 100% at 50% 100%, rgba(255,255,255,0.55), transparent 70%);
  filter: blur(15px); opacity: .7; transition: opacity .35s ease;
}
.varmi-btn--dark:hover::before { opacity: 1; }
.varmi-btn--dark:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
.varmi-btn--gradient {
  background:
    linear-gradient(var(--night), var(--night)) padding-box,
    ${gradient.buttonBorder} border-box;
  border: 2px solid transparent; color: var(--mist);
}
.varmi-btn--gradient:hover { color: var(--white); }
.varmi-btn--copper { background: var(--copper); color: var(--night); font-weight: 600; border: 0; }
.varmi-btn--copper:hover { background: var(--copper-hover); }

/* Stat */
.varmi-stat-value { font-size: ${type.stat}; font-weight: 700; color: var(--white); line-height: 1; letter-spacing: -0.02em; }
.varmi-stat-label { color: var(--mist-60); font-size: 0.9rem; margin-top: 8px; }

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
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .varmi-reveal { opacity: 1 !important; transform: none !important; transition: opacity .3s ease !important; }
  .varmi *, .varmi *::before, .varmi *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`;
var FONT_HREF = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Instrument+Serif:ital@1&display=swap";
function VarmiStyles() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
    /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
    /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: FONT_HREF }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: css } })
  ] });
}

// src/varmi/sections/Hero.tsx
import { useState as useState2 } from "react";
import { motion } from "framer-motion";

// src/varmi/components/primitives.tsx
import { useEffect as useEffect2, useRef as useRef2, useState } from "react";

// src/varmi/svg/Icon.tsx
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var P = {
  arrowUpRight: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("line", { x1: "7", y1: "17", x2: "17", y2: "7" }),
    /* @__PURE__ */ jsx2("polyline", { points: "7 7 17 7 17 17" })
  ] }),
  chevronDown: /* @__PURE__ */ jsx2("polyline", { points: "6 9 12 15 18 9" }),
  check: /* @__PURE__ */ jsx2("polyline", { points: "20 6 9 17 4 12" }),
  x: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    /* @__PURE__ */ jsx2("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ] }),
  bolt: /* @__PURE__ */ jsx2("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }),
  cpu: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
    /* @__PURE__ */ jsx2("rect", { x: "9", y: "9", width: "6", height: "6" }),
    /* @__PURE__ */ jsx2("line", { x1: "9", y1: "1", x2: "9", y2: "4" }),
    /* @__PURE__ */ jsx2("line", { x1: "15", y1: "1", x2: "15", y2: "4" }),
    /* @__PURE__ */ jsx2("line", { x1: "9", y1: "20", x2: "9", y2: "23" }),
    /* @__PURE__ */ jsx2("line", { x1: "15", y1: "20", x2: "15", y2: "23" }),
    /* @__PURE__ */ jsx2("line", { x1: "20", y1: "9", x2: "23", y2: "9" }),
    /* @__PURE__ */ jsx2("line", { x1: "20", y1: "14", x2: "23", y2: "14" }),
    /* @__PURE__ */ jsx2("line", { x1: "1", y1: "9", x2: "4", y2: "9" }),
    /* @__PURE__ */ jsx2("line", { x1: "1", y1: "14", x2: "4", y2: "14" })
  ] }),
  tool: /* @__PURE__ */ jsx2("path", { d: "M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18v3h3l6.5-6.5a4 4 0 0 0 5.2-5.2l-2.9 2.9-2-2 2.9-2.9z" }),
  layers: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
    /* @__PURE__ */ jsx2("polyline", { points: "2 17 12 22 22 17" }),
    /* @__PURE__ */ jsx2("polyline", { points: "2 12 12 17 22 12" })
  ] }),
  home: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
    /* @__PURE__ */ jsx2("polyline", { points: "9 22 9 12 15 12 15 22" })
  ] }),
  sliders: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("line", { x1: "4", y1: "21", x2: "4", y2: "14" }),
    /* @__PURE__ */ jsx2("line", { x1: "4", y1: "10", x2: "4", y2: "3" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "21", x2: "12", y2: "12" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "8", x2: "12", y2: "3" }),
    /* @__PURE__ */ jsx2("line", { x1: "20", y1: "21", x2: "20", y2: "16" }),
    /* @__PURE__ */ jsx2("line", { x1: "20", y1: "12", x2: "20", y2: "3" }),
    /* @__PURE__ */ jsx2("line", { x1: "1", y1: "14", x2: "7", y2: "14" }),
    /* @__PURE__ */ jsx2("line", { x1: "9", y1: "8", x2: "15", y2: "8" }),
    /* @__PURE__ */ jsx2("line", { x1: "17", y1: "16", x2: "23", y2: "16" })
  ] }),
  list: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ jsx2("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ jsx2("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ jsx2("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ jsx2("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ jsx2("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] }),
  users: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    /* @__PURE__ */ jsx2("circle", { cx: "9", cy: "7", r: "4" }),
    /* @__PURE__ */ jsx2("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    /* @__PURE__ */ jsx2("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
  ] }),
  help: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx2("path", { d: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
  ] }),
  sun: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "1", x2: "12", y2: "4" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "20", x2: "12", y2: "23" }),
    /* @__PURE__ */ jsx2("line", { x1: "4.2", y1: "4.2", x2: "6.3", y2: "6.3" }),
    /* @__PURE__ */ jsx2("line", { x1: "17.7", y1: "17.7", x2: "19.8", y2: "19.8" }),
    /* @__PURE__ */ jsx2("line", { x1: "1", y1: "12", x2: "4", y2: "12" }),
    /* @__PURE__ */ jsx2("line", { x1: "20", y1: "12", x2: "23", y2: "12" }),
    /* @__PURE__ */ jsx2("line", { x1: "4.2", y1: "19.8", x2: "6.3", y2: "17.7" }),
    /* @__PURE__ */ jsx2("line", { x1: "17.7", y1: "6.3", x2: "19.8", y2: "4.2" })
  ] }),
  battery: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("rect", { x: "1", y: "6", width: "18", height: "12", rx: "2" }),
    /* @__PURE__ */ jsx2("line", { x1: "23", y1: "10", x2: "23", y2: "14" }),
    /* @__PURE__ */ jsx2("polyline", { points: "11 9 8 13 12 13 9 16" })
  ] }),
  droplet: /* @__PURE__ */ jsx2("path", { d: "M12 2.7l5.7 5.6a8 8 0 1 1-11.4 0z" }),
  hybrid: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("polyline", { points: "17 1 21 5 17 9" }),
    /* @__PURE__ */ jsx2("path", { d: "M3 11V9a4 4 0 0 1 4-4h14" }),
    /* @__PURE__ */ jsx2("polyline", { points: "7 23 3 19 7 15" }),
    /* @__PURE__ */ jsx2("path", { d: "M21 13v2a4 4 0 0 1-4 4H3" })
  ] }),
  swap: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("polyline", { points: "16 3 21 8 16 13" }),
    /* @__PURE__ */ jsx2("path", { d: "M21 8H8a5 5 0 0 0-5 5" }),
    /* @__PURE__ */ jsx2("polyline", { points: "8 21 3 16 8 11" }),
    /* @__PURE__ */ jsx2("path", { d: "M3 16h13a5 5 0 0 0 5-5" })
  ] }),
  shieldCheck: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    /* @__PURE__ */ jsx2("polyline", { points: "9 12 11 14 15 10" })
  ] }),
  smartphone: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
  ] }),
  activity: /* @__PURE__ */ jsx2("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }),
  landmark: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("line", { x1: "3", y1: "22", x2: "21", y2: "22" }),
    /* @__PURE__ */ jsx2("line", { x1: "6", y1: "18", x2: "6", y2: "11" }),
    /* @__PURE__ */ jsx2("line", { x1: "10", y1: "18", x2: "10", y2: "11" }),
    /* @__PURE__ */ jsx2("line", { x1: "14", y1: "18", x2: "14", y2: "11" }),
    /* @__PURE__ */ jsx2("line", { x1: "18", y1: "18", x2: "18", y2: "11" }),
    /* @__PURE__ */ jsx2("polygon", { points: "12 2 20 7 4 7 12 2" })
  ] }),
  building: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("rect", { x: "4", y: "2", width: "16", height: "20", rx: "1" }),
    /* @__PURE__ */ jsx2("line", { x1: "9", y1: "6", x2: "9", y2: "6.01" }),
    /* @__PURE__ */ jsx2("line", { x1: "15", y1: "6", x2: "15", y2: "6.01" }),
    /* @__PURE__ */ jsx2("line", { x1: "9", y1: "10", x2: "9", y2: "10.01" }),
    /* @__PURE__ */ jsx2("line", { x1: "15", y1: "10", x2: "15", y2: "10.01" }),
    /* @__PURE__ */ jsx2("line", { x1: "9", y1: "14", x2: "9", y2: "14.01" }),
    /* @__PURE__ */ jsx2("line", { x1: "15", y1: "14", x2: "15", y2: "14.01" }),
    /* @__PURE__ */ jsx2("path", { d: "M9 22v-4h6v4" })
  ] }),
  box: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    /* @__PURE__ */ jsx2("polyline", { points: "3.3 7 12 12 20.7 7" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "22", x2: "12", y2: "12" })
  ] }),
  doorClosed: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M5 22V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v18" }),
    /* @__PURE__ */ jsx2("line", { x1: "3", y1: "22", x2: "21", y2: "22" }),
    /* @__PURE__ */ jsx2("line", { x1: "15", y1: "12", x2: "15", y2: "12.5" })
  ] }),
  download: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx2("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  mail: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
    /* @__PURE__ */ jsx2("polyline", { points: "22 6 12 13 2 6" })
  ] }),
  linkedin: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" }),
    /* @__PURE__ */ jsx2("rect", { x: "2", y: "9", width: "4", height: "12" }),
    /* @__PURE__ */ jsx2("circle", { cx: "4", cy: "4", r: "2" })
  ] }),
  instagram: /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5" }),
    /* @__PURE__ */ jsx2("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx2("line", { x1: "17.5", y1: "6.5", x2: "17.5", y2: "6.51" })
  ] }),
  facebook: /* @__PURE__ */ jsx2("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }),
  spark: /* @__PURE__ */ jsx2("path", { d: "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" })
};
function Icon({
  name,
  size = 24,
  strokeWidth = 1.5,
  fill = "none",
  style
}) {
  return /* @__PURE__ */ jsx2(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill,
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      style,
      children: P[name]
    }
  );
}

// src/varmi/motion/useReveal.ts
import { useEffect, useRef } from "react";
function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return ref;
}

// src/varmi/components/primitives.tsx
import { Fragment as Fragment3, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function Shell({ children, style }) {
  return /* @__PURE__ */ jsx3("div", { className: "varmi-shell", style, children });
}
function Section({
  id,
  children,
  style
}) {
  return /* @__PURE__ */ jsx3("section", { id, className: "varmi-section", style, children: /* @__PURE__ */ jsx3(Shell, { children }) });
}
function Card({
  children,
  hover = false,
  accent = false,
  style,
  padding = 28
}) {
  const cls = ["varmi-card", hover && "varmi-card--hover", accent && "varmi-card--accent"].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx3("div", { className: cls, style: { padding, ...style }, children });
}
function Eyebrow({
  label,
  icon,
  dot = false,
  serif = false,
  style
}) {
  return /* @__PURE__ */ jsxs3("span", { className: "varmi-eyebrow", style, children: [
    dot && /* @__PURE__ */ jsx3("span", { className: "varmi-dot", "aria-hidden": "true" }),
    icon && /* @__PURE__ */ jsx3(Icon, { name: icon, size: 14 }),
    /* @__PURE__ */ jsx3("span", { style: serif ? { fontFamily: '"Instrument Serif",serif', fontStyle: "italic", textTransform: "none", fontSize: "1rem", letterSpacing: 0 } : void 0, children: label })
  ] });
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
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      ref,
      className: "varmi-reveal",
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 16,
        maxWidth: align === "center" ? 720 : void 0,
        marginInline: align === "center" ? "auto" : void 0
      },
      children: [
        /* @__PURE__ */ jsx3(Eyebrow, { label: eyebrow, icon: eyebrowIcon, dot: eyebrowDot }),
        /* @__PURE__ */ jsx3(
          "h2",
          {
            className: "varmi-fill-h2",
            style: {
              fontSize: "var(--t-h2, clamp(2rem,1.4rem + 2.6vw,2.75rem))",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em"
            },
            children: title
          }
        ),
        subline && /* @__PURE__ */ jsx3("p", { style: { color: "var(--mist-70)", maxWidth: 640, fontSize: "1.0625rem" }, children: subline })
      ]
    }
  );
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
  return /* @__PURE__ */ jsxs3("div", { ref, children: [
    /* @__PURE__ */ jsx3("div", { className: "varmi-stat-value", children: display }),
    /* @__PURE__ */ jsx3("div", { className: "varmi-stat-label", children: label })
  ] });
}
function Button({
  children,
  variant = "dark",
  icon = variant === "dark" ? "arrowUpRight" : void 0,
  onClick,
  href,
  ariaLabel,
  style,
  type: type2 = "button"
}) {
  const cls = `varmi-btn varmi-btn--${variant}`;
  const inner = /* @__PURE__ */ jsxs3(Fragment3, { children: [
    /* @__PURE__ */ jsx3("span", { children }),
    icon && /* @__PURE__ */ jsx3(Icon, { name: icon, size: 16 })
  ] });
  if (href) {
    return /* @__PURE__ */ jsx3("a", { className: cls, href, "aria-label": ariaLabel, style, children: inner });
  }
  return /* @__PURE__ */ jsx3("button", { className: cls, type: type2, onClick, "aria-label": ariaLabel, style, children: inner });
}

// src/varmi/components/ImageFrame.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function ImageFrame({
  src,
  alt,
  ratio = "4 / 3",
  label,
  priority = false,
  style,
  contain = true
}) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        borderRadius: 20,
        overflow: "hidden",
        background: "radial-gradient(120% 90% at 50% 0%, rgba(184,199,217,0.06), rgba(4,7,13,0) 60%), #04070D",
        ...style
      },
      children: src ? /* @__PURE__ */ jsx4(
        "img",
        {
          src,
          alt,
          loading: priority ? "eager" : "lazy",
          fetchpriority: priority ? "high" : void 0,
          decoding: "async",
          style: {
            width: "100%",
            height: "100%",
            objectFit: contain ? "contain" : "cover"
          }
        }
      ) : /* @__PURE__ */ jsx4(
        "div",
        {
          "aria-label": alt,
          style: {
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "rgba(213,219,230,0.35)",
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px dashed rgba(216,231,242,0.12)",
            borderRadius: 20
          },
          children: label ?? alt
        }
      )
    }
  );
}

// src/varmi/sections/Hero.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var HEIZUNGEN = ["\xD6l", "Gas", "Nachtspeicher", "Hybrid"];
function Hero({
  onContactClick,
  heroImage
}) {
  const [aktuell, setAktuell] = useState2(null);
  return /* @__PURE__ */ jsxs4("section", { id: "hero", style: { position: "relative", overflow: "hidden", paddingTop: 96 }, children: [
    /* @__PURE__ */ jsx5(
      "div",
      {
        "aria-hidden": true,
        style: {
          position: "absolute",
          inset: "0 0 auto 0",
          height: "clamp(96px, 16vh, 190px)",
          background: "linear-gradient(180deg, #E8A260 0%, #E07A26 40%, rgba(176,88,0,0.22) 68%, rgba(4,7,13,0) 100%)",
          opacity: 0.82,
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ jsx5(
      "div",
      {
        "aria-hidden": true,
        style: {
          position: "absolute",
          inset: 0,
          background: "radial-gradient(60% 50% at 50% 6%, rgba(232,162,96,0.18), rgba(4,7,13,0) 60%)",
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ jsxs4(Shell, { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxs4(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "clamp(40px, 8vh, 90px)",
            gap: 22
          },
          children: [
            /* @__PURE__ */ jsx5(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: /* @__PURE__ */ jsx5(Eyebrow, { label: "Verf\xFCgbar", dot: true }) }),
            /* @__PURE__ */ jsx5(
              motion.h1,
              {
                className: "varmi-fill-h1",
                initial: { opacity: 0, scale: 0.78 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
                style: {
                  fontSize: "var(--t-hero)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  margin: 0
                },
                children: "Varmi"
              }
            ),
            /* @__PURE__ */ jsx5(
              motion.p,
              {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, delay: 0.2 },
                style: {
                  fontSize: "clamp(1.25rem, 0.9rem + 1.6vw, 1.75rem)",
                  fontWeight: 500,
                  color: "var(--mist)",
                  letterSpacing: "-0.01em"
                },
                children: "Einfach. Intelligent. Warm."
              }
            ),
            /* @__PURE__ */ jsx5(
              motion.p,
              {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, delay: 0.35 },
                style: { maxWidth: 560, color: "var(--mist-70)" },
                children: "Die W\xE4rmewende ohne Gro\xDFbaustelle. An einem Tag installiert, ohne Au\xDFeneinheit, kompatibel mit Ihrer bestehenden Anlage \u2014 und smart genug, g\xFCnstige Stromzeiten automatisch zu nutzen."
              }
            ),
            /* @__PURE__ */ jsxs4(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.6 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] },
                style: { display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 4 },
                children: [
                  /* @__PURE__ */ jsx5(Button, { variant: "dark", onClick: onContactClick, children: "Beratung anfragen" }),
                  /* @__PURE__ */ jsx5(Button, { variant: "gradient", href: "#technologie", icon: "chevronDown", children: "Wie es funktioniert" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs4(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 1, delay: 0.7 },
                style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8 },
                children: [
                  /* @__PURE__ */ jsx5("span", { style: { fontSize: 13, color: "var(--mist-60)" }, children: "Womit heizen Sie aktuell?" }),
                  /* @__PURE__ */ jsx5("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }, children: HEIZUNGEN.map((h) => {
                    const active = aktuell === h;
                    return /* @__PURE__ */ jsx5(
                      "button",
                      {
                        onClick: () => setAktuell(active ? null : h),
                        "aria-pressed": active,
                        style: {
                          padding: "7px 14px",
                          borderRadius: 60,
                          fontSize: 13,
                          border: `1px solid ${active ? "var(--copper)" : "var(--hairline)"}`,
                          background: active ? "rgba(232,162,96,0.12)" : "var(--night)",
                          color: active ? "var(--copper)" : "var(--mist-70)",
                          transition: "all .2s ease"
                        },
                        children: h
                      },
                      h
                    );
                  }) })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx5(
        motion.div,
        {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay: 0.5 },
          style: { marginTop: 56, maxWidth: 760, marginInline: "auto" },
          children: /* @__PURE__ */ jsx5(
            ImageFrame,
            {
              src: heroImage,
              alt: "Varmi Heizsystem \u2014 freigestellter Produkt-Render",
              ratio: "4 / 3",
              label: "Produkt-Render",
              priority: true
            }
          )
        }
      ),
      /* @__PURE__ */ jsx5("div", { style: { display: "flex", justifyContent: "center", marginTop: 28 }, children: /* @__PURE__ */ jsx5("a", { href: "#energiefluss", "aria-label": "Weiter scrollen", style: { color: "var(--mist-60)" }, children: /* @__PURE__ */ jsx5("span", { style: { display: "inline-block", animation: "varmi-bounce 1.8s ease-in-out infinite" }, children: /* @__PURE__ */ jsx5(Icon, { name: "chevronDown", size: 26 }) }) }) })
    ] })
  ] });
}

// src/varmi/sections/Energiefluss.tsx
import { useEffect as useEffect3, useRef as useRef3, useState as useState3 } from "react";
import { motion as motion3, useScroll, useTransform as useTransform2 } from "framer-motion";

// src/varmi/svg/EnergieflussScene.tsx
import { motion as motion2, useTransform } from "framer-motion";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function EnergieflussScene({
  progress,
  reduced
}) {
  const sunPV = useTransform(progress, [0, 0.22], [0, 1]);
  const pvVarmi = useTransform(progress, [0.24, 0.48], [0, 1]);
  const pvGlow = useTransform(progress, [0.05, 0.22], [0, 1]);
  const varmiPulse = useTransform(progress, [0.48, 0.56, 0.64], [0.2, 1, 0.55]);
  const roomsDraw = useTransform(progress, [0.62, 0.96], [0, 1]);
  const roomsGlow = useTransform(progress, [0.74, 1], [0, 1]);
  const pv0 = useTransform(progress, [0.05, 0.18], reduced ? [1, 1] : [0.15, 1]);
  const pv1 = useTransform(progress, [0.08, 0.21], reduced ? [1, 1] : [0.15, 1]);
  const pv2 = useTransform(progress, [0.11, 0.24], reduced ? [1, 1] : [0.15, 1]);
  const pv3 = useTransform(progress, [0.14, 0.27], reduced ? [1, 1] : [0.15, 1]);
  const pvOpacities = [pv0, pv1, pv2, pv3];
  const v = (mv, final = 1) => reduced ? final : mv;
  return /* @__PURE__ */ jsxs5("svg", { viewBox: "0 0 800 500", width: "100%", height: "100%", role: "img", "aria-label": "Energieweg: Solarstrom vom Dach \xFCber Varmi in alle R\xE4ume", style: { display: "block" }, children: [
    /* @__PURE__ */ jsxs5("defs", { children: [
      /* @__PURE__ */ jsxs5("radialGradient", { id: "vf-sun", cx: "50%", cy: "50%", r: "50%", children: [
        /* @__PURE__ */ jsx6("stop", { offset: "0%", stopColor: "#F0B27A" }),
        /* @__PURE__ */ jsx6("stop", { offset: "100%", stopColor: "#E8A260" })
      ] }),
      /* @__PURE__ */ jsxs5("radialGradient", { id: "vf-room", cx: "50%", cy: "50%", r: "50%", children: [
        /* @__PURE__ */ jsx6("stop", { offset: "0%", stopColor: "rgba(232,162,96,0.55)" }),
        /* @__PURE__ */ jsx6("stop", { offset: "100%", stopColor: "rgba(232,162,96,0)" })
      ] }),
      /* @__PURE__ */ jsxs5("filter", { id: "vf-glow", x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsx6("feGaussianBlur", { stdDeviation: "6", result: "b" }),
        /* @__PURE__ */ jsxs5("feMerge", { children: [
          /* @__PURE__ */ jsx6("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsx6("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("g", { stroke: "rgba(213,219,230,0.45)", strokeWidth: "2", fill: "none", strokeLinejoin: "round", strokeLinecap: "round", children: [
      /* @__PURE__ */ jsx6("path", { d: "M250 250 L440 130 L630 250" }),
      /* @__PURE__ */ jsx6("path", { d: "M280 250 L280 430 L600 430 L600 250" }),
      /* @__PURE__ */ jsx6("line", { x1: "280", y1: "350", x2: "600", y2: "350", stroke: "rgba(213,219,230,0.18)" }),
      /* @__PURE__ */ jsx6("line", { x1: "460", y1: "350", x2: "460", y2: "430", stroke: "rgba(213,219,230,0.18)" })
    ] }),
    /* @__PURE__ */ jsxs5("g", { children: [
      /* @__PURE__ */ jsx6(motion2.circle, { cx: "120", cy: "100", r: "30", fill: "url(#vf-sun)", style: { opacity: v(pvGlow, 1) }, filter: "url(#vf-glow)" }),
      /* @__PURE__ */ jsx6("g", { stroke: "#E8A260", strokeWidth: "2.5", strokeLinecap: "round", children: [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r1 = 38, r2 = 50;
        const rad = a * Math.PI / 180;
        return /* @__PURE__ */ jsx6(
          motion2.line,
          {
            x1: 120 + r1 * Math.cos(rad),
            y1: 100 + r1 * Math.sin(rad),
            x2: 120 + r2 * Math.cos(rad),
            y2: 100 + r2 * Math.sin(rad),
            style: { opacity: v(pvGlow, 1) }
          },
          a
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx6("g", { children: [0, 1, 2, 3].map((i) => {
      const t = i / 4;
      const x = 270 + t * 150;
      const y = 238 - t * 95;
      return /* @__PURE__ */ jsx6(
        motion2.path,
        {
          d: `M${x} ${y} l40 -25 l16 18 l-40 25 z`,
          fill: "rgba(232,162,96,0.16)",
          stroke: "#E8A260",
          strokeWidth: "1.5",
          style: { opacity: pvOpacities[i] }
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsx6(
      motion2.path,
      {
        d: "M150 120 C 200 180, 230 175, 300 195",
        fill: "none",
        stroke: "#E8A260",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        style: { pathLength: v(sunPV) },
        filter: "url(#vf-glow)"
      }
    ),
    /* @__PURE__ */ jsxs5("g", { children: [
      /* @__PURE__ */ jsx6(
        motion2.rect,
        {
          x: "396",
          y: "360",
          width: "84",
          height: "62",
          rx: "10",
          fill: "#10131C",
          stroke: "#E8A260",
          strokeWidth: "2",
          style: { opacity: v(varmiPulse, 1) },
          filter: "url(#vf-glow)"
        }
      ),
      /* @__PURE__ */ jsx6(motion2.path, { d: "M414 374 L438 408 L462 374", fill: "none", stroke: "#E8A260", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: v(varmiPulse, 1) } })
    ] }),
    /* @__PURE__ */ jsx6(
      motion2.path,
      {
        d: "M300 150 C 330 250, 380 300, 430 360",
        fill: "none",
        stroke: "#E8A260",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        style: { pathLength: v(pvVarmi) }
      }
    ),
    [
      { gx: 360, gy: 300, rx: 330, ry: 286 },
      { gx: 545, gy: 300, rx: 520, ry: 286 },
      { gx: 360, gy: 400, rx: 332, ry: 392 },
      { gx: 545, gy: 400, rx: 520, ry: 392 }
    ].map((p, i) => /* @__PURE__ */ jsxs5("g", { children: [
      /* @__PURE__ */ jsx6(motion2.circle, { cx: p.gx, cy: p.gy, r: "46", fill: "url(#vf-room)", style: { opacity: v(roomsGlow, 1) } }),
      /* @__PURE__ */ jsxs5("g", { stroke: "rgba(213,219,230,0.6)", strokeWidth: "1.5", fill: "none", children: [
        /* @__PURE__ */ jsx6("rect", { x: p.rx, y: p.ry, width: "34", height: "26", rx: "3" }),
        /* @__PURE__ */ jsx6("line", { x1: p.rx + 9, y1: p.ry, x2: p.rx + 9, y2: p.ry + 26 }),
        /* @__PURE__ */ jsx6("line", { x1: p.rx + 18, y1: p.ry, x2: p.rx + 18, y2: p.ry + 26 }),
        /* @__PURE__ */ jsx6("line", { x1: p.rx + 27, y1: p.ry, x2: p.rx + 27, y2: p.ry + 26 })
      ] })
    ] }, i)),
    [
      "M438 360 C 420 330, 380 315, 350 300",
      "M460 362 C 500 335, 530 318, 545 305",
      "M440 422 C 420 430, 380 420, 352 405",
      "M462 422 C 500 430, 530 420, 548 405"
    ].map((d, i) => /* @__PURE__ */ jsx6(
      motion2.path,
      {
        d,
        fill: "none",
        stroke: "#E8A260",
        strokeWidth: "2",
        strokeLinecap: "round",
        style: { pathLength: v(roomsDraw) }
      },
      i
    ))
  ] });
}

// src/varmi/svg/Tagesverlauf.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs6("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", role: "img", "aria-label": "Tagesverlauf des Strompreises mit g\xFCnstigen Heizfenstern nachts und mittags", style: { display: "block" }, children: [
    /* @__PURE__ */ jsx7("defs", { children: /* @__PURE__ */ jsxs6("linearGradient", { id: "vf-area", x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx7("stop", { offset: "0%", stopColor: "rgba(213,219,230,0.18)" }),
      /* @__PURE__ */ jsx7("stop", { offset: "100%", stopColor: "rgba(213,219,230,0)" })
    ] }) }),
    WINDOWS.map(([a, b, label]) => /* @__PURE__ */ jsxs6("g", { children: [
      /* @__PURE__ */ jsx7("rect", { x: xOf(a), y: TOP, width: xOf(b) - xOf(a), height: BASE - TOP, fill: "rgba(232,162,96,0.12)" }),
      /* @__PURE__ */ jsx7("line", { x1: xOf(a), y1: TOP, x2: xOf(a), y2: BASE, stroke: "rgba(232,162,96,0.3)", strokeDasharray: "3 4" }),
      /* @__PURE__ */ jsx7("line", { x1: xOf(b), y1: TOP, x2: xOf(b), y2: BASE, stroke: "rgba(232,162,96,0.3)", strokeDasharray: "3 4" }),
      /* @__PURE__ */ jsx7("text", { x: (xOf(a) + xOf(b)) / 2, y: TOP - 8, fill: "#E8A260", fontSize: "12", textAnchor: "middle", fontFamily: "Inter, sans-serif", children: label })
    ] }, label)),
    /* @__PURE__ */ jsx7("line", { x1: PADL, y1: BASE, x2: W - PADR, y2: BASE, stroke: "rgba(216,231,242,0.12)" }),
    /* @__PURE__ */ jsx7("path", { d: area, fill: "url(#vf-area)" }),
    /* @__PURE__ */ jsx7("path", { d: line, fill: "none", stroke: "#D5DBE6", strokeWidth: "2", strokeLinecap: "round" }),
    [0, 6, 12, 18, 24].map((h) => /* @__PURE__ */ jsxs6("text", { x: xOf(h), y: H - 6, fill: "rgba(213,219,230,0.5)", fontSize: "11", textAnchor: h === 0 ? "start" : h === 24 ? "end" : "middle", fontFamily: "Inter, sans-serif", children: [
      h,
      ":00"
    ] }, h))
  ] });
}

// src/varmi/sections/Energiefluss.tsx
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var PHASES = ["Eigener Solarstrom", "Direkt in Varmi", "Intelligent gesteuert", "W\xE4rme im ganzen Haus"];
var BULLETS = ["Dynamischer Stromtarif", "PV-Eigenverbrauch", "Batteriespeicher-Anbindung", "Lastverschiebung automatisch"];
var WINDOWS2 = [
  [0, 0.04, 0.2, 0.26],
  [0.24, 0.3, 0.44, 0.5],
  [0.48, 0.54, 0.6, 0.66],
  [0.64, 0.72, 1.01, 1.02]
];
function PhaseWord({ i, label, progress }) {
  const [a, b, c, d] = WINDOWS2[i];
  const opacity = useTransform2(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform2(progress, [a, b], [12, 0]);
  return /* @__PURE__ */ jsx8(
    motion3.span,
    {
      style: {
        opacity,
        y,
        gridArea: "1 / 1",
        textAlign: "center",
        color: "var(--copper)",
        fontSize: "clamp(1.1rem, 0.8rem + 1.4vw, 1.6rem)",
        fontWeight: 500,
        letterSpacing: "-0.01em"
      },
      children: label
    }
  );
}
function Energiefluss() {
  const scrollRef = useRef3(null);
  const [reduced, setReduced] = useState3(false);
  useEffect3(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener?.("change", apply);
    return () => m.removeEventListener?.("change", apply);
  }, []);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });
  const closeRef = useReveal();
  const chartRef = useReveal();
  return /* @__PURE__ */ jsxs7("section", { id: "energiefluss", style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx8("div", { ref: scrollRef, style: { height: reduced ? "auto" : "300vh", position: "relative" }, children: /* @__PURE__ */ jsx8(
      "div",
      {
        style: {
          position: reduced ? "static" : "sticky",
          top: 0,
          minHeight: reduced ? "auto" : "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          paddingBlock: "clamp(60px, 7vw, 90px)"
        },
        children: /* @__PURE__ */ jsxs7(Shell, { children: [
          /* @__PURE__ */ jsxs7("div", { style: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 24 }, children: [
            /* @__PURE__ */ jsx8(Eyebrow, { label: "Smart heizen", icon: "sun" }),
            /* @__PURE__ */ jsx8("h2", { className: "varmi-fill-h2", style: { fontSize: "var(--t-h2)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em", maxWidth: 760 }, children: "Strom vom eigenen Dach. W\xE4rme f\xFCrs ganze Haus." })
          ] }),
          /* @__PURE__ */ jsxs7("div", { style: { maxWidth: 760, margin: "0 auto", width: "100%" }, children: [
            /* @__PURE__ */ jsx8("div", { style: { aspectRatio: "800 / 500" }, children: /* @__PURE__ */ jsx8(EnergieflussScene, { progress: scrollYProgress, reduced }) }),
            reduced ? /* @__PURE__ */ jsx8("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", marginTop: 16 }, children: PHASES.map((p, i) => /* @__PURE__ */ jsxs7("span", { style: { color: "var(--copper)", fontWeight: 500 }, children: [
              i > 0 && /* @__PURE__ */ jsx8("span", { style: { color: "var(--mist-40)", marginRight: 20 }, children: "\u2192" }),
              p
            ] }, p)) }) : /* @__PURE__ */ jsx8("div", { style: { display: "grid", placeItems: "center", minHeight: "2.4em", marginTop: 8 }, children: PHASES.map((p, i) => /* @__PURE__ */ jsx8(PhaseWord, { i, label: p, progress: scrollYProgress }, p)) })
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxs7(Shell, { style: { paddingBottom: "clamp(80px, 7vw, 100px)" }, children: [
      /* @__PURE__ */ jsxs7("div", { ref: closeRef, className: "varmi-reveal", style: { maxWidth: 760, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 22 }, children: [
        /* @__PURE__ */ jsx8("p", { style: { color: "var(--mist-70)", fontSize: "1.0625rem" }, children: "Varmi ist PV- und b\xF6rsenstrom-ready. Die Regelung verschiebt das Heizen automatisch in g\xFCnstige Zeitfenster \u2014 nachts oder mittags bei Sonnenstrom." }),
        /* @__PURE__ */ jsx8("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }, children: BULLETS.map((b) => /* @__PURE__ */ jsxs7("span", { style: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 60, border: "1px solid var(--hairline)", background: "var(--panel)", color: "var(--mist-70)", fontSize: "0.875rem" }, children: [
          /* @__PURE__ */ jsx8("span", { style: { color: "var(--copper)", display: "inline-flex" }, children: /* @__PURE__ */ jsx8(Icon, { name: "check", size: 14, strokeWidth: 2 }) }),
          b
        ] }, b)) }),
        /* @__PURE__ */ jsx8("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ jsx8(StatBadge, { value: "bis zu 30\u201350 %\xB9", label: "geringere Stromkosten durch Lastverschiebung" }) })
      ] }),
      /* @__PURE__ */ jsxs7("div", { ref: chartRef, className: "varmi-reveal", style: { maxWidth: 760, margin: "40px auto 0" }, children: [
        /* @__PURE__ */ jsx8(Tagesverlauf, {}),
        /* @__PURE__ */ jsx8("p", { style: { color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, marginTop: 18, textAlign: "center" }, children: "\xB9 Abh\xE4ngig von Stromtarif, Geb\xE4ude und Nutzungsverhalten. Keine garantierte Einsparung." })
      ] })
    ] })
  ] });
}

// src/varmi/components/FeatureCard.tsx
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function FeatureCard({
  icon,
  number,
  title,
  children,
  delay = 0,
  accent = false
}) {
  const ref = useReveal(delay);
  return /* @__PURE__ */ jsx9("div", { ref, className: "varmi-reveal", style: { height: "100%" }, children: /* @__PURE__ */ jsxs8(Card, { hover: true, accent, style: { height: "100%", display: "flex", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsxs8(
      "div",
      {
        style: {
          width: 48,
          height: 48,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: "var(--panel)",
          border: "1px solid var(--hairline)",
          color: "var(--copper)",
          position: "relative"
        },
        children: [
          icon ? /* @__PURE__ */ jsx9(Icon, { name: icon, size: 22 }) : null,
          number ? /* @__PURE__ */ jsx9("span", { style: { fontSize: 15, fontWeight: 600, color: "var(--mist)" }, children: number }) : null
        ]
      }
    ),
    /* @__PURE__ */ jsx9("h3", { style: { fontSize: "var(--t-card)", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", lineHeight: 1.2 }, children: title }),
    /* @__PURE__ */ jsx9("p", { style: { color: "var(--mist-60)", fontSize: "0.975rem" }, children })
  ] }) });
}

// src/varmi/sections/Technologie.tsx
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
function Technologie({ schnittImage }) {
  const imgRef = useReveal();
  return /* @__PURE__ */ jsxs9(Section, { id: "technologie", children: [
    /* @__PURE__ */ jsx10(
      SectionHeader,
      {
        eyebrow: "Technologie",
        eyebrowIcon: "cpu",
        title: "Wie Varmi W\xE4rme macht",
        subline: "Strom rein, W\xE4rme raus \u2014 mit einem Thermofluid-Speicher, der W\xE4rme puffert und gleichm\xE4\xDFig an Ihren Heizkreis abgibt."
      }
    ),
    /* @__PURE__ */ jsx10("div", { ref: imgRef, className: "varmi-reveal", style: { maxWidth: 720, margin: "44px auto 0" }, children: /* @__PURE__ */ jsx10(
      ImageFrame,
      {
        src: schnittImage,
        alt: "Varmi im Schnitt: Tank, Pumpe, W\xE4rmetauscher, Steuerung, Schaltschrank",
        ratio: "16 / 10",
        label: "Schnitt-Render \u2460\u2013\u2464"
      }
    ) }),
    /* @__PURE__ */ jsxs9("div", { className: "varmi-grid varmi-grid-3", style: { marginTop: 44 }, children: [
      /* @__PURE__ */ jsx10(FeatureCard, { icon: "bolt", number: "1", title: "Erzeugen", delay: 0, children: "Vier Heizst\xE4be erhitzen das W\xE4rmetr\xE4gerfluid im Tank. Strom wird direkt in W\xE4rme umgesetzt \u2014 robust und wartungsarm." }),
      /* @__PURE__ */ jsx10(FeatureCard, { icon: "swap", number: "2", title: "\xDCbergeben", delay: 100, children: "Ein W\xE4rmetauscher \xFCbertr\xE4gt die W\xE4rme an Ihren wassergef\xFChrten Heizkreis. Heizk\xF6rper oder Fu\xDFboden \u2014 beides m\xF6glich." }),
      /* @__PURE__ */ jsx10(FeatureCard, { icon: "sliders", number: "3", title: "Steuern", delay: 200, children: "Eine intelligente Regelung entscheidet, wann geheizt und gespeichert wird \u2014 abgestimmt auf Tarif, PV und Bedarf. Bedienung & \xDCbersicht bequem per App." })
    ] })
  ] });
}

// src/varmi/sections/Installation.tsx
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs10("div", { ref, className: "varmi-reveal", style: { position: "relative", flex: 1, minWidth: 220 }, children: [
    /* @__PURE__ */ jsx11(
      "div",
      {
        style: {
          width: 36,
          height: 36,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "var(--night)",
          border: "1px solid var(--copper)",
          color: "var(--copper)",
          fontWeight: 600,
          fontSize: 15,
          position: "relative",
          zIndex: 1
        },
        children: i + 1
      }
    ),
    /* @__PURE__ */ jsx11("h3", { style: { marginTop: 18, fontSize: "var(--t-card)", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em" }, children: t }),
    /* @__PURE__ */ jsx11("p", { style: { marginTop: 8, color: "var(--mist-60)", fontSize: "0.975rem", maxWidth: 280 }, children: b })
  ] });
}
function Installation() {
  return /* @__PURE__ */ jsxs10(Section, { id: "installation", children: [
    /* @__PURE__ */ jsx11(
      SectionHeader,
      {
        eyebrow: "Installation",
        eyebrowIcon: "tool",
        title: "In einem Tag eingebaut",
        subline: "Vormontiert geliefert auf einer Europalette. Kein Erdaushub, keine Au\xDFeneinheit, kein wochenlanges Chaos im Haus."
      }
    ),
    /* @__PURE__ */ jsxs10("div", { style: { position: "relative", marginTop: 52 }, children: [
      /* @__PURE__ */ jsx11(
        "div",
        {
          "aria-hidden": true,
          className: "varmi-hide-mobile",
          style: {
            position: "absolute",
            top: 18,
            left: "8%",
            right: "8%",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--copper), transparent)",
            opacity: 0.5
          }
        }
      ),
      /* @__PURE__ */ jsx11("div", { style: { display: "flex", flexWrap: "wrap", gap: 30 }, children: STEPS.map((s, i) => /* @__PURE__ */ jsx11(Step, { i, t: s.t, b: s.b }, s.t)) })
    ] }),
    /* @__PURE__ */ jsx11(Card, { style: { marginTop: 52, padding: "34px clamp(20px,4vw,44px)" }, children: /* @__PURE__ */ jsxs10("div", { className: "varmi-grid varmi-grid-3", style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsx11(StatBadge, { value: "1", label: "typische Installationszeit (Werktag)" }),
      /* @__PURE__ */ jsx11(StatBadge, { value: "0", label: "Au\xDFeneinheiten \u2014 kein L\xE4rm, keine Genehmigung" }),
      /* @__PURE__ */ jsx11(StatBadge, { value: "~90 kg", label: "kompakt, vormontiert auf Europalette" })
    ] }) })
  ] });
}

// src/varmi/sections/Betriebsarten.tsx
import { Fragment as Fragment4, jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
function Betriebsarten() {
  return /* @__PURE__ */ jsxs11(Section, { id: "betriebsarten", children: [
    /* @__PURE__ */ jsx12(
      SectionHeader,
      {
        eyebrow: "Betriebsarten",
        eyebrowIcon: "layers",
        title: /* @__PURE__ */ jsxs11(Fragment4, { children: [
          "Drei Wege, ",
          /* @__PURE__ */ jsx12("span", { className: "varmi-serif", children: "warm" }),
          " zu werden"
        ] })
      }
    ),
    /* @__PURE__ */ jsxs11("div", { className: "varmi-grid varmi-grid-3", style: { marginTop: 44 }, children: [
      /* @__PURE__ */ jsx12(FeatureCard, { icon: "battery", title: "Ladebetrieb", delay: 0, children: "Varmi speichert W\xE4rme im Fluid vor und gibt sie bedarfsgerecht ab \u2014 ideal, um g\xFCnstige Stromzeiten zu nutzen." }),
      /* @__PURE__ */ jsx12(FeatureCard, { icon: "droplet", title: "Durchlauferhitzer", delay: 100, children: "W\xE4rme genau dann, wenn sie gebraucht wird \u2014 direkt und ohne Vorlauf." }),
      /* @__PURE__ */ jsx12(FeatureCard, { icon: "hybrid", title: "Hybridbetrieb", delay: 200, children: "Varmi arbeitet mit Ihrer vorhandenen \xD6l- oder Gasheizung zusammen. Sie behalten die Sicherheit Ihres Bestands." })
    ] })
  ] });
}

// src/varmi/sections/PasstAnders.tsx
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
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
  "Smarte Steuerung inklusive"
];
var CON = [
  "Komplexe Installation",
  "Nicht immer PV-kompatibel",
  "Oft nur mit F\xF6rderung bezahlbar",
  "Einschr\xE4nkungen bei der Umsetzbarkeit",
  "Aufw\xE4ndige Inbetriebnahme"
];
function CompareList({
  title,
  items,
  positive
}) {
  const ref = useReveal(positive ? 0 : 100);
  return /* @__PURE__ */ jsx13("div", { ref, className: "varmi-reveal", style: { height: "100%" }, children: /* @__PURE__ */ jsxs12(Card, { accent: positive, style: { height: "100%", padding: "28px 30px" }, children: [
    /* @__PURE__ */ jsx13("h3", { style: { fontSize: "var(--t-card)", fontWeight: 500, color: positive ? "var(--mist)" : "var(--mist-70)", marginBottom: 20, letterSpacing: "-0.01em" }, children: title }),
    /* @__PURE__ */ jsx13("ul", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: items.map((it, i) => /* @__PURE__ */ jsxs12("li", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsx13(
        "span",
        {
          style: {
            flexShrink: 0,
            marginTop: 1,
            width: 22,
            height: 22,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: positive ? "rgba(232,162,96,0.14)" : "rgba(213,219,230,0.06)",
            color: positive ? "var(--copper)" : "var(--mist-40)"
          },
          children: /* @__PURE__ */ jsx13(Icon, { name: positive ? "check" : "x", size: 13, strokeWidth: 2 })
        }
      ),
      /* @__PURE__ */ jsx13("span", { style: { color: positive ? "var(--mist)" : "var(--mist-60)", fontSize: "0.975rem" }, children: it })
    ] }, i)) })
  ] }) });
}
function PasstAnders() {
  const chipsRef = useReveal();
  return /* @__PURE__ */ jsxs12(Section, { id: "passt-anders", children: [
    /* @__PURE__ */ jsx13(
      SectionHeader,
      {
        eyebrow: "F\xFCr jedes Haus",
        eyebrowIcon: "home",
        title: "Da, wo andere scheitern",
        subline: "Ideal f\xFCr Geb\xE4ude, in denen eine W\xE4rmepumpe schwer umzusetzen ist \u2014 wegen Platz, Schallschutz, Denkmalschutz oder fehlender Au\xDFenfl\xE4che."
      }
    ),
    /* @__PURE__ */ jsx13(
      "div",
      {
        ref: chipsRef,
        className: "varmi-reveal",
        style: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 40 },
        children: CHIPS.map((c) => /* @__PURE__ */ jsxs12(
          "span",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 60,
              border: "1px solid var(--hairline)",
              background: "var(--panel)",
              color: "var(--mist-70)",
              fontSize: "0.9rem"
            },
            children: [
              /* @__PURE__ */ jsx13("span", { style: { color: "var(--copper)", display: "inline-flex" }, children: /* @__PURE__ */ jsx13(Icon, { name: c.icon, size: 16 }) }),
              c.label
            ]
          },
          c.label
        ))
      }
    ),
    /* @__PURE__ */ jsxs12("div", { className: "varmi-grid varmi-grid-2", style: { marginTop: 44 }, children: [
      /* @__PURE__ */ jsx13(CompareList, { title: "Varmi", items: PRO, positive: true }),
      /* @__PURE__ */ jsx13(CompareList, { title: "Bekannte Heiztechnologien", items: CON, positive: false })
    ] })
  ] });
}

// src/varmi/sections/SteuerungVerlass.tsx
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
function SteuerungVerlass() {
  const closeRef = useReveal();
  return /* @__PURE__ */ jsxs13(Section, { id: "steuerung-verlass", children: [
    /* @__PURE__ */ jsx14(
      SectionHeader,
      {
        eyebrow: "Steuerung & Verl\xE4sslichkeit",
        eyebrowIcon: "sliders",
        title: "Sicherheit. Ruhe. Kontrolle."
      }
    ),
    /* @__PURE__ */ jsxs13("div", { className: "varmi-grid varmi-grid-3", style: { marginTop: 44 }, children: [
      /* @__PURE__ */ jsx14(FeatureCard, { icon: "smartphone", title: "App & Automationen", delay: 0, children: "\xDCber LAN/App steuern Sie Zeiten und Temperaturen und sehen jederzeit, was Varmi gerade tut. Den Rest optimiert die Regelung selbst." }),
      /* @__PURE__ */ jsx14(FeatureCard, { icon: "shieldCheck", title: "Wartungsarm & robust", delay: 100, children: "Gebaut f\xFCr den Dauerbetrieb: ohne Au\xDFeneinheit, ohne L\xE4rm, mit minimalem Serviceaufwand." }),
      /* @__PURE__ */ jsx14(FeatureCard, { icon: "activity", title: "Sicher \xFCberwacht", delay: 200, children: "Selbst-Monitoring meldet Auff\xE4lligkeiten fr\xFCh; Fernwartung m\xF6glich. Garantie bis 5 Jahre\xB2." })
    ] }),
    /* @__PURE__ */ jsxs13("div", { ref: closeRef, className: "varmi-reveal", style: { textAlign: "center", marginTop: 40 }, children: [
      /* @__PURE__ */ jsx14("p", { style: { color: "var(--mist-70)", maxWidth: 620, margin: "0 auto", fontSize: "1.0625rem" }, children: "Sie bekommen W\xE4rme, wenn Sie sie brauchen \u2014 und behalten Anlage und Kosten jederzeit im Blick." }),
      /* @__PURE__ */ jsx14("p", { style: { color: "var(--mist-40)", fontSize: "0.8rem", marginTop: 14 }, children: "\xB2 Je nach Paket/Vertrag." })
    ] })
  ] });
}

// src/varmi/types.ts
var VARMI_DEFAULTS = {
  datasheetUrl: "/assets/Technisches_Datenblatt_Varmi.pdf",
  fallbackContactUrl: "https://www.varmova.de/kontakt",
  fallbackPartnerUrl: "https://www.varmova.de/kontakt"
};

// src/varmi/sections/Daten.tsx
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var GROUPS = [
  {
    title: "Leistung & Effizienz",
    rows: [
      ["Max. Heizleistung", "17,8 kW"],
      ["\xD8 erwartete Heizleistung", "ca. 10,5 kW"],
      ["Leistungsaufnahme (max.)", "9,2 kW"],
      ["COP (Herstellerangabe)", "1,23"],
      ["Energieeffizienzklasse (Herstellerangabe)", "A+"]
    ]
  },
  {
    title: "Elektrik",
    rows: [
      ["Betriebsspannung", "3/N/PE AC 400 V / 50 Hz"],
      ["Steuerspannung", "230 V AC"],
      ["Stromaufnahme (max.)", "23 A"],
      ["Absicherung", "25 A"],
      ["Zuleitung", "5 \xD7 2,5 bis 5 \xD7 16 mm\xB2"]
    ]
  },
  {
    title: "Hydraulik & Medium",
    rows: [
      ["Betriebsmittel", "ISOTHERM 100/S (F\xFCllmenge ca. 16 l)"],
      ["Anschl\xFCsse Vor-/R\xFCcklauf", "\xBE\u2033 AG (DN25)"],
      ["Mindestvolumenstrom", "0,5 \u2013 3,0 m\xB3/h"],
      ["Betriebsdruck", "1,9 bar"],
      ["Achsabstand Vor-/R\xFCcklauf", "241 mm"]
    ]
  },
  {
    title: "Abmessungen & Allgemein",
    rows: [
      ["Anlagenschrank (H\xD7B\xD7T)", "600 \xD7 760 \xD7 350 mm"],
      ["Schaltschrank (H\xD7B\xD7T)", "600 \xD7 600 \xD7 350 mm", true],
      ["Gewicht (betriebsbereit)", "ca. 90 kg", true],
      ["Schutzart", "IP54"],
      ["Lieferung", "vormontiert auf Europalette"]
    ]
  },
  {
    title: "Steuerung",
    rows: [
      ["Steuerungstyp", "UVR-16X2S (technische Alternative)"],
      ["Display", "Farb-Touch-Display"],
      ["Schnittstellen", "CAN-Bus, DL-Bus"],
      ["Ausg\xE4nge", "11\xD7 Relais, 5\xD7 Multifunktion (0\u201310 V / PWM)"],
      ["Sensorik", "PT1000, PT500, Ni1000, KTY, 0\u201310 V, 4\u201320 mA"]
    ]
  }
];
function Group({ title, rows, delay }) {
  const ref = useReveal(delay);
  return /* @__PURE__ */ jsx15("div", { ref, className: "varmi-reveal", style: { height: "100%" }, children: /* @__PURE__ */ jsxs14(Card, { style: { height: "100%", padding: "26px 28px" }, children: [
    /* @__PURE__ */ jsx15("h3", { style: { color: "var(--copper)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }, children: title }),
    /* @__PURE__ */ jsx15("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ jsx15("tbody", { children: rows.map(([label, value, warn]) => /* @__PURE__ */ jsxs14("tr", { style: { borderTop: "1px solid var(--hairline)" }, children: [
      /* @__PURE__ */ jsx15(
        "th",
        {
          scope: "row",
          style: { textAlign: "left", fontWeight: 400, color: "var(--mist-60)", padding: "11px 12px 11px 0", fontSize: "0.9rem", verticalAlign: "top" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxs14("td", { style: { textAlign: "right", color: "var(--mist)", padding: "11px 0", fontSize: "0.9rem", verticalAlign: "top", whiteSpace: "nowrap" }, children: [
        value,
        warn ? /* @__PURE__ */ jsx15("span", { title: "Vor Go-Live verifizieren", style: { color: "var(--copper)", marginLeft: 6 }, children: "\u26A0" }) : null
      ] })
    ] }, label)) }) })
  ] }) });
}
function Daten({ datasheetUrl }) {
  const footRef = useReveal();
  const href = datasheetUrl || VARMI_DEFAULTS.datasheetUrl;
  return /* @__PURE__ */ jsxs14(Section, { id: "daten", children: [
    /* @__PURE__ */ jsx15(
      SectionHeader,
      {
        eyebrow: "Technische Daten",
        eyebrowIcon: "list",
        title: "Alle Daten auf einen Blick"
      }
    ),
    /* @__PURE__ */ jsx15("div", { className: "varmi-grid varmi-grid-2", style: { marginTop: 44, alignItems: "start" }, children: GROUPS.map((g, i) => /* @__PURE__ */ jsx15(Group, { title: g.title, rows: g.rows, delay: i % 2 * 90 }, g.title)) }),
    /* @__PURE__ */ jsxs14("div", { ref: footRef, className: "varmi-reveal", style: { marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }, children: [
      /* @__PURE__ */ jsxs14("p", { style: { display: "flex", gap: 10, alignItems: "flex-start", color: "var(--mist-60)", fontSize: "0.85rem", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ jsx15("span", { style: { color: "var(--copper)", flexShrink: 0 }, children: "\u26A0" }),
        /* @__PURE__ */ jsxs14("span", { children: [
          /* @__PURE__ */ jsx15("strong", { style: { color: "var(--mist-70)", fontWeight: 600 }, children: "Zu verifizieren vor Go-Live:" }),
          " ",
          "Schaltschrank-Ma\xDFe differieren zwischen Quellen (600\xD7600\xD7350 vs. 600\xD7300\xD7150 mm) \u2014 gegen Datenblatt v0.9 abgleichen. Gleiches gilt f\xFCr das Gewicht (ca. 90 kg vs. 70\u201390 kg). Ma\xDFgeblich ist das offizielle Datenblatt."
        ] })
      ] }),
      /* @__PURE__ */ jsx15("div", { children: /* @__PURE__ */ jsx15(Button, { variant: "gradient", href, icon: "download", children: "Technisches Datenblatt (PDF)" }) }),
      /* @__PURE__ */ jsx15("p", { style: { color: "var(--mist-40)", fontSize: "0.8rem", lineHeight: 1.6, maxWidth: 760 }, children: "Alle Leistungsangaben sind Herstellerangaben und m\xFCssen im Einzelfall normativ verifiziert werden. COP- und Effizienzwerte beschreiben das Ger\xE4t und sind keine Aussage \xFCber Heizkosten im Betrieb." })
    ] })
  ] });
}

// src/varmi/sections/FuerWen.tsx
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
function AudienceCard({
  icon,
  kicker,
  title,
  body,
  cta,
  variant,
  onClick,
  delay,
  accent
}) {
  const ref = useReveal(delay);
  return /* @__PURE__ */ jsx16("div", { ref, className: "varmi-reveal", style: { height: "100%" }, children: /* @__PURE__ */ jsxs15(Card, { accent, style: { height: "100%", padding: "36px 34px", display: "flex", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsx16(
      "div",
      {
        style: {
          width: 48,
          height: 48,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: "var(--panel)",
          border: "1px solid var(--hairline)",
          color: "var(--copper)"
        },
        children: /* @__PURE__ */ jsx16(Icon, { name: icon, size: 22 })
      }
    ),
    /* @__PURE__ */ jsx16("span", { style: { color: "var(--mist-60)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }, children: kicker }),
    /* @__PURE__ */ jsx16("h3", { style: { fontSize: "1.4rem", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", marginTop: -6 }, children: title }),
    /* @__PURE__ */ jsx16("p", { style: { color: "var(--mist-70)", flex: 1 }, children: body }),
    /* @__PURE__ */ jsx16("div", { children: /* @__PURE__ */ jsx16(Button, { variant, icon: variant === "gradient" ? "chevronDown" : "arrowUpRight", onClick, children: cta }) })
  ] }) });
}
function FuerWen({ onContactClick, onPartnerClick }) {
  return /* @__PURE__ */ jsxs15(Section, { id: "fuer-wen", children: [
    /* @__PURE__ */ jsx16(SectionHeader, { eyebrow: "F\xFCr wen", eyebrowIcon: "users", title: "Zwei Wege zu Varmi" }),
    /* @__PURE__ */ jsxs15("div", { className: "varmi-grid varmi-grid-2", style: { marginTop: 44, alignItems: "stretch" }, children: [
      /* @__PURE__ */ jsx16(
        AudienceCard,
        {
          icon: "home",
          kicker: "Hausbesitzer",
          title: "Sie heizen ein Zuhause",
          body: "Wenn eine W\xE4rmepumpe bei Ihnen schwierig ist, bekommen Sie mit Varmi moderne W\xE4rme \u2014 einfach, leise, schnell installiert.",
          cta: "Beratung anfragen",
          variant: "dark",
          onClick: onContactClick,
          delay: 0,
          accent: true
        }
      ),
      /* @__PURE__ */ jsx16(
        AudienceCard,
        {
          icon: "tool",
          kicker: "Fachpartner",
          title: "Sie installieren Heizungen",
          body: "Als Heizungs-, Sanit\xE4r-, PV- oder Solarbetrieb bieten Sie Ihren Kunden eine schnell umsetzbare Alternative \u2014 hoher Durchsatz statt Baustellenchaos.",
          cta: "Partner werden",
          variant: "gradient",
          onClick: onPartnerClick,
          delay: 100
        }
      )
    ] })
  ] });
}

// src/varmi/sections/CTA.tsx
import { jsx as jsx17, jsxs as jsxs16 } from "react/jsx-runtime";
function CTA({ onContactClick }) {
  const ref = useReveal();
  return /* @__PURE__ */ jsxs16(Section, { id: "cta", style: { position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx17(
      "div",
      {
        "aria-hidden": true,
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "120%",
          transform: "translate(-50%,-50%) rotate(-13deg)",
          background: "radial-gradient(50% 50% at 50% 50%, var(--copper-glow), transparent 70%)",
          opacity: 0.12,
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ jsxs16(
      "div",
      {
        ref,
        className: "varmi-reveal",
        style: { position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 640, margin: "0 auto" },
        children: [
          /* @__PURE__ */ jsx17(Eyebrow, { label: "Beratung", serif: true }),
          /* @__PURE__ */ jsx17(
            "h2",
            {
              className: "varmi-fill-h2",
              style: { fontSize: "var(--t-h2)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em" },
              children: "Interesse an der Varmi Heiztechnologie?"
            }
          ),
          /* @__PURE__ */ jsx17("p", { style: { color: "var(--mist-70)", maxWidth: 520 }, children: "Schildern Sie uns kurz Ihr Geb\xE4ude \u2014 wir sagen Ihnen ehrlich, ob Varmi passt." }),
          /* @__PURE__ */ jsx17("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ jsx17(Button, { variant: "dark", onClick: onContactClick, href: onContactClick ? void 0 : VARMI_DEFAULTS.fallbackContactUrl, children: "Beratung anfragen" }) }),
          /* @__PURE__ */ jsx17("a", { href: "mailto:info@varmova.de", style: { color: "var(--mist-60)", fontSize: "0.9rem", marginTop: 4 }, children: "info@varmova.de" })
        ]
      }
    )
  ] });
}

// src/varmi/sections/FAQ.tsx
import { useState as useState4 } from "react";
import { Fragment as Fragment5, jsx as jsx18, jsxs as jsxs17 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs17("div", { style: { borderTop: "1px solid var(--hairline)" }, children: [
    /* @__PURE__ */ jsx18("h3", { style: { margin: 0 }, children: /* @__PURE__ */ jsxs17(
      "button",
      {
        id: btnId,
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: onToggle,
        style: {
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
        },
        children: [
          /* @__PURE__ */ jsx18("span", { children: q }),
          /* @__PURE__ */ jsx18("span", { style: { flexShrink: 0, color: "var(--copper)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }, children: /* @__PURE__ */ jsx18(Icon, { name: "chevronDown", size: 20 }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx18(
      "div",
      {
        id: panelId,
        role: "region",
        "aria-labelledby": btnId,
        hidden: !open,
        style: { padding: open ? "0 4px 24px" : 0, color: "var(--mist-60)", maxWidth: 760, fontSize: "0.975rem", lineHeight: 1.65 },
        children: a
      }
    )
  ] });
}
function FAQ({ onContactClick }) {
  const [open, setOpen] = useState4(0);
  const listRef = useReveal();
  const ctaRef = useReveal();
  return /* @__PURE__ */ jsxs17(Section, { id: "faq", children: [
    /* @__PURE__ */ jsx18(
      SectionHeader,
      {
        eyebrow: "FAQ",
        eyebrowIcon: "help",
        title: /* @__PURE__ */ jsxs17(Fragment5, { children: [
          "H\xE4ufige ",
          /* @__PURE__ */ jsx18("span", { className: "varmi-serif", children: "Fragen" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx18("div", { ref: listRef, className: "varmi-reveal", style: { maxWidth: 820, margin: "40px auto 0" }, children: ITEMS.map((it, i) => /* @__PURE__ */ jsx18(Item, { idx: i, q: it.q, a: it.a, open: open === i, onToggle: () => setOpen(open === i ? -1 : i) }, i)) }),
    /* @__PURE__ */ jsx18("div", { ref: ctaRef, className: "varmi-reveal", style: { maxWidth: 820, margin: "28px auto 0" }, children: /* @__PURE__ */ jsxs17(Card, { style: { padding: "26px 30px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsx18("div", { style: { color: "var(--mist)", fontWeight: 500, fontSize: "1.0625rem" }, children: "Weitere Fragen?" }),
        /* @__PURE__ */ jsx18("div", { style: { color: "var(--mist-60)", fontSize: "0.95rem" }, children: "Schreiben Sie uns gerne." })
      ] }),
      /* @__PURE__ */ jsx18(Button, { variant: "gradient", onClick: onContactClick, icon: "arrowUpRight", children: "Frage stellen" })
    ] }) })
  ] });
}

// src/varmi/sections/Footer.tsx
import { Fragment as Fragment6, jsx as jsx19, jsxs as jsxs18 } from "react/jsx-runtime";
function VLogo() {
  return /* @__PURE__ */ jsxs18("span", { style: { display: "inline-flex", alignItems: "center", gap: 10 }, children: [
    /* @__PURE__ */ jsxs18("svg", { width: "26", height: "26", viewBox: "0 0 32 32", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx19("path", { d: "M5 7 L16 25 L27 7", fill: "none", stroke: "var(--mist)", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx19("path", { d: "M11 7 L16 16 L21 7", fill: "none", stroke: "var(--copper)", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }),
    /* @__PURE__ */ jsx19("span", { style: { fontWeight: 600, fontSize: "1.1rem", color: "var(--mist)", letterSpacing: "-0.01em" }, children: "Varmova" })
  ] });
}
var LINKS = [
  ["Startseite", "/"],
  ["Varmi", "/#hero"],
  ["Kontakt", "/kontakt"],
  ["Impressum", "/impressum"],
  ["AGB", "/agbs"]
];
function Footer({ onContactClick, onPartnerClick }) {
  const bandRef = useReveal();
  return /* @__PURE__ */ jsxs18(Fragment6, { children: [
    /* @__PURE__ */ jsxs18("section", { style: { position: "relative", overflow: "hidden", borderTop: "1px solid var(--hairline)" }, children: [
      /* @__PURE__ */ jsx19("div", { "aria-hidden": true, style: { position: "absolute", inset: 0, background: "radial-gradient(80% 140% at 50% 0%, rgba(232,162,96,0.12), transparent 60%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx19(Shell, { style: { position: "relative", paddingBlock: "clamp(56px, 6vw, 80px)" }, children: /* @__PURE__ */ jsxs18("div", { ref: bandRef, className: "varmi-reveal", style: { display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsx19("h2", { style: { fontSize: "clamp(1.5rem, 1rem + 2vw, 2rem)", fontWeight: 500, color: "var(--mist)", letterSpacing: "-0.01em", maxWidth: 520 }, children: "Die W\xE4rmewende beginnt mit einem Termin." }),
        /* @__PURE__ */ jsxs18("div", { style: { display: "flex", flexWrap: "wrap", gap: 12 }, children: [
          /* @__PURE__ */ jsx19(Button, { variant: "dark", onClick: onContactClick, children: "Beratung anfragen" }),
          /* @__PURE__ */ jsx19(Button, { variant: "gradient", icon: "chevronDown", onClick: onPartnerClick, children: "F\xFCr Fachbetriebe" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx19("footer", { style: { borderTop: "1px solid var(--copper)", background: "var(--night)" }, children: /* @__PURE__ */ jsxs18(Shell, { style: { paddingBlock: 48 }, children: [
      /* @__PURE__ */ jsxs18("div", { style: { display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsxs18("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsx19(VLogo, {}),
          /* @__PURE__ */ jsxs18("div", { style: { color: "var(--mist-60)", fontSize: "0.875rem", lineHeight: 1.7 }, children: [
            "Am Weiher 1, 85435 Erding",
            /* @__PURE__ */ jsx19("br", {}),
            /* @__PURE__ */ jsx19("a", { href: "mailto:info@varmova.de", style: { color: "var(--mist-70)" }, children: "info@varmova.de" })
          ] })
        ] }),
        /* @__PURE__ */ jsx19("nav", { "aria-label": "Footer", style: { display: "flex", flexWrap: "wrap", gap: "10px 22px" }, children: LINKS.map(([label, href]) => /* @__PURE__ */ jsx19("a", { href, style: { color: "var(--mist-70)", fontSize: "0.9rem" }, children: label }, label)) }),
        /* @__PURE__ */ jsx19("div", { style: { display: "flex", gap: 12 }, children: ["linkedin", "instagram", "facebook"].map((s) => /* @__PURE__ */ jsx19(
          "a",
          {
            href: "#",
            "aria-label": s,
            style: { width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--hairline)", display: "grid", placeItems: "center", color: "var(--mist-70)" },
            children: /* @__PURE__ */ jsx19(Icon, { name: s, size: 17, fill: "currentColor", strokeWidth: 0 })
          },
          s
        )) })
      ] }),
      /* @__PURE__ */ jsx19("hr", { className: "varmi-hairline", style: { margin: "32px 0 20px" } }),
      /* @__PURE__ */ jsx19("p", { style: { color: "var(--mist-40)", fontSize: "0.75rem", lineHeight: 1.6, maxWidth: 900 }, children: "Die angegebenen Leistungsdaten (insb. Heizleistung, COP, Energieeffizienzklasse) basieren auf internen Herstellerangaben und bed\xFCrfen vor finaler Projektierung normativer Verifizierung. Eignung f\xFCr den konkreten Einsatzfall kundenseitig zu pr\xFCfen. Abbildungen unverbindlich. Technische \xC4nderungen und Irrt\xFCmer vorbehalten." }),
      /* @__PURE__ */ jsx19("p", { style: { color: "var(--mist-60)", fontSize: "0.8rem", marginTop: 16 }, children: "\xA9 2026 Varmova UG" })
    ] }) })
  ] });
}

// src/varmi/Varmi.tsx
import { jsx as jsx20, jsxs as jsxs19 } from "react/jsx-runtime";
function Varmi(props) {
  const onContact = props.onContactClick;
  const onPartner = props.onPartnerClick;
  return /* @__PURE__ */ jsxs19("div", { className: "varmi", children: [
    /* @__PURE__ */ jsx20(VarmiStyles, {}),
    /* @__PURE__ */ jsxs19("main", { children: [
      /* @__PURE__ */ jsx20(Hero, { onContactClick: onContact, heroImage: props.heroImage }),
      /* @__PURE__ */ jsx20(Energiefluss, {}),
      /* @__PURE__ */ jsx20(Technologie, { schnittImage: props.schnittImage }),
      /* @__PURE__ */ jsx20(Installation, {}),
      /* @__PURE__ */ jsx20(Betriebsarten, {}),
      /* @__PURE__ */ jsx20(PasstAnders, {}),
      /* @__PURE__ */ jsx20(SteuerungVerlass, {}),
      /* @__PURE__ */ jsx20(Daten, { datasheetUrl: props.datasheetUrl }),
      /* @__PURE__ */ jsx20(FuerWen, { onContactClick: onContact, onPartnerClick: onPartner }),
      /* @__PURE__ */ jsx20(CTA, { onContactClick: onContact }),
      /* @__PURE__ */ jsx20(FAQ, { onContactClick: onContact })
    ] }),
    /* @__PURE__ */ jsx20(Footer, { onContactClick: onContact, onPartnerClick: onPartner })
  ] });
}
var Varmi_default = Varmi;

// src/framer-entry.tsx
import { jsx as jsx21 } from "react/jsx-runtime";
function VarmiPage(props) {
  return /* @__PURE__ */ jsx21(Varmi_default, { ...props });
}
addPropertyControls(VarmiPage, {
  onContactClick: { type: ControlType.EventHandler },
  onPartnerClick: { type: ControlType.EventHandler },
  heroImage: { type: ControlType.Image, title: "Hero-Render" },
  energieflussImage: { type: ControlType.Image, title: "Energiefluss" },
  schnittImage: { type: ControlType.Image, title: "Schnitt-Render" },
  appImage: { type: ControlType.Image, title: "App-Mockup" },
  datasheetUrl: { type: ControlType.File, title: "Datenblatt (PDF)", allowedFileTypes: ["pdf"] },
  fallbackContactUrl: { type: ControlType.Link, title: "Kontakt-Fallback" },
  fallbackPartnerUrl: { type: ControlType.Link, title: "Partner-Fallback" }
});
export {
  VarmiPage as default
};
