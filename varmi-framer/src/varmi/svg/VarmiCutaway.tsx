/**
 * Schematic cutaway of the VARMI thermofluid system — replaces a product photo
 * in §C. Pure SVG + CSS animation (heating rods glow, fluid flow in the pipes),
 * reduced-motion safe. Components: ① Tank ② Pumpe ③ Wärmetauscher ④ Steuerung
 * ⑤ Schaltschrank.
 */

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="#04070D" stroke="#E8A260" strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#E8A260" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
        {n}
      </text>
    </g>
  );
}

export function VarmiCutaway() {
  const rods = [196, 226, 256, 286];
  return (
    <svg viewBox="0 0 760 460" width="100%" height="100%" role="img" aria-label="Schnitt durch das Varmi-System: Tank mit vier Heizstäben, Wärmetauscher, Pumpe und Steuerung" style={{ display: "block" }}>
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

      {/* Cabinet (Anlagenschrank) */}
      <rect x="60" y="48" width="380" height="372" rx="20" fill="none" stroke="rgba(216,231,242,0.14)" strokeWidth="1.5" />

      {/* Tank ① */}
      <rect x="150" y="92" width="190" height="300" rx="16" fill="#0B0F18" stroke="rgba(213,219,230,0.5)" strokeWidth="2" />
      {/* thermofluid */}
      <g clipPath="url(#vc-tank)">
        <rect x="150" y="150" width="190" height="242" fill="url(#vc-fluid)" />
        {/* heat shimmer rising */}
        {[180, 245, 310].map((x, i) => (
          <circle key={x} cx={x} cy="360" r="3" fill="rgba(232,162,96,0.6)" style={{ animation: `varmi-rise ${3 + i * 0.6}s ease-in ${i * 0.8}s infinite` }} />
        ))}
      </g>
      {/* heating rods */}
      {rods.map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y="118" width="10" height="250" rx="5" fill="url(#vc-rod)" filter="url(#vc-glow)" style={{ transformOrigin: "center", animation: `varmi-rod ${2.2 + i * 0.3}s ease-in-out ${i * 0.25}s infinite` }} />
          <rect x={x - 9} y="110" width="18" height="12" rx="3" fill="#10131C" stroke="rgba(213,219,230,0.4)" strokeWidth="1" />
        </g>
      ))}

      {/* Heat exchanger ③ — coil at the top of the tank */}
      <g stroke="#E8A260" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M250 92 V 70 q 0 -14 18 -14 q 18 0 18 -14 q 0 -14 -18 -14 q -18 0 -18 -14 q 0 -14 18 -14 H 345" />
      </g>

      {/* Pump ② on the return line */}
      <g>
        <circle cx="405" cy="350" r="22" fill="#10131C" stroke="rgba(213,219,230,0.5)" strokeWidth="2" />
        <g stroke="#E8A260" strokeWidth="2" strokeLinecap="round" style={{ transformOrigin: "405px 350px", animation: "varmi-spin 5s linear infinite" }}>
          <line x1="405" y1="338" x2="405" y2="362" />
          <line x1="394" y1="344" x2="416" y2="356" />
          <line x1="394" y1="356" x2="416" y2="344" />
        </g>
      </g>

      {/* Pipes: Vorlauf (warm, top) + Rücklauf (cool, bottom) to the heating circuit */}
      {/* Vorlauf */}
      <path d="M345 64 H 460 V 150 H 470" fill="none" stroke="#E8A260" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M345 64 H 460 V 150 H 470" fill="none" stroke="#F0B27A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 22" style={{ animation: "varmi-flow 1.2s linear infinite" }} />
      <polygon points="470,144 482,150 470,156" fill="#E8A260" />
      {/* Rücklauf */}
      <path d="M470 320 H 460 V 350 H 427" fill="none" stroke="rgba(213,219,230,0.5)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M482 320 H 460 V 350 H 427" fill="none" stroke="rgba(213,219,230,0.7)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 22" style={{ animation: "varmi-flow 1.6s linear infinite reverse" }} />

      {/* labels for the circuit */}
      <text x="492" y="138" fill="var(--mist-60)" fontSize="12" fontFamily="Inter, sans-serif">Vorlauf</text>
      <text x="492" y="324" fill="var(--mist-60)" fontSize="12" fontFamily="Inter, sans-serif">Rücklauf</text>

      {/* Controller ④ + Schaltschrank ⑤ */}
      <rect x="560" y="92" width="150" height="220" rx="14" fill="#0B0F18" stroke="rgba(216,231,242,0.14)" strokeWidth="1.5" />
      {/* touch display */}
      <rect x="584" y="120" width="102" height="64" rx="8" fill="#10131C" stroke="rgba(232,162,96,0.4)" strokeWidth="1.5" filter="url(#vc-glow)" />
      <path d="M598 160 L618 140 L636 154 L660 132" fill="none" stroke="#E8A260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* relay/indicator rows */}
      {[208, 230, 252, 274].map((y) => (
        <g key={y}>
          <rect x="584" y={y} width="78" height="10" rx="3" fill="rgba(213,219,230,0.08)" />
          <circle cx="674" cy={y + 5} r="3.5" fill={y === 208 ? "#A6DAFF" : "rgba(213,219,230,0.4)"} />
        </g>
      ))}

      {/* number badges */}
      <Badge x={150} y={92} n={1} />
      <Badge x={405} y={350} n={2} />
      <Badge x={398} y={40} n={3} />
      <Badge x={560} y={92} n={4} />
      <Badge x={710} y={92} n={5} />
    </svg>
  );
}
