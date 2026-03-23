import { AppShell } from "@/components/app-shell";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <AppShell role={session.user.role} name={session.user.name ?? session.user.email ?? "Nutzer"}>
      {children}
    </AppShell>
  );
}
