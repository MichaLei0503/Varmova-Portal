import { ProjectScope } from "@prisma/client";
import { z } from "zod";

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return Number(value);
}, z.number().positive().optional());

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value?.trim() ? value.trim() : undefined));

export const projectSchema = z.object({
  firstName: z.string().min(2, "Vorname ist erforderlich."),
  lastName: z.string().min(2, "Nachname ist erforderlich."),
  email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben."),
  phone: z.string().min(6, "Telefon ist erforderlich.").optional().or(z.literal("")),
  street: z.string().min(2, "Straße ist erforderlich."),
  houseNumber: z.string().min(1, "Hausnummer ist erforderlich."),
  postalCode: z.string().min(4, "PLZ ist erforderlich."),
  city: z.string().min(2, "Ort ist erforderlich."),
  buildingType: z.string().min(2, "Gebäudetyp ist erforderlich."),
  livingAreaSqm: z.coerce.number().min(30, "Wohnfläche muss mindestens 30 m² betragen."),
  constructionYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
  currentHeatingType: z.string().min(2, "Heizungsart ist erforderlich."),
  annualEnergyConsumption: optionalNumber,
  scope: z.nativeEnum(ProjectScope),
  varmiSku: z.string().min(1).default("VARMI-9.2"),
  bufferSku: optionalString,
  specialNote: optionalString,
  implementationWindow: z.string().min(2, "Umsetzungszeitraum ist erforderlich."),
  ipOrgId: z.string().min(1, "Bitte Installationspartner auswählen."),
  internalSalesNote: optionalString,
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
