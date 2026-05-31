import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host");

  // Define your main domains here. Any other domain will be treated as a tenant.
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
  const mainDomain = new URL(webUrl).host;
  const mainDomains = [
    mainDomain, 
    "localhost:3000", 
    "shipany.ai", 
    "exam.shipany.ai", 
    "xucongyong.workers.dev"
  ];
  const isMainDomain = mainDomains.some((d) => hostname?.includes(d));

  if (!isMainDomain && hostname) {
    // Multi-tenant routing: Rewrite to /tenants/[hostname]
    // Note: We skip this for internal Next.js paths and static files via the matcher.
    const site = hostname.split(":")[0];
    url.pathname = `/tenants/${site}${url.pathname}`;
    console.log(`[Middleware] Rewriting to tenant: ${site}${url.pathname}`);
    return NextResponse.rewrite(url);
  }

  // Standard i18n routing for the main site
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames or tenant paths
  // Skip API routes, _next, and static assets
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
