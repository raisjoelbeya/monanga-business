import { PrismaClient } from '@prisma/client';

// Ne pas initialiser Prisma dans le navigateur
const isBrowser = typeof window !== 'undefined';

const prismaClientSingleton = () => {
  if (isBrowser) {
    throw new Error(
      '❌ PrismaClient is not available in the browser. Check your code to ensure it only runs on the server.'
    );
  }

  // Configuration minimale du client Prisma
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

  return client;
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

// Ne pas mettre en cache en production pour éviter les fuites de mémoire
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
