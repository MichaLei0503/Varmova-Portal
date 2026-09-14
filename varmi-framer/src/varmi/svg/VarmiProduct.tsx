/**
 * Hero product — VARMI unit in a clean 3/4 (oblique) view, matte-black with the
 * real gold "V" mark, touch display and fasteners. To scale: square front face
 * (Anlagenschrank 600×600 mm) + visible depth (≙ 350 mm). Pure SVG + CSS:
 * the V draws on, the display lights up, an Apple-style specular sweep crosses
 * the face. Reduced-motion safe.
 */
import { VMark } from "./VLogo";

// front face
const FX = 116, FY = 150, FS = 420;
const DX = 46, DY = -34; // depth vector (up-right)
const CXF = FX + FS / 2; // front-face centre x

// V placement on the face
const VW = 150, VS = VW / 200;
const VTX = CXF - VW / 2, VTY = FY + 50;

export function VarmiProduct() {
  return (
    <svg viewBox="0 0 720 620" width="100%" height="100%" role="img" aria-label="Varmi Heizsystem — mattschwarzes Gehäuse mit goldenem V-Logo und Touch-Display" style={{ display: "block", overflow: "visible" }}>
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

      {/* contact shadow + ambient */}
      <ellipse cx={CXF + 20} cy="585" rx="250" ry="30" fill="rgba(0,0,0,0.7)" filter="url(#vp-soft)" />
      <circle cx={CXF} cy="320" r="250" fill="rgba(232,162,96,0.05)" filter="url(#vp-soft)" />

      {/* top face */}
      <polygon points={`${FX},${FY} ${FX + FS},${FY} ${FX + FS + DX},${FY + DY} ${FX + DX},${FY + DY}`} fill="url(#vp-top)" stroke="rgba(216,231,242,0.10)" strokeWidth="1" />
      {/* right face */}
      <polygon points={`${FX + FS},${FY} ${FX + FS + DX},${FY + DY} ${FX + FS + DX},${FY + FS + DY} ${FX + FS},${FY + FS}`} fill="url(#vp-right)" stroke="rgba(216,231,242,0.07)" strokeWidth="1" />

      {/* front face */}
      <rect x={FX} y={FY} width={FS} height={FS} fill="url(#vp-front)" stroke="rgba(216,231,242,0.10)" strokeWidth="1.5" />
      {/* edge highlights */}
      <line x1={FX} y1={FY + 1} x2={FX + FS} y2={FY + 1} stroke="rgba(207,231,255,0.16)" strokeWidth="1.5" />
      <line x1={FX + 1} y1={FY} x2={FX + 1} y2={FY + FS} stroke="rgba(207,231,255,0.08)" strokeWidth="1.5" />

      {/* fasteners */}
      {[FY + 70, FY + FS - 70].map((cy) => (
        <g key={cy}>
          <circle cx={FX + FS - 40} cy={cy} r="10" fill="#070a0e" stroke="rgba(216,231,242,0.16)" strokeWidth="1.2" />
          <circle cx={FX + FS - 40} cy={cy} r="3" fill="rgba(213,219,230,0.4)" />
        </g>
      ))}

      {/* gold V — correct brand mark, fades/draws on */}
      <g transform={`translate(${VTX} ${VTY}) scale(${VS})`}>
        <VMark fill="url(#vp-gold)" glow animate />
      </g>

      {/* touch display — recessed, lights up */}
      <g style={{ animation: "varmi-screen 1s ease 1.15s both" }}>
        <rect x={CXF - 66} y={FY + 250} width="132" height="86" rx="8" fill="#04060a" stroke="rgba(232,162,96,0.3)" strokeWidth="1.5" />
        <rect x={CXF - 60} y={FY + 256} width="120" height="60" rx="5" fill="rgba(232,162,96,0.06)" />
        <path d={`M${CXF - 44} ${FY + 300} L${CXF - 22} ${FY + 280} L${CXF - 2} ${FY + 294} L${CXF + 32} ${FY + 266}`} fill="none" stroke="#E8A260" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={CXF + 32} cy={FY + 266} r="2.8" fill="#F0B27A" />
        <text x={CXF} y={FY + 330} textAnchor="middle" fill="rgba(213,219,230,0.4)" fontSize="7.5" fontFamily="Inter, sans-serif" letterSpacing="1.5">XM13</text>
      </g>

      {/* specular light sweep across the face */}
      <g clipPath="url(#vp-face)">
        <rect x="-180" y={FY} width="150" height={FS} fill="url(#vp-sweep)" style={{ animation: "varmi-sweep 5.5s ease-in-out 1.7s infinite" }} />
      </g>
    </svg>
  );
}
