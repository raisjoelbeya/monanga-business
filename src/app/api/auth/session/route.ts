import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Définir une interface pour l'instance auth avec les méthodes nécessaires
interface AuthInstance {
  validateSession: (sessionId: string) => Promise<{ user: unknown }>;
  sessionCookieName?: string;
}

// Vérifier si l'objet est une instance d'authentification valide
function isAuthInstance(obj: unknown): obj is AuthInstance {
  if (!obj || typeof obj !== 'object') return false;
  
  // Utiliser une assertion de type sécurisée
  const authObj = obj as Record<string, unknown>;
  return 'validateSession' in authObj && 
         typeof authObj.validateSession === 'function';
}

export async function GET() {
  try {
    // Vérifier que auth est correctement initialisé
    if (!isAuthInstance(auth)) {
      console.error('Auth is not properly initialized');
      return new NextResponse(
        JSON.stringify({ error: 'Authentication service unavailable' }),
        { status: 500 }
      );
    }

    // Utiliser le nom du cookie de session ou une valeur par défaut
    const cookieName = auth.sessionCookieName || 'auth_session';
    const sessionId = (await cookies()).get(cookieName)?.value;
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Non authentifié' }), 
        { status: 401 }
      );
    }
    
    const { user } = await auth.validateSession(sessionId);
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Session invalide' }), 
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Erreur de vérification de session:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur serveur' }), 
      { status: 500 }
    );
  }
}
