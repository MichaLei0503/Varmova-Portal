import crypto from "node:crypto";

/**
 * Lead-Funnel-Mails (FA-FUNNEL): Double-Opt-in und Willkommensmail.
 *
 * Versand über die Resend-HTTP-API (kein SDK, keine zusätzliche Dependency).
 * Benötigte Umgebungsvariablen:
 *   RESEND_API_KEY  — API-Key aus dem Resend-Dashboard (Domain varmova.de verifizieren!)
 *   LEAD_MAIL_FROM  — Absender, z. B. `Varmova <anfrage@varmova.de>` (Default unten)
 *   LEAD_DOI_SECRET — Secret für die Signatur der Bestätigungslinks
 *                     (Fallback: NEXTAUTH_SECRET)
 *   APP_BASE_URL    — öffentliche Basis-URL des Portals, z. B. https://varmova-portal.vercel.app
 *                     (Fallback: NEXTAUTH_URL, dann VERCEL_URL)
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Varmova <anfrage@varmova.de>";
const DOI_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

// ---------------------------------------------------------------------------
// Double-Opt-in-Token: HMAC-signiert, kein zusätzliches DB-Feld nötig.
// Format: base64url(leadId|expiresAtMs) + "." + hmacSha256
// ---------------------------------------------------------------------------

function doiSecret(): string {
  const secret = process.env.LEAD_DOI_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("LEAD_DOI_SECRET oder NEXTAUTH_SECRET muss gesetzt sein");
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", doiSecret()).update(payload).digest("base64url");
}

export function createDoiToken(leadId: string, now = Date.now()): string {
  const payload = Buffer.from(`${leadId}|${now + DOI_TTL_MS}`).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyDoiToken(token: string): { leadId: string } | { error: "invalid" | "expired" } {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { error: "invalid" };
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { error: "invalid" };
  const decoded = Buffer.from(payload, "base64url").toString("utf8");
  const sep = decoded.lastIndexOf("|");
  if (sep < 1) return { error: "invalid" };
  const leadId = decoded.slice(0, sep);
  const expiresAt = Number(decoded.slice(sep + 1));
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return { error: "expired" };
  return { leadId };
}

export function appBaseUrl(): string {
  const explicit = process.env.APP_BASE_URL || process.env.NEXTAUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// ---------------------------------------------------------------------------
// Versand
// ---------------------------------------------------------------------------

type SendResult = { sent: true } | { sent: false; reason: string };

async function sendMail(to: string, subject: string, html: string, text: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[leadMail] RESEND_API_KEY fehlt — Mail nicht versendet:", subject);
    return { sent: false, reason: "RESEND_API_KEY fehlt" };
  }
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_MAIL_FROM || DEFAULT_FROM,
      to: [to],
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[leadMail] Versand fehlgeschlagen:", res.status, body);
    return { sent: false, reason: `Resend ${res.status}` };
  }
  return { sent: true };
}

// ---------------------------------------------------------------------------
// Templates — Varmova-CI: Inter/Arial, Night #05070D, Copper #E8A260,
// Sie-Form, kein Emoji, ruhiger Ton. E-Mail-sicher als Tabellenlayout.
// ---------------------------------------------------------------------------

function mailShell(contentHtml: string): string {
  return `<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F8FB;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FB;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:94%;">
        <tr>
          <td style="background:#05070D;border-radius:16px 16px 0 0;padding:26px 40px;">
            <span style="font-family:Inter,Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.02em;color:#FFFFFF;">Varmova</span>
            <span style="font-family:Inter,Arial,sans-serif;font-size:11px;letter-spacing:0.16em;color:#E8A260;text-transform:uppercase;padding-left:12px;">Next Gen Heating</span>
          </td>
        </tr>
        <tr>
          <td style="background:#FFFFFF;border-radius:0 0 16px 16px;padding:40px;">
            ${contentHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;font-family:Inter,Arial,sans-serif;font-size:11px;line-height:1.6;color:#908F94;">
            Varmova UG (haftungsbeschränkt) · Am Weiher 1 · 85435 Erding · Deutschland<br>
            info@varmova.de · Tel. 08122-5538050 · Geschäftsführer: Markus Januschkowetz<br>
            Amtsgericht München, HRB 309125 · USt-ID DE460335598
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const P = `font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.65;color:#454449;margin:0 0 16px;`;
const H = `font-family:Inter,Arial,sans-serif;font-size:22px;line-height:1.3;letter-spacing:-0.02em;color:#05070D;font-weight:700;margin:0 0 18px;`;

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;"><tr>
    <td style="border-radius:999px;background:#05070D;">
      <a href="${href}" style="display:inline-block;padding:14px 32px;font-family:Inter,Arial,sans-serif;font-size:15px;font-weight:600;color:#E8A260;text-decoration:none;border-radius:999px;">${label}</a>
    </td>
  </tr></table>`;
}

/**
 * Double-Opt-in-Mail. Rechtlich bewusst werbefrei: nur Bestätigungszweck,
 * keine Produktwerbung (BGH-Anforderung an DOI-Mails).
 */
