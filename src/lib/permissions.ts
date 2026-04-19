import { Actor, can, Resource } from "@/lib/rbac/can";

// Dünne, domänenspezifische Wrapper um can(). Sie existieren nur, um Call-Sites
// lesbar zu halten — die Policy-Entscheidung selbst steckt in POLICIES.

export function canReadProject(actor: Actor, project: Resource) {
  return can(actor, "project:read", project);
}

export function canEditProject(actor: Actor, project: Resource) {
  return can(actor, "project:edit", project);
}

export function canReadOffer(actor: Actor, offer: Resource) {
  return can(actor, "offer:read", offer);
}

export function canCreateProject(actor: Actor) {
  return can(actor, "project:create");
}

export function canUpdateOfferStatus(actor: Actor, offer: Resource) {
  return can(actor, "offer:approve", offer) || can(actor, "offer:edit", offer);
}
