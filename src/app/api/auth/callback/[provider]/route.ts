import {cookies} from 'next/headers';
import {OAuth2RequestError} from 'arctic';
import {generateId} from 'lucia';
import {NextRequest, NextResponse} from 'next/server';
import {auth, facebook, google} from '@/lib/auth';
import prisma from '@/lib/prisma';
import {logger} from '@/lib/logger';

// Type pour les paramètres de route
type Params = {
    provider: string;
};

// Configuration des fournisseurs OAuth
const providers = {
    google: {
        instance: google, userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    }, facebook: {
        instance: facebook, userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,email,picture',
    },
} as const;

type Provider = keyof typeof providers;

type OAuthUserInfo = {
    email: string; name?: string; picture?: string | { data?: { url?: string } }; email_verified?: boolean;
};

// Helper functions
const getOAuthParams = (request: NextRequest) => {
    const url = new URL(request.url);
    return {
        code: url.searchParams.get('code'), state: url.searchParams.get('state'),
    };
};

const getStoredParams = async (provider: Provider) => {
    const cookieStore = await cookies();
    const stateCookie = cookieStore.get(`oauth_${provider}_state`)?.value;
    let storedState: string | undefined;
    let codeVerifier: string | undefined;
    let redirectTo: string | undefined;

    if (stateCookie) {
        try {
            const parsed = JSON.parse(stateCookie);
            if (parsed && typeof parsed === 'object') {
                storedState = parsed.state;
                codeVerifier = parsed.codeVerifier;
                redirectTo = parsed.redirectTo;
            }
        } catch {
            // state cookie is a plain string
            storedState = stateCookie;
        }
    }

    // Fallback to legacy separate cookies if not found in combined cookie
    if (!codeVerifier) {
        codeVerifier = cookieStore.get('code_verifier')?.value;
    }
    if (!redirectTo) {
        redirectTo = cookieStore.get('oauth_redirect_uri')?.value || '/';
    }

    return {codeVerifier, storedState, redirectTo};
};

const validateOAuthParams = (provider: Provider, {code, state}: ReturnType<typeof getOAuthParams>, {
    codeVerifier,
    storedState,
    redirectTo
}: Awaited<ReturnType<typeof getStoredParams>>): { valid: false; error: string } | {
    valid: true;
    redirectTo: string
} => {
    const params = {code, state, codeVerifier, storedState, redirectTo};

    if (!storedState || !state || storedState !== state) {
        logger.warn('Échec de la validation de l\'état OAuth', {
            provider, ...params, statesMatch: storedState === state
        });
        return {valid: false, error: 'OAuthStateMismatch'};
    }

    if (!code || !codeVerifier) {
        logger.warn('Paramètres OAuth manquants', {provider, hasCode: !!code, hasCodeVerifier: !!codeVerifier});
        return {valid: false, error: 'OAuthStateMismatch'};
    }

    return {valid: true, redirectTo};
};

interface ProviderInstance {
    validateAuthorizationCode: (code: string, verifier: string) => Promise<{ accessToken: string }>;
}

interface ProviderConfig {
    instance: ProviderInstance;
    userInfoUrl: string;
}

const getProviderConfig = (provider: string): ProviderConfig => {
    const config = providers[provider as keyof typeof providers];
    if (!config) {
        throw new Error(`Provider ${provider} not supported`);
    }
    return config as ProviderConfig;
};

const exchangeAuthorizationCode = async (provider: Provider, code: string, codeVerifier: string) => {
    const {instance} = getProviderConfig(provider);
    return await instance.validateAuthorizationCode(code, codeVerifier);
};

