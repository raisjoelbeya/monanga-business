import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation avec Zod
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { token, email, password } = validation.data;

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

    // Hacher le nouveau mot de passe
    const hashedPassword = await hash(password, 12);

    // Mettre à jour le mot de passe et effacer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: 'Votre mot de passe a été réinitialisé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
