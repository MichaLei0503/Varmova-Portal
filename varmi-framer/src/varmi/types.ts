/** Public props for the VARMI page component (become Framer property controls). */
export interface VarmiProps {
  /** Primary B2C CTA ("Beratung anfragen"). Defaults to the Onepage request form. */
  onContactClick?: () => void;
  /** B2B CTA ("Partner werden"). Defaults to the Onepage request form. */
  onPartnerClick?: () => void;

  /** Wistia media id for the hero background video (e.g. "dx12f5xdt00zmn9"). Takes priority over heroImage/vector. */
  heroVideoId?: string;
  /** Hero product render URL. Used when no video id is set. */
  heroImage?: string;

  /**
   * Technical datasheet (PDF) download URL.
   *
   * Set this via the Framer "Datenblatt (PDF)" File control — Framer uploads the
   * file and hosts it itself. There is deliberately NO default: an outdated
   * fallback PDF would contradict the spec table in §H, so the download button
   * simply hides until a file is attached.
   */
  datasheetUrl?: string;
  /** No-JS / fallback external targets. */
  fallbackContactUrl?: string;
  fallbackPartnerUrl?: string;

  /**
   * Span the full viewport width via the 100vw trick (default true).
   * The Framer entry sets this to false ON THE EDITOR CANVAS, where 100vw is
   * the editor window — not the breakpoint frame — and blew the layout apart.
   */
  fullBleed?: boolean;
}

const CONTACT_URL = "https://anfrage-varmova.onepage.me/";

export const VARMI_DEFAULTS: Required<
  Pick<VarmiProps, "fallbackContactUrl" | "fallbackPartnerUrl">
> = {
  fallbackContactUrl: CONTACT_URL,
  fallbackPartnerUrl: CONTACT_URL,
};