const fetchUserInfo = async (provider: Provider, accessToken: string) => {
    const {userInfoUrl} = getProviderConfig(provider);

    const response = await fetch(userInfoUrl, {
        headers: {Authorization: `Bearer ${accessToken}`},
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
    if (!picture) {
        return null;
    }
    
    if (typeof picture === 'string') {
        return picture;
    }
    
    // Gestion du cas où picture est un objet avec une propriété data
    if ('data' in picture && picture.data && 'url' in picture.data) {
        return picture.data.url || null;
    }
    
    // Gestion d'autres formats d'objets potentiels
    if ('url' in picture) {
        return picture.url as string;
    }
    
    return null;
};

const upsertUser = async (userInfo: OAuthUserInfo) => {
    try {
        // Vérifier si l'utilisateur existe déjà par email ou username
        const existingUser = await prisma.user.findFirst({
            where: {
                email: userInfo.email,
            },
        });

        let userId: string;

        if (existingUser) {
            // Mettre à jour l'utilisateur existant si nécessaire
            userId = existingUser.id;
            await prisma.user.update({
                where: {id: userId}, data: {
                    name: userInfo.name || existingUser.name,
                    image: formatProfileImage(userInfo.picture) || existingUser.image,
                    emailVerified: userInfo.email_verified ?? existingUser.emailVerified,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Créer un nouvel utilisateur avec Lucia
            userId = generateId(15);
            const password = generateId(32); // Generate a random password for OAuth users

            await prisma.user.create({
                data: {
                    id: userId,
                    password: password, // In a real app, this should be hashed
                    email: userInfo.email,
                    name: userInfo.name || userInfo.email.split('@')[0],
                    image: formatProfileImage(userInfo.picture),
                    emailVerified: userInfo.email_verified ?? false,
                    role: 'USER',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            // Créer une session pour l'utilisateur
            await prisma.session.create({
                data: {
                    userId: userId,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
                },
            });
        }

        return userId;
    } catch (error) {
        console.error('Erreur lors de la création/mise à jour de l\'utilisateur:', error);
        throw new Error('Failed to create/update user');
    }
};

const createUserSession = async (userId: string, redirectTo: string) => {
    try {
        // Créer une nouvelle session dans la base de données
        const session = await prisma.session.create({
            data: {
                userId: userId,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
            },
        });

        // Créer le cookie de session
        const sessionCookie = auth.createSessionCookie(session.id);

        // Créer la réponse de redirection
        const response = NextResponse.redirect(redirectTo);

        // Définir le cookie de session
        response.cookies.set({
            name: sessionCookie.name,
            value: sessionCookie.value,
            ...sessionCookie.attributes,
            // S'assurer que le cookie est accessible sur tous les sous-domaines en production
            domain: process.env.NODE_ENV === 'production' ? '.votre-domaine.com' : undefined,
            // Forcer le drapeau secure en production
            secure: process.env.NODE_ENV === 'production',
            // Utiliser SameSite=Lax pour la compatibilité
            sameSite: 'lax',
            // Chemin racine pour que le cookie soit disponible sur tout le site
            path: '/',
            // Durée de vie du cookie (30 jours)
            maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
        });

        return response;
    } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
        throw new Error('Failed to create session');
    }
};

const cleanupOAuthCookies = (response: NextResponse, provider: Provider) => {
    const cookiesToDelete = [`oauth_${provider}_state`, 'oauth_redirect_uri', 'code_verifier',];

    cookiesToDelete.forEach(cookieName => {
        response.cookies.delete(cookieName);
    });

    return response;
};

const handleOAuthError = (error: unknown, provider: Provider) => {
    const errorToLog = error instanceof Error ? error : new Error(String(error));
    logger.error(`Erreur lors de la connexion OAuth pour le provider ${provider}`, errorToLog);

    const errorCode = error instanceof OAuth2RequestError ? 'OAuthCallbackError' : 'OAuthError';

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=${errorCode}`);
};

// Main handler
export async function GET(_request: NextRequest, {params}: { params: Promise<Params> }): Promise<NextResponse> {
    const {provider: providerParam} = await params;
    const provider = providerParam as Provider;

    try {
        // Validate provider
        getProviderConfig(provider);

        // Extract OAuth parameters
        const oauthParams = getOAuthParams(_request);

        // Extract and await stored parameters
        const storedParams = await getStoredParams(provider);

        // Validate OAuth parameters
        const validation = validateOAuthParams(provider, oauthParams, storedParams);

        if (!validation.valid) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=${validation.error}`);
        }

        // OAuth flow
        const tokens = await exchangeAuthorizationCode(provider, oauthParams.code!, storedParams.codeVerifier!);

        const userInfo = await fetchUserInfo(provider, tokens.accessToken);
        const userId = await upsertUser(userInfo);

        // Create session and cleanup
        let response = await createUserSession(userId, validation.redirectTo);
        response = cleanupOAuthCookies(response, provider);

        logger.info(`Connexion OAuth réussie pour l'utilisateur: ${userId}`);
        return response;

    } catch (error) {
        if (error instanceof Error && error.message.includes('non pris en charge')) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=OAuthProviderNotSupported`);
        }

        return handleOAuthError(error, provider);
    }
}