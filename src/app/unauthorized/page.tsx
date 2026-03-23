import Link from "next/link";
import { Card } from "@/components/ui";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Zugriff verweigert</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Diese Seite ist für deine Rolle nicht freigegeben.</h1>
        <p className="mt-3 text-sm text-slate-500">Bitte gehe zurück ins Dashboard oder melde dich mit einem berechtigten Account an.</p>
        <Link href="/dashboard" className="mt-6 inline-flex text-sm font-medium text-brand hover:underline">
          Zurück zum Dashboard
        </Link>
      </Card>
    </div>
  );
}
