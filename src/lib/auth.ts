import {Lucia, Session, User, TimeSpan} from "lucia";
import {PrismaAdapter} from "@lucia-auth/adapter-prisma";
import {Facebook, Google} from "arctic";
import {logger} from "@/lib/logger";

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

// Configuration de base pour Lucia
const luciaConfig = {
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      // Ajouter le domaine en production si nécessaire
      ...(process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_DOMAIN 
        ? { domain: process.env.NEXT_PUBLIC_APP_DOMAIN }
        : {})
    }
  },
  getUserAttributes: (userData: DatabaseUserAttributes) => ({
    id: userData.id,
    email: userData.email,
    email_verified: userData.emailVerified,
    name: userData.firstName || userData.username || userData.email?.split('@')[0] || '',
    firstName: userData.firstName,
    lastName: userData.lastName,
    fullName: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}`.trim() : null,
    username: userData.username,
    image: userData.image,
    role: userData.role
  })
};

// Configuration des fournisseurs OAuth
const authBaseUrl = process.env.NODE_ENV === 'production' ? 'https://monanga-business.vercel.app' : process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Initialisation des fournisseurs OAuth
export const google = new Google(process.env.GOOGLE_CLIENT_ID || '', process.env.GOOGLE_CLIENT_SECRET || '', `${authBaseUrl}/api/auth/callback/google`);

export const facebook = new Facebook(process.env.FACEBOOK_CLIENT_ID || '', process.env.FACEBOOK_CLIENT_SECRET || '', `${authBaseUrl}/api/auth/callback/facebook`);

// Alias pour la rétrocompatibilité
export const googleAuth = google;
export const facebookAuth = facebook;

// Initialisation de l'authentification
let auth: Lucia<Record<string, unknown>, DatabaseUserAttributes>;

// Only initialize Lucia on the server side
if (typeof window === 'undefined') {
  // Côté serveur uniquement
  (async () => {
    try {
      const { prisma } = await import('@/lib/prisma');
      if (!prisma) throw new Error('Prisma client not found');
      
      const adapter = new PrismaAdapter(prisma.session, prisma.user);
      
      // Configuration de Lucia
      auth = new Lucia(adapter, {
        ...luciaConfig,
        // Configuration des sessions (1 semaine)
        sessionExpiresIn: new TimeSpan(1, 'w'), // 1 semaine
        // Gestion des sessions expirées
        getSessionAttributes: () => {
          // Retourner un objet vide car nous n'avons pas d'attributs de session personnalisés
          // Les attributs sont gérés directement par Lucia
          return {};
        }
      });
      
      // Tester la connexion à la base de données
      await prisma.user.findFirst({ take: 1 });
      
    } catch (err) {
			console.error('❌ Failed to initialize auth:', err);
			
			// Fallback pour le développement
			auth = {
				validateSession: async () => {
					console.error('Auth not properly initialized');
					return {user: null, session: null};
				},
				sessionCookieName: 'auth_session',
				sessionExpiresIn: 60 * 60 * 24 * 7, // 1 week
				sessionCookieController: {
					createSessionCookie: (): Record<string, unknown> => ({}),
					createBlankSessionCookie: (): Record<string, unknown> => ({}),
					parseSessionCookie: (): Record<string, unknown> => ({})
				}, 
				adapter: {
                    getSessionAndUser: async (): Promise<[Session | null, User | null]> => [null, null],
                    getUserSessions: async (): Promise<Session[]> => [],
                    setSession: async () => {},
                    deleteSession: async () => {},
                    deleteUserSessions: async () => {},
                    updateSessionAttributes: async () => {},
                    deleteExpiredSessions: async () => {},
                    deleteDeadUserSessions: async () => {}
                },
				getSessionAttributes: () => ({}),
				setSession: async () => {
				},
				getSession: async () => null,
				validateSessionUser: async () => ({user: null, session: null}),
				invalidateSession: async () => {
				},
				deleteDeadUserSessions: async () => {
				},
				deleteExpiredSessions: async () => {},
				createSession: async (): Promise<Session> => ({
                    sessionId: '',
                    userId: '',
                    expiresAt: new Date(),
                    fresh: false,
                    idleExpiresAt: new Date(),
                    data: {},
                    created: new Date(),
                    updated: new Date(),
                    id: '', // Ajout de la propriété 'id'
                }),
				updateSessionAttributes: async () => {
				},
				deleteSession: async () => {
				},
				deleteUserSessions: async () => {
				}
			} as unknown as Lucia<Record<string, unknown>, DatabaseUserAttributes>;
		}
	})();
} else {
	// On the client side, we'll handle session validation through API routes
  auth = {
    validateSession: async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include', // Important pour envoyer les cookies
          cache: 'no-store' // Empêcher la mise en cache
        });
        
        if (!response.ok) {
          console.error('Session validation failed:', response.status);
          return { user: null, session: null };
        }
        
        const data = await response.json();
        return { 
          user: data.user, 
          session: data.session 
        };
      } catch (error) {
        console.error('Error validating session:', error);
        return { user: null, session: null };
      }
    },
    sessionCookieName: 'auth_session',
    sessionExpiresIn: 60 * 60 * 24 * 7, // 1 week
    sessionCookieController: {
      createSessionCookie: () => ({
        name: 'auth_session',
        value: '',
        attributes: {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          ...(process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_DOMAIN 
            ? { domain: process.env.NEXT_PUBLIC_APP_DOMAIN }
            : {})
        }
      }),
      createBlankSessionCookie: () => ({
        name: 'auth_session',
        value: '',
        attributes: {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          expires: new Date(0), // Date d'expiration dans le passé
          ...(process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_DOMAIN 
            ? { domain: process.env.NEXT_PUBLIC_APP_DOMAIN }
            : {})
        }
      }),
      parseSessionCookie: () => ({
        name: 'auth_session',
        value: '',
        attributes: {}
      })
    }
  } as unknown as Lucia<Record<string, unknown>, DatabaseUserAttributes>;
}

// Export a function to get the auth instance
export async function getAuth() {
  // Always return the main auth instance if it's already initialized
  if (auth) return auth;
  
  // If we're on the server and auth isn't initialized yet, initialize it
  if (typeof window === 'undefined') {
    try {
      const { prisma } = await import('@/lib/prisma');
      if (!prisma) throw new Error('Prisma client not found');
      
      const adapter = new PrismaAdapter(prisma.session, prisma.user);
      
      // Initialize auth with proper configuration
      auth = new Lucia(adapter, {
        ...luciaConfig,
        sessionExpiresIn: new TimeSpan(1, 'w'), // 1 semaine
        getSessionAttributes: () => ({})
      });
      
      // Test database connection
      await prisma.user.findFirst({ take: 1 });
      
      return auth;
    } catch (error) {
      console.error('Failed to initialize auth in getAuth():', error);
      throw new Error('Failed to initialize authentication service');
    }
  }
  
  throw new Error('getAuth() should not be called on the client side');
}

export { auth };

// Debug configuration in development
if (process.env.NODE_ENV !== 'production') {
	const mask = (v?: string | null) => v ? `${v.slice(0, 4)}...${v.slice(-4)}` : 'undefined';
	logger.debug('OAuth providers configured', {
		baseUrl: authBaseUrl, google: {
			clientId: mask(process.env.GOOGLE_CLIENT_ID), redirect: `${authBaseUrl}/api/auth/callback/google`,
		}, facebook: {
			clientId: mask(process.env.FACEBOOK_CLIENT_ID), redirect: `${authBaseUrl}/api/auth/callback/facebook`,
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

