import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/server/password";
import { getAuth } from "@/lib/auth";

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

    console.log('Tentative de connexion pour:', username);
    
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

    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    // Verify user exists
    if (!user) {
      console.log('Aucun utilisateur trouvé avec cet email');
      return new Response(
        JSON.stringify({ error: "Identifiants invalides" }),
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(passwordInput, user.password || '');
    console.log('Mot de passe valide:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Mot de passe incorrect pour l\'utilisateur:', user.email);
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

    // Exclure le mot de passe de la réponse
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    
    try {
      // Get the auth instance
      const auth = await getAuth();
      
      // Create session
      const session = await auth.createSession(user.id, {});
      
      // Create session cookie
      const sessionCookie = auth.createSessionCookie(session.id);
      
      // Format cookie header
      const cookieAttributes = [
        `Path=/`,
        `SameSite=Lax`,
        `HttpOnly`,
        ...Object.entries(sessionCookie.attributes)
          .filter(entry => entry[1] !== undefined && entry[1] !== null)
          .map(([key, value]) => {
            if (value === true) return key;
            return `${key}=${value}`;
          })
      ].join('; ');
      
      // Create response with user data and cookie
      const response = new Response(
        JSON.stringify({ 
          success: true,
          user: userWithoutPassword
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `${sessionCookie.name}=${sessionCookie.value}; ${cookieAttributes}`
          }
        }
      );
      
      console.log('Cookie de session défini:', sessionCookie.name, '=', sessionCookie.value.substring(0, 10) + '...');
      return response;
    } catch (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication service error' }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
