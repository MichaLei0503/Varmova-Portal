import { addPropertyControls, ControlType, RenderTarget } from "framer";
import Kooperation from "./varmi/kooperation/Kooperation";
import type { KooperationProps } from "./varmi/kooperation/Kooperation";

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
 * VARMI Kooperation — Framer code component (single full-page, full-bleed).
 * Place on a blank page (e.g. /kooperation). All CTAs link to the Onepage lead form.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 4200
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerDisableUnlink
 */
export default function KooperationPage(props: KooperationProps) {
  return <Kooperation {...props} fullBleed={!onCanvas()} />;
}

addPropertyControls(KooperationPage, {
  partnerUrl: { type: ControlType.Link, title: "Partner-URL (Onepage)" },
  email: { type: ControlType.String, title: "Kontakt-E-Mail", defaultValue: "info@varmova.de" },
});
