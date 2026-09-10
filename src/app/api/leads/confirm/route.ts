import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeMail, verifyDoiToken, appBaseUrl } from "@/lib/leadMail";

/**
 * Double-Opt-in-Bestätigung (FA-FUNNEL).
 *
 * GET /api/leads/confirm?t=<token> — prüft den signierten Token, setzt
 * doiConfirmedAt (idempotent) und leitet auf die Bestätigungsseite des
 * Funnels weiter. Nach erfolgreicher Erst-Bestätigung geht die
 * segmentspezifische Willkommensmail raus.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const base = appBaseUrl();

  const result = verifyDoiToken(token);
  if ("error" in result) {
    return NextResponse.redirect(`${base}/funnel/bestaetigt.html?status=${result.error}`);
  }

  const lead = await prisma.lead.findUnique({ where: { id: result.leadId } });
  if (!lead || !lead.email) {
    return NextResponse.redirect(`${base}/funnel/bestaetigt.html?status=invalid`);
  }

  const segment: "B2C" | "B2B" = lead.segment === "B2B" ? "B2B" : "B2C";

  if (!lead.doiConfirmedAt) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { doiConfirmedAt: new Date() },
    });
    const firstName = lead.name.split(" ")[0] || lead.name;
    sendWelcomeMail({ to: lead.email, firstName, segment }).catch((err) =>
      console.error("[confirm] Willkommensmail fehlgeschlagen:", err)
    );
  }

  return NextResponse.redirect(
    `${base}/funnel/bestaetigt.html?status=ok&segment=${segment.toLowerCase()}`
  );
}
