import { z } from "zod";

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return Number(value);
}, z.number().positive().optional());

export const projectSchema = z.object({
  firstName: z.string().min(2, "Vorname ist erforderlich."),
  lastName: z.string().min(2, "Nachname ist erforderlich."),
  email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben."),
  phone: z.string().min(6, "Telefon ist erforderlich."),
  street: z.string().min(2, "Straße ist erforderlich."),
  houseNumber: z.string().min(1, "Hausnummer ist erforderlich."),
  postalCode: z.string().min(4, "PLZ ist erforderlich."),
  city: z.string().min(2, "Ort ist erforderlich."),
  buildingType: z.string().min(2, "Gebäudetyp ist erforderlich."),
  livingAreaSqm: z.coerce.number().min(30, "Wohnfläche muss mindestens 30 m² betragen."),
  constructionYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
  householdSize: z.coerce.number().min(1).max(20),
  currentHeatingType: z.string().min(2, "Heizungsart ist erforderlich."),
  annualEnergyConsumption: optionalNumber,
  hasPv: z.boolean(),
  hasStorage: z.boolean(),
  specialNote: z.string().optional(),
  implementationWindow: z.string().min(2, "Umsetzungszeitraum ist erforderlich."),
  installerId: z.string().min(1, "Bitte Installateur auswählen."),
  internalSalesNote: z.string().optional(),
  productName: z.literal("Varmi"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
