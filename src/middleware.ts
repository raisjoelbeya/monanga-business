import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

// Middleware configuration
export const config = {
  // Explicitly opt-out of Edge Runtime
  runtime: 'nodejs',
  // Define URL patterns to match
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;
  
  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!sessionId && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  if (sessionId && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
