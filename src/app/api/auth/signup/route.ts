import { lucia } from "@/lib/lucia";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/server/password";
import { generateUsername } from "@/lib/user-utils";

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
      // Additional fields can be added here
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

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(
      JSON.stringify({ 
        success: true,
        userId 
      }), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
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
