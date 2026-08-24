import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const response = intlMiddleware(req);
  const { pathname } = req.nextUrl;

  // Admin guard — token presence only (signature verified in API/layout).
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/fr/admin') || pathname.startsWith('/ar/admin');
  const isLogin = pathname.includes('/admin/login');
  if (isAdmin && !isLogin) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      const url = new URL('/fr/admin/login', req.url);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
