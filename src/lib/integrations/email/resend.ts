import { EmailProvider, SendEmailInput } from "./types";

/**
 * Resend-Provider (https://resend.com) — aktiv, sobald RESEND_API_KEY gesetzt ist.
 * Absender über EMAIL_FROM (verifizierte Domain), Fallback: Resend-Onboarding-Absender.
 */
export class ResendEmailProvider implements EmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly from: string = process.env.EMAIL_FROM || "Varmova Portal <onboarding@resend.dev>",
  ) {}

  async send(input: SendEmailInput): Promise<{ messageId: string }> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: [input.to],
        subject: input.subject,
        text: input.bodyText,
        ...(input.bodyHtml ? { html: input.bodyHtml } : {}),
      }),
    });

    if (!res.ok) {
      throw new Error(`Resend ${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as { id?: string };
    return { messageId: data.id ?? "resend-unknown" };
  }
}
