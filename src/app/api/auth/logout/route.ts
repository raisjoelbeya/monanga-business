import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    
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

    return new NextResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          'Set-Cookie': sessionCookie.serialize()
        }
      }
    );
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la déconnexion" }),
      { status: 500 }
    );
  }
}
