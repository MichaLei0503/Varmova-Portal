import { MockGeocodingProvider } from "./mock";
import { OpenRouteServiceProvider } from "./openroute";
import { GeocodingProvider } from "./types";

// Factory liest ENV-Config und liefert die passende Implementierung.
// Ohne OPENROUTESERVICE_API_KEY wird der Mock genutzt (für lokale Entwicklung).
export function getGeocodingProvider(): GeocodingProvider {
  const key = process.env.OPENROUTESERVICE_API_KEY;
  if (key && key.length > 0) return new OpenRouteServiceProvider(key);
  return new MockGeocodingProvider();
}

export type { AddressInput, Coordinates, GeocodingProvider } from "./types";
