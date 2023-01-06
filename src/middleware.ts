import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt } from './lib/jwt';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_proxy & /_auth (special pages for OG tag proxying and password protection)
     * 4. /_static (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_proxy|_auth|_static|va|[\\w-]+\\.\\w+).*)',
  ],
};

export const middleware = async (req: NextRequest, res: NextResponse) => {
  const token = req.cookies.get('sessionToken')?.value;
  const session = await decrypt({ token, secret: process.env.TOKEN_SECRET! });
  const isAuthorized = !!session;

  const { pathname } = req.nextUrl;

  if (pathname.includes('/_next')) {
    return NextResponse.next();
  }

  if (!isAuthorized && pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
};
