import { OfferPdfInput, PdfProvider } from "./types";

// Mock: statt echter PDF-Generierung liefert der Provider die URL der druckbaren
// HTML-Angebotsseite. Der reale React-PDF-Adapter kommt in AP 1.8.
export class MockPdfProvider implements PdfProvider {
  async generateOfferPdf(input: OfferPdfInput): Promise<{ url: string }> {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    return { url: `${base}/offers/${input.offerId}` };
  }
}
