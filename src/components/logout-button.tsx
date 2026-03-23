"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";

export function LogoutButton() {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
      Abmelden
    </Button>
  );
}
