import { MockEmailProvider } from "./mock";
import { ResendEmailProvider } from "./resend";
import { EmailProvider } from "./types";

export function getEmailProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) return new ResendEmailProvider(apiKey);
  return new MockEmailProvider();
}

export type { EmailProvider, SendEmailInput } from "./types";
