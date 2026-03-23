import { Prisma, PrismaClient } from "@prisma/client";

export async function generateProjectNumber(
  db: Prisma.TransactionClient | PrismaClient,
) {
  const year = new Date().getFullYear();
  const prefix = `VAR-${year}`;
  const count = await db.project.count({
    where: {
      projectNumber: {
        startsWith: prefix,
      },
    },
  });

  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}
