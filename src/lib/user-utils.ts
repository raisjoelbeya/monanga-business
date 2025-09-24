import { prisma } from "./prisma";

export function generateUsername(email: string): string {
  if (!email) throw new Error("Email is required");
  
  const base = email.split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20); // Limiter la longueur
    
  // Ajouter un suffixe aléatoire pour l'unicité
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
}

export function getDisplayName(user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email: string;
}): string {
  if (user.firstName) {
    return user.firstName;
  }
  
  if (user.username) {
    return user.username;
  }
  
  return user.email.split('@')[0];
}

export function getFullName(user: {
  firstName?: string | null;
  lastName?: string | null;
}): string | null {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`.trim();
  }
  return user.firstName || user.lastName || null;
}

export async function ensureUsername(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, email: true }
  });

  if (!user) throw new Error("User not found");
  
  if (!user.username && user.email) {
    const username = generateUsername(user.email);
    await prisma.user.update({
      where: { id: userId },
      data: { username }
    });
  } else if (!user.email) {
    throw new Error("User email is required to generate a username");
  }
}
