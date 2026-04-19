import { Role } from "@prisma/client";

// Scope beschreibt, auf welche Ressourcen eine Rolle eine Aktion ausführen darf.
// SELF     — nur Ressourcen, die der User selbst erzeugt hat (createdById)
// ORG      — Ressourcen der eigenen Organisation (orgId)
// ASSIGNED — Ressourcen, bei denen der User/die Org explizit zugewiesen ist
// ALL      — alle Ressourcen
export type Scope = "SELF" | "ORG" | "ASSIGNED" | "ALL";

// Alle Aktionen im System. Jede neue Aktion wird hier registriert —
// damit ist die Policy-Tabelle immer vollständig typisiert.
export type Action =
  | "offer:create"
  | "offer:read"
  | "offer:edit"
  | "offer:submit"
  | "offer:approve"
  | "offer:cancel"
  | "offer:sign"
  | "offer:edit-positions"
  | "project:create"
  | "project:read"
  | "project:edit"
  | "project:delete"
  | "partner:approve"
  | "partner:suspend"
  | "user:invite"
  | "product:read"
  | "product:edit"
  | "price:edit"
  | "commission:read"
  | "commission:edit"
  | "subsidy:read"
  | "subsidy:edit"
  | "audit:read"
  | "insight:write"
  | "lead:read"
  | "lead:edit";

// Policy-Tabelle: Rolle → Aktion → Scope. Fehlt ein Eintrag, ist die Aktion verboten.
// Statt if-Kaskaden eine Datenstruktur (Torvalds) — neue Rollen/Aktionen = neue Zeile.
export const POLICIES: Record<Role, Partial<Record<Action, Scope>>> = {
  VARMOVA_ADMIN: {
    "offer:create": "ALL",
    "offer:read": "ALL",
    "offer:edit": "ALL",
    "offer:submit": "ALL",
    "offer:approve": "ALL",
    "offer:cancel": "ALL",
    "offer:edit-positions": "ALL",
    "project:create": "ALL",
    "project:read": "ALL",
    "project:edit": "ALL",
    "project:delete": "ALL",
    "partner:approve": "ALL",
    "partner:suspend": "ALL",
    "user:invite": "ALL",
    "product:read": "ALL",
    "product:edit": "ALL",
    "price:edit": "ALL",
    "commission:read": "ALL",
    "commission:edit": "ALL",
    "subsidy:read": "ALL",
    "subsidy:edit": "ALL",
    "audit:read": "ALL",
    "insight:write": "ALL",
    "lead:read": "ALL",
    "lead:edit": "ALL",
  },
  VARMOVA_PRODUCTION: {
    "product:read": "ALL",
    "insight:write": "ALL",
  },
  VP_ADMIN: {
    "offer:create": "ORG",
    "offer:read": "ORG",
    "offer:edit": "ORG",
    "offer:submit": "ORG",
    "offer:cancel": "ORG",
    "project:create": "ORG",
    "project:read": "ORG",
    "project:edit": "ORG",
    "user:invite": "ORG",
    "commission:read": "ORG",
    "lead:read": "ORG",
    "lead:edit": "ORG",
    "product:read": "ALL",
  },
  VP: {
    "offer:create": "SELF",
    "offer:read": "SELF",
    "offer:edit": "SELF",
    "offer:submit": "SELF",
    "project:create": "SELF",
    "project:read": "SELF",
    "project:edit": "SELF",
    "commission:read": "SELF",
    "lead:read": "SELF",
    "lead:edit": "SELF",
    "product:read": "ALL",
  },
  IP_ADMIN: {
    "offer:read": "ASSIGNED",
    "offer:edit-positions": "ASSIGNED",
    "project:read": "ASSIGNED",
    "user:invite": "ORG",
    "product:read": "ALL",
  },
  IP: {
    "offer:read": "ASSIGNED",
    "offer:edit-positions": "ASSIGNED",
    "project:read": "ASSIGNED",
    "product:read": "ALL",
  },
  ENERGY_ADVISOR: {
    "subsidy:read": "ASSIGNED",
    "subsidy:edit": "ASSIGNED",
    "project:read": "ASSIGNED",
  },
};
