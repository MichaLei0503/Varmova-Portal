import { PricingConfig } from "@prisma/client";

export type PricingInput = {
  productName: string;
  livingAreaSqm: number;
  annualEnergyConsumption?: number | null;
  hasPv: boolean;
  hasStorage: boolean;
};

export type CalculatedOfferItem = {
  label: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sortOrder: number;
};

function asNumber(value: PricingConfig[keyof PricingConfig]) {
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

export function calculateOffer(input: PricingInput, config: PricingConfig) {
  const items: CalculatedOfferItem[] = [
    {
      label: input.productName,
      quantity: 1,
      unitPrice: asNumber(config.basePrice),
      totalPrice: asNumber(config.basePrice),
      sortOrder: 1,
    },
    {
      label: "Installationspauschale",
      quantity: 1,
      unitPrice: asNumber(config.installationFlatFee),
      totalPrice: asNumber(config.installationFlatFee),
      sortOrder: 2,
    },
  ];

  if (input.hasPv) {
    items.push({
      label: "PV-Integration",
      description: "Einbindung vorhandener PV-Anlage in das Varmi Gesamtsystem",
      quantity: 1,
      unitPrice: asNumber(config.pvIntegrationPrice),
      totalPrice: asNumber(config.pvIntegrationPrice),
      sortOrder: 3,
    });
  }

  if (input.hasStorage) {
    items.push({
      label: "Speicherintegration",
      description: "Berücksichtigung eines vorhandenen Energiespeichers",
      quantity: 1,
      unitPrice: asNumber(config.storageIntegrationPrice),
      totalPrice: asNumber(config.storageIntegrationPrice),
      sortOrder: 4,
    });
  }

  if ((input.annualEnergyConsumption ?? 0) > 25000) {
    items.push({
      label: "Energieanalyse",
      description: "Erweiterte Vorprüfung bei erhöhtem Energieverbrauch",
      quantity: 1,
      unitPrice: asNumber(config.energyAuditPrice),
      totalPrice: asNumber(config.energyAuditPrice),
      sortOrder: 5,
    });
  }

  if (input.livingAreaSqm > config.largeHouseThreshold) {
    items.push({
      label: `Objektzuschlag > ${config.largeHouseThreshold} m²`,
      description: "Zusätzlicher Projektaufwand bei größeren Objekten",
      quantity: 1,
      unitPrice: asNumber(config.largeHouseSurcharge),
      totalPrice: asNumber(config.largeHouseSurcharge),
      sortOrder: 6,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    subtotal,
    total: subtotal,
    hintText: config.hintText,
    items,
  };
}
