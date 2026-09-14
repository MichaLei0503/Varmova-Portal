import { useEffect, useState } from "react";

/**
 * Full-bleed Wistia background video — autoplays muted, loops, no controls,
 * covers the container (object-fit: cover via the 16:9 over-size technique).
 * Click-through (pointer-events: none). `id` = Wistia media hashed id.
 *
 * Performance behaviour:
 *  - The iframe (player JS + poster + video stream, easily 2–8 MB) is mounted
 *    only AFTER the browser goes idle post-first-paint, so it never competes
 *    with the initial render. Until then the hero shows its gradient/overlay
 *    design on the dark base — visually identical for the first moments.
 *  - On mobile (≤809px) the video is skipped entirely.
 *  - qualityMax caps the stream at 1080p so the 4K rendition is never pulled.
 */

/** Accepts a raw hashed id, a media URL, or a full iframe embed string. */
function extractId(input: string): string {
  const m = input.match(/(?:medias\/|embed\/iframe\/|wistia_async_)([a-z0-9]+)/i);
  return (m ? m[1] : input).trim();
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function WistiaBackground({ id }: { id: string }) {
  const mediaId = extractId(id);
  const [mount, setMount] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 809px)").matches) return;
    const w = window as IdleWindow;
    const start = () => setMount(true);
    // requestIdleCallback for the fast path, plus a plain timeout backstop —
    // rIC can stall indefinitely in background tabs, setTimeout still fires.
    let idleHandle = 0;
    if (typeof w.requestIdleCallback === "function") {
      idleHandle = w.requestIdleCallback(start, { timeout: 2000 });
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
    "qualityMax=1080",
  ].join("&");
  const src = `https://fast.wistia.net/embed/iframe/${mediaId}?${params}`;

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: "#04070D" }}>
      {mount && (
        <iframe
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
            transition: "opacity 1.2s ease",
          }}
        />
      )}
    </div>
  );
}
