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

// Désactiver le cache pour le middleware
export const dynamic = 'force-dynamic';

// Chemins publics qui ne nécessitent pas d'authentification
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/auth',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/_vercel',
  '/site.webmanifest',
  '/sitemap.xml',
  '/robots.txt'
];

// Chemins d'API qui nécessitent une authentification
const PROTECTED_API_PATHS = [
  '/api/dashboard',
  '/api/user',
  '/api/admin'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Based on your excellent diagnosis, this will exclude all static files
  // from the authentication check. This is a generic solution that checks
  // for a file extension in the path.
  if (/\..*$/.test(pathname)) {
    return NextResponse.next();
  }

  const cookieName = 'auth_session';
  const sessionId = request.cookies.get(cookieName)?.value;
  
  // Vérifier si le chemin est public
  const isPublicPath = PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Vérifier si c'est une API protégée
  const isProtectedApi = PROTECTED_API_PATHS.some(apiPath => 
    pathname.startsWith(apiPath)
  );
  
  // Gestion de la déconnexion
  const isLogoutRequest = pathname === '/login' && 
                         request.nextUrl.searchParams.get('logout') === 'true';
  
  // Si c'est une demande de déconnexion, supprimer le cookie et rediriger
  if (isLogoutRequest) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(cookieName);
    return response;
  }
  
  // Si c'est une route publique, continuer sans vérification d'authentification
  if (isPublicPath && !isProtectedApi) {
    return NextResponse.next();
  }
  
  // Si pas de session ID et que la route est protégée, rediriger vers la page de connexion
  if (!sessionId) {
    // Pour les API, retourner une erreur 401
    if (isProtectedApi) {
      return new NextResponse(
        JSON.stringify({ error: 'Non authentifié' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Pour les pages, rediriger vers la page de connexion
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion ou d'inscription
  if (sessionId && (pathname === '/login' || pathname === '/register')) {
    // Vérifier si l'utilisateur est administrateur
    try {
      const session = await auth.validateSession(sessionId);
      if (session?.user) {
        const user = session.user as { role?: string };
        // Rediriger vers /admin si l'utilisateur est administrateur
        if (user.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
        // Sinon rediriger vers le tableau de bord
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Erreur lors de la validation de la session:', error);
      // En cas d'erreur, supprimer le cookie et rediriger vers la page de connexion
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(cookieName);
      return response;
    }
  }
  
  // Pour les routes protégées, vérifier la validité de la session
  if (sessionId && !isPublicPath) {
    try {
      const session = await auth.validateSession(sessionId);
      
      // Si la session est invalide ou expirée
      if (!session?.user) {
        // Pour les API, retourner une erreur 401
        if (isProtectedApi) {
          return new NextResponse(
            JSON.stringify({ error: 'Session expirée ou invalide' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Pour les pages, rediriger vers la page de connexion
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect_to', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(cookieName);
        return response;
      }
      
      // Vérifier les rôles si nécessaire (ex: accès admin)
      const user = session.user as { role?: string };
      if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
        // Rediriger vers la page non autorisée ou le tableau de bord
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // La session est valide, continuer la requête
      return NextResponse.next();
      
    } catch (error) {
      console.error('Erreur lors de la validation de la session:', error);
      
      // En cas d'erreur, supprimer le cookie et rediriger
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(cookieName);
      
      // Ajouter un en-tête pour indiquer une erreur de session
      response.headers.set('x-auth-error', 'Session validation failed');
      return response;
    }
  }
  
  // Pour toutes les autres requêtes, continuer normalement
  return NextResponse.next();
}
