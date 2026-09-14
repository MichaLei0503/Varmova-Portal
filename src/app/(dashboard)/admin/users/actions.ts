"use server";

import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/lib/action-state";

const MIN_PASSWORD_LENGTH = 10;
const BCRYPT_ROUNDS = 10;

const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name ist erforderlich."),
  email: z.string().trim().toLowerCase().email("Bitte eine gültige E-Mail-Adresse eingeben."),
  role: z.nativeEnum(Role),
  organizationId: z.string().min(1, "Bitte eine Organisation wählen."),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`),
});

export async function createUserAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireRole(["VARMOVA_ADMIN"]);

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    organizationId: formData.get("organizationId"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte die markierten Felder prüfen.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, role, organizationId, password } = parsed.data;

  const emailTaken = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (emailTaken) {
    return {
      success: false,
      message: "Bitte die markierten Felder prüfen.",
      errors: { email: ["Diese E-Mail-Adresse ist bereits vergeben."] },
    };
  }

  const passwordHash = await hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, role, organizationId, passwordHash },
  });

  await prisma.auditLog.create({
    data: {
      entity: "User",
      entityId: user.id,
      action: "user:created",
      actorId: session.user.id,
      diff: { email, role, organizationId },
    },
  });

  revalidatePath("/admin/users");
  return { success: true, message: `Benutzer ${name} (${email}) wurde angelegt.` };
}
