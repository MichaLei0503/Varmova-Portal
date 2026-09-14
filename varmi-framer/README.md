# VARMI — Produktseite als Framer-Code-Component

Eine eigenständige, Apple-artige Scroll-Story für **VARMI** (Varmova UG), umgesetzt als **eine** Full-Page Framer Code Component. Framework-pur (React 18 + `framer-motion` + scoped CSS), passend zur Live-Optik von varmova.de (Night `#04070D`, Copper `#E8A260`, Inter + Instrument Serif, Gradient-Text-Fill).

Sektionen in Reihenfolge: **A** Hero · **B** Energiefluss (Signature-Scroll) · **C** Technologie · **D** Installation · **E** Betriebsarten · **F** Passt/Anders · **G** Steuerung & Verlässlichkeit · **H** Technische Daten · **I** Für wen · **J** CTA · **K** FAQ · **L** Footer.

---

## 1. Einbau in Framer (empfohlen: Single-File-Bundle)

1. In deinem Framer-Projekt: **Assets → Code → Create Code File**, Name z. B. `Varmi`.
2. Inhalt von **`framer-dist/Varmi.framer.tsx`** komplett hineinkopieren (ein File, ~85 kb; `react` und `framer` sind in Framer bereits vorhanden und werden nicht mitgebündelt).
3. Neue, **leere, vollbreite Page** anlegen. Die Component `Varmi` aus dem Insert-Menü auf die Page ziehen, Breite **Fill**, Höhe **Auto**.
4. Im rechten Panel erscheinen die Property-Controls (Bilder, Datenblatt, CTA-Events – siehe §3/§4).

> Bundle neu erzeugen nach Code-Änderungen: `npm run build:framer` (baut Varmi **und** Kooperation).
>
> ⚠️ Das Build-Rezept ist empfindlich: esbuild muss mit **`--jsx=preserve`** laufen, die Imports werden
> danach von `scripts/merge-imports.cjs` nach oben gezogen und der Default-Export von
> `scripts/fix-default-export.cjs` auf `export default VarmiPage;` umgeschrieben. Ein transpiliertes
> Bundle (`React.createElement`) oder ein `export { X as default }` wird von Framer **stillschweigend
> ignoriert** — die Component taucht dann einfach nicht im Dropdown auf, ohne Fehlermeldung.

### Alternative: Multi-File-Quelle
Der lesbare Quellcode liegt unter `src/varmi/` (Tokens, Komponenten, Sektionen, SVG). Framer unterstützt mehrere Code-Files mit relativen Imports – du kannst die Struktur 1:1 nachbauen und `src/framer-entry.tsx` als Entry verwenden. Für die meisten Fälle ist das Single-File-Bundle einfacher.

---

## 2. Wichtige Architektur-Hinweise (Framer-spezifisch)

Bewusste Abweichungen von der v3-Spec, weil Framer die Seite selbst rendert/scrollt:

- **Kein Lenis, kein framer-motion.** Framer steuert den Seiten-Scroll (inkl. Smooth-Scroll). Der Signature-Moment §B nutzt einen einfachen Window-Scroll-Listener → `progress`-State → SVG `stroke-dashoffset` + `position: sticky`. `framer-motion` wurde bewusst entfernt: dessen `.animate()` wirft in diesem Framer-Projekt „Offsets must be null or in the range [0,1]". Der Hero-Intro läuft über CSS-Keyframes.
- **Kein Tailwind / kein `/api/lead`.** Styling über scoped CSS (`.varmi`-Klasse, injiziert von der Component). Lead-Erfassung über native Framer-Forms (§4).
- **`prefers-reduced-motion`** wird respektiert: §B fällt auf das statische Endbild (alle Leitungen gefüllt) + Stichworte als Liste; Reveals nur als Opacity.

§B selbst ist **300vh** hoch mit einer gepinnten 100vh-Bühne. Lege die Component auf eine normale (nicht fixierte) Page; nichts Weiteres ist nötig.

---

## 3. Property-Controls

