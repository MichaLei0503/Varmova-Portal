import { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient | Prisma.TransactionClient;

// Schema aus Lastenheft FA-ANG-070: WP<YY><NNNNNN>.
// YY = Jahr mod 100 (z. B. "26" für 2026), NNNNNN = laufende Nummer pro Jahr, 6-stellig.
export async function generateOfferNumber(db: Db): Promise<string> {
  const yy = String(new Date().getFullYear() % 100).padStart(2, "0");
  const prefix = `WP${yy}`;
  const count = await db.offer.count({
    where: { offerNumber: { startsWith: prefix } },
  });
  return `${prefix}${String(count + 1).padStart(6, "0")}`;
}
