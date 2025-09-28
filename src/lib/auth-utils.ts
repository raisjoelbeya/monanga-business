import { auth } from "./auth";
import { cookies } from 'next/headers';

// Définir une interface pour l'instance auth avec les méthodes nécessaires
interface AuthInstance {
  validateSession: (sessionId: string) => Promise<{ session: unknown; user: unknown }>;
  sessionCookieName?: string;
}

// Vérifier si l'objet est une instance d'authentification valide
function isAuthInstance(obj: unknown): obj is AuthInstance {
  if (!obj || typeof obj !== 'object') return false;
  
  const authObj = obj as Record<string, unknown>;
  return 'validateSession' in authObj && 
         typeof authObj.validateSession === 'function';
}

export async function getSession() {
  try {
    // Vérifier que auth est correctement initialisé
    if (!isAuthInstance(auth)) {
      console.error('❌ Auth is not properly initialized');
      return null;
    }

    // Utiliser le nom du cookie de session ou une valeur par défaut
    const cookieName = auth.sessionCookieName || 'auth_session';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(cookieName)?.value ?? null;
    
    if (!sessionId) {
      console.log('🔍 No session ID found in cookies');
      return null;
    }
    
    console.log('🔑 Validating session...');
    const result = await auth.validateSession(sessionId);
    
    if (!result?.session) {
      console.log('❌ No valid session found');
      return null;
    }
    
    console.log('✅ Session validated successfully');
    return { 
      session: result.session, 
      user: result.user 
    };
  } catch (error) {
    console.error('❌ Error validating session:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  // Ajoutez ici la logique pour vérifier si l'utilisateur est admin
  // Par exemple: if (!session.user.isAdmin) throw new Error('Not authorized');
  return session;
}
