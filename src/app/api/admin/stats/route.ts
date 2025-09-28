import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { Lucia } from 'lucia';

interface User {
  id: string;
  email: string;
  role: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
}

export async function GET() {
  if (!auth) {
    console.error('Auth is not properly initialized');
    return new NextResponse(
      JSON.stringify({ error: 'Service d\'authentification non disponible' }), 
      { status: 500 }
    );
  }

  // Vérifier que auth est une instance complète de Lucia
  const isFullLuciaInstance = auth && 
    'sessionCookieName' in auth && 
    typeof auth.sessionCookieName === 'string' &&
    'validateSession' in auth && 
    typeof auth.validateSession === 'function';
  
  if (!isFullLuciaInstance) {
    console.error('Auth instance is not a complete Lucia instance');
    return new NextResponse(
      JSON.stringify({ error: 'Configuration d\'authentification incorrecte' }), 
      { status: 500 }
    );
  }
  
  // À ce stade, TypeScript sait que auth est une instance complète de Lucia
  const lucia = auth as unknown as Lucia<Record<string, unknown>>;
  try {
    // Vérifier la session
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value;
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Non authentifié' }), 
        { status: 401 }
      );
    }
    
    const session = await lucia.validateSession(sessionId);
    const user = session?.user as User | undefined;
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Session invalide' }), 
        { status: 401 }
      );
    }
    
    if (user.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Accès non autorisé' }), 
        { status: 403 }
      );
    }
    
    // Ici, vous pourriez récupérer les vraies statistiques depuis votre base de données
    // Pour l'instant, nous retournons des données factices
    const stats = {
      totalUsers: 1242,
      activeUsers: 873,
      totalOrders: 5489,
      revenue: 125000,
    };
    
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur serveur' }), 
      { status: 500 }
    );
  }
}
