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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: username },
      select: { id: true }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    const userId = generateId(15);
    
    // Create new user with generated username
    const userData = {
      id: userId,
      email: username,
      username: generateUsername(username),
      password: hashedPassword,
      emailVerified: false,
      // Additional fields can be added here
      // firstName: '',
      // lastName: '',
    };

    await prisma.user.create({
      data: userData
    });

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
