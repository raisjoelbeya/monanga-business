import { NextRequest, NextResponse } from 'next/server';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { getOAuthProvider } from '@/lib/auth-config';
import { authRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Appliquer la limitation de taux
  const rateLimitResponse = await authRateLimit(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider');
    const redirectTo = searchParams.get('redirect_to') || '/dashboard';

    if (!providerId) {
      return new NextResponse(
        JSON.stringify({ error: 'Fournisseur non spécifié' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const provider = getOAuthProvider(providerId);
    if (!provider) {
      return new NextResponse(
        JSON.stringify({ error: 'Unsupported provider' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Générer un état et un code_verifier pour PKCE
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    
    // Créer l'URL d'autorisation
    const authorizationUrl = new URL(provider.authorization.url);
    
    // Ajouter les paramètres d'autorisation
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/${provider.id}`,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      ...(provider.authorization.params || {}),
    });
    
    console.log('Provider ID:', provider.id);
    console.log('Redirect URI:', `${process.env.NEXTAUTH_URL}/api/auth/callback/${provider.id}`);

    // Ajouter le code_challenge si on utilise PKCE
    if (provider.version === '2.0' && codeVerifier) {
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      params.set('code_challenge', codeChallenge);
      params.set('code_challenge_method', 'S256');
    }

    authorizationUrl.search = params.toString();

    // Stocker l'état et le code_verifier dans un cookie sécurisé
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
      sameSite: 'lax' as const,
    };

    (await cookies()).set(
      `oauth_${provider.id}_state`,
      JSON.stringify({
        state,
        codeVerifier,
        redirectTo,
      }),
      cookieOptions
    );

    // Rediriger vers l'URL d'autorisation
    return NextResponse.redirect(authorizationUrl.toString());
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
