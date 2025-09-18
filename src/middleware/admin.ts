import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Liste des chemins protégés
const protectedPaths = ['/admin', '/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si le chemin actuel est protégé
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  try {
    // Récupérer l'ID de session depuis les cookies
    const sessionId = request.cookies.get(auth.sessionCookieName)?.value;
    
    if (!sessionId) {
      // Rediriger vers la page de connexion avec l'URL de redirection
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Valider la session
    const { session, user } = await auth.validateSession(sessionId);
    
    if (!session || !user) {
      // Supprimer le cookie de session invalide
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(auth.sessionCookieName);
      return response;
    }

    // Type assertion pour accéder aux propriétés de l'utilisateur
    const userWithAttributes = user as unknown as {
      email: string;
      email_verified: boolean;
      name: string | null;
      image: string | null;
      role: string;
    };
    
    // Vérifier le rôle administrateur
    if (userWithAttributes.role !== 'ADMIN') {
        return new NextResponse(
            JSON.stringify({error: 'Accès non autorisé'}),
            {status: 403, headers: {'Content-Type': 'application/json'}}
        );
    }

    // Si tout est bon, continuer
    return NextResponse.next();
  } catch (error) {
    console.error('Erreur dans le middleware admin:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur d\'authentification' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
