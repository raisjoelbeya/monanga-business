import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation avec Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json(
        { message: 'Si votre adresse email est enregistrée, vous recevrez un email de réinitialisation' },
        { status: 200 }
      );
    }

    // Générer un token de réinitialisation
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 heure d'expiration

    // Mettre à jour l'utilisateur avec le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email de réinitialisation
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div>
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
          <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Si votre adresse email est enregistrée, vous recevrez un email de réinitialisation',
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la demande de réinitialisation' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
