import { AddressInput, Coordinates, GeocodingProvider } from "./types";

// OpenRouteService (Pelias Geocoder): https://openrouteservice.org/dev/#/api-docs/geocode/search
// Kostenlos bis 2000 Requests/Tag, EU-gehostet.
// Attribution gemäß FA-ANG-053 in UI und PDF-Fußzeile.

const ORS_BASE = "https://api.openrouteservice.org/geocode/search";

export class OpenRouteServiceProvider implements GeocodingProvider {
  constructor(private readonly apiKey: string) {}

  async geocode(address: AddressInput): Promise<Coordinates | null> {
    const query = [
      `${address.street} ${address.houseNumber}`,
      `${address.postalCode} ${address.city}`,
    ].join(", ");

    const url = new URL(ORS_BASE);
    url.searchParams.set("api_key", this.apiKey);
    url.searchParams.set("text", query);
    url.searchParams.set("boundary.country", "DEU");
    url.searchParams.set("size", "1");

    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) {
      throw new Error(`OpenRouteService geocode failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      features?: Array<{ geometry?: { coordinates?: [number, number] } }>;
    };
    const coords = payload.features?.[0]?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;

    // ORS liefert [lng, lat] — wir drehen auf Branchenstandard {lat, lng}.
    return { lng: coords[0], lat: coords[1] };
  }
}
