import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/server/password";

export async function POST(req: Request) {
  try {
    const { username, password: passwordInput } = await req.json();

    // Basic validation
    if (!username || !passwordInput) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: username },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        image: true,
        role: true,
        password: true
      }
    });

    // Verify user exists and password matches
    if (!user || !(await verifyPassword(passwordInput, user.password || ''))) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

    // Create session
 // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Exclure le mot de passe de la réponse
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    
    return new Response(
      JSON.stringify({ 
        success: true,
        user: userWithoutPassword
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
