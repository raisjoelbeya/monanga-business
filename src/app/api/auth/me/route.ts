import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200 }
      );
    }

    const { user } = await lucia.validateSession(sessionId);
    
    if (!user) {
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

    return new Response(
      JSON.stringify({ 
        user: {
          id: user.id,
          username: user.username
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
