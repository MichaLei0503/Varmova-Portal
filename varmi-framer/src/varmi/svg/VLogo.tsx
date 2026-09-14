/**
 * The VARMI "V" mark — elegant flared double-stroke, matching the brand logo.
 * Built as FILLED ribbons (tapered tips) + a thin inner companion line, so it
 * reads as the brand's double-line V. Coordinate box 0..200 × 0..200.
 * `VMark` renders just the paths (place inside any SVG with a transform);
 * `VLogo` wraps it in a standalone <svg>.
 */

// filled wing ribbons (tapered) — outer edge down, inner edge back up
const LEFT_WING =
  "M26 38 C 36 54, 42 68, 49 88 C 59 122, 75 151, 96 173 C 102 179, 108 175, 104 165 C 87 139, 71 111, 62 86 C 55 63, 47 49, 39 42 C 34 38, 29 37, 26 38 Z";
const RIGHT_WING =
  "M174 38 C 164 54, 158 68, 151 88 C 141 122, 125 151, 104 173 C 98 179, 92 175, 96 165 C 113 139, 129 111, 138 86 C 145 63, 153 49, 161 42 C 166 38, 171 37, 174 38 Z";
// thin inner companion lines hugging the inner edge (the double-line look)
const LEFT_INNER = "M56 64 C 62 96, 76 132, 96 160";
const RIGHT_INNER = "M144 64 C 138 96, 124 132, 104 160";

export const V_PATHS = { leftMain: LEFT_WING, rightMain: RIGHT_WING, leftInner: LEFT_INNER, rightInner: RIGHT_INNER } as const;

export function VMark({
  fill = "url(#vlogo-gold)",
  animate = false,
  delay = 0.35,
  glow = false,
}: {
  fill?: string;
  animate?: boolean;
  delay?: number;
  glow?: boolean;
}) {
  const wingAnim = (i: number) =>
    animate ? { style: { opacity: 0, animation: `varmi-in-fade .7s ease ${delay + i * 0.12}s both` } } : {};
  const lineAnim = (i: number) =>
    animate ? ({ pathLength: 1, strokeDasharray: 1, style: { animation: `varmi-draw 1s ease ${delay + 0.5 + i * 0.1}s both` } } as const) : {};
  return (
    <g>
      {glow && (
        <g fill={fill} opacity="0.35" style={{ filter: "blur(4px)" }}>
          <path d={LEFT_WING} />
          <path d={RIGHT_WING} />
        </g>
      )}
      <g fill={fill}>
        <path d={LEFT_WING} {...wingAnim(0)} />
        <path d={RIGHT_WING} {...wingAnim(1)} />
      </g>
      <g fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d={LEFT_INNER} {...lineAnim(0)} />
        <path d={RIGHT_INNER} {...lineAnim(1)} />
      </g>
    </g>
  );
}

export function VLogo({ glow = false, animate = false }: { glow?: boolean; animate?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="vlogo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8CE93" />
          <stop offset="48%" stopColor="#E8A260" />
          <stop offset="100%" stopColor="#B4742F" />
        </linearGradient>
      </defs>
      <VMark glow={glow} animate={animate} />
    </svg>
  );
}
