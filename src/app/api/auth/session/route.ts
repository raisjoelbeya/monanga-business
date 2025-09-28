import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Définir une interface pour l'instance auth avec les méthodes nécessaires
interface AuthInstance {
  validateSession: (sessionId: string) => Promise<{ user: unknown; session: unknown }>;
  sessionCookieName?: string;
}

// Vérifier si l'objet est une instance d'authentification valide
function isAuthInstance(obj: unknown): obj is AuthInstance {
  if (!obj || typeof obj !== 'object') return false;
  
  const authObj = obj as Record<string, unknown>;
  return 'validateSession' in authObj && 
         typeof authObj.validateSession === 'function';
}

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Vérifier que auth est correctement initialisé
    if (!isAuthInstance(auth)) {
      console.error('❌ Auth is not properly initialized');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          code: 'AUTH_SERVICE_UNAVAILABLE'
        }),
        { 
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          }
        }
      );
    }

    // Utiliser le nom du cookie de session ou une valeur par défaut
    const cookieName = auth.sessionCookieName || 'auth_session';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(cookieName)?.value;
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Non authentifié',
          code: 'UNAUTHORIZED',
          authenticated: false
        }), 
        { 
          status: 200, // Retourner 200 même si non authentifié pour faciliter la gestion côté client
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          }
        }
      );
    }
    
    // Valider la session
    const { user, session } = await auth.validateSession(sessionId);
    
    if (!user || !session) {
      // Si la session est invalide, supprimer le cookie
      const response = new NextResponse(
        JSON.stringify({ 
          error: 'Session invalide ou expirée',
          code: 'INVALID_SESSION',
          authenticated: false
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          }
        }
      );
      
      // Supprimer le cookie de session invalide
      response.cookies.delete(cookieName);
      return response;
    }
    
    // Retourner les informations utilisateur sans données sensibles
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      image: user.image,
      role: user.role,
      email_verified: user.emailVerified
    };

    return new NextResponse(
      JSON.stringify({ 
        user: safeUser,
        authenticated: true,
        session: {
          id: session.id,
          expiresAt: session.expiresAt
        }
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
    
  } catch (error) {
    console.error('❌ Erreur de vérification de session:', error);
    
    // En cas d'erreur, supprimer le cookie de session par précaution
    const cookieName = auth.sessionCookieName || 'auth_session';
    const response = new NextResponse(
      JSON.stringify({ 
        error: 'Erreur serveur lors de la vérification de la session',
        code: 'SERVER_ERROR',
        authenticated: false
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
    
    // Supprimer le cookie en cas d'erreur
    response.cookies.delete(cookieName);
    return response;
  }
}
