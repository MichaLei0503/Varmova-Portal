import { addPropertyControls, ControlType, RenderTarget } from "framer";
import Varmi from "./varmi/Varmi";
import type { VarmiProps } from "./varmi/types";

/** True while rendering on the Framer editor canvas — there 100vw is the editor
 *  window (not the breakpoint frame), so the full-bleed trick must be off. */
function onCanvas(): boolean {
  try {
    return RenderTarget.current() === RenderTarget.canvas;
  } catch {
    return false;
  }
}

/**
 * VARMI — Framer code component (single full-page).
 *
 * Place on a blank, full-width page. Bind `onContactClick` / `onPartnerClick`
 * to "Open Overlay → Kontaktformular / Partnerformular" (native Framer Forms)
 * so leads land in Framer's submissions. Supply the product renders via the
 * image controls.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 6400
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerDisableUnlink
 */
export default function VarmiPage(props: VarmiProps) {
  return <Varmi {...props} fullBleed={!onCanvas()} />;
}

// NOTE: deliberately NO EventHandler controls. Framer injects a handler for
// registered EventHandler controls even when nothing is bound in the panel —
// that swallowed every contact-CTA click. The CTAs are plain links now.
addPropertyControls(VarmiPage, {
  heroVideoId: { type: ControlType.String, title: "Hero-Video (Wistia-ID)", placeholder: "leer = Vektor-Grafik", defaultValue: "efseenjfgh" },
  heroImage: { type: ControlType.Image, title: "Hero-Render (ohne Video)" },
  datasheetUrl: { type: ControlType.File, title: "Datenblatt (PDF)", allowedFileTypes: ["pdf"] },
  fallbackContactUrl: { type: ControlType.Link, title: "Kontakt-URL (Formular)" },
  fallbackPartnerUrl: { type: ControlType.Link, title: "Partner-URL" },
});
