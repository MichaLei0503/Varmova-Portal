import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-3xl bg-night p-10 text-white shadow-soft lg:block [background-image:radial-gradient(ellipse_420px_280px_at_85%_10%,rgba(232,162,96,0.18),transparent_70%)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-copper">Next Gen Heating</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Partner Portal für Vertrieb, Angebot und Installateur-Übergabe.</h1>
          <p className="mt-4 max-w-xl text-base text-white/70">
            Projekt erfassen, Angebot erzeugen, Installateur zuweisen — und mit Academy und Rechner direkt verkaufsfähig sein.
          </p>
          <p className="mt-10 text-sm font-medium text-white/60">Einfach. Intelligent. Warm.</p>
        </div>

        <Card className="mx-auto w-full max-w-xl p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-copper">Login</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Willkommen zurück</h2>
          <p className="mt-2 text-sm text-slate-500">Melde dich mit deiner Rolle im Varmova Partner Portal an.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
