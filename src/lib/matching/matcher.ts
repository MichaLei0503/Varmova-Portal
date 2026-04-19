import { InstallerProfile, Organization } from "@prisma/client";
import { Coordinates } from "@/lib/integrations/geocoding";
import { haversineKm } from "./haversine";

// Matcher liefert eine nach dem gewählten Kriterium sortierte Liste passender IPs (FA-ANG-050..055).
// Reine Funktion — keine DB-Zugriffe, keine Seiteneffekte. Test- und Cache-freundlich.

export type InstallerWithProfile = Organization & { installerProfile: InstallerProfile };

export type MatchSortKey = "distance" | "capacity" | "rating";

type MatchInput = {
  customerPostalCode: string;
  customerCoords: Coordinates | null;
  varmiSku: string;
  now: Date;
};

export type InstallerMatch = {
  org: InstallerWithProfile;
  distanceKm: number | null;
  withinZipList: boolean;
  withinRadius: boolean;
};

export function matchInstallers(
  input: MatchInput,
  installers: ReadonlyArray<InstallerWithProfile>,
  sort: MatchSortKey = "distance",
): InstallerMatch[] {
  const eligible = installers
    .filter((org) => isTrusted(org, input.now))
    .filter((org) => org.installerProfile.certifiedProducts.includes(input.varmiSku))
    .map((org) => buildMatch(org, input))
    .filter((match) => match.withinZipList || match.withinRadius);

  return eligible.sort(comparator(sort));
}

function isTrusted(org: InstallerWithProfile, now: Date): boolean {
  return org.status === "ACTIVE" && Boolean(org.trustedUntil) && org.trustedUntil! > now;
}

function buildMatch(org: InstallerWithProfile, input: MatchInput): InstallerMatch {
  const withinZipList = org.installerProfile.zipCodes.includes(input.customerPostalCode);

  const distanceKm =
    input.customerCoords && org.lat !== null && org.lng !== null
      ? haversineKm(input.customerCoords, { lat: org.lat, lng: org.lng })
      : null;

  const withinRadius =
    !withinZipList &&
    distanceKm !== null &&
    org.installerProfile.radiusKm !== null &&
    distanceKm <= org.installerProfile.radiusKm!;

  return { org, distanceKm, withinZipList, withinRadius };
}

// Sort-Strategien als Daten: neue Strategie = neuer Eintrag, keine if-Kaskade.
const SORT_COMPARATORS: Record<MatchSortKey, (a: InstallerMatch, b: InstallerMatch) => number> = {
  distance: (a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY),
  capacity: (a, b) => b.org.installerProfile.weeklyCapacity - a.org.installerProfile.weeklyCapacity,
  rating: (a, b) => (b.org.installerProfile.ratingAvg ?? 0) - (a.org.installerProfile.ratingAvg ?? 0),
};

function comparator(sort: MatchSortKey) {
  return SORT_COMPARATORS[sort];
}

export function isValidSortKey(value: string): value is MatchSortKey {
  return value === "distance" || value === "capacity" || value === "rating";
}
