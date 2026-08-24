import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, signToken, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const token = signToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
