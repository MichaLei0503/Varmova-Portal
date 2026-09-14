import { useEffect, useRef } from "react";

/**
 * Scroll-reveal (Layer A) — fail-safe progressive enhancement.
 *
 * The old version hid elements via CSS (`.varmi-reveal { opacity: 0 }`) and
 * relied on JS to un-hide them. In Framer that is fragile: static export,
 * delayed hydration or a suspended editor preview leave content permanently
 * invisible (the "black stripe" at the end of the page).
 *
 * New contract:
 *  - Content is VISIBLE by default (no-JS / pre-hydration / SSR safe).
 *  - Only once JS runs, elements that are still safely BELOW the fold get
 *    "armed" (hidden) and then revealed by an IntersectionObserver.
 *  - A passive scroll/resize fallback plus a hard timeout guarantee that an
 *    armed element can never stay invisible, even if the observer never fires.
 */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      el.classList.add("is-in");
      return;
    }

    // Element already on screen (or close to it) → keep it visible, no arming.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add("is-in");
      return;
    }

    el.classList.add("varmi-armed");

    let revealed = false;
    let io: IntersectionObserver | null = null;
    let timeoutId = 0;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.add("is-in");
      cleanup();
    };

    // Fallback: plain scroll check in case the observer never delivers.
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
    // Absolute last resort: never allow content to stay hidden forever.
    timeoutId = window.setTimeout(reveal, 6000);

    return () => {
      cleanup();
      // Strict/re-mount: leave the element visible, never hidden.
      el.classList.remove("varmi-armed");
    };
  }, [delay]);

  return ref;
}