export async function sendDoiMail(params: {
  to: string;
  firstName: string;
  leadId: string;
}): Promise<SendResult> {
  const confirmUrl = `${appBaseUrl()}/api/leads/confirm?t=${encodeURIComponent(createDoiToken(params.leadId))}`;
  const subject = "Bitte bestätigen Sie Ihre Anfrage bei Varmova";
  const html = mailShell(`
    <h1 style="${H}">Nur noch ein Klick</h1>
    <p style="${P}">Guten Tag ${escapeHtml(params.firstName)},</p>
    <p style="${P}">vielen Dank für Ihre Anfrage. Bitte bestätigen Sie kurz Ihre E-Mail-Adresse, damit wir Ihre Anfrage bearbeiten und Sie kontaktieren dürfen.</p>
    ${ctaButton(confirmUrl, "E-Mail-Adresse bestätigen")}
    <p style="${P}">Der Link ist 7 Tage gültig. Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail einfach — es passiert dann nichts, Ihre Daten werden nicht weiterverarbeitet.</p>
    <p style="${P}margin-bottom:0;">Ihr Varmova-Team</p>
  `);
  const text = `Guten Tag ${params.firstName},

vielen Dank für Ihre Anfrage. Bitte bestätigen Sie Ihre E-Mail-Adresse, damit wir Ihre Anfrage bearbeiten und Sie kontaktieren dürfen:

${confirmUrl}

Der Link ist 7 Tage gültig. Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail einfach.

Ihr Varmova-Team

Varmova UG (haftungsbeschränkt) · Am Weiher 1 · 85435 Erding
info@varmova.de · Tel. 08122-5538050`;
  return sendMail(params.to, subject, html, text);
}

/** Willkommensmail nach erfolgreicher Bestätigung, je Segment. */
export async function sendWelcomeMail(params: {
  to: string;
  firstName: string;
  segment: "B2C" | "B2B";
}): Promise<SendResult> {
  const isB2B = params.segment === "B2B";
  const subject = isB2B
    ? "Ihre Kooperationsanfrage bei Varmova — die nächsten Schritte"
    : "Ihre Anfrage bei Varmova — die nächsten Schritte";
  const nextSteps = isB2B
    ? `<p style="${P}">Ihre Anfrage liegt jetzt bei unserem Partner-Team. Wir melden uns innerhalb von zwei Werktagen bei Ihnen, um ein persönliches Gespräch zu vereinbaren — mit der vollständigen Partner-Rechnung, den Konditionen und den nächsten Schritten zur Zertifizierung.</p>
       <p style="${P}">Vorab in Kürze: ein Montagetag, zwei Monteure, planbare Roherträge — und Kundenanfragen aus Ihrer Region liefern wir dazu.</p>`
    : `<p style="${P}">Ihre Anfrage liegt jetzt bei uns. Ein zertifizierter Varmi-Fachpartner aus Ihrer Region meldet sich innerhalb von zwei Werktagen bei Ihnen — mit einer ehrlichen Ersteinschätzung, ob Varmi zu Ihrem Gebäude passt.</p>
       <p style="${P}">Varmi wird an einem Tag eingebaut, kommt ohne Außeneinheit aus und ist förderungsunabhängig — der Preis steht ohne Antrag und ohne Wartezeit.</p>`;
  const html = mailShell(`
    <h1 style="${H}">Vielen Dank — Ihre E-Mail ist bestätigt.</h1>
    <p style="${P}">Guten Tag ${escapeHtml(params.firstName)},</p>
    ${nextSteps}
    <p style="${P}">Mehr über Varmova und Varmi finden Sie auf <a href="https://www.varmova.de" style="color:#05070D;font-weight:600;">varmova.de</a>.</p>
    <p style="${P}margin-bottom:0;">Einfach. Intelligent. Warm.<br>Ihr Varmova-Team</p>
  `);
  const text = `Guten Tag ${params.firstName},

Ihre E-Mail-Adresse ist bestätigt. ${
    isB2B
      ? "Unser Partner-Team meldet sich innerhalb von zwei Werktagen bei Ihnen, um ein persönliches Gespräch zu vereinbaren."
      : "Ein zertifizierter Varmi-Fachpartner aus Ihrer Region meldet sich innerhalb von zwei Werktagen bei Ihnen."
  }

Mehr über Varmova und Varmi: https://www.varmova.de

Einfach. Intelligent. Warm.
Ihr Varmova-Team`;
  return sendMail(params.to, subject, html, text);
}

/** Interne Benachrichtigung an das Varmova-Team über einen neuen Funnel-Lead.
 *  Geht immer an info@varmova.de, sofern nicht per LEAD_NOTIFY_EMAIL überschrieben. */
export async function sendTeamNotification(params: {
  leadId: string;
  segment: "B2C" | "B2B";
  name: string;
  email: string;
  summary: string;
}): Promise<SendResult> {
  const to = process.env.LEAD_NOTIFY_EMAIL || "info@varmova.de";
  const subject = `Neuer ${params.segment}-Lead über den Funnel: ${params.name}`;
  const portalUrl = `${appBaseUrl()}/leads`;
  const html = mailShell(`
    <h1 style="${H}">Neuer ${params.segment}-Lead</h1>
    <p style="${P}"><strong>${escapeHtml(params.name)}</strong> · ${escapeHtml(params.email)}</p>
    <p style="${P}white-space:pre-line;">${escapeHtml(params.summary)}</p>
    ${ctaButton(portalUrl, "Im Lead-CRM öffnen")}
  `);
  return sendMail(to, subject, html, `${params.name} · ${params.email}\n\n${params.summary}\n\n${portalUrl}`);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
