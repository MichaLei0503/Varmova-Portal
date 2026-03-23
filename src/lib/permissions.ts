import { Role } from "@prisma/client";

export function canAccessProject(params: {
  role: Role;
  userId: string;
  installerUserId?: string | null;
  createdById: string;
}) {
  const { role, userId, installerUserId, createdById } = params;

  if (role === "ADMIN") return true;
  if (role === "SALES") return createdById === userId;
  if (role === "INSTALLER") return installerUserId === userId;
  return false;
}

export function canUpdateStatus(role: Role) {
  return role === "ADMIN" || role === "INSTALLER";
}

export function canCreateProject(role: Role) {
  return role === "ADMIN" || role === "SALES";
}
