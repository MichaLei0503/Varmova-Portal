/**
 * VARMI — single full-page component (sections A–K; site footer handled by Framer).
 * Framework-pure: plain React + scoped CSS, so the exact same code runs in the
 * local harness and inside Framer (see framer-entry.tsx).
 */
import { VarmiStyles } from "./styles";
import type { VarmiProps } from "./types";
import { Hero } from "./sections/Hero";
import { Energiefluss } from "./sections/Energiefluss";
import { Technologie } from "./sections/Technologie";
import { Installation } from "./sections/Installation";
import { Betriebsarten } from "./sections/Betriebsarten";
import { PasstAnders } from "./sections/PasstAnders";
import { SteuerungVerlass } from "./sections/SteuerungVerlass";
import { Daten } from "./sections/Daten";
import { FuerWen } from "./sections/FuerWen";
import { CTA } from "./sections/CTA";
import { FAQ } from "./sections/FAQ";

const CONTACT_URL = "https://anfrage-varmova.onepage.me/";

export function Varmi(props: VarmiProps) {
  // Contact CTAs are REAL LINKS to the request form (new tab). Framer's
  // EventHandler controls inject a handler even when nothing is bound, which
  // silently swallowed clicks — so links are the default and an explicitly
  // passed handler (code use only) takes over instead.
  const contactUrl = props.fallbackContactUrl || CONTACT_URL;
  const partnerUrl = props.fallbackPartnerUrl || CONTACT_URL;
  const onContact = props.onContactClick;
  const onPartner = props.onPartnerClick;

  const bleed = props.fullBleed !== false;
  return (
    <div className={bleed ? "varmi varmi--bleed" : "varmi"}>
      <VarmiStyles bleed={bleed} />
      <main>
        <Hero onContactClick={onContact} contactUrl={contactUrl} heroImage={props.heroImage} heroVideoId={props.heroVideoId ?? "efseenjfgh"} />
        <Energiefluss />
        <Technologie />
        <Installation />
        <Betriebsarten />
        <PasstAnders />
        <SteuerungVerlass />
        <Daten datasheetUrl={props.datasheetUrl} />
        <FuerWen onContactClick={onContact} onPartnerClick={onPartner} contactUrl={contactUrl} partnerUrl={partnerUrl} />
        <CTA onContactClick={onContact} contactUrl={contactUrl} />
        <FAQ onContactClick={onContact} contactUrl={contactUrl} />
      </main>
    </div>
  );
}

export default Varmi;
