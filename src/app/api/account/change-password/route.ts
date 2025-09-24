import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword, hashPassword } from "@/lib/server/password";
import { getClientSession } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    const { user: sessionUser } = await getClientSession();
    if (!sessionUser?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new NextResponse(
        JSON.stringify({ error: "Tous les champs sont obligatoires" }),
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec le mot de passe hashé
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { password: true }
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Utilisateur non trouvé" }),
        { status: 404 }
      );
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await verifyPassword(currentPassword, user.password || '');
    
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ error: "Mot de passe actuel incorrect" }),
        { status: 401 }
      );
    }

    // Mettre à jour le mot de passe
    const hashedNewPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors du changement de mot de passe" }),
      { status: 500 }
    );
  }
}
