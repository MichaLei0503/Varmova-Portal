"use client";

import { useActionState } from "react";
import { Role } from "@prisma/client";
import { createUserAction } from "@/app/(dashboard)/admin/users/actions";
import { Button, Card, CardTitle, Input, Label, Select } from "@/components/ui";
import { initialActionState } from "@/lib/action-state";
import { roleLabels } from "@/lib/utils";

type OrganizationOption = { id: string; name: string };

export function CreateUserForm({ organizations }: { organizations: OrganizationOption[] }) {
  const [state, formAction, pending] = useActionState(createUserAction, initialActionState);
  const fieldError = (field: string) => state.errors?.[field]?.[0];

  return (
    <Card>
      <CardTitle>Benutzer anlegen</CardTitle>
      <form key={state.success ? state.message : "edit"} action={formAction} className="mt-5 space-y-4">
        {state.message ? (
          <div
            className={
              state.success
                ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            }
          >
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required minLength={2} autoComplete="off" />
            {fieldError("name") ? <p className="mt-1 text-xs text-danger">{fieldError("name")}</p> : null}
          </div>
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" required autoComplete="off" />
            {fieldError("email") ? <p className="mt-1 text-xs text-danger">{fieldError("email")}</p> : null}
          </div>
          <div>
            <Label htmlFor="role">Rolle</Label>
            <Select id="role" name="role" defaultValue={Role.VP}>
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="organizationId">Organisation</Label>
            <Select id="organizationId" name="organizationId" required defaultValue={organizations[0]?.id}>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
            {fieldError("organizationId") ? <p className="mt-1 text-xs text-danger">{fieldError("organizationId")}</p> : null}
          </div>
          <div>
            <Label htmlFor="password">Startpasswort</Label>
            <Input id="password" name="password" type="text" required minLength={10} autoComplete="new-password" />
            {fieldError("password") ? <p className="mt-1 text-xs text-danger">{fieldError("password")}</p> : null}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Das Startpasswort bitte auf sicherem Weg übergeben (nicht per unverschlüsselter Mail).
        </p>

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Wird angelegt…" : "Benutzer anlegen"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
