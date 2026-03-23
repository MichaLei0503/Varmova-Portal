import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProjectStatus, Role } from "@prisma/client";

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

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  SALES: "Vertriebspartner",
  INSTALLER: "Installateur",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  DRAFT: "Entwurf",
  CREATED: "Angelegt",
  OFFER_CREATED: "Angebot erstellt",
  HANDED_OVER: "An Installateur übergeben",
  IN_PROGRESS: "In Bearbeitung",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

export const projectStatusColors: Record<ProjectStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  CREATED: "bg-blue-50 text-blue-700 border-blue-200",
  OFFER_CREATED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  HANDED_OVER: "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-cyan-50 text-cyan-700 border-cyan-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};
