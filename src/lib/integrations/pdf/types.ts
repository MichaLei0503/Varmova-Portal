// PDF-Provider generiert das Angebots-PDF und gibt eine erreichbare URL zurück.
// Der Mock verweist auf die bestehende druckbare /offers/<id>-Seite (HTML mit Print-CSS).
// Der reale Provider rendert mit @react-pdf/renderer und legt das File in Vercel Blob ab.

export type OfferPdfInput = {
  offerId: string;
  offerNumber: string;
};

export interface PdfProvider {
  generateOfferPdf(input: OfferPdfInput): Promise<{ url: string }>;
}
