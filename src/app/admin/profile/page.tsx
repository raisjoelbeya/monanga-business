'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/lib/auth-helpers';
import Image from 'next/image';
import { User } from '@/types';

export default function AdminProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user: currentUser } = await getClientSession();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Votre Profil Administrateur</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <Image 
                src={user.image} 
                alt={`${user.firstName} ${user.lastName}`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-3xl text-gray-400">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              Administrateur
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Informations personnelles</h3>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium text-gray-400">Nom complet:</span> {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-gray-400">Email:</span> {user?.email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-gray-400">Nom d&apos;utilisateur:</span> {user?.username || 'Non défini'}
              </p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Sécurité</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin/settings/change-password')}
                className="w-full text-left text-blue-400 hover:text-blue-300 transition-colors"
              >
                Changer le mot de passe
              </button>
              <button className="w-full text-left text-blue-400 hover:text-blue-300 transition-colors">
                Activer l&apos;authentification à deux facteurs
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Activité récente</h3>
          <div className="text-gray-400 text-sm">
            <p>Dernière connexion: {new Date().toLocaleDateString('fr-FR')}</p>
            <p className="mt-1">Compte créé le: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Date non disponible'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
