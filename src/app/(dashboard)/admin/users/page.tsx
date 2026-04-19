import { Role } from "@prisma/client";
import { updateUserAccessAction } from "@/app/(dashboard)/actions";
import { Badge, Button, Card, PageHeader, Select } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleLabels } from "@/lib/utils";

export default async function AdminUsersPage() {
  await requireRole(["VARMOVA_ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { organization: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Benutzerverwaltung" description="Rollen, Aktivstatus und Organisationszuordnung zentral verwalten." />
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-night">{user.name}</h2>
                  <Badge className="border-slate-200 bg-slate-50 text-slate-700">{roleLabels[user.role]}</Badge>
                  <Badge className={user.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}>
                    {user.isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                <p className="mt-2 text-sm text-slate-700">{user.organization.name}</p>
              </div>
            </div>

            <form action={updateUserAccessAction} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <input type="hidden" name="userId" value={user.id} />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Rolle</label>
                <Select name="role" defaultValue={user.role}>
                  {Object.values(Role).map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </Select>
              </div>
              <label className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked={user.isActive} />
                Aktiv
              </label>
              <Button type="submit">Speichern</Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
