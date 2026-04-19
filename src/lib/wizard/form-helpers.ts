import { z } from "zod";

// Gemeinsame zod-Bausteine für HTML-Formular-Eingaben.
// HTML-Checkboxes liefern "on" wenn gesetzt, sonst fehlt der Key ganz in FormData.
// Der Action-Parser aggregiert Mehrfachvorkommen desselben Feldnamens zu einem Array.

export const checkbox = z.preprocess(
  (value) => value === "on" || value === true || value === "true",
  z.boolean(),
);

// HTML-Select mit leerer Default-Option liefert "" statt undefined.
// Dieser Helper macht daraus undefined, damit `.optional()`-Schemas greifen.
export const emptyToUndefined = (value: unknown): unknown =>
  value === "" || value === null ? undefined : value;

export const optionalString = z
  .union([z.string(), z.undefined(), z.null()])
  .transform((value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  });

export const optionalInt = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}, z.number().int().optional());

// Mehrfach-Checkbox-Gruppe: FormData kann ein einzelnes String oder ein Array liefern.
export const stringArray = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return [];
  return Array.isArray(value) ? value : [value];
}, z.array(z.string()));
