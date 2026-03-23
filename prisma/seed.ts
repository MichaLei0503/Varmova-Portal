import { PrismaClient, ProjectStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.fileUpload.deleteMany();
  await prisma.note.deleteMany();
  await prisma.offerItem.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.project.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.salesPartner.deleteMany();
  await prisma.installer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pricingConfig.deleteMany();

  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Anna Admin",
      email: "admin@varmova.local",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const salesOne = await prisma.user.create({
    data: {
      name: "Lukas Schneider",
      email: "sales1@varmova.local",
      passwordHash,
      role: Role.SALES,
      salesPartner: {
        create: {
          companyName: "Varmova Vertrieb Nord",
          partnerCode: "VP-NORD-01",
          phone: "+49 40 555100",
          region: "Nord",
        },
      },
    },
    include: { salesPartner: true },
  });

  const salesTwo = await prisma.user.create({
    data: {
      name: "Miriam Keller",
      email: "sales2@varmova.local",
      passwordHash,
      role: Role.SALES,
      salesPartner: {
        create: {
          companyName: "Varmova Vertrieb Süd",
          partnerCode: "VP-SUED-01",
          phone: "+49 89 555200",
          region: "Süd",
        },
      },
    },
    include: { salesPartner: true },
  });

  const installerOne = await prisma.user.create({
    data: {
      name: "Tobias Richter",
      email: "installer1@varmova.local",
      passwordHash,
      role: Role.INSTALLER,
      installer: {
        create: {
          companyName: "Richter Haustechnik GmbH",
          installerCode: "INST-NORD-01",
          phone: "+49 40 700100",
          region: "Hamburg",
        },
      },
    },
    include: { installer: true },
  });

  const installerTwo = await prisma.user.create({
    data: {
      name: "Daniela Vogt",
      email: "installer2@varmova.local",
      passwordHash,
      role: Role.INSTALLER,
      installer: {
        create: {
          companyName: "Vogt Energie & Wärme",
          installerCode: "INST-SUED-01",
          phone: "+49 89 700200",
          region: "München",
        },
      },
    },
    include: { installer: true },
  });

  await prisma.pricingConfig.create({
    data: {
      productName: "Varmi",
      basePrice: 12990,
      installationFlatFee: 3490,
      pvIntegrationPrice: 1190,
      storageIntegrationPrice: 890,
      energyAuditPrice: 590,
      largeHouseThreshold: 160,
      largeHouseSurcharge: 1290,
      hintText:
        "Dieses Angebot basiert auf den aktuell bekannten Projektdaten und dient als indikative Kalkulation für das Varmi MVP.",
    },
  });

  const customerOne = await prisma.customer.create({
    data: {
      firstName: "Julia",
      lastName: "Becker",
      email: "julia.becker@example.com",
      phone: "+49 151 1000001",
      street: "Birkenweg",
      houseNumber: "12",
      postalCode: "22303",
      city: "Hamburg",
    },
  });

  const customerTwo = await prisma.customer.create({
    data: {
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

  const projectOne = await prisma.project.create({
    data: {
      projectNumber: "VAR-2026-0001",
      status: ProjectStatus.HANDED_OVER,
      implementationWindow: "Q2 2026",
      buildingType: "Einfamilienhaus",
      livingAreaSqm: 145,
      constructionYear: 1998,
      householdSize: 4,
      currentHeatingType: "Gas-Brennwert",
      annualEnergyConsumption: 22000,
      hasPv: true,
      hasStorage: false,
      specialNote: "Kellerraum gut zugänglich, alte Therme soll rückgebaut werden.",
      internalSalesNote: "Kunde wünscht zügige Umsetzung vor Sommer.",
      customerId: customerOne.id,
      salesPartnerId: salesOne.salesPartner!.id,
      installerId: installerOne.installer!.id,
      createdById: salesOne.id,
      offer: {
        create: {
          subtotal: 17670,
          total: 17670,
          hintText:
            "PV-Anbindung wurde berücksichtigt. Finale Montageprüfung erfolgt durch den Installateur.",
          items: {
            create: [
              { label: "Varmi System", quantity: 1, unitPrice: 12990, totalPrice: 12990, sortOrder: 1 },
              { label: "Installationspauschale", quantity: 1, unitPrice: 3490, totalPrice: 3490, sortOrder: 2 },
              { label: "PV-Integration", quantity: 1, unitPrice: 1190, totalPrice: 1190, sortOrder: 3 },
            ],
          },
        },
      },
      notes: {
        create: [
          {
            authorId: salesOne.id,
            content: "Projekt inklusive Erstangebot angelegt und an Installateur übergeben.",
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      projectNumber: "VAR-2026-0002",
      status: ProjectStatus.IN_PROGRESS,
      implementationWindow: "Q3 2026",
      buildingType: "Doppelhaushälfte",
      livingAreaSqm: 178,
      constructionYear: 1986,
      householdSize: 5,
      currentHeatingType: "Öl-Heizung",
      annualEnergyConsumption: 28500,
      hasPv: false,
      hasStorage: true,
      specialNote: "Zusätzliche Dämmmaßnahme für Spitzboden geplant.",
      internalSalesNote: "Kunde prüft Fördermittel und benötigt druckbares Angebot.",
      customerId: customerTwo.id,
      salesPartnerId: salesTwo.salesPartner!.id,
      installerId: installerTwo.installer!.id,
      createdById: salesTwo.id,
      offer: {
        create: {
          subtotal: 19250,
          total: 19250,
          hintText:
            "Energieanalyse und Speicherintegration wurden aufgrund der Projektdaten ergänzt.",
          items: {
            create: [
              { label: "Varmi System", quantity: 1, unitPrice: 12990, totalPrice: 12990, sortOrder: 1 },
              { label: "Installationspauschale", quantity: 1, unitPrice: 3490, totalPrice: 3490, sortOrder: 2 },
              { label: "Speicherintegration", quantity: 1, unitPrice: 890, totalPrice: 890, sortOrder: 3 },
              { label: "Energieanalyse", quantity: 1, unitPrice: 590, totalPrice: 590, sortOrder: 4 },
              { label: "Objektzuschlag > 160 m²", quantity: 1, unitPrice: 1290, totalPrice: 1290, sortOrder: 5 },
            ],
          },
        },
      },
      notes: {
        create: [
          {
            authorId: installerTwo.id,
            content: "Vor-Ort-Termin für kommende Woche geplant. Anschlussraum wurde bereits vorgeprüft.",
          },
        ],
      },
    },
  });

  console.log({ admin: admin.email, demoPassword: "Demo1234!", projectOne: projectOne.projectNumber });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
