import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Vérifier si nous sommes dans un environnement de navigateur
const isBrowser = typeof window !== 'undefined';

// Ne pas initialiser Prisma dans le navigateur
const prismaClientSingleton = () => {
  if (isBrowser) {
    throw new Error(
      '❌ PrismaClient is not available in the browser. Check your code to ensure it only runs on the server.'
    );
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

// Ne pas mettre en cache en production pour éviter les fuites de mémoire
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
