import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/uploads") || pathname.startsWith("/icons") || pathname === "/manifest.webmanifest") {
    return NextResponse.next();
  }

  // Meta Lead Ads Webhook: wird von Meta-Servern ohne Session aufgerufen;
  // authentifiziert sich über Verify-Token (GET) bzw. Signatur (POST).
  if (pathname === "/api/leads/meta") {
    return NextResponse.next();
  }

  // Ads-Domain partner.varmova.de: Startseite ist dort die öffentliche
  // B2B-Landingpage (Rewrite in next.config.mjs) — keine Session nötig.
  const host = request.headers.get("host") ?? "";
  if (host === "partner.varmova.de" && pathname === "/") {
    return NextResponse.next();
  }

  // Öffentlicher Lead-Funnel (FA-FUNNEL): statische Funnel-Seiten unter
  // /funnel/*, Lead-Annahme und Double-Opt-in-Bestätigung ohne Session.
  if (
    pathname === "/funnel" ||
    pathname.startsWith("/funnel/") ||
    pathname === "/partner-werden" ||
    pathname.startsWith("/partner/") ||
    pathname === "/datenschutz" ||
    pathname.startsWith("/datenschutz/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/unterlagen/") ||
    pathname === "/api/leads/funnel" ||
    pathname === "/api/leads/confirm"
  ) {
    return NextResponse.next();
  }

  // Öffentliche Angebots-Annahme durch den Kunden (unguessbarer Token in der URL).
  if (pathname.startsWith("/angebot/")) {
    return NextResponse.next();
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = token.role as string | undefined;

  if (pathname.startsWith("/admin") && role !== "VARMOVA_ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/installer") && role !== "IP" && role !== "IP_ADMIN" && role !== "VARMOVA_ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/projects/new") && role !== "VP" && role !== "VP_ADMIN" && role !== "VARMOVA_ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth).*)"],
};
