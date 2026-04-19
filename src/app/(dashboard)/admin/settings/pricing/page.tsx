import { Badge, Card, CardTitle, PageHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents, formatDate } from "@/lib/utils";

// AP 1.0: Read-only-Sicht auf den Produktkatalog. CRUD-Pflege folgt in AP 2.8.
export default async function ProductCatalogPage() {
  await requireRole(["VARMOVA_ADMIN"]);

  const entries = await prisma.productCatalog.findMany({
    orderBy: [{ kind: "asc" }, { sku: "asc" }],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produktkatalog"
        description="Aktuelle Preise, SKUs und Gültigkeitszeiträume. Pflege-UI folgt in Phase 2."
      />
      <Card>
        <CardTitle>Einträge</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Typ</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Preis netto</th>
                <th className="px-4 py-3">Einheit</th>
                <th className="px-4 py-3">Gültig ab</th>
                <th className="px-4 py-3">Gültig bis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 font-mono text-xs">{entry.sku}</td>
                  <td className="px-4 py-3">
                    <Badge className="border-slate-200 bg-slate-50 text-slate-700">{entry.kind}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-night">{entry.name}</td>
                  <td className="px-4 py-3 text-right">{formatCents(entry.priceCents)}</td>
                  <td className="px-4 py-3">{entry.unit}</td>
                  <td className="px-4 py-3">{formatDate(entry.validFrom)}</td>
                  <td className="px-4 py-3">{entry.validUntil ? formatDate(entry.validUntil) : "offen"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
