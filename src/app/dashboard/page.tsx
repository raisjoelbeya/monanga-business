'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/api';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
} | null;

export default function Dashboard() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await auth.getSession();
        if (!data?.user) {
          router.push('/');
          return;
        }
        setUser(data.user);
      } catch (error) {
        console.error('Erreur de vérification de session:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Mon Tableau de Bord</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Connecté en tant que <span className="font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Bienvenue, {user?.username} !</h2>
            <p className="text-gray-600">
              Vous êtes maintenant connecté à votre compte. Ceci est une page protégée.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="text-lg font-medium text-blue-800">Informations du compte</h3>
              <dl className="mt-2">
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">ID Utilisateur</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Nom d&apos;utilisateur</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.username}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
