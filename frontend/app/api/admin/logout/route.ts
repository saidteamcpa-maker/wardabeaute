import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, sessionCookieOptions, ADMIN_COOKIE, getAdminSessionFromCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  await destroySession(session?.token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
