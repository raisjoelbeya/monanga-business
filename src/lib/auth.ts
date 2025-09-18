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
    getUserAttributes: (userData) => ({
        id: userData.id,
        email: userData.email,
        email_verified: userData.email_verified,
        name: userData.name,
        image: userData.image,
        role: userData.role,
    }),
});

// Fournisseurs OAuth
export const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.NEXTAUTH_URL}/login/google/callback` // mieux que api/auth
);

export const facebook = new Facebook(
    process.env.FACEBOOK_CLIENT_ID!,
    process.env.FACEBOOK_CLIENT_SECRET!,
    `${process.env.NEXTAUTH_URL}/login/facebook/callback`
);

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
    email_verified: boolean;
    name: string | null;
    image: string | null;
    role: string;
}
