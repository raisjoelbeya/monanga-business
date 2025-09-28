import { getAuth } from './auth';

// Créer une instance de Lucia de manière asynchrone
export const getLucia = async () => {
  return await getAuth();
};

// Exporter une instance par défaut pour la compatibilité
export const lucia = {
  async validateSession(sessionId: string) {
    const auth = await getLucia();
    return auth.validateSession(sessionId);
  },
  async invalidateSession(sessionId: string) {
    const auth = await getLucia();
    return auth.invalidateSession(sessionId);
  },
  createBlankSessionCookie() {
    return {
      name: 'auth_session',
      value: '',
      attributes: {
        path: '/',
        sameSite: 'lax' as const,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      }
    };
  },
  sessionCookieName: 'auth_session'
};
