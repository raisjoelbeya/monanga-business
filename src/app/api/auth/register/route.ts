import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation avec Zod
const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().optional(),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = validation.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || '',
        username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Générer un nom d'utilisateur unique
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: false,
        role: 'USER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
      },
    });

    // TODO: Envoyer un email de vérification

    return NextResponse.json(
      { message: 'Inscription réussie', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
