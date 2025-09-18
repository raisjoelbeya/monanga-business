import { cache } from 'react';

// Fonction pour récupérer la session côté client
export const getClientSession = cache(async () => {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return { session: null, user: null };
    return await response.json();
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, user: null };
  }
});

export const isAuthenticated = cache(async () => {
    const { session } = await getClientSession();
    return session !== null;
});

export const hasRole = cache(async (role: string) => {
    const { user } = await getClientSession();
    return user?.role === role;
});

export const getCurrentUser = cache(async () => {
    const { user } = await getClientSession();
    return user;
});

export const getUserId = cache(async () => {
    const { user } = await getClientSession();
    return user?.id ?? null;
});

export const isAdmin = cache(async () => {
    return hasRole("ADMIN");
});
