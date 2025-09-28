import { cache } from 'react';

// Types pour les données utilisateur
type User = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  image: string | null;
  role: string;
  emailVerified: boolean | null;
  name?: string;
};

type SessionResponse = {
  user: User | null;
  error?: string;
};

// Fonction pour récupérer la session côté client
export const getClientSession = cache(async (): Promise<{ user: User | null; session: { user: User } | null }> => {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      console.error('Failed to fetch session:', response.status, response.statusText);
      return { session: null, user: null };
    }
    
    const data: SessionResponse = await response.json();
    
    if (data.error) {
      console.error('Session error:', data.error);
      return { session: null, user: null };
    }
    
    return { 
      session: data.user ? { user: data.user } : null, 
      user: data.user || null 
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, user: null };
  }
});

// Vérifie si l'utilisateur est authentifié
export const isAuthenticated = cache(async (): Promise<boolean> => {
  const { user } = await getClientSession();
  return user !== null;
});

// Vérifie si l'utilisateur a un rôle spécifique
export const hasRole = cache(async (role: string): Promise<boolean> => {
  const { user } = await getClientSession();
  return user?.role === role;
});

// Récupère l'utilisateur actuel
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { user } = await getClientSession();
  return user;
});

// Récupère l'ID de l'utilisateur actuel
export const getUserId = cache(async (): Promise<string | null> => {
  const { user } = await getClientSession();
  return user?.id ?? null;
});

// Vérifie si l'utilisateur est un administrateur
export const isAdmin = cache(async (): Promise<boolean> => {
  return hasRole("ADMIN");
});

// Vérifie si l'utilisateur a un email vérifié
export const isEmailVerified = cache(async (): Promise<boolean> => {
  const { user } = await getClientSession();
  return user?.emailVerified === true;
});

// Récupère le nom d'affichage de l'utilisateur
export const getUserDisplayName = cache(async (): Promise<string> => {
  const { user } = await getClientSession();
  if (!user) return '';
  
  if (user.name) return user.name;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`.trim();
  if (user.firstName) return user.firstName;
  if (user.username) return user.username;
  if (user.email) return user.email.split('@')[0];
  
  return 'Utilisateur';
});
