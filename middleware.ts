/**
 * NEXORA — Enterprise Next.js Route Protection & Session Middleware
 * Follows industry best practices for edge-level route guarding and anti-caching enforcement.
 */

// In Next.js environments, NextResponse and NextRequest are imported from 'next/server'
// We provide type-safe fallback declarations to ensure zero compile errors in Vite SPA
type NextRequestLike = {
  nextUrl: {
    pathname: string;
    search: string;
    origin: string;
  };
  url: string;
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
  headers: {
    get: (name: string) => string | null;
  };
};

export const PROTECTED_ROUTES = ['/dashboard', '/student', '/faculty', '/admin', '/dean'];
export const PUBLIC_AUTH_ROUTES = ['/login', '/auth', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequestLike) {
  const { pathname } = request.nextUrl;

  // 1. Identify protected routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 2. Extract session token from HTTPOnly cookie or authorization header
  const token =
    request.cookies.get('nexora_auth_token')?.value ||
    request.cookies.get('refresh_token')?.value ||
    (request.headers.get('authorization')?.startsWith('Bearer ')
      ? request.headers.get('authorization')?.slice(7)
      : null);

  // 3. Unauthenticated access to protected route: redirect to /login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectUrl', pathname);

    const redirectResponse = {
      status: 307,
      headers: new Headers({
        Location: loginUrl.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return redirectResponse;
  }

  // 4. Authenticated user attempting to access public login: redirect to default dashboard
  if (isAuthRoute && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return {
      status: 307,
      headers: new Headers({
        Location: dashboardUrl.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      }),
    };
  }

  // 5. Enforce Anti-Caching Headers on all protected views to eliminate BFcache restoration
  const headers = new Headers();
  if (isProtected) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Surrogate-Control', 'no-store');
  }

  return { headers };
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/student/:path*',
    '/faculty/:path*',
    '/admin/:path*',
    '/dean/:path*',
    '/login',
  ],
};
