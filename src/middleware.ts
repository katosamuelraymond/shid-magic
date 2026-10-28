import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isAdminSubdomain = host.startsWith('admin.');

  // Check auth session cookie
  const authSession = request.cookies.get('shid_admin_session')?.value;
  const isAuthenticated = authSession === 'authenticated_admin_shidmagic_2026';

  // 1. If accessing via admin subdomain (e.g. admin.shidmagic.com or admin.localhost:3000)
  if (isAdminSubdomain) {
    if (pathname === '/') {
      if (!isAuthenticated) {
        return NextResponse.rewrite(new URL('/admin/login', request.url));
      }
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
  }

  // 2. Direct path protection for /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (!isAuthenticated && !isLoginPage) {
      // Redirect unauthenticated visitor to login portal
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isLoginPage) {
      // If already logged in, redirect straight to dashboard
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
