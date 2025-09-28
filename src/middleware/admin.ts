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
    // Vérifier que auth est correctement initialisé
    if (!auth) {
      console.error('Auth is not properly initialized');
      return new NextResponse(
        JSON.stringify({error: 'Erreur de configuration du serveur'}),
        {status: 500, headers: {'Content-Type': 'application/json'}}
      );
    }

    // Utiliser une valeur par défaut pour le nom du cookie
    const cookieName = 'auth_session';
    const sessionId = request.cookies.get(cookieName)?.value;
    
    if (!sessionId) {
      // Rediriger vers la page de connexion avec l'URL de redirection
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Valider la session avec un typage explicite
    const result = await auth.validateSession(sessionId) as { 
      session: { id: string } | null; 
      user: { role: string; [key: string]: unknown } | null 
    };
    const { session, user } = result;
    
    if (!session || !user) {
      // Supprimer le cookie de session invalide
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(cookieName);
      return response;
    }

    // Vérifier le rôle administrateur
    if (user.role !== 'ADMIN') {
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
