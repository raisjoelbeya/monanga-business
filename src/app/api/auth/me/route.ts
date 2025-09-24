import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }

    const { user: sessionUser } = await lucia.validateSession(sessionId);
    
    if (!sessionUser) {
      // Invalid session
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