| Control | Typ | Zweck |
|---|---|---|
| `fallbackContactUrl` („Kontakt-URL") | Link | Ziel aller B2C-CTAs („Beratung anfragen", „Frage stellen"). Leer = Onepage-Formular |
| `fallbackPartnerUrl` („Partner-URL") | Link | Ziel des B2B-CTA („Partner werden"). Leer = Onepage-Formular |
| `heroImage` | Image | Freigestellter Produkt-Render (Hero) |
| `schnittImage` | Image | ISO-Schnitt mit Komponenten ①–⑤ (Technologie) |
| `energieflussImage` | Image | optional, Hintergrund §B |
| `appImage` | Image | optional, App-/Display-Mockup |
| `datasheetUrl` | File (PDF) | „Technisches Datenblatt (PDF)" Download (§H). **Datei hier hochladen — Framer hostet sie selbst**, kein Dropbox-Link nötig. Ohne Datei blendet sich der Button aus (statt auf ein veraltetes PDF zu zeigen). Aktuelle Datei: `neues Datenblatt und Änderungen/Technisches_Datenblatt_VARMI_07-2026.pdf` |
| `fallbackContactUrl` / `fallbackPartnerUrl` | Link | Fallback, falls kein Event gebunden |

Ohne gesetztes Bild zeigt die Component einen sauberen Platzhalter mit korrektem `aspect-ratio` (kein Layout-Shift).

---

## 4. Leads

**Standard (aktiv):** Alle Kontakt-CTAs sind echte Links (neuer Tab) auf das Onepage-Anfrageformular (`https://anfrage-varmova.onepage.me/`), überschreibbar über die Link-Controls (§3).

> ⚠️ Die frühere EventHandler-Variante (`onContactClick`/`onPartnerClick` als Framer-Controls) wurde entfernt: Framer injiziert für registrierte EventHandler-Controls auch dann einen Handler, wenn im Panel **nichts** gebunden ist — dadurch verpufften alle CTA-Klicks stumm. Die Props existieren im Code weiterhin für programmatische Nutzung.

### Alternative: native Framer-Forms (Overlays)

Aus Custom-Code kann man **nicht** in Framers Form-System posten. Wer Leads in Framer sammeln will, müsste die EventHandler-Controls in `src/framer-entry.tsx` reaktivieren und wie folgt verbinden:

1. Zwei **Overlays** anlegen: `Kontaktformular` und `Partnerformular`.
2. Darin je eine native **Form** mit diesen Feldern:
   - **Kontakt:** Name\* · E-Mail\* · Telefon · PLZ\* (5-stellig) · „Womit heizen Sie aktuell?" (Select: Öl/Gas/Nachtspeicher/Hybrid) · Nachricht · Einwilligung\* (Checkbox + Datenschutz-Link). Success: „Anfrage gesendet. Wir melden uns innerhalb eines Werktags."
   - **Partner:** Firma\* · Ansprechpartner\* · E-Mail\* · Telefon\* · Heizungs-Projekte/Jahr (Select: <20 / 20–50 / 50+) · Nachricht · Einwilligung\*. Success: „Danke. Unser Partner-Team meldet sich."
3. Form-Submissions in Framer auf **E-Mail / Google-Sheet / Webhook** leiten (Form → „Send To"). Für DSGVO: Einwilligungs-Checkbox + Datenschutz-Link.
4. Die Component-Events binden: Layer mit `Varmi` wählen → Interaktion `onContactClick` → **Open Overlay → Kontaktformular**; `onPartnerClick` → **Open Overlay → Partnerformular**.

> Variante „alles in Code" (Modals mit Feldern als Code, Submit an eine Webhook-URL-Prop) ist möglich – sag Bescheid, dann ergänze ich `ContactModal`/`PartnerModal` + `leadWebhookUrl`-Control.

---

## 5. Assets, die der Kunde liefert

- `hero-anlage-render` (freigestellt, ~4/3) · `varmi-schnitt-render` (ISO-Schnitt ①–⑤)
- optional `energiefluss_render`, App-/Display-Mockup
- `Technisches_Datenblatt_VARMI_07-2026.pdf` — liegt bereits unter `neues Datenblatt und Änderungen/` (Seiten 5–7 der Broschüre: Spezifikationen, technische Zeichnungen, Kontakt)
- `varmi-og.png` (1200×630) fürs Social-Preview

Die Energiefluss-Szene (§B) und der Tagesverlauf-Chart sind **vollständig als SVG im Code** – kein Bild nötig.

---

## 6. SEO / Meta (in Framer: Page-Settings + Custom-Code `<head>`)

```html
<title>Varmi — Einfach. Intelligent. Warm. | Das elektrische Heizsystem von Varmova</title>
<meta name="description" content="Varmi ist die Wärmewende ohne Großbaustelle: an einem Tag installiert, ohne Außeneinheit, kompatibel mit Ihrer bestehenden Heizung und smart genug, günstige Stromzeiten automatisch zu nutzen.">
<link rel="canonical" href="https://www.varmova.de/varmi">
<meta property="og:type" content="website">
<meta property="og:title" content="Varmi — Einfach. Intelligent. Warm.">
<meta property="og:description" content="Die alternative Heiztechnologie für Altbau, Denkmal und alle Häuser, wo keine Wärmepumpe passt.">
<meta property="og:image" content="https://www.varmova.de/assets/varmi-og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index,follow,max-image-preview:large">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Varmi",
  "brand": { "@type": "Brand", "name": "Varmova" },
  "manufacturer": { "@type": "Organization", "name": "Varmova UG" },
  "category": "Elektrisches Heizsystem",
  "description": "Elektrisches Heizsystem mit Thermofluid-Technologie. An einem Tag installiert, ohne Außeneinheit, kompatibel mit bestehender Anlage, PV- und börsenstrom-ready."
}
</script>
```
Anker-IDs sind bereits gesetzt: `#hero #energiefluss #technologie #installation #betriebsarten #passt-anders #steuerung-verlass #daten #fuer-wen #faq`.

**Rechtliches:** Alle technischen Werte in §H stammen aus dem **Technischen Datenblatt VARMI, Stand 07/2026** (`neues Datenblatt und Änderungen/Varmova-Broschuere_inkl_Datenblatt.pdf`) und tragen dort den Pflicht-Disclaimer (Herstellerangaben, normative Verifizierung vor Projektierung, CE-Unterlagen auf Anfrage). Der Einsparungs-Claim (§B, „30–50 %") trägt die Pflicht-Fußnote ¹, die Garantie-Aussage (§G) die Fußnote ². Ein COP-Wert wird **nicht** mehr ausgewiesen — das Datenblatt nennt stattdessen einen Effizienzfaktor von 1,8 – 2,2.

---

## 7. Lokale Entwicklung & visuelle Verifikation

```bash
npm install
npm run dev            # Vite-Harness auf :5173
```
Verify-Modi (URL-Parameter):
- `/?only=<id>` – eine Sektion isoliert oben rendern (z. B. `/?only=daten`)
- `/?scene=<0..1>` – die §B-Energiefluss-Szene bei fixem Scroll-Progress
- `/?flat=1` – Scroll-Reveals deaktivieren

Der Harness (`src/main.tsx`) ist nur fürs lokale Testen; in Framer wird ausschließlich die Component genutzt. `npx tsc --noEmit -p tsconfig.app.json` läuft fehlerfrei.
