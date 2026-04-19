import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OfferStatus, ProjectScope, Role } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatCents(cents: number) {
  return formatCurrency(cents / 100);
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export const roleLabels: Record<Role, string> = {
  VARMOVA_ADMIN: "Varmova Admin",
  VARMOVA_PRODUCTION: "Varmova Produktion",
  VP_ADMIN: "VP Admin",
  VP: "Vertriebspartner",
  IP_ADMIN: "IP Admin",
  IP: "Installationspartner",
  ENERGY_ADVISOR: "Energieberater",
};

export const offerStatusLabels: Record<OfferStatus, string> = {
  DRAFT: "Entwurf",
  OFFER_CREATED: "Angebot erstellt",
  AWAITING_CUSTOMER: "Kunde",
  DATA_COLLECTION: "Datenerfassung",
  VARMOVA_REVIEW: "Varmova-Prüfung",
  INSTALLER_ASSIGNED: "Installateur",
  INSTALLATION_SCHEDULED: "Installation geplant",
  INSTALLATION_DONE: "Installation abgeschlossen",
  INVOICED: "Abgerechnet",
  FEEDBACK_COLLECTED: "Feedback eingeholt",
  CLOSED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

export const offerStatusColors: Record<OfferStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  OFFER_CREATED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  AWAITING_CUSTOMER: "bg-amber-50 text-amber-700 border-amber-200",
  DATA_COLLECTION: "bg-sky-50 text-sky-700 border-sky-200",
  VARMOVA_REVIEW: "bg-violet-50 text-violet-700 border-violet-200",
  INSTALLER_ASSIGNED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  INSTALLATION_SCHEDULED: "bg-teal-50 text-teal-700 border-teal-200",
  INSTALLATION_DONE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INVOICED: "bg-lime-50 text-lime-700 border-lime-200",
  FEEDBACK_COLLECTED: "bg-green-50 text-green-700 border-green-200",
  CLOSED: "bg-slate-900 text-white border-slate-900",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

export const projectScopeLabels: Record<ProjectScope, string> = {
  HYBRID: "Hybrid",
  MONOVALENT_NO_STORAGE: "Monovalent (ohne Speicher)",
  MONOVALENT_WITH_STORAGE: "Monovalent (mit Speicher)",
};
