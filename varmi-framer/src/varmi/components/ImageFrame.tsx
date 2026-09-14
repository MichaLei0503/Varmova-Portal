import type { CSSProperties } from "react";

/**
 * Image container with a fixed aspect-ratio (prevents CLS).
 * If `src` is empty, renders a labelled dark placeholder so the layout reads
 * correctly in the harness; in Framer the client supplies the real render URL.
 */
export function ImageFrame({
  src,
  alt,
  ratio = "4 / 3",
  label,
  priority = false,
  style,
  contain = true,
}: {
  src?: string;
  alt: string;
  ratio?: string;
  label?: string;
  priority?: boolean;
  style?: CSSProperties;
  contain?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        borderRadius: 20,
        overflow: "hidden",
        background:
          "radial-gradient(120% 90% at 50% 0%, rgba(184,199,217,0.06), rgba(4,7,13,0) 60%), #04070D",
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          // @ts-expect-error fetchpriority is valid HTML, not yet in React types everywhere
          fetchpriority={priority ? "high" : undefined}
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: contain ? "contain" : "cover",
          }}
        />
      ) : (
        <div
          aria-label={alt}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "rgba(213,219,230,0.35)",
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px dashed rgba(216,231,242,0.12)",
            borderRadius: 20,
          }}
        >
          {label ?? alt}
        </div>
      )}
    </div>
  );
}
