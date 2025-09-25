import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google, Facebook } from "arctic";
import prisma from "./prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const auth = new Lucia(adapter, {
    sessionCookie: {
        name: "auth_session",
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        },
    },
    getUserAttributes: (userData) => {
        const fullName = userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`.trim()
            : null;
            
        return {
            id: userData.id,
            email: userData.email,
            email_verified: userData.emailVerified,
            name: userData.firstName || userData.username || userData.email.split('@')[0],
            firstName: userData.firstName,
            lastName: userData.lastName,
            fullName: fullName,
            username: userData.username,
            image: userData.image,
            role: userData.role,
        };
    },
});

// Configuration des URLs de callback en fonction de l'environnement
const getAuthBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://monanga-business.vercel.app';
  }
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

const authBaseUrl = getAuthBaseUrl();

// Fournisseurs OAuth
export const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${authBaseUrl}/api/auth/callback/google`
);

// Alias for backward compatibility
export const googleAuth = google;

export const facebook = new Facebook(
    process.env.FACEBOOK_CLIENT_ID!,
    process.env.FACEBOOK_CLIENT_SECRET!,
    `${authBaseUrl}/api/auth/callback/facebook`
);

// Alias for backward compatibility
export const facebookAuth = facebook;

// Typage Lucia
declare module "lucia" {
    interface Register {
        Lucia: typeof auth;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

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
