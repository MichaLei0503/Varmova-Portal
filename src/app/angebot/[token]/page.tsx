import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import { signOfferAction } from "./actions";

export const metadata = { title: "Ihr Varmi-Angebot · Varmova" };

// Öffentliche Angebots-Ansicht mit digitaler Annahme (mobile-first, kein Login).
export default async function PublicOfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const offer = await prisma.offer.findUnique({
    where: { signingToken: token },
    include: { items: { orderBy: { sortOrder: "asc" } }, project: { include: { customer: true } } },
  });
  if (!offer || !offer.offerNumber) notFound();

  const customer = offer.project.customer;
  const expired = Boolean(offer.validUntil && offer.validUntil < new Date() && !offer.signedAt);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-night px-5 py-8 text-white [background-image:radial-gradient(ellipse_420px_240px_at_88%_0%,rgba(232,162,96,0.16),transparent_70%)]">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper">Varmova</p>
          <h1 className="mt-2 text-2xl font-semibold">Ihr Angebot {offer.offerNumber}</h1>
          <p className="mt-1 text-sm text-white/70">
            für {customer.salutation} {customer.firstName} {customer.lastName} · {customer.postalCode} {customer.city}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-5 py-6 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="divide-y divide-slate-100">
            {offer.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-night">{item.label}</p>
                  {item.description ? <p className="mt-0.5 text-slate-500">{item.description}</p> : null}
                  <p className="mt-0.5 text-xs text-slate-400">Menge: {item.quantity}</p>
                </div>
                <p className="shrink-0 font-medium text-night">{formatCents(item.totalCents)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-night p-6 text-white">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Zwischensumme netto</span><span>{formatCents(offer.subtotalCents)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
            <span>Umsatzsteuer {offer.vatRatePercent} %</span><span>{formatCents(offer.vatCents)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold">
            <span>Gesamtsumme brutto</span><span className="text-copper">{formatCents(offer.totalCents)}</span>
          </div>
        </div>

        {offer.signedAt ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-emerald-800">
              <CheckCircle2 className="h-5 w-5" /> Angebot angenommen
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              Digital signiert von {offer.signatureRef} am{" "}
              {new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeStyle: "short" }).format(offer.signedAt)} Uhr.
              Ihr Installationsbetrieb meldet sich zur Terminplanung.
            </p>
          </div>
        ) : expired ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            Dieses Angebot ist abgelaufen. Bitte wenden Sie sich an Ihren Varmova-Ansprechpartner für ein aktualisiertes Angebot.
          </div>
        ) : (
          <form action={signOfferAction} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-night">Angebot digital annehmen</h2>
            <p className="mt-1 text-sm text-slate-500">
              Mit Ihrer Annahme beauftragen Sie die Lieferung und Installation zu den oben genannten Konditionen.
            </p>
            <input type="hidden" name="token" value={token} />
            <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="signerName">
              Vollständiger Name (digitale Unterschrift)
            </label>
            <input
              id="signerName"
              name="signerName"
              required
              minLength={3}
              placeholder={`${customer.firstName} ${customer.lastName}`}
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-copper"
            />
            <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
              <input type="checkbox" name="accept" required className="mt-0.5 h-4 w-4 accent-[#C5854A]" />
              <span>Ich nehme das Angebot {offer.offerNumber} verbindlich an.</span>
            </label>
            <button
              type="submit"
              className="mt-5 h-12 w-full rounded-full bg-copper text-sm font-semibold text-night transition hover:bg-[#C5854A] active:scale-[0.99]"
            >
              Angebot verbindlich annehmen
            </button>
            {offer.validUntil ? (
              <p className="mt-3 text-center text-xs text-slate-400">
                Gültig bis {new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(offer.validUntil)}
              </p>
            ) : null}
          </form>
        )}

        <p className="text-center text-xs text-slate-400">
          Varmova UG (haftungsbeschränkt) · Erding · varmova.de · Fragen? Antworten Sie einfach auf Ihre Angebots-E-Mail.
        </p>
      </main>
    </div>
  );
}
