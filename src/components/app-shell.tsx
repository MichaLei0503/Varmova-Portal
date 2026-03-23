import Link from "next/link";
import { Role } from "@prisma/client";
import { Building2, ClipboardList, LayoutDashboard, Settings, Users } from "lucide-react";
import { roleLabels } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";

export function AppShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: React.ReactNode;
}) {
  const navigation = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: true },
    { href: "/projects", label: "Projektliste", icon: ClipboardList, visible: role !== "INSTALLER" },
    { href: "/projects/new", label: "Neues Projekt", icon: Building2, visible: role === "SALES" || role === "ADMIN" },
    { href: "/installer", label: "Installateur Dashboard", icon: ClipboardList, visible: role === "INSTALLER" || role === "ADMIN" },
    { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard, visible: role === "ADMIN" },
    { href: "/admin/users", label: "Benutzer", icon: Users, visible: role === "ADMIN" },
    { href: "/admin/settings/pricing", label: "Preislogik", icon: Settings, visible: role === "ADMIN" },
  ].filter((item) => item.visible);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft lg:block">
          <div className="border-b border-slate-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Varmova</p>
            <h1 className="mt-2 text-xl font-semibold text-slate-950">Partner Portal</h1>
            <p className="mt-3 text-sm text-slate-500">{name}</p>
            <p className="text-xs text-slate-400">{roleLabels[role]}</p>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-soft">
            <div>
              <p className="text-sm font-medium text-slate-900">Varmi Vertriebs- & Installateurprozess</p>
              <p className="text-xs text-slate-500">Klarer MVP-Workflow für Angebot, Übergabe und Projektbearbeitung.</p>
            </div>
            <LogoutButton />
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
