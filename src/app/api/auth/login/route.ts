import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/server/password";

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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: username },
      select: {
        id: true,
        password: true
      }
    });

    // Verify user exists and password matches
    if (!user || !(await verifyPassword(password, user.password || ''))) {
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

    return new Response(
      JSON.stringify({ 
        success: true,
        userId: user.id
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
