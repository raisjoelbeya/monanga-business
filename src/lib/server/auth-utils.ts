'server-only';

import { cookies } from "next/headers";
import { auth } from "../auth";

// Récupérer la session + user
export const getServerSession = async () => {
    const sessionId = (await cookies()).get(auth.sessionCookieName)?.value ?? null;
    if (!sessionId) return { session: null, user: null };

    const { session, user } = await auth.validateSession(sessionId);

    if (session?.fresh) {
        const sessionCookie = auth.createSessionCookie(session.id);
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    if (!session) {
        const blankCookie = auth.createBlankSessionCookie();
        (await cookies()).set(blankCookie.name, blankCookie.value, blankCookie.attributes);
    }

    return { session, user };
};

// Vérifier si connecté
export const requireAuth = async () => {
    const { session, user } = await getServerSession();
    if (!session || !user) throw new Error("Not authenticated");
    return { session, user };
};

// Déconnexion
export const signOut = async () => {
    const sessionId = (await cookies()).get(auth.sessionCookieName)?.value;
    if (sessionId) await auth.invalidateSession(sessionId);

    const blankCookie = auth.createBlankSessionCookie();
    (await cookies()).set(blankCookie.name, blankCookie.value, blankCookie.attributes);
};
