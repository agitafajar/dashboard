import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lewatkan API routes
  if (pathname.startsWith('/api')) return NextResponse.next();

  const token = req.cookies.get('token')?.value;

  // Proteksi beranda
  if (!token && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Jika sudah login, cegah akses ke halaman login
  if (token && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};