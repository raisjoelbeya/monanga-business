import { lucia } from "@/lib/lucia";
import { generateId } from "lucia";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/server/password";
import { generateUsername } from "@/lib/user-utils";

// Définir une interface pour l'instance Lucia avec les méthodes nécessaires
interface LuciaWithSession {
  createSession: (userId: string, attributes: Record<string, unknown>) => Promise<{ id: string }>;
  createSessionCookie: (sessionId: string) => {
    name: string;
    value: string;
    attributes: Record<string, unknown>;
  };
}

// Vérifier si l'objet est une instance de Lucia avec les méthodes de session
function isLuciaWithSession(obj: unknown): obj is LuciaWithSession {
  if (!obj || typeof obj !== 'object') return false;
  
  const luciaObj = obj as Record<string, unknown>;
  return (
    typeof luciaObj.createSession === 'function' &&
    typeof luciaObj.createSessionCookie === 'function'
  );
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    
    // Basic validation
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400 }
      );
    }
    
    // Normaliser l'email en minuscules
    const normalizedEmail = username.toLowerCase().trim();
    
    // Vérifier si l'utilisateur existe déjà (insensible à la casse)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      },
      select: { id: true }
    });
    
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "Un compte avec cette adresse email existe déjà",
          code: "EMAIL_ALREADY_EXISTS"
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    const userId = generateId(15);
    
    // Créer un nouvel utilisateur avec email en minuscules
    const userData = {
      id: userId,
      email: normalizedEmail,
      username: await generateUsername(normalizedEmail),
      password: hashedPassword,
      emailVerified: false,
      // firstName: '',
      // lastName: '',
    };
    
    try {
      await prisma.user.create({
        data: userData
      });
    } catch (error) {
      // Gérer spécifiquement les erreurs de contrainte d'unicité
      const prismaError = error as { code?: string; meta?: { target?: string[] } };
      if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('email')) {
        return new Response(
          JSON.stringify({
            error: "Un compte avec cette adresse email existe déjà",
            code: "EMAIL_ALREADY_EXISTS"
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      // Relancer les autres erreurs
      throw error;
    }
    
    // Vérifier que lucia est correctement initialisé avec les méthodes de session
    if (!isLuciaWithSession(lucia)) {
      console.error('Lucia is not properly initialized or missing session methods');
      return new Response(
        JSON.stringify({ error: 'Authentication service unavailable' }),
        { status: 500 }
      );
    }
    
    // Créer la session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    // Créer la réponse avec le cookie de session
    return new Response(
      JSON.stringify({
        success: true,
        userId
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `${sessionCookie.name}=${sessionCookie.value}; ${Object.entries(sessionCookie.attributes)
            .filter(entry => entry[1] !== undefined && entry[1] !== null)
            .map(([key, value]) => (value === true ? key : `${key}=${value}`))
            .join('; ')}`
        }
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
