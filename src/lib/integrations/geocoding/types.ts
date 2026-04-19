// Austauschbarer Adapter (siehe Plan A.7). Domain-Code kennt nur dieses Interface,
// nie einen konkreten Provider.

export type Coordinates = { lat: number; lng: number };

export type AddressInput = {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
};

export interface GeocodingProvider {
  geocode(address: AddressInput): Promise<Coordinates | null>;
}
