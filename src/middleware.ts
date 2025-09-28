import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

// Middleware configuration
export const config = {
  // Explicitly opt-out of Edge Runtime
  runtime: 'nodejs',
  // Define URL patterns to match
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

export async function middleware(request: NextRequest) {
  if (!auth) {
    console.error('Auth is not properly initialized');
    return NextResponse.next();
  }
  
  // Utiliser une valeur par défaut pour le nom du cookie
  const cookieName = 'auth_session';
  const sessionId = request.cookies.get(cookieName)?.value ?? null;
  
  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!sessionId && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  if (sessionId && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth'))) {
    try {
      // Récupérer et vérifier la session
      const session = await auth.validateSession(sessionId);
      
      // Vérifier si la session et l'utilisateur sont valides
      if (session && typeof session === 'object' && 'user' in session && session.user) {
        const user = session.user as { role?: string };
        // Rediriger vers /admin si l'utilisateur est administrateur
        if (user.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
        // Sinon rediriger vers le dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Error validating session:', error);
      // En cas d'erreur, continuer avec la requête normale
    }
  }

  return NextResponse.next();
}
