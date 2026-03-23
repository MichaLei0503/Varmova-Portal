"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Input, Label } from "@/components/ui";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const response = await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (response?.error) {
      setError("Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" name="email" type="email" placeholder="name@varmova.local" required />
      </div>
      <div>
        <Label htmlFor="password">Passwort</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Anmeldung läuft..." : "Einloggen"}
      </Button>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Demo-Zugang</p>
        <p>admin@varmova.local / Demo1234!</p>
        <p>sales1@varmova.local / Demo1234!</p>
        <p>installer1@varmova.local / Demo1234!</p>
      </div>
    </form>
  );
}
