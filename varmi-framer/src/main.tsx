import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import Varmi from "./varmi/Varmi";
import Kooperation from "./varmi/kooperation/Kooperation";
import { VarmiStyles } from "./varmi/styles";
import { EnergieflussScene } from "./varmi/svg/EnergieflussScene";
import { VLogo } from "./varmi/svg/VLogo";
import { VarmiProduct } from "./varmi/svg/VarmiProduct";
import { Hero } from "./varmi/sections/Hero";
import { Energiefluss } from "./varmi/sections/Energiefluss";
import { Technologie } from "./varmi/sections/Technologie";
import { Installation } from "./varmi/sections/Installation";
import { Betriebsarten } from "./varmi/sections/Betriebsarten";
import { PasstAnders } from "./varmi/sections/PasstAnders";
import { SteuerungVerlass } from "./varmi/sections/SteuerungVerlass";
import { Daten } from "./varmi/sections/Daten";
import { FuerWen } from "./varmi/sections/FuerWen";
import { CTA } from "./varmi/sections/CTA";
import { FAQ } from "./varmi/sections/FAQ";
import "./harness.css";

/**
 * Local verification harness.
 * - default: full page
 * - ?only=<id>: render a single section at the top (reliable screenshots,
 *   avoids the preview capture clipping tall pages)
 * - ?flat=1: disable scroll reveals (everything visible immediately)
 */
const params = new URLSearchParams(location.search);
const only = params.get("only");
const scene = params.get("scene");
const logo = params.get("logo");
const page = params.get("page");
const flat = params.get("flat") === "1" || only != null;

const onContact = () => console.log("[harness] open Kontaktformular");
const onPartner = () => console.log("[harness] open Partnerformular");
const HARNESS_URL = "https://anfrage-varmova.onepage.me/";

const SECTIONS: Record<string, ReactNode> = {
  hero: <Hero onContactClick={onContact} contactUrl={HARNESS_URL} heroVideoId="efseenjfgh" />,
  energiefluss: <Energiefluss />,
  technologie: <Technologie />,
  installation: <Installation />,
  betriebsarten: <Betriebsarten />,
  "passt-anders": <PasstAnders />,
  "steuerung-verlass": <SteuerungVerlass />,
  daten: <Daten />,
  "fuer-wen": <FuerWen onContactClick={onContact} onPartnerClick={onPartner} contactUrl={HARNESS_URL} partnerUrl={HARNESS_URL} />,
  cta: <CTA onContactClick={onContact} contactUrl={HARNESS_URL} />,
  faq: <FAQ onContactClick={onContact} contactUrl={HARNESS_URL} />,
};

function SingleSection({ id }: { id: string }) {
  return (
    <div className="varmi">
      <VarmiStyles />
      {SECTIONS[id] ?? <div style={{ padding: 40, color: "#fff" }}>Unknown section: {id}</div>}
    </div>
  );
}

function SceneProbe({ p }: { p: number }) {
  return (
    <div className="varmi" style={{ padding: 24 }}>
      <VarmiStyles />
      <div style={{ maxWidth: 760, margin: "0 auto", aspectRatio: "800 / 500", background: "#04070D" }}>
        <EnergieflussScene progress={p} reduced={false} />
      </div>
      <p style={{ color: "#E8A260", textAlign: "center", marginTop: 12 }}>progress = {p}</p>
    </div>
  );
}

const FlatStyle = () => (
  <style>{`.varmi-reveal{opacity:1!important;transform:none!important;transition:none!important;}`}</style>
);

const container = document.getElementById("root")!;
const g = window as unknown as { __varmiRoot?: ReturnType<typeof createRoot> };
const root = g.__varmiRoot ?? (g.__varmiRoot = createRoot(container));
root.render(
  <StrictMode>
    {flat && <FlatStyle />}
    {logo != null ? (
      <div style={{ background: "#04070D", padding: 40, minHeight: "100vh" }}>
        <div style={{ width: logo === "prod" ? 600 : 360, margin: "0 auto" }}>
          {logo === "prod" ? <VarmiProduct /> : <VLogo glow />}
        </div>
      </div>
    ) : scene != null ? (
      <SceneProbe p={Number(scene)} />
    ) : only ? (
      <SingleSection id={only} />
    ) : page === "kooperation" ? (
      <Kooperation />
    ) : (
      /* Like in Framer: no handlers bound → all contact CTAs are real links. */
      <Varmi />
    )}
  </StrictMode>
);
