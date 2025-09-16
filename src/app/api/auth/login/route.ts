import { lucia } from "@/lib/lucia";
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

    // Get user from database
    const userResult = await pool.query(
      "SELECT id, password FROM auth_user WHERE username = $1",
      [username]
    );

    const user = userResult.rows[0];

    // Verify user exists and password matches
    // In a real app, use proper password hashing (bcrypt, Argon2, etc.)
    if (!user || user.password !== password) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

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
