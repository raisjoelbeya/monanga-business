interface OAuthProfile {
    sub?: string;
    id?: string;
    name?: string;
    email?: string;
    picture?: string | { data?: { url?: string } };
    email_verified?: boolean;
    preferred_username?: string;
    [key: string]: string | number | boolean | object | undefined;
}

interface OAuthConfig<P extends OAuthProfile> {
    id: string;
    name: string;
    type: 'oauth';
    version: '2.0';
    authorization: {
        url: string;
        params: Record<string, string>;
    };
    token: string | { url: string };
    userinfo: string | { url: string; params?: Record<string, string> };
    clientId: string;
    clientSecret: string;
    profile(profile: P): {
        id: string | undefined;
        name: string;
        email: string;
        image: string | undefined;
    };
    style?: {
        logo: string;
        logoDark: string;
        bg: string;
        text: string;
        bgDark: string;
        textDark: string;
    };
}

export const oauthProviders: OAuthConfig<OAuthProfile>[] = [
    {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        version: '2.0',
        authorization: {
            url: 'https://accounts.google.com/o/oauth2/v2/auth',
            params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
                scope: 'openid email profile',
            },
        },
        token: 'https://oauth2.googleapis.com/token',
        userinfo: 'https://www.googleapis.com/oauth2/v1/userinfo',
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        profile(profile) {
            return {
                id: profile.sub,
                name: profile.name || 'Utilisateur',
                email: profile.email || '',
                image: profile.picture as string | undefined,
            };
        },
    },
    {
        id: 'facebook',
        name: 'Facebook',
        type: 'oauth',
        version: '2.0',
        clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
        authorization: {
            url: 'https://www.facebook.com/v19.0/dialog/oauth',
            params: {
                scope: 'email public_profile',
                auth_type: 'rerequest', // Demande les permissions manquantes si nécessaire
                display: 'popup',
            },
        },
        token: {
            url: 'https://graph.facebook.com/v19.0/oauth/access_token',
        },
        userinfo: {
            url: 'https://graph.facebook.com/me',
            params: {
                fields: 'id,name,email,picture.type(large),first_name,last_name',
            },
        },
        profile(profile) {
            // Gestion sécurisée de l'image de profil
            let imageUrl: string | undefined;
            if (profile.picture) {
                if (typeof profile.picture === 'string') {
                    imageUrl = profile.picture;
                } else if (typeof profile.picture === 'object' && profile.picture.data) {
                    imageUrl = profile.picture.data.url;
                }
            }

            // Créer un nom à partir du prénom et du nom si le nom complet n'est pas disponible
            let name = 'Utilisateur';
            if (typeof profile.name === 'string' && profile.name.trim()) {
                name = profile.name.trim();
            } else {
                const firstName = typeof profile.first_name === 'string' ? profile.first_name.trim() : '';
                const lastName = typeof profile.last_name === 'string' ? profile.last_name.trim() : '';
                name = [firstName, lastName].filter(s => s).join(' ').trim() || 'Utilisateur';
            }
            
            // L'email est requis, on utilise une valeur par défaut si non fourni
            const email = profile.email || `${profile.id}@facebook.none`;

            return {
                id: profile.id || 'unknown',
                name: name,
                email: email,
                image: imageUrl,
            };
        },
    },
];

// Fonction utilitaire pour obtenir un fournisseur par son ID
export function getOAuthProvider(providerId: string): OAuthConfig<OAuthProfile> | undefined {
    return oauthProviders.find((p) => p.id === providerId);
}

// Vérification des variables d'environnement requises
export function validateOAuthConfig() {

    const errors: string[] = [];

    // En développement, on utilise des valeurs par défaut pour tous les fournisseurs
    if (process.env.NODE_ENV !== 'production') {
        if (!process.env.GOOGLE_CLIENT_ID) process.env.GOOGLE_CLIENT_ID = 'dev_google_client_id';
        if (!process.env.GOOGLE_CLIENT_SECRET) process.env.GOOGLE_CLIENT_SECRET = 'dev_google_client_secret';
        if (!process.env.FACEBOOK_CLIENT_ID) process.env.FACEBOOK_CLIENT_ID = 'dev_facebook_client_id';
        if (!process.env.FACEBOOK_CLIENT_SECRET) process.env.FACEBOOK_CLIENT_SECRET = 'dev_facebook_client_secret';
    }

    // En production, on vérifie que toutes les variables sont définies
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            errors.push('Google OAuth credentials are not configured');
        }
        if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
            errors.push('Facebook OAuth credentials are not configured');
        }
    }

    if (errors.length > 0) {
        console.error('OAuth configuration errors:', errors.join('\n'));
        if (process.env.NODE_ENV === 'production') {
            throw new Error('OAuth configuration is invalid');
        } else {
            console.warn('Continuing in development mode with default OAuth values');
        }
    }
}