import { NextRequest, NextResponse } from 'next/server';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { getOAuthProvider } from '@/lib/auth-config';
import { authRateLimit } from '@/lib/rate-limit';
import { randomBytes } from 'crypto';
import type { Redis } from 'ioredis';

// Redis est optionnel - seulement utilisé si REDIS_URL est configuré
let RedisClient: Redis | null = null;

// Chargement asynchrone de Redis uniquement si nécessaire
if (process.env.REDIS_URL) {
  import('ioredis')
    .then((Redis) => {
      RedisClient = new Redis.default(process.env.REDIS_URL!);
    })
    .catch((error) => {
      console.warn('Redis n\'a pas pu être initialisé:', error);
    });
}

export async function GET(request: NextRequest) {
  // Appliquer la limitation de taux
  const rateLimitResponse = await authRateLimit(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider');

    if (!providerId) {
      return new NextResponse(
        JSON.stringify({ error: 'Fournisseur non spécifié' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const provider = getOAuthProvider(providerId);
    if (!provider) {
      return new NextResponse(
        JSON.stringify({ error: 'Fournisseur non pris en charge' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Générer un état et un code_verifier pour PKCE
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const sessionId = randomBytes(16).toString('hex');
    // Support both snake_case and camelCase for redirect param, default to dashboard
    const redirectTo = searchParams.get('redirect_to') || searchParams.get('redirectTo') || '/dashboard';
    
    // Créer l'URL d'autorisation
    const authorizationUrl = new URL(provider.authorization.url);
    
    // Construire la même base URL que celle utilisée par Arctic dans src/lib/auth.ts
    const getAuthBaseUrl = () => {
      if (process.env.NODE_ENV === 'production') {
        return 'https://monanga-business.vercel.app';
      }
      return process.env.NEXTAUTH_URL || 'http://localhost:3000';
    };
    const authBaseUrl = getAuthBaseUrl();

    // Ajouter les paramètres d'autorisation
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: `${authBaseUrl}/api/auth/callback/${provider.id}`,
      response_type: 'code',
      state,
      ...(provider.authorization.params || {}),
    });
    
    const mask = (v?: string | null) => v ? `${v.slice(0,4)}...${v.slice(-4)}` : 'undefined';
    console.log('Provider ID:', provider.id);
    console.log('Redirect URI:', `${authBaseUrl}/api/auth/callback/${provider.id}`);
    console.log('Client ID (init)', mask(provider.clientId));

    // Ajouter le code_challenge si on utilise PKCE
    // Facebook: ne pas utiliser PKCE pour rester cohérent avec l'échange côté callback
    if (provider.version === '2.0' && codeVerifier && provider.id !== 'facebook') {
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      params.set('code_challenge', codeChallenge);
      params.set('code_challenge_method', 'S256');
    }

    authorizationUrl.search = params.toString();

    // Fonction utilitaire pour créer des options de cookie sécurisées
    const createCookieOptions = (path: string, maxAge: number) => ({
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'lax' : 'lax') as 'lax' | 'none',
      path,
      maxAge,
      domain: process.env.NODE_ENV === 'production' ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN || 'monanga-business.vercel.app'}` : undefined
    } as const);

    const codeVerifierCookie = {
      name: 'code_verifier',
      value: codeVerifier,
      options: createCookieOptions('/api/auth/callback', 60 * 15) // 15 minutes
    };

    // Cookie combiné attendu par le callback: oauth_${provider}_state
    const combinedStateCookie = {
      name: `oauth_${provider.id}_state`,
      value: JSON.stringify({ state, codeVerifier, redirectTo }),
      options: createCookieOptions('/api/auth/callback', 60 * 15) // 15 minutes
    };

    // Cookie de redirection attendu par le callback en fallback
    const redirectCookie = {
      name: 'oauth_redirect_uri',
      value: redirectTo,
      options: createCookieOptions('/', 60 * 15)
    };

    const sessionCookie = {
      name: 'session_id',
      value: sessionId,
      options: createCookieOptions('/', 60 * 60 * 24 * 7) // 7 days
    };

    // Définir les cookies
    (await cookies()).set(codeVerifierCookie.name, codeVerifierCookie.value, codeVerifierCookie.options);
    (await cookies()).set(combinedStateCookie.name, combinedStateCookie.value, combinedStateCookie.options);
    (await cookies()).set(redirectCookie.name, redirectCookie.value, redirectCookie.options);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

    // Stocker également l'état et le code_verifier dans une session côté serveur ou un cache
    if (RedisClient) {
      try {
        await RedisClient.set(`oauth:${sessionId}`, JSON.stringify({
          state,
          codeVerifier,
          provider: provider.id,
          timestamp: Date.now()
        }), 'EX', 60 * 15); // 15 minutes expiration
      } catch (error) {
        console.error('Erreur lors de la connexion à Redis:', error);
        // Continuer même en cas d'erreur Redis
      }
    }

    // Préparer la réponse de redirection
    const redirectResponse = NextResponse.redirect(authorizationUrl.toString());

    // Définir les cookies sur la réponse de redirection (garantit l'envoi des Set-Cookie)
    redirectResponse.cookies.set(codeVerifierCookie.name, codeVerifierCookie.value, codeVerifierCookie.options);
    redirectResponse.cookies.set(combinedStateCookie.name, combinedStateCookie.value, combinedStateCookie.options);
    redirectResponse.cookies.set(redirectCookie.name, redirectCookie.value, redirectCookie.options);
    redirectResponse.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

    // Rediriger vers l'URL d'autorisation
    return redirectResponse;
  } catch (error) {
    console.error('Error in OAuth initiation:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Fonction utilitaire pour générer un code challenge PKCE
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
