import { lucia } from "@/lib/lucia";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

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
    const userExists = await pool.query(
      "SELECT id FROM auth_user WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        { status: 400 }
      );
    }

    // In a real app, you should hash the password here
    // For now, we'll store it as is (NOT RECOMMENDED FOR PRODUCTION)
    const userId = generateId(15);
    
    await pool.query(
      "INSERT INTO auth_user (id, username, password) VALUES ($1, $2, $3)",
      [userId, username, password]
    );

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
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
