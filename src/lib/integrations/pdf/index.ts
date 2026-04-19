import { MockPdfProvider } from "./mock";
import { PdfProvider } from "./types";

// AP 1.7 liefert nur den Mock. AP 1.8 ergänzt einen realen React-PDF-Adapter,
// der per ENV-Variable PDF_PROVIDER="react-pdf" aktiviert wird.
export function getPdfProvider(): PdfProvider {
  return new MockPdfProvider();
}

export type { OfferPdfInput, PdfProvider } from "./types";
