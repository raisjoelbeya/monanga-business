import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { NextRequest, NextResponse } from 'next/server';
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

// Helper functions
const getOAuthParams = (request: Request) => {
    const url = new URL(request.url);
    return {
        code: url.searchParams.get('code'),
        state: url.searchParams.get('state'),
    };
};

const getStoredParams = async (provider: Provider) => {
    const cookieStore = await cookies();
    return {
        codeVerifier: cookieStore.get('code_verifier')?.value,
        storedState: cookieStore.get(`oauth_${provider}_state`)?.value,
        redirectTo: cookieStore.get('oauth_redirect_uri')?.value || '/',
    };
};

const validateOAuthParams = (
    provider: Provider,
    { code, state }: ReturnType<typeof getOAuthParams>,
    { codeVerifier, storedState, redirectTo }: Awaited<ReturnType<typeof getStoredParams>>
): { valid: false; error: string } | { valid: true; redirectTo: string } => {
    const params = { code, state, codeVerifier, storedState, redirectTo };

    if (!storedState || !state || storedState !== state) {
        logger.warn('Échec de la validation de l\'état OAuth', {
            provider,
            ...params,
            statesMatch: storedState === state
        });
        return { valid: false, error: 'OAuthStateMismatch' };
    }

    if (!code || !codeVerifier) {
        logger.warn('Paramètres OAuth manquants', { provider, hasCode: !!code, hasCodeVerifier: !!codeVerifier });
        return { valid: false, error: 'OAuthStateMismatch' };
    }

    return { valid: true, redirectTo };
};

const getProviderConfig = (provider: Provider) => {
    const config = providers[provider];
    if (!config) {
        throw new Error(`Fournisseur OAuth non pris en charge: ${provider}`);
    }
    return config;
};

const exchangeAuthorizationCode = async (
    provider: Provider,
    code: string,
    codeVerifier: string
) => {
    const { instance } = getProviderConfig(provider);
    return await instance.validateAuthorizationCode(code, codeVerifier);
};

const fetchUserInfo = async (provider: Provider, accessToken: string) => {
    const { userInfoUrl } = getProviderConfig(provider);

    const response = await fetch(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Échec de la récupération des informations utilisateur: ${errorText}`);
    }

    const userInfo: OAuthUserInfo = await response.json();

    if (!userInfo.email) {
        throw new Error('Email non fourni par le fournisseur OAuth');
    }

    return userInfo;
};

const formatProfileImage = (picture?: OAuthUserInfo['picture']): string | null => {
    if (!picture) return null;

    if (typeof picture === 'string') {
        return picture;
    }

    return picture.data?.url || null;
};

const upsertUser = async (userInfo: OAuthUserInfo) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: userInfo.email },
    });

    let userId: string;

    if (existingUser) {
        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                name: userInfo.name || existingUser.name,
                image: formatProfileImage(userInfo.picture) || existingUser.image,
                emailVerified: userInfo.email_verified ?? existingUser.emailVerified,
            },
        });
        userId = updatedUser.id;
    } else {
        const newUser = await prisma.user.create({
            data: {
                id: generateId(15),
                email: userInfo.email,
                name: userInfo.name || userInfo.email.split('@')[0],
                image: formatProfileImage(userInfo.picture),
                emailVerified: userInfo.email_verified ?? true,
                role: 'USER',
            },
        });
        userId = newUser.id;
    }

    return userId;
};

const createUserSession = async (userId: string, redirectTo: string) => {
    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);

    const response = NextResponse.redirect(redirectTo);
    response.cookies.set({
        name: sessionCookie.name,
        value: sessionCookie.value,
        ...sessionCookie.attributes,
    });

    return response;
};

const cleanupOAuthCookies = (response: NextResponse, provider: Provider) => {
    const cookiesToDelete = [
        `oauth_${provider}_state`,
        'oauth_redirect_uri',
        'code_verifier',
    ];

    cookiesToDelete.forEach(cookieName => {
        response.cookies.delete(cookieName);
    });

    return response;
};

const handleOAuthError = (error: unknown, provider: Provider) => {
    const errorToLog = error instanceof Error ? error : new Error(String(error));
    logger.error(`Erreur lors de la connexion OAuth pour le provider ${provider}`, errorToLog);

    const errorCode = error instanceof OAuth2RequestError
        ? 'OAuthCallbackError'
        : 'OAuthError';

    return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${errorCode}`
    );
};


// Main handler
type RouteParams = {
    params: {
        provider: string;
    };
};

export async function GET(
    request: NextRequest,
    context: RouteParams
) {
    const provider = context.params.provider as Provider;

    try {
        // Validate provider
        getProviderConfig(provider);

        // Extract OAuth parameters
        const oauthParams = getOAuthParams(request);

        // Extract and await stored parameters
        const storedParams = await getStoredParams(provider);

        // Validate OAuth parameters
        const validation = validateOAuthParams(provider, oauthParams, storedParams);

        if (!validation.valid) {
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/login?error=${validation.error}`
            );
        }

        // OAuth flow
        const tokens = await exchangeAuthorizationCode(
            provider,
            oauthParams.code!,
            storedParams.codeVerifier!
        );

        const userInfo = await fetchUserInfo(provider, tokens.accessToken);
        const userId = await upsertUser(userInfo);

        // Create session and cleanup
        let response = await createUserSession(userId, validation.redirectTo);
        response = cleanupOAuthCookies(response, provider);

        logger.info(`Connexion OAuth réussie pour l'utilisateur: ${userId}`);
        return response;

    } catch (error) {
        if (error instanceof Error && error.message.includes('non pris en charge')) {
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/login?error=OAuthProviderNotSupported`
            );
        }

        return handleOAuthError(error, provider);
    }
}