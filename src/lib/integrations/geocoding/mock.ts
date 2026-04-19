import { AddressInput, Coordinates, GeocodingProvider } from "./types";

// Deterministischer Mock-Provider für Dev/Test ohne ORS-API-Key.
// Erstes PLZ-Leitziffer → Großstadt-Zentrum. Gut genug, um Matching- und
// Sortierlogik vor der echten API-Integration zu testen.
const PLZ_LEITZIFFER_TO_CITY: Record<string, Coordinates> = {
  "0": { lat: 51.0504, lng: 13.7373 }, // Dresden
  "1": { lat: 52.5200, lng: 13.4050 }, // Berlin
  "2": { lat: 53.5511, lng: 9.9937 }, // Hamburg
  "3": { lat: 52.3759, lng: 9.7320 }, // Hannover
  "4": { lat: 51.5136, lng: 7.4653 }, // Dortmund
  "5": { lat: 50.9375, lng: 6.9603 }, // Köln
  "6": { lat: 50.1109, lng: 8.6821 }, // Frankfurt
  "7": { lat: 48.7758, lng: 9.1829 }, // Stuttgart
  "8": { lat: 48.1351, lng: 11.5820 }, // München
  "9": { lat: 49.4521, lng: 11.0767 }, // Nürnberg
};

export class MockGeocodingProvider implements GeocodingProvider {
  async geocode(address: AddressInput): Promise<Coordinates | null> {
    const leit = address.postalCode.charAt(0);
    return PLZ_LEITZIFFER_TO_CITY[leit] ?? null;
  }
}
