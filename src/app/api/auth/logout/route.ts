import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Définir une interface pour l'instance Lucia avec les méthodes nécessaires
interface LuciaInstance {
  invalidateSession: (sessionId: string) => Promise<void>;
  createBlankSessionCookie: () => { 
    name: string; 
    value: string; 
    attributes: Record<string, unknown> 
  };
  sessionCookieName?: string;
}

// Vérifier si l'objet est une instance de Lucia valide
function isLuciaInstance(obj: unknown): obj is LuciaInstance {
  if (!obj || typeof obj !== 'object') return false;
  
  // Utiliser une assertion de type pour accéder aux propriétés en toute sécurité
  const luciaObj = obj as Record<string, unknown>;
  return (
    typeof luciaObj.invalidateSession === 'function' &&
    typeof luciaObj.createBlankSessionCookie === 'function'
  );
}

export async function POST() {
  try {
    // Vérifier que lucia est défini et est une instance de Lucia valide
    if (!isLuciaInstance(lucia)) {
      console.error('Lucia is not properly initialized or invalid');
      return new NextResponse(
        JSON.stringify({ error: 'Authentication service unavailable' }),
        { status: 500 }
      );
    }

    // Utiliser le nom du cookie de session de Lucia ou une valeur par défaut
    const cookieName = lucia.sessionCookieName || 'auth_session';
    const sessionId = (await cookies()).get(cookieName)?.value ?? null;
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: "Aucune session active" }),
        { status: 401 }
      );
    }

    // Invalider la session
    await lucia.invalidateSession(sessionId);
    
    // Créer un cookie de session vide
    const sessionCookie = lucia.createBlankSessionCookie();
    
    // Définir le cookie de session vide
    (await cookies()).set(
      sessionCookie.name, 
      sessionCookie.value, 
      sessionCookie.attributes
    );

    // Nous utilisons déjà cookies().set() plus haut, donc pas besoin de définir à nouveau le cookie ici
    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Une erreur est survenue lors de la déconnexion' }),
      { status: 500 }
    );
  }
}
