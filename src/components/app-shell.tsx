import Link from "next/link";
import { Role } from "@prisma/client";
import {
  Building2,
  Calculator,
  Contact,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { roleLabels } from "@/lib/utils";
import { CALCULATOR_URL } from "@/lib/tools";
import { LogoutButton } from "@/components/logout-button";

const VP_ROLES: Role[] = ["VP", "VP_ADMIN"];
const IP_ROLES: Role[] = ["IP", "IP_ADMIN"];
const VARMOVA_ROLES: Role[] = ["VARMOVA_ADMIN", "VARMOVA_PRODUCTION"];

export function AppShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: React.ReactNode;
}) {
  const isVp = VP_ROLES.includes(role);
  const isIp = IP_ROLES.includes(role);
  const isVarmova = VARMOVA_ROLES.includes(role);
  const isAdmin = role === "VARMOVA_ADMIN";

  const navigation = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: true, external: false },
    { href: "/leads", label: "Leads", icon: Contact, visible: isVp || isVarmova, external: false },
    { href: "/projects", label: "Projektliste", icon: ClipboardList, visible: isVp || isVarmova, external: false },
    { href: "/projects/new", label: "Neues Projekt", icon: Building2, visible: isVp || isAdmin, external: false },
    { href: "/installer", label: "Installateur Dashboard", icon: ClipboardList, visible: isIp || isAdmin, external: false },
    { href: "/academy", label: "Varmi Academy", icon: GraduationCap, visible: true, external: false },
    { href: CALCULATOR_URL ?? "/academy", label: "Wirtschaftlichkeitsrechner", icon: Calculator, visible: Boolean(CALCULATOR_URL), external: true },
    { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard, visible: isAdmin, external: false },
    { href: "/admin/users", label: "Benutzer", icon: Users, visible: isAdmin, external: false },
    { href: "/admin/settings/pricing", label: "Produktkatalog", icon: Package, visible: isAdmin, external: false },
    { href: "/admin/settings/pricing", label: "Einstellungen", icon: Settings, visible: false, external: false },
  ].filter((item) => item.visible);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 overflow-hidden rounded-3xl bg-night p-5 shadow-soft lg:block [background-image:radial-gradient(ellipse_360px_240px_at_85%_0%,rgba(232,162,96,0.14),transparent_70%)]">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper">Varmova</p>
            <h1 className="mt-2 text-xl font-semibold text-white">Partner Portal</h1>
            <p className="mt-3 text-sm text-white/70">{name}</p>
            <p className="text-xs text-white/50">{roleLabels[role]}</p>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-copper" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-soft">
            <div>
              <p className="text-sm font-medium text-night">Varmi Vertriebs- & Installationsprozess</p>
              <p className="text-xs text-slate-500">Vertriebspartner, Installationspartner und Varmova in einem Netzwerk.</p>
            </div>
            <LogoutButton />
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
