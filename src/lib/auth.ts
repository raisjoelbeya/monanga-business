import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google, Facebook } from "arctic";
import { logger } from "@/lib/logger";

interface DatabaseUserAttributes {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  role: string;
  name?: string; // Pour la rétrocompatibilité
}

// Type pour les erreurs d'authentification
type AuthError = Error & {
  code?: string;
  status?: number;
};

// Configuration de base pour Lucia
const luciaConfig = {
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/"
    }
  },
  getUserAttributes: (userData: DatabaseUserAttributes) => ({
    id: userData.id,
    email: userData.email,
    email_verified: userData.emailVerified,
    name: userData.firstName || userData.username || userData.email?.split('@')[0] || '',
    firstName: userData.firstName,
    lastName: userData.lastName,
    fullName: userData.firstName && userData.lastName 
      ? `${userData.firstName} ${userData.lastName}`.trim()
      : null,
    username: userData.username,
    image: userData.image,
    role: userData.role
  })
};

// Configuration des fournisseurs OAuth
const authBaseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://monanga-business.vercel.app' 
  : process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Initialisation des fournisseurs OAuth
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID || '',
  process.env.GOOGLE_CLIENT_SECRET || '',
  `${authBaseUrl}/api/auth/callback/google`
);

export const facebook = new Facebook(
  process.env.FACEBOOK_CLIENT_ID || '',
  process.env.FACEBOOK_CLIENT_SECRET || '',
  `${authBaseUrl}/api/auth/callback/facebook`
);

// Alias pour la rétrocompatibilité
export const googleAuth = google;
export const facebookAuth = facebook;

// Type pour le contexte d'authentification
type AuthContext = {
  validateSession: () => Promise<unknown>;
};

// Initialisation de l'authentification
let auth: Lucia<Record<string, unknown>, DatabaseUserAttributes> | AuthContext | undefined;

if (typeof window === 'undefined') {
  // Côté serveur uniquement
  (async () => {
    try {
      const { default: prisma } = await import('./prisma');
      const adapter = new PrismaAdapter(prisma.session, prisma.user);
      auth = new Lucia(adapter, luciaConfig);
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Failed to initialize auth:', authError);
      // Fallback pour le développement
      auth = {
        validateSession: () => Promise.reject(new Error(`Auth initialization failed: ${authError.message || 'Unknown error'}`)),
      };
    }
  })();
} else {
  // Côté client
  auth = {
    validateSession: () => {
      return fetch('/api/auth/session')
        .then(res => res.ok ? res.json() : Promise.reject('Not authenticated'))
        .catch(() => ({}));
    },
  };
}

export { auth };

// Debug configuration in development
if (process.env.NODE_ENV !== 'production') {
  const mask = (v?: string | null) => v ? `${v.slice(0,4)}...${v.slice(-4)}` : 'undefined';
  logger.debug('OAuth providers configured', {
    baseUrl: authBaseUrl,
    google: {
      clientId: mask(process.env.GOOGLE_CLIENT_ID),
      redirect: `${authBaseUrl}/api/auth/callback/google`,
    },
    facebook: {
      clientId: mask(process.env.FACEBOOK_CLIENT_ID),
      redirect: `${authBaseUrl}/api/auth/callback/facebook`,
    },
  });
}

// Typage Lucia
declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

