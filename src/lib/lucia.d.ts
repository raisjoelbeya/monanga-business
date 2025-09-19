/// <reference types="lucia" />

import type { auth } from './auth';

declare module 'lucia' {
  type Auth = typeof auth;
  
  interface Register {
    lucia: Auth;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      email_verified: boolean;
      name: string | null;
      image: string | null;
      role: string;
    };
    DatabaseSessionAttributes: object;
  }
}

export type { Auth };

// Déclaration des types pour les sessions
declare global {
  namespace Lucia {
    type Auth = import('./auth').Auth;
    type DatabaseUserAttributes = {
      email: string;
      email_verified: boolean;
      name: string | null;
      image: string | null;
      role: string;
    };
    type DatabaseSessionAttributes = object;
  }
}
