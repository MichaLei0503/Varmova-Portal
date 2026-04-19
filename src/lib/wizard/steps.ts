import { HeatingLocation, HeatingSystem, ProjectScope, WindowType } from "@prisma/client";
import { z } from "zod";
import { checkbox, optionalInt, optionalString, stringArray } from "./form-helpers";

// Die Wizard-Struktur ist Daten, nicht Code (Torvalds/Hickey).
// Ein neuer Schritt = ein neuer Eintrag. Der Fortschrittsbalken, das
// Routing und die Step-Dispatch lesen alle aus derselben Quelle.

// Schritt 1 — Projekttyp. Aktuell nur Varmi (FA-ANG-001).
export const projekttypSchema = z.object({
  productLine: z.literal("varmi"),
});

// Schritt 2 — Kundendaten (FA-ANG-010..014).
export const kundeSchema = z.object({
  salutation: z.enum(["Herr", "Frau", "Divers"]),
  title: optionalString,
  firstName: z.string().min(2, "Vorname ist erforderlich."),
  lastName: z.string().min(2, "Nachname ist erforderlich."),
  email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben."),
  phone: optionalString,
  mobile: optionalString,
  street: z.string().min(2, "Straße ist erforderlich."),
  houseNumber: z.string().min(1, "Hausnummer ist erforderlich."),
  addressExtra: optionalString,
  postalCode: z.string().min(4, "PLZ ist erforderlich.").max(10),
  city: z.string().min(2, "Ort ist erforderlich."),
  // FA-ANG-012: abweichende Projektadresse optional.
  projectStreet: optionalString,
  projectHouseNumber: optionalString,
  projectPostalCode: optionalString,
  projectCity: optionalString,
});

// Schritt 3 — Haus (FA-ANG-020..023).
export const hausSchema = z.object({
  buildingType: z.enum(["Einfamilienhaus", "Zweifamilienhaus", "Mehrfamilienhaus", "Reihenhaus"]),
  constructionYear: z.coerce.number().int().min(1800).max(new Date().getFullYear()),
  livingAreaSqm: z.coerce.number().int().min(30, "Mindestens 30 m²."),
  units: z.coerce.number().int().min(1).default(1),
  bathrooms: z.coerce.number().int().min(0).default(1),
  bathtubs: z.coerce.number().int().min(0).default(0),
  showers: z.coerce.number().int().min(0).default(1),
  windowType: z.nativeEnum(WindowType).optional(),
  roofInsulated: checkbox.default(false),
  exteriorInsulated: checkbox.default(false),
});

// Schritt 4 — Bestandsheizung (FA-ANG-030..036).
export const heizungSchema = z.object({
  currentHeatingType: z.enum([
    "Gas-Brennwert",
    "Gasheizung",
    "Öl-Heizung",
    "Ölheizung",
    "Holzheizung",
    "Pelletheizung",
    "Wärmepumpe",
  ]),
  currentHeatingInstallYear: optionalInt,
  currentHeatingSystem: z.nativeEnum(HeatingSystem).optional(),
  currentHeatingLocation: z.nativeEnum(HeatingLocation).optional(),
  annualEnergyConsumption: optionalInt,
  heatingCircuits: z.coerce.number().int().min(1).max(3).optional(),
  heaterTypes: stringArray,
  hasPotentialEqualization: checkbox.default(false),
  hasSolarThermal: checkbox.default(false),
  hasCirculationPump: checkbox.default(false),
});

// Schritt 5 — Varmi-Konfiguration (FA-ANG-040..044).
// Preis-relevante Extras bleiben begrenzt auf was Varmi aktuell tatsächlich anbietet
// (WLAN-Modul, Peripherie, Potentialausgleich, Fundament: siehe Produktfreigabe 2026-04-17).
export const projektSchema = z.object({
  scope: z.nativeEnum(ProjectScope),
  varmiSku: z.string().min(1).default("VARMI-9.2"),
  bufferSku: optionalString,
  newThermostats: z.coerce.number().int().min(0).default(0),
  thermostatSku: optionalString,
  replaceHeaters: z.coerce.number().int().min(0).default(0),
  heaterReplacementSku: optionalString,
  newMeterCabinet: checkbox.default(false),
  requestSubsidy: checkbox.default(false),
  implementationWindow: z.string().min(2, "Umsetzungszeitraum ist erforderlich."),
});

// Schritt 6 — Auswahl (FA-ANG-050..055). Speichert die gewählte IP-Org-ID als Referenz.
export const auswahlSchema = z.object({
  ipOrgId: z.string().min(1, "Bitte Installationspartner wählen."),
});

export const WIZARD_STEPS = [
  { id: "projekttyp", title: "Projekttyp", order: 1, schema: projekttypSchema },
  { id: "kunde", title: "Kunde", order: 2, schema: kundeSchema },
  { id: "haus", title: "Haus", order: 3, schema: hausSchema },
  { id: "heizung", title: "Heizung", order: 4, schema: heizungSchema },
  { id: "projekt", title: "Projekt", order: 5, schema: projektSchema },
  { id: "auswahl", title: "Auswahl", order: 6, schema: auswahlSchema },
  { id: "pruefung", title: "Prüfung", order: 7, schema: z.object({}).passthrough() },
  { id: "bestaetigung", title: "Bestätigung", order: 8, schema: z.object({}).passthrough() },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

export const FIRST_STEP: WizardStepId = WIZARD_STEPS[0].id;
export const LAST_STEP: WizardStepId = WIZARD_STEPS[WIZARD_STEPS.length - 1].id;

export function getStep(id: string) {
  return WIZARD_STEPS.find((step) => step.id === id);
}

export function isValidStepId(id: string): id is WizardStepId {
  return WIZARD_STEPS.some((step) => step.id === id);
}

export function nextStepId(id: WizardStepId): WizardStepId | null {
  const index = WIZARD_STEPS.findIndex((step) => step.id === id);
  return WIZARD_STEPS[index + 1]?.id ?? null;
}

export function prevStepId(id: WizardStepId): WizardStepId | null {
  const index = WIZARD_STEPS.findIndex((step) => step.id === id);
  return index > 0 ? WIZARD_STEPS[index - 1].id : null;
}
