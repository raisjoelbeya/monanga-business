import { getLucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Récupérer l'instance Lucia
    const lucia = await getLucia();
    
    // Utiliser le nom du cookie de session de Lucia
    const cookieName = lucia.sessionCookieName || 'auth_session';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(cookieName)?.value ?? null;
    
    // Invalider la session si elle existe
    if (sessionId) {
      try {
        await lucia.invalidateSession(sessionId);
      } catch (error) {
        console.error('Error invalidating session:', error);
        // On continue même en cas d'erreur pour supprimer le cookie
      }
    }
    
    // Créer un cookie de session vide qui expire immédiatement
    const sessionCookie = lucia.createBlankSessionCookie();
    
    // S'assurer que le cookie expire immédiatement
    const cookieAttributes = [
      `Path=${sessionCookie.attributes.path}`,
      `SameSite=${sessionCookie.attributes.sameSite}`,
      `HttpOnly`,
      sessionCookie.attributes.secure ? 'Secure' : '',
      'Max-Age=0',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ].filter(Boolean).join('; ');
    
    // Créer la réponse avec le cookie de session vide
    return new NextResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          'Set-Cookie': `${sessionCookie.name}=; ${cookieAttributes}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Logout error:', errorMessage);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la déconnexion',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}
