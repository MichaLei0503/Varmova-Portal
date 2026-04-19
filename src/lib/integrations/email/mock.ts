import { EmailProvider, SendEmailInput } from "./types";

// Mock schreibt die Nachricht ins Server-Log und liefert eine synthetische Message-ID.
// Echte Provider (SendGrid, AWS SES) kommen in AP 1.8 / Phase 2 an dieses Interface.
export class MockEmailProvider implements EmailProvider {
  async send(input: SendEmailInput): Promise<{ messageId: string }> {
    const messageId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    console.log("[mock-email]", {
      messageId,
      to: input.to,
      subject: input.subject,
      bodyPreview: input.bodyText.slice(0, 120),
    });
    return { messageId };
  }
}
