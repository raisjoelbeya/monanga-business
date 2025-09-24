import { prisma } from "./prisma";

/**
 * Génère un nom d'utilisateur unique basé sur l'email
 * Vérifie dans la base de données pour s'assurer que le nom d'utilisateur est unique
 */
export async function generateUsername(email: string): Promise<string> {
  if (!email) throw new Error("Email is required");
  
  // Nettoyer et formater la partie avant @ de l'email
  let base = email.split('@')[0]
    .toLowerCase()
    .normalize('NFD') // Normaliser les caractères accentués
    .replace(/[^a-z0-9]/g, '') // Supprimer les caractères spéciaux
    .substring(0, 15); // Limiter la longueur pour laisser de la place au suffixe
    
  // Si le nom est trop court, ajouter un préfixe
  if (base.length < 3) {
    base = 'user' + base;
  }
  
  let username = base;
  let suffix = 1;
  let isUnique = false;
  const maxAttempts = 10;
  
  // Essayer de trouver un nom d'utilisateur unique
  for (let i = 0; i < maxAttempts && !isUnique; i++) {
    // Pour le premier essai, on n'ajoute pas de suffixe
    const attempt = i === 0 ? username : `${username}${suffix}`;
    
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { username: attempt },
      select: { id: true }
    });
    
    if (!existingUser) {
      return attempt; // Nom d'utilisateur unique trouvé
    }
    
    // Incrémenter le suffixe pour la prochaine tentative
    suffix++;
    
    // Si on a dépassé 999, réinitialiser avec un préfixe différent
    if (suffix > 999) {
      suffix = 1;
      username = base + Math.floor(Math.random() * 10);
    }
  }
  
  // Si on n'a pas trouvé de nom d'utilisateur unique après plusieurs tentatives,
  // générer un nom aléatoire
  return `${base}${Date.now().toString().slice(-4)}`;
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
    select: { 
      id: true,
      username: true, 
      email: true,
      firstName: true,
      lastName: true
    }
  });

  if (!user) throw new Error("User not found");
  
  if (!user.username && user.email) {
    try {
      // Essayer de générer un nom d'utilisateur basé sur le nom complet si disponible
      let username: string;
      
      if (user.firstName && user.lastName) {
        const base = `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`
          .normalize('NFD')
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 15);
          
        // Vérifier si ce nom d'utilisateur est disponible
        const existingUser = await prisma.user.findFirst({
          where: { 
            username: base,
            id: { not: user.id }
          }
        });
        
        username = existingUser ? await generateUsername(user.email) : base;
      } else {
        // Si on n'a pas de nom complet, utiliser l'email
        username = await generateUsername(user.email);
      }
      
      await prisma.user.update({
        where: { id: userId },
        data: { username }
      });
    } catch (error) {
      console.error('Erreur lors de la génération du nom d\'utilisateur:', error);
      // En cas d'erreur, utiliser une solution de secours
      const fallbackUsername = `user${Date.now().toString().slice(-6)}`;
      await prisma.user.update({
        where: { id: userId },
        data: { username: fallbackUsername }
      });
    }
  } else if (!user.email) {
    // Si l'utilisateur n'a pas d'email, utiliser un nom d'utilisateur basé sur l'ID
    const fallbackUsername = `user${user.id.slice(0, 8)}`;
    await prisma.user.update({
      where: { id: userId },
      data: { username: fallbackUsername }
    });
  }
}
