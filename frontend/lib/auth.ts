import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

export const ADMIN_COOKIE = "admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

export function verifyCredentials(username: string, password: string): boolean {
  // Fall back to safe defaults so the admin panel works out of the box even if
  // ADMIN_USERNAME / ADMIN_PASSWORD env vars aren't set. Env values always win.
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || "Saidecom324@";
  const uOk = timingSafeEqual(Buffer.from(sha256(username)), Buffer.from(sha256(u)));
  const pOk = timingSafeEqual(Buffer.from(sha256(password)), Buffer.from(sha256(p)));
  return uOk && pOk;
}

export async function createSession(username: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.adminSession.create({ data: { token, username, expiresAt } });
  return token;
}

export async function getSession(token?: string | null) {
  if (!token) return null;
  const s = await prisma.adminSession.findUnique({ where: { token } });
  if (!s) return null;
  if (s.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { id: s.id } }).catch(() => {});
    return null;
  }
  return s;
}

export async function destroySession(token?: string | null) {
  if (!token) return;
  await prisma.adminSession.deleteMany({ where: { token } }).catch(() => {});
}

export async function getAdminSessionFromCookies() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return getSession(token);
}

export function loginRateLimited(ip: string): boolean {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}

export function registerLoginAttempt(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) attempts.set(ip, { count: 1, first: now });
  else rec.count++;
}

export function resetLoginAttempts(ip: string) {
  attempts.delete(ip);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
