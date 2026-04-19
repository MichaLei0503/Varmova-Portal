export type SendEmailInput = {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
};

export interface EmailProvider {
  send(input: SendEmailInput): Promise<{ messageId: string }>;
}
