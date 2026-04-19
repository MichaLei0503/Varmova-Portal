import { MockEmailProvider } from "./mock";
import { EmailProvider } from "./types";

export function getEmailProvider(): EmailProvider {
  return new MockEmailProvider();
}

export type { EmailProvider, SendEmailInput } from "./types";
