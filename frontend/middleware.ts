import { NextRequest, NextResponse } from "next/server";

const COOKIE = "admin_session";
const LANG_COOKIE = "warda-lang";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Explicit locale in URL must NEVER fall back to DEFAULT_LANG.
  // /ar/* → Arabic, /fr/* → French, strip prefix and set cookie for persistence.
  const localeMatch = pathname.match(/^\/(ar|fr)(\/|$)/);
  if (localeMatch && !pathname.startsWith("/admin")) {
    const locale = localeMatch[1] as "ar" | "fr";
    const stripped = pathname.replace(/^\/(ar|fr)(?=\/|$)/, "") || "/";
    const url = req.nextUrl.clone();
    url.pathname = stripped;
    url.search = req.nextUrl.search;
    const res = NextResponse.rewrite(url);
    res.cookies.set(LANG_COOKIE, locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    return res;
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const hasCookie = !!req.cookies.get(COOKIE)?.value;

  if (!hasCookie && pathname !== "/admin/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (hasCookie && pathname === "/admin/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/orders";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
