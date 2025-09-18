import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation avec Zod
const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  email: z.string().email('Adresse email invalide'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = verifyTokenSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { token, email } = validation.data;

    // Trouver l'utilisateur avec le token et vérifier la date d'expiration
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Vérifie que le token n'a pas expiré
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification du token' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
