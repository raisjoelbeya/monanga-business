import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Définir une interface pour l'instance Lucia avec les méthodes nécessaires
interface LuciaInstance {
  validateSession: (sessionId: string) => Promise<{ user: { id: string } | null }>;
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
  
  const luciaObj = obj as Record<string, unknown>;
  return (
    typeof luciaObj.validateSession === 'function' &&
    typeof luciaObj.createBlankSessionCookie === 'function'
  );
}

export async function GET() {
  try {
    // Vérifier que lucia est défini et est une instance de Lucia valide
    if (!isLuciaInstance(lucia)) {
      console.error('Lucia is not properly initialized or invalid');
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }

    // Utiliser le nom du cookie de session de Lucia ou une valeur par défaut
    const cookieName = lucia.sessionCookieName || 'auth_session';
    const sessionId = (await cookies()).get(cookieName)?.value ?? null;
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }

    if (!sessionId) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }

    // Valider la session
    const sessionValidation = await lucia.validateSession(sessionId);
    
    if (!sessionValidation?.user) {
      // Session invalide, créer un cookie vide
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }
    
    const sessionUser = sessionValidation.user;

    // Récupérer les informations complètes de l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        image: true,
        role: true
      }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          image: user.image,
          role: user.role,
          // Pour la rétrocompatibilité avec le code existant qui pourrait attendre un champ name
          name: user.firstName || user.username || user.email.split('@')[0]
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Session validation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
