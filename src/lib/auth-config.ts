interface OAuthProfile {
  sub?: string;
  id?: string;
  name: string;
  email: string;
  picture?: string | { data?: { url?: string; }; };
  email_verified?: boolean;
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
  token: string;
  userinfo: string | { url: string; params: Record<string, string> };
  clientId: string;
  clientSecret: string;
  profile(profile: P): {
    id: string | undefined;
    name: string;
    email: string;
    image: string | undefined;
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
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture as string | undefined,
      };
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    type: 'oauth',
    version: '2.0',
    authorization: {
      url: 'https://www.facebook.com/v12.0/dialog/oauth',
      params: {
        scope: 'email public_profile',
      },
    },
    token: 'https://graph.facebook.com/oauth/access_token',
    userinfo: {
      url: 'https://graph.facebook.com/me',
      params: { fields: 'id,name,email,picture.type(large)' },
    },
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: (profile.picture as { data?: { url?: string } })?.data?.url,
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
    }
  }
}

// Valider la configuration au chargement du module
if (typeof window === 'undefined') {
  validateOAuthConfig();
}
