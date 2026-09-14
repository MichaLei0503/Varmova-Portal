/**
 * Self-contained schematic of the energy path: Sun → PV roof → VARMI → rooms.
 * Copper line-art on night. Driven by a plain 0→1 `progress` number (no
 * framer-motion → no WAAPI .animate() calls). Paths draw via SVG
 * stroke-dashoffset with a normalized pathLength of 1.
 */
import { VMark } from "./VLogo";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

// piecewise pulse: 0.2 → 1 (0.48–0.56) → 0.55 (0.56–0.64)
function pulse(p: number) {
  if (p < 0.48) return 0.2;
  if (p < 0.56) return 0.2 + (1 - 0.2) * seg(p, 0.48, 0.56);
  if (p < 0.64) return 1 + (0.55 - 1) * seg(p, 0.56, 0.64);
  return 0.55;
}

/** draw helper: normalized pathLength=1, dash 1, offset 1→0 as fraction 0→1 */
function draw(fraction: number) {
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - fraction } as const;
}

export function EnergieflussScene({ progress, reduced }: { progress: number; reduced: boolean }) {
  const p = reduced ? 1 : progress;

  const sunPV = seg(p, 0.0, 0.22);
  const pvVarmi = seg(p, 0.24, 0.48);
  const pvGlow = seg(p, 0.05, 0.22);
  const varmiOp = pulse(p);
  const roomsDraw = seg(p, 0.62, 0.96);
  const roomsGlow = seg(p, 0.74, 1.0);
  const pvOpacity = (i: number) => seg(p, 0.05 + i * 0.03, 0.18 + i * 0.03);

  return (
    <svg viewBox="0 0 800 500" width="100%" height="100%" role="img" aria-label="Energieweg: Solarstrom vom Dach über Varmi in alle Räume" style={{ display: "block" }}>
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

      {/* House outline */}
      <g stroke="rgba(213,219,230,0.45)" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M250 250 L440 130 L630 250" />
        <path d="M280 250 L280 430 L600 430 L600 250" />
        <line x1="280" y1="350" x2="600" y2="350" stroke="rgba(213,219,230,0.18)" />
        <line x1="460" y1="350" x2="460" y2="430" stroke="rgba(213,219,230,0.18)" />
      </g>

      {/* Sun */}
      <g style={{ opacity: pvGlow }}>
        <circle cx="120" cy="100" r="30" fill="url(#vf-sun)" filter="url(#vf-glow)" />
        <g stroke="#E8A260" strokeWidth="2.5" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={120 + 38 * Math.cos(rad)}
                y1={100 + 38 * Math.sin(rad)}
                x2={120 + 50 * Math.cos(rad)}
                y2={100 + 50 * Math.sin(rad)}
              />
            );
          })}
        </g>
      </g>

      {/* PV panels on the left roof slope */}
      <g>
        {[0, 1, 2, 3].map((i) => {
          const t = i / 4;
          const x = 270 + t * 150;
          const y = 238 - t * 95;
          return (
            <path
              key={i}
              d={`M${x} ${y} l40 -25 l16 18 l-40 25 z`}
              fill="rgba(232,162,96,0.16)"
              stroke="#E8A260"
              strokeWidth="1.5"
              style={{ opacity: pvOpacity(i) }}
            />
          );
        })}
      </g>

      {/* Path: Sun → PV */}
      <path d="M150 120 C 200 180, 230 175, 300 195" fill="none" stroke="#E8A260" strokeWidth="2.5" strokeLinecap="round" filter="url(#vf-glow)" {...draw(sunPV)} />

      {/* VARMI unit with the brand V */}
      <g style={{ opacity: varmiOp }}>
        <rect x="396" y="360" width="84" height="62" rx="10" fill="#10131C" stroke="#E8A260" strokeWidth="2" filter="url(#vf-glow)" />
        <g transform="translate(416 369) scale(0.22)">
          <VMark fill="#E8A260" />
        </g>
      </g>

      {/* Path: PV roof → VARMI */}
      <path d="M300 150 C 330 250, 380 300, 430 360" fill="none" stroke="#E8A260" strokeWidth="2.5" strokeLinecap="round" {...draw(pvVarmi)} />

      {/* Rooms (radiators) with warm glow */}
      {[
        { gx: 360, gy: 300, rx: 330, ry: 286 },
        { gx: 545, gy: 300, rx: 520, ry: 286 },
        { gx: 360, gy: 400, rx: 332, ry: 392 },
        { gx: 545, gy: 400, rx: 520, ry: 392 },
      ].map((pt, i) => (
        <g key={i}>
          <circle cx={pt.gx} cy={pt.gy} r="46" fill="url(#vf-room)" style={{ opacity: roomsGlow }} />
          <g stroke="rgba(213,219,230,0.6)" strokeWidth="1.5" fill="none">
            <rect x={pt.rx} y={pt.ry} width="34" height="26" rx="3" />
            <line x1={pt.rx + 9} y1={pt.ry} x2={pt.rx + 9} y2={pt.ry + 26} />
            <line x1={pt.rx + 18} y1={pt.ry} x2={pt.rx + 18} y2={pt.ry + 26} />
            <line x1={pt.rx + 27} y1={pt.ry} x2={pt.rx + 27} y2={pt.ry + 26} />
          </g>
        </g>
      ))}

      {/* Paths: VARMI → rooms */}
      {[
        "M438 360 C 420 330, 380 315, 350 300",
        "M460 362 C 500 335, 530 318, 545 305",
        "M440 422 C 420 430, 380 420, 352 405",
        "M462 422 C 500 430, 530 420, 548 405",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#E8A260" strokeWidth="2" strokeLinecap="round" {...draw(roomsDraw)} />
      ))}
    </svg>
  );
}
