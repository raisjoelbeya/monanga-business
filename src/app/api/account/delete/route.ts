import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Lucia instance is already imported as auth
const lucia = auth;

export async function DELETE() {
    try {
        // Récupérer la session via les cookies
        const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
        
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Non autorisé - Aucune session active' },
                { status: 401 }
            );
        }
        
        // Valider la session
        const { session, user } = await lucia.validateSession(sessionId);
        
        if (!session || !user) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const userId = user.id;

        // 1. Supprimer toutes les sessions de l'utilisateur
        await lucia.invalidateUserSessions(userId);

        // 2. Supprimer l'utilisateur et ses données associées
        await prisma.$transaction(async (tx) => {
            // Supprimer d'abord les sessions
            await tx.session.deleteMany({
                where: { userId },
            });

            // Puis supprimer l'utilisateur
            await tx.user.delete({
                where: { id: userId },
            });
        });

        // 3. Créer un en-tête pour effacer le cookie de session
        const sessionCookie = lucia.createBlankSessionCookie();

        const response = NextResponse.json(
            { message: 'Compte supprimé avec succès', success: true },
            { status: 200 }
        );

        // 4. Définir le cookie de session vide
        response.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return response;
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);

        // Gestion des erreurs spécifiques
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Une erreur est survenue lors de la suppression du compte';

        return NextResponse.json(
            {
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}