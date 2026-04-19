import Link from "next/link";
import { InstallerProfile, Organization } from "@prisma/client";
import { Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { getGeocodingProvider, type Coordinates } from "@/lib/integrations/geocoding";
import {
  InstallerMatch,
  InstallerWithProfile,
  isValidSortKey,
  matchInstallers,
  MatchSortKey,
} from "@/lib/matching/matcher";
import type { WizardDraftData } from "@/lib/wizard/draft";

// Step 6 — Auswahl des Installationspartners (FA-ANG-050..055).
// Async Server Component: lädt IPs, geocodiert die Kundenadresse, ruft Matcher auf.
export async function AuswahlStep({
  draftId,
  draftData,
  sort,
}: {
  draftId: string;
  draftData: WizardDraftData;
  sort: string | undefined;
}) {
  const customer = draftData.kunde as Record<string, string | undefined> | undefined;
  const projekt = draftData.projekt as Record<string, unknown> | undefined;
  const selectedIpOrgId = ((draftData.auswahl ?? {}) as Record<string, unknown>).ipOrgId as string | undefined;

  if (!customer?.street || !customer?.postalCode || !customer?.city) {
    return <MissingCustomerWarning draftId={draftId} />;
  }

  const varmiSku = (projekt?.varmiSku as string) || "VARMI-9.2";
  const sortKey: MatchSortKey = sort && isValidSortKey(sort) ? sort : "distance";

  const [coords, installersWithProfile] = await Promise.all([
    geocodeCustomer(customer),
    loadInstallers(),
  ]);

  const matches = matchInstallers(
    {
      customerPostalCode: customer.postalCode,
      customerCoords: coords,
      varmiSku,
      now: new Date(),
    },
    installersWithProfile,
    sortKey,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-night">
          Projektadresse: {customer.street} {customer.houseNumber}, {customer.postalCode} {customer.city}
        </p>
        <p className="mt-1 text-xs text-slate-500">Gewähltes Modell: {varmiSku}</p>
      </div>

      <SortLinks draftId={draftId} current={sortKey} />

      {matches.length === 0 ? (
        <EmptyResult />
      ) : (
        <ul className="space-y-3">
          {matches.map((match) => (
            <InstallerCard
              key={match.org.id}
              match={match}
              selected={match.org.id === selectedIpOrgId}
            />
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-400">
        Geodaten © OpenStreetMap-Mitwirkende · Geocoding via OpenRouteService (FA-ANG-053)
      </p>
    </div>
  );
}

async function geocodeCustomer(customer: Record<string, string | undefined>): Promise<Coordinates | null> {
  const provider = getGeocodingProvider();
  try {
    return await provider.geocode({
      street: customer.street ?? "",
      houseNumber: customer.houseNumber ?? "",
      postalCode: customer.postalCode ?? "",
      city: customer.city ?? "",
    });
  } catch {
    return null;
  }
}

async function loadInstallers(): Promise<InstallerWithProfile[]> {
  const orgs = await prisma.organization.findMany({
    where: { type: "IP", status: "ACTIVE" },
    include: { installerProfile: true },
    orderBy: { name: "asc" },
  });
  return orgs.filter(hasProfile);
}

function hasProfile(org: Organization & { installerProfile: InstallerProfile | null }): org is InstallerWithProfile {
  return org.installerProfile !== null;
}

function InstallerCard({ match, selected }: { match: InstallerMatch; selected: boolean }) {
  const { org } = match;
  const profile = org.installerProfile;

  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-4 transition",
          selected ? "border-copper ring-2 ring-copper/30" : "border-slate-200 hover:border-copper/60",
        )}
      >
        <div className="flex items-start gap-4">
          <input
            type="radio"
            name="ipOrgId"
            value={org.id}
            defaultChecked={selected}
            required
            className="mt-1 h-4 w-4"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-night">{org.name}</p>
              {org.trustedUntil ? <Award className="h-4 w-4 text-copper" aria-label="Trusted Partner" /> : null}
            </div>
            <p className="mt-1 text-sm text-slate-500">{org.address ?? "Keine Adresse hinterlegt"}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-sm text-slate-700 md:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-400">Entfernung</dt>
            <dd className="font-medium text-night">
              {match.distanceKm !== null ? `${match.distanceKm.toFixed(1)} km` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Kapazität/Woche</dt>
            <dd className="font-medium text-night">{profile.weeklyCapacity}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Bewertung</dt>
            <dd className="font-medium text-night">
              {profile.ratingAvg !== null ? `${profile.ratingAvg.toFixed(1)} ★` : "Keine Bewertungen"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Zahlung</dt>
            <dd className="font-medium text-night">50 % Anzahlung</dd>
          </div>
        </dl>
      </label>
    </li>
  );
}

function SortLinks({ draftId, current }: { draftId: string; current: MatchSortKey }) {
  const options: Array<{ key: MatchSortKey; label: string }> = [
    { key: "distance", label: "Entfernung" },
    { key: "capacity", label: "Verfügbarkeit" },
    { key: "rating", label: "Bewertung" },
  ];
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">Sortieren nach:</span>
      {options.map((opt) => (
        <Link
          key={opt.key}
          href={`/wizard/${draftId}/auswahl?sort=${opt.key}`}
          className={cn(
            "rounded-full px-3 py-1 font-medium",
            current === opt.key ? "bg-night text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
          )}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}

function MissingCustomerWarning({ draftId }: { draftId: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="font-medium text-amber-900">Kundenadresse fehlt</p>
      <p className="mt-2 text-sm text-amber-800">
        Die Auswahl eines Installationspartners benötigt eine vollständige Projektadresse.
        Bitte zuerst Schritt 2 ausfüllen.
      </p>
      <Link
        href={`/wizard/${draftId}/kunde`}
        className="mt-4 inline-flex h-10 items-center rounded-xl bg-copper px-4 text-sm font-medium text-night"
      >
        Zu Schritt 2 springen
      </Link>
    </div>
  );
}

function EmptyResult() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
      Für die angegebene Projektadresse wurde kein passender Installationspartner gefunden.
      Bitte Varmova kontaktieren — wir erweitern das Partnernetzwerk laufend.
    </div>
  );
}
