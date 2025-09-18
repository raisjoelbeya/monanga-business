import { auth } from "./auth";
import { cookies } from 'next/headers';

export async function getSession() {
  const sessionId = (await cookies()).get(auth.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  
  const { session, user } = await auth.validateSession(sessionId);
  if (!session) return null;
  
  return { session, user };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  // Ajoutez ici la logique pour vérifier si l'utilisateur est admin
  // Par exemple: if (!session.user.isAdmin) throw new Error('Not authorized');
  return session;
}
