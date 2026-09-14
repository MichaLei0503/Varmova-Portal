/**
 * 24h dynamic-price curve. Cheap windows (night 02–06 & midday PV 11–15) are
 * highlighted in copper — where VARMI shifts the heating load. Inline SVG.
 */
const W = 720, H = 230;
const PADL = 16, PADR = 16, TOP = 24, BASE = 176;

// representative relative price across the day (0..1)
const PRICE: [number, number][] = [
  [0, 0.36], [2, 0.18], [4, 0.15], [6, 0.46], [8, 0.86], [10, 0.6],
  [12, 0.3], [14, 0.28], [16, 0.56], [18, 0.96], [20, 0.8], [22, 0.5], [24, 0.36],
];

const xOf = (h: number) => PADL + (h / 24) * (W - PADL - PADR);
const yOf = (p: number) => BASE - p * (BASE - TOP);

function smoothPath(pts: [number, number][]) {
  const P = pts.map(([h, p]) => [xOf(h), yOf(p)] as const);
  let d = `M ${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const [x0, y0] = P[i];
    const [x1, y1] = P[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const WINDOWS: [number, number, string][] = [
  [2, 6, "Nacht"],
  [11, 15, "PV-Mittag"],
];

export function Tagesverlauf() {
  const line = smoothPath(PRICE);
  const area = `${line} L ${xOf(24)} ${BASE} L ${xOf(0)} ${BASE} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Tagesverlauf des Strompreises mit günstigen Heizfenstern nachts und mittags" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vf-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(213,219,230,0.18)" />
          <stop offset="100%" stopColor="rgba(213,219,230,0)" />
        </linearGradient>
      </defs>

      {/* cheap windows */}
      {WINDOWS.map(([a, b, label]) => (
        <g key={label}>
          <rect x={xOf(a)} y={TOP} width={xOf(b) - xOf(a)} height={BASE - TOP} fill="rgba(232,162,96,0.12)" />
          <line x1={xOf(a)} y1={TOP} x2={xOf(a)} y2={BASE} stroke="rgba(232,162,96,0.3)" strokeDasharray="3 4" />
          <line x1={xOf(b)} y1={TOP} x2={xOf(b)} y2={BASE} stroke="rgba(232,162,96,0.3)" strokeDasharray="3 4" />
          <text x={(xOf(a) + xOf(b)) / 2} y={TOP - 8} fill="#E8A260" fontSize="12" textAnchor="middle" fontFamily="Inter, sans-serif">
            {label}
          </text>
        </g>
      ))}

      {/* baseline */}
      <line x1={PADL} y1={BASE} x2={W - PADR} y2={BASE} stroke="rgba(216,231,242,0.12)" />

      {/* area + curve */}
      <path d={area} fill="url(#vf-area)" />
      <path d={line} fill="none" stroke="#D5DBE6" strokeWidth="2" strokeLinecap="round" />

      {/* hour ticks */}
      {[0, 6, 12, 18, 24].map((h) => (
        <text key={h} x={xOf(h)} y={H - 6} fill="rgba(213,219,230,0.5)" fontSize="11" textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} fontFamily="Inter, sans-serif">
          {h}:00
        </text>
      ))}
    </svg>
  );
}
