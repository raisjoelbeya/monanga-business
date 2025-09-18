import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { NextResponse } from 'next/server';
import { google, facebook, auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Configuration des fournisseurs OAuth
const providers = {
  google: {
    instance: google,
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  facebook: {
    instance: facebook,
    userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,email,picture',
  },
} as const;

type Provider = keyof typeof providers;

type OAuthUserInfo = {
  email: string;
  name?: string;
  picture?: string | { data?: { url?: string } };
  email_verified?: boolean;
};

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    
    // Vérifier que le fournisseur est pris en charge
    if (!(provider in providers)) {
      logger.warn(`Fournisseur OAuth non pris en charge: ${provider}`);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=OAuthProviderNotSupported`
      );
    }
    
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const codeVerifier = (await cookies()).get('code_verifier')?.value;
    const storedState = (await cookies()).get(`oauth_${provider}_state`)?.value;
    const redirectTo = (await cookies()).get('oauth_redirect_uri')?.value || '/';
    
    // Valider l'état pour prévenir les attaques CSRF
    if (!storedState || !state || storedState !== state || !code || !codeVerifier) {
      logger.warn('Échec de la validation de l\'état OAuth', { 
        provider,
        hasStoredState: !!storedState,
        hasState: !!state,
        statesMatch: storedState === state,
        hasCode: !!code,
        hasCodeVerifier: !!codeVerifier
      });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=OAuthStateMismatch`
      );
    }
    
    const oauthConfig = providers[provider as Provider];
    
    try {
      // Échanger le code d'autorisation contre un jeton d'accès
      const tokens = await oauthConfig.instance.validateAuthorizationCode(code, codeVerifier);
      
      // Récupérer les informations utilisateur du fournisseur
      const userInfoResponse = await fetch(oauthConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      
      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        throw new Error(`Échec de la récupération des informations utilisateur: ${errorText}`);
      }
      
      const userInfo: OAuthUserInfo = await userInfoResponse.json();
      
      if (!userInfo.email) {
        throw new Error('Email non fourni par le fournisseur OAuth');
      }
      
      // Formater l'image de profil
      let imageUrl: string | null = null;
      if (userInfo.picture) {
        if (typeof userInfo.picture === 'string') {
          imageUrl = userInfo.picture;
        } else if (userInfo.picture.data?.url) {
          imageUrl = userInfo.picture.data.url;
        }
      }
      
      // Créer ou mettre à jour l'utilisateur dans la base de données
      const existingUser = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });
      
      let userId: string;
      
      if (existingUser) {
        // Mettre à jour l'utilisateur existant
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: userInfo.name || existingUser.name,
            image: imageUrl || existingUser.image,
            email_verified: userInfo.email_verified ?? existingUser.email_verified,
          },
        });
        userId = existingUser.id;
      } else {
        // Créer un nouvel utilisateur
        const newUser = await prisma.user.create({
          data: {
            id: generateId(15),
            email: userInfo.email,
            name: userInfo.name || userInfo.email.split('@')[0],
            image: imageUrl,
            email_verified: userInfo.email_verified ?? true,
            role: 'USER', // Rôle par défaut
          },
        });
        userId = newUser.id;
      }
      
      // Créer une session pour l'utilisateur
      const session = await auth.createSession(userId, {});
      
      // Créer et définir le cookie de session
      const sessionCookie = auth.createSessionCookie(session.id);
      const response = NextResponse.redirect(redirectTo);
      
      // Définir le cookie de session
      response.cookies.set({
        name: sessionCookie.name,
        value: sessionCookie.value,
        ...sessionCookie.attributes
      });
      
      // Supprimer les cookies OAuth
      response.cookies.delete(`oauth_${provider}_state`);
      response.cookies.delete('oauth_redirect_uri');
      response.cookies.delete('code_verifier');
      
      logger.info(`Connexion OAuth réussie pour l'utilisateur: ${userId}`);
      return response;
      
    } catch (error) {
        const errorToLog = error instanceof Error ? error : new Error(String(error));
        logger.error(`Erreur lors de la connexion OAuth pour le provider ${provider}`, errorToLog);
      
      if (error instanceof OAuth2RequestError) {
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/login?error=OAuthCallbackError`
        );
      }
      
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=OAuthError`
      );
    }
    
  } catch (error) {
    const errorToLog = error instanceof Error ? error : new Error(String(error));
    logger.error('Erreur inattendue dans le gestionnaire OAuth', errorToLog);
    
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=UnexpectedError`
    );
  }
}
