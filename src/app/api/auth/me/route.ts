import { getLucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import type { CookieAttributes } from "lucia";

// Fonction utilitaire pour créer une réponse JSON
const jsonResponse = <T>(data: T, status = 200, headers: Record<string, string> = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
};

// Fonction utilitaire pour formater les attributs du cookie
const formatCookieAttributes = (attributes: CookieAttributes) => {
  return Object.entries(attributes)
    .filter(entry => entry[1] !== undefined && entry[1] !== null)
    .map(([key, value]) => value === true ? key : `${key}=${value}`)
    .join('; ');
};

export async function GET() {
  try {
    const lucia = await getLucia();
    
    // Récupérer l'ID de session depuis les cookies de manière asynchrone
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth_session')?.value ?? null;
    
    // Si pas de session ID, retourner null
    if (!sessionId) {
      return jsonResponse({ user: null });
    }

    // Valider la session
    const { user } = await lucia.validateSession(sessionId);
    
    // Si la session n'est pas valide, invalider le cookie
    if (!user) {
      const sessionCookie = lucia.createBlankSessionCookie();
      return jsonResponse(
        { user: null },
        200,
        {
          'Set-Cookie': `${sessionCookie.name}=${sessionCookie.value}; ${formatCookieAttributes(sessionCookie.attributes)}`
        }
      );
    }
    
    // Récupérer les informations de l'utilisateur depuis la base de données
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        image: true,
        role: true,
        emailVerified: true
      }
    });

    // Si l'utilisateur n'existe plus dans la base de données
    if (!userData) {
      const sessionCookie = lucia.createBlankSessionCookie();
      return jsonResponse(
        { user: null },
        200,
        {
          'Set-Cookie': `${sessionCookie.name}=${sessionCookie.value}; ${formatCookieAttributes(sessionCookie.attributes)}`
        }
      );
    }

    // Retourner les informations de l'utilisateur
    return jsonResponse({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        image: userData.image,
        role: userData.role,
        emailVerified: userData.emailVerified,
        name: [userData.firstName, userData.lastName].filter(Boolean).join(' ') || userData.email?.split('@')[0]
      }
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return jsonResponse(
      { error: 'Internal server error' },
      500
    );
  }
}
