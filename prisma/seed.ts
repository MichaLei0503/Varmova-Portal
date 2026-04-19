import {
  CatalogKind,
  HeatingSystem,
  OfferStatus,
  OrgStatus,
  OrgType,
  PrismaClient,
  ProjectScope,
  Role,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATALOG_VALID_FROM = new Date("2026-01-01T00:00:00Z");

// Preise in Cent, Quelle: Varmova-Lieferung 2026-04-17.
// Für Positionen ohne finale Varmova-Preisfreigabe dient der Admin später zur Korrektur.
const CATALOG = [
  { sku: "VARMI-9.2", kind: CatalogKind.PRODUCT, name: "Varmi Heiztechnologie 9,2 kW", description: "Leistungsaufnahme 9,2 kW, Heizleistung max 17,8 kW, Energieeffizienz A+, Steuerung UVR-16X2S, CAN/DL-Bus.", priceCents: 990_000, unit: "Stück", power: 9 },
  { sku: "MONTAGE-STD", kind: CatalogKind.SERVICE, name: "Montage durch Heizungsinstallateur", description: "Inklusive Standard-Installationsmaterial.", priceCents: 250_000, unit: "Pauschal" },
  { sku: "ELEKTRO-INSTALL", kind: CatalogKind.SERVICE, name: "Elektroinstallation", priceCents: 110_000, unit: "Pauschal" },
  { sku: "PUFFER-KOMBI-300-100", kind: CatalogKind.ACCESSORY, name: "Pufferspeicher WP-Kombi 300/100", description: "Bayersolar, 275/98 l, Energieeffizienz B, inkl. Montage-Set.", priceCents: 210_000, unit: "Stück" },
  { sku: "PUFFER-400", kind: CatalogKind.ACCESSORY, name: "Pufferspeicher 400 l", priceCents: 250_000, unit: "Stück" },
  { sku: "THERMOSTAT-KLASSISCH", kind: CatalogKind.ACCESSORY, name: "Thermostat klassisch", priceCents: 3_500, unit: "Stück" },
  { sku: "THERMOSTAT-SMART", kind: CatalogKind.ACCESSORY, name: "Thermostat smart", priceCents: 8_500, unit: "Stück" },
  { sku: "HEIZKOERPER-STD", kind: CatalogKind.ACCESSORY, name: "Heizkörper-Ersatz (Standard)", priceCents: 40_000, unit: "Stück" },
  { sku: "HEIZKOERPER-NT", kind: CatalogKind.ACCESSORY, name: "Niedertemperatur-Heizkörper", priceCents: 75_000, unit: "Stück" },
  { sku: "ZAEHLERSCHRANK", kind: CatalogKind.SERVICE, name: "Zählerschrank (WP-Umbau)", priceCents: 250_000, unit: "Pauschal" },
  { sku: "DEMONTAGE-GAS", kind: CatalogKind.SERVICE, name: "Demontage Altanlage Gas", priceCents: 55_000, unit: "Pauschal" },
  { sku: "DEMONTAGE-OEL", kind: CatalogKind.SERVICE, name: "Demontage Altanlage Öl", priceCents: 225_000, unit: "Pauschal" },
] as const;

async function main() {
  // Reihenfolge respektiert onDelete: Cascade.
  await prisma.auditLog.deleteMany();
  await prisma.fileUpload.deleteMany();
  await prisma.note.deleteMany();
  await prisma.offerItem.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.project.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.installerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.productCatalog.deleteMany();

  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  const varmova = await prisma.organization.create({
    data: {
      type: OrgType.VARMOVA,
      name: "Varmova UG",
      status: OrgStatus.ACTIVE,
      taxId: "DE460335598",
      address: "Am Weiher 1, 85435 Erding",
    },
  });

  const vpOrg = await prisma.organization.create({
    data: {
      type: OrgType.VP,
      name: "Varmova Vertrieb Süd",
      status: OrgStatus.ACTIVE,
      taxId: "DE111111111",
      address: "Hauptstraße 5, 80331 München",
      trustedUntil: new Date("2027-04-17T00:00:00Z"),
    },
  });

  const ipOrg = await prisma.organization.create({
    data: {
      type: OrgType.IP,
      name: "Richter Haustechnik GmbH",
      status: OrgStatus.ACTIVE,
      taxId: "DE222222222",
      address: "Gewerbering 7, 85435 Erding",
      lat: 48.3066,
      lng: 11.9067,
      trustedUntil: new Date("2027-04-17T00:00:00Z"),
      installerProfile: {
        create: {
          zipCodes: ["85435", "85445", "85456", "80331", "80333"],
          radiusKm: 50,
          certifiedProducts: ["VARMI-9.2"],
          weeklyCapacity: 3,
        },
      },
    },
  });

  // Bundesweit agierender Installationspartner, Standort ~geografisches Zentrum DE (Kassel).
  // radiusKm 1000 deckt jede deutsche Projektadresse per Luftlinie ab (max ~900 km).
  const ipOrgNationwide = await prisma.organization.create({
    data: {
      type: OrgType.IP,
      name: "Varmova Bundesweit Service GmbH",
      status: OrgStatus.ACTIVE,
      taxId: "DE333333333",
      address: "Kölnische Straße 100, 34117 Kassel",
      lat: 51.3127,
      lng: 9.4797,
      trustedUntil: new Date("2027-04-17T00:00:00Z"),
      installerProfile: {
        create: {
          zipCodes: [],
          radiusKm: 1000,
          certifiedProducts: ["VARMI-9.2"],
          weeklyCapacity: 10,
          ratingAvg: 4.8,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Anna Admin",
      email: "admin@varmova.local",
      passwordHash,
      role: Role.VARMOVA_ADMIN,
      organizationId: varmova.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Paul Produktion",
      email: "production@varmova.local",
      passwordHash,
      role: Role.VARMOVA_PRODUCTION,
      organizationId: varmova.id,
    },
  });

  const vpAdmin = await prisma.user.create({
    data: {
      name: "Miriam Keller",
      email: "vp-admin@varmova.local",
      passwordHash,
      role: Role.VP_ADMIN,
      organizationId: vpOrg.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Lukas Schneider",
      email: "vp@varmova.local",
      passwordHash,
      role: Role.VP,
      organizationId: vpOrg.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Tobias Richter",
      email: "ip-admin@varmova.local",
      passwordHash,
      role: Role.IP_ADMIN,
      organizationId: ipOrg.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Daniela Vogt",
      email: "ip@varmova.local",
      passwordHash,
      role: Role.IP,
      organizationId: ipOrg.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Max Bundesweit",
      email: "ip-nationwide@varmova.local",
      passwordHash,
      role: Role.IP_ADMIN,
      organizationId: ipOrgNationwide.id,
    },
  });

  await prisma.productCatalog.createMany({
    data: CATALOG.map((entry) => ({
      sku: entry.sku,
      kind: entry.kind,
      name: entry.name,
      description: "description" in entry ? entry.description : null,
      priceCents: entry.priceCents,
      unit: entry.unit,
      power: "power" in entry ? entry.power : null,
      validFrom: CATALOG_VALID_FROM,
    })),
  });

  const customer = await prisma.customer.create({
    data: {
      salutation: "Herr",
      firstName: "Stefan",
      lastName: "Hoffmann",
      email: "stefan.hoffmann@example.com",
      phone: "+49 171 2000002",
      street: "Alpenstraße",
      houseNumber: "8",
      postalCode: "81675",
      city: "München",
    },
  });

  const catalogByIssueDate = Object.fromEntries(
    CATALOG.map((entry) => [entry.sku, { ...entry, validFrom: CATALOG_VALID_FROM.toISOString() }]),
  );

  const itemSpecs = [
    { sku: "VARMI-9.2", quantity: 1 },
    { sku: "MONTAGE-STD", quantity: 1 },
    { sku: "ELEKTRO-INSTALL", quantity: 1 },
    { sku: "PUFFER-KOMBI-300-100", quantity: 1 },
  ] as const;

  const items = itemSpecs.map((spec, index) => {
    const entry = CATALOG.find((c) => c.sku === spec.sku)!;
    return {
      sku: entry.sku,
      label: entry.name,
      description: "description" in entry ? entry.description : null,
      quantity: spec.quantity,
      unitCents: entry.priceCents,
      totalCents: entry.priceCents * spec.quantity,
      sortOrder: index + 1,
    };
  });

  const subtotalCents = items.reduce((sum, item) => sum + item.totalCents, 0);
  const vatRatePercent = 19;
  const vatCents = Math.round((subtotalCents * vatRatePercent) / 100);
  const totalCents = subtotalCents + vatCents;

  await prisma.project.create({
    data: {
      projectNumber: "VAR-2026-0001",
      buildingType: "Einfamilienhaus",
      constructionYear: 1998,
      livingAreaSqm: 145,
      units: 1,
      bathrooms: 2,
      bathtubs: 1,
      showers: 1,
      currentHeatingType: "Gas-Brennwert",
      currentHeatingInstallYear: 2005,
      currentHeatingSystem: HeatingSystem.ZWEIROHR,
      annualEnergyConsumption: 22000,
      heatingCircuits: 2,
      heaterTypes: ["Heizkörper"],
      scope: ProjectScope.MONOVALENT_WITH_STORAGE,
      varmiSku: "VARMI-9.2",
      bufferSku: "PUFFER-KOMBI-300-100",
      implementationWindow: "KW 24/2026",
      internalSalesNote: "Kunde wünscht zügige Umsetzung vor Sommer.",
      customerId: customer.id,
      vpOrgId: vpOrg.id,
      ipOrgId: ipOrg.id,
      createdById: vpAdmin.id,
      offer: {
        create: {
          offerNumber: "WP26000001",
          status: OfferStatus.OFFER_CREATED,
          vatRatePercent,
          subtotalCents,
          vatCents,
          totalCents,
          priceSnapshot: {
            catalogValidFrom: CATALOG_VALID_FROM.toISOString(),
            vatRatePercent,
            items: itemSpecs.map((spec) => catalogByIssueDate[spec.sku]),
          },
          plannedWeek: "KW 24/2026",
          validUntil: new Date("2026-05-01T00:00:00Z"),
          hintText: "Beispielangebot aus Seed. Preise und Konfiguration gemäß Katalogstand 2026-01-01.",
          items: { create: items },
        },
      },
    },
  });

  console.log({
    demoPassword: "Demo1234!",
    users: [
      "admin@varmova.local",
      "production@varmova.local",
      "vp-admin@varmova.local",
      "vp@varmova.local",
      "ip-admin@varmova.local",
      "ip@varmova.local",
      "ip-nationwide@varmova.local",
    ],
    totalCents,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
