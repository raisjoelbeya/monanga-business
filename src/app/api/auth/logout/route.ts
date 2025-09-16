import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: "No active session" }),
        { status: 400 }
      );
    }

    // Invalidate session
    await lucia.invalidateSession(sessionId);
    
    // Create blank session cookie
    const sessionCookie = lucia.createBlankSessionCookie();
    
    // Set the cookie
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
