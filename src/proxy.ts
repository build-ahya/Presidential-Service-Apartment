import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Gate for the admin area. Pages additionally check the session on the server
 * (see the (panel) layout) and every admin API route calls `requireStaff`.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_ACCESS_SECRET,
  });

  if (!token?.id || !token.role) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    url.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
