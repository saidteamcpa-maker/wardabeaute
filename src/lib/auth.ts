import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'insecure-dev-secret-change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'warda-admin-2026';
const COOKIE = 'admin_token';

export function verifyPassword(input: string): boolean {
  return input === ADMIN_PASSWORD;
}

export function signToken(): string {
  return jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = COOKIE;
