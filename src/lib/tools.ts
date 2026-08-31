/**
 * Externe Partner-Werkzeuge.
 *
 * Der Wirtschaftlichkeitsrechner ("varmi kalkulator") ist eine eigenständige
 * Anwendung; seine Produktions-URL wird über die Umgebungsvariable
 * NEXT_PUBLIC_CALCULATOR_URL verknüpft. Ohne gesetzte Variable zeigen
 * Academy und Navigation einen Hinweis statt eines toten Links.
 */
export const CALCULATOR_URL = process.env.NEXT_PUBLIC_CALCULATOR_URL || undefined;

/** Öffentlicher Eignungscheck (varmova.de) — immer verfügbar. */
export const EIGNUNGSCHECK_URL = "https://check.varmova.de";

/** Interner, per Login geschützter Montage-Trainer (statisches Modul). */
export const MONTAGE_TRAINER_PATH = "/academy/varmi-montage-trainer.html";

/** Interne, per Login geschützte Vertriebs-Academy (statisches Modul). */
export const VERTRIEBS_TRAINER_PATH = "/academy/varmi-vertriebs-trainer.html";
