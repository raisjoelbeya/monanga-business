'server-only';

import { cookies } from "next/headers";
import { auth } from "../auth";

// Définir une interface pour l'instance auth avec les méthodes nécessaires
interface AuthInstance {
  validateSession: (sessionId: string) => Promise<{ 
    session: { id: string; fresh?: boolean } | null; 
    user: { id: string; [key: string]: unknown } | null 
  }>;
  createSessionCookie: (sessionId: string) => { 
    name: string; 
    value: string; 
    attributes: Record<string, string | boolean | number | Date> 
  };
  createBlankSessionCookie: () => { 
    name: string; 
    value: string; 
    attributes: Record<string, string | boolean | number | Date> 
  };
  sessionCookieName?: string;
  invalidateSession?: (sessionId: string) => Promise<void>;
}

// Vérifier si l'objet est une instance d'authentification valide
function isAuthInstance(obj: unknown): obj is AuthInstance {
  if (!obj || typeof obj !== 'object') return false;
  
  const authObj = obj as Record<string, unknown>;
  return (
    'validateSession' in authObj && 
    'createSessionCookie' in authObj &&
    'createBlankSessionCookie' in authObj &&
    typeof authObj.validateSession === 'function' &&
    typeof authObj.createSessionCookie === 'function' &&
    typeof authObj.createBlankSessionCookie === 'function'
  );
}

// Récupérer la session + user
export const getServerSession = async () => {
    // Vérifier que auth est correctement initialisé
    if (!isAuthInstance(auth)) {
        console.error('Auth is not properly initialized');
        return { session: null, user: null };
    }

    // Utiliser le nom du cookie de session ou une valeur par défaut
    const cookieName = auth.sessionCookieName || 'auth_session';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(cookieName)?.value ?? null;
    
    if (!sessionId) return { session: null, user: null };

    try {
        const { session, user } = await auth.validateSession(sessionId);
        const updatedCookieStore = await cookies();

        if (session?.fresh) {
            const sessionCookie = auth.createSessionCookie(session.id);
            updatedCookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }

        if (!session) {
            const blankCookie = auth.createBlankSessionCookie();
            updatedCookieStore.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
        }

        return { session, user };
    } catch (error) {
        console.error('Error validating session:', error);
        return { session: null, user: null };
    }
};

// Vérifier si connecté
export const requireAuth = async () => {
    const { session, user } = await getServerSession();
    if (!session || !user) {
        throw new Error('Not authenticated');
    }
    return { session, user };
};

// Déconnexion
export const signOut = async () => {
    if (!isAuthInstance(auth)) {
        console.error('Auth is not properly initialized');
        return false;
    }

    try {
        // Récupérer l'ID de session
        const cookieName = auth.sessionCookieName || 'auth_session';
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(cookieName)?.value;
        
        if (sessionId) {
            // Invalider la session côté serveur
            if (auth.invalidateSession) {
                await auth.invalidateSession(sessionId);
            }
        }
        
        // Créer et définir un cookie vide
        const blankCookie = auth.createBlankSessionCookie();
        cookieStore.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
        
        return true;
    } catch (error) {
        console.error('Error during sign out:', error);
        // En cas d'erreur, essayer de supprimer le cookie quand même
        try {
            const cookieStore = await cookies();
            const blankCookie = auth.createBlankSessionCookie();
            cookieStore.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
        } catch (cookieError) {
            console.error('Error clearing session cookie:', cookieError);
        }
        return false;
    }
};
