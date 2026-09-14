/**
 * Self-contained global styles for the VARMI page.
 * Renders a Google Fonts <link> + a scoped <style> block so the whole thing
 * works as a single Framer code component (no external CSS files).
 * Everything is scoped under the `.varmi` root class.
 */
import { color, gradient, shadow, type, font, layout, bp } from "./tokens";

const css = `
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
   ONLY applied outside the Framer editor canvas — on the canvas 100vw is the
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

/* Reveal (Layer A) — fail-safe: content is visible by default. JS "arms"
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
   Mobile: number left, text right, vertical connector line — a real timeline
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

  /* data tables → stacked key/value lists (no horizontal overflow) */
  .varmi-dtable, .varmi-dtable tbody, .varmi-dtable tr, .varmi-dtable th, .varmi-dtable td { display: block; width: 100%; }
  .varmi-dtable tr { border-top: 1px solid var(--hairline); padding: 11px 0; }
  .varmi-dtable th { text-align: left !important; color: var(--mist-60) !important; padding: 0 !important; font-size: 0.85rem !important; }
  .varmi-dtable td { text-align: left !important; white-space: normal !important; padding: 3px 0 0 !important; font-weight: 500; }
}

/* §B Energiefluss stage.
   The 300vh pinned runway exists ONLY on pointer-fine desktop/tablet widths.
   On mobile the stage is static PURELY VIA CSS — never via a JS class — so the
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

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@1&display=swap";

/* Companion to .varmi--bleed: kills the ~scrollbar-width horizontal overflow
   caused by 100vw (overflow-x: clip is sticky-safe — no scroll container).
   Injected ONLY when full-bleed is active, so the Framer editor's own
   html/body are never touched while on the canvas. */
const bleedGlobalCss = `html, body { overflow-x: clip; }`;

export function VarmiStyles({ bleed = true }: { bleed?: boolean }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONT_HREF} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {bleed && <style dangerouslySetInnerHTML={{ __html: bleedGlobalCss }} />}
    </>
  );
}
