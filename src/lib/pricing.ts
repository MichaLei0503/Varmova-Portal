import { ProductCatalog, ProjectScope } from "@prisma/client";

export type CalculatedOfferItem = {
  sku: string;
  label: string;
  description?: string | null;
  quantity: number;
  unitCents: number;
  totalCents: number;
  sortOrder: number;
};

export type PricingInput = {
  scope: ProjectScope;
  varmiSku: string;
  bufferSku?: string | null;
  newThermostats?: number;
  thermostatSku?: string | null;
  replaceHeaters?: number;
  heaterReplacementSku?: string | null;
  newMeterCabinet?: boolean;
  currentHeatingType?: string;
};

export type PriceSnapshot = {
  catalogValidFrom: string;
  vatRatePercent: number;
  items: ReadonlyArray<{ sku: string; priceCents: number; name: string }>;
};

export type OfferCalculation = {
  items: CalculatedOfferItem[];
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  snapshot: PriceSnapshot;
};

const VAT_RATE_PERCENT = 19;

// Bestimmt die Basis-SKUs je Auftragsumfang.
// Datenstruktur statt Switch: eine neue Variante = ein neuer Eintrag.
const SCOPE_BASE_SKUS: Record<ProjectScope, ReadonlyArray<string>> = {
  HYBRID: ["MONTAGE-STD", "ELEKTRO-INSTALL"],
  MONOVALENT_NO_STORAGE: ["MONTAGE-STD", "ELEKTRO-INSTALL"],
  MONOVALENT_WITH_STORAGE: ["MONTAGE-STD", "ELEKTRO-INSTALL"],
};

// Heizungs-Typ → Demontage-SKU. Kein Match = keine Demontage-Position.
const DEMONTAGE_SKU_BY_HEATING: Record<string, string> = {
  "Gas-Brennwert": "DEMONTAGE-GAS",
  Gasheizung: "DEMONTAGE-GAS",
  "Öl-Heizung": "DEMONTAGE-OEL",
  Ölheizung: "DEMONTAGE-OEL",
};

export function calculateOffer(input: PricingInput, catalog: ReadonlyArray<ProductCatalog>): OfferCalculation {
  const bySku = new Map(catalog.map((entry) => [entry.sku, entry]));

  const pick = (sku: string, quantity = 1): CalculatedOfferItem | null => {
    const entry = bySku.get(sku);
    if (!entry || quantity <= 0) return null;
    return {
      sku: entry.sku,
      label: entry.name,
      description: entry.description,
      quantity,
      unitCents: entry.priceCents,
      totalCents: entry.priceCents * quantity,
      sortOrder: 0,
    };
  };

  const candidates: Array<CalculatedOfferItem | null> = [
    pick(input.varmiSku),
    ...SCOPE_BASE_SKUS[input.scope].map((sku) => pick(sku)),
  ];

  if (input.scope === "MONOVALENT_WITH_STORAGE" && input.bufferSku) {
    candidates.push(pick(input.bufferSku));
  }

  if (input.currentHeatingType && DEMONTAGE_SKU_BY_HEATING[input.currentHeatingType]) {
    candidates.push(pick(DEMONTAGE_SKU_BY_HEATING[input.currentHeatingType]));
  }

  if (input.newThermostats && input.thermostatSku) {
    candidates.push(pick(input.thermostatSku, input.newThermostats));
  }

  if (input.replaceHeaters && input.heaterReplacementSku) {
    candidates.push(pick(input.heaterReplacementSku, input.replaceHeaters));
  }

  if (input.newMeterCabinet) {
    candidates.push(pick("ZAEHLERSCHRANK"));
  }

  const items = candidates
    .filter((item): item is CalculatedOfferItem => item !== null)
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));

  const subtotalCents = items.reduce((sum, item) => sum + item.totalCents, 0);
  const vatCents = Math.round((subtotalCents * VAT_RATE_PERCENT) / 100);
  const totalCents = subtotalCents + vatCents;

  const catalogValidFrom = earliestValidFrom(catalog, items.map((i) => i.sku));

  const snapshot: PriceSnapshot = {
    catalogValidFrom,
    vatRatePercent: VAT_RATE_PERCENT,
    items: items.map((item) => ({
      sku: item.sku,
      priceCents: item.unitCents,
      name: item.label,
    })),
  };

  return { items, subtotalCents, vatCents, totalCents, snapshot };
}

function earliestValidFrom(catalog: ReadonlyArray<ProductCatalog>, skus: ReadonlyArray<string>): string {
  const used = catalog.filter((entry) => skus.includes(entry.sku));
  if (used.length === 0) return new Date().toISOString();
  return used
    .map((entry) => entry.validFrom)
    .reduce((earliest, current) => (current < earliest ? current : earliest))
    .toISOString();
}
