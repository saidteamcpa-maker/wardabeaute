import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  createSession,
  loginRateLimited,
  registerLoginAttempt,
  resetLoginAttempts,
  sessionCookieOptions,
  ADMIN_COOKIE,
} from "@/lib/auth";
import { getClientIp } from "@/lib/geo";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (loginRateLimited(ip)) {
    return NextResponse.json({ detail: "too_many_attempts" }, { status: 429 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "invalid_json" }, { status: 400 });
  }

  const { username, password } = body ?? {};
  if (!verifyCredentials(username ?? "", password ?? "")) {
    registerLoginAttempt(ip);
    return NextResponse.json({ detail: "invalid_credentials" }, { status: 401 });
  }

  resetLoginAttempts(ip);
  const token = await createSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
  return res;
}
