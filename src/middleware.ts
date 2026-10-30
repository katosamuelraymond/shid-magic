import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  // Clean host from port (e.g., "admin.localhost:3000" -> "admin.localhost", "admin.shidmagic.com" -> "admin.shidmagic.com")
  const hostname = host.split(':')[0].toLowerCase();
  const isAdminSubdomain = hostname.startsWith('admin.');

  // Check auth session cookie
  const authSession = request.cookies.get('shid_admin_session')?.value;
  const isAuthenticated = authSession === 'authenticated_admin_shidmagic_2026';

  // 1. SUBDOMAIN ROUTING: When visiting via admin.* subdomain
  if (isAdminSubdomain) {
    // If accessing root "/" on admin subdomain
    if (pathname === '/') {
      if (!isAuthenticated) {
        return NextResponse.rewrite(new URL('/admin/login', request.url));
      }
      return NextResponse.rewrite(new URL('/admin', request.url));
    }

    // If accessing "/login" on admin subdomain
    if (pathname === '/login') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    }

    // If user accesses /admin directly on admin subdomain (e.g. admin.domain.com/admin)
    if (pathname.startsWith('/admin')) {
      const subPath = pathname.replace(/^\/admin/, '') || '/';
      return NextResponse.redirect(new URL(subPath, request.url));
    }
  }

  // 2. PATH ROUTING: When visiting /admin directly on main domain
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
