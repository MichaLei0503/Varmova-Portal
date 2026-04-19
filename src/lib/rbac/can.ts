import { Role } from "@prisma/client";
import { Action, POLICIES, Scope } from "./policies";

export type Actor = {
  userId: string;
  role: Role;
  organizationId: string;
};

// Resource beschreibt die minimale Menge an Feldern, die für die Scope-Prüfung nötig ist.
// Alle Felder optional, damit auch reine Klassen-Aktionen (z. B. "offer:create") prüfbar sind.
export type Resource = {
  createdById?: string;
  organizationId?: string;
  assignedOrgIds?: ReadonlyArray<string>;
};

// can(actor, action, resource?) → true, wenn die Rolle in POLICIES eingetragen ist
// UND der Scope auf die übergebene Resource passt.
export function can(actor: Actor, action: Action, resource?: Resource): boolean {
  const scope = POLICIES[actor.role][action];
  if (!scope) return false;
  if (scope === "ALL") return true;
  if (!resource) {
    // Ohne Resource lässt sich Scope ≠ ALL nicht prüfen. Bei Klassen-Aktionen
    // wie "offer:create" ist Scope "SELF"/"ORG" ausreichend — der Actor wird die
    // Resource gleich selbst erzeugen und die Felder entsprechend setzen.
    return scope === "SELF" || scope === "ORG";
  }
  return matchesScope(scope, actor, resource);
}

function matchesScope(scope: Scope, actor: Actor, resource: Resource): boolean {
  if (scope === "SELF") return resource.createdById === actor.userId;
  if (scope === "ORG") return resource.organizationId === actor.organizationId;
  if (scope === "ASSIGNED") return resource.assignedOrgIds?.includes(actor.organizationId) ?? false;
  return false;
}
