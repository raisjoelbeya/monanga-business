import { getLucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Récupérer l'instance Lucia
    const lucia = await getLucia();
    
    // Utiliser le nom du cookie de session de Lucia ou une valeur par défaut
    const cookieName = 'auth_session'; // Utiliser le nom du cookie directement
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(cookieName)?.value ?? null;
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: "Aucune session active" }),
        { status: 401 }
      );
    }

    try {
      // Invalider la session
      await lucia.invalidateSession(sessionId);
    } catch (error) {
      console.error('Error invalidating session:', error);
      // Continuer même en cas d'erreur d'invalidation pour supprimer le cookie
    }
    
    // Créer un cookie de session vide
    const sessionCookie = {
      name: cookieName,
      value: '',
      attributes: {
        path: '/',
        sameSite: 'lax' as const,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0 // Expire immédiatement
      }
    };
    
    // Créer la chaîne d'attributs du cookie
    const cookieAttributes = Object.entries(sessionCookie.attributes)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => value === true ? key : `${key}=${value}`)
      .join('; ');
    
    // Créer la réponse avec le cookie de session vide
    return new NextResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          'Set-Cookie': `${sessionCookie.name}=${sessionCookie.value}; ${cookieAttributes}`
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Une erreur est survenue lors de la déconnexion' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
