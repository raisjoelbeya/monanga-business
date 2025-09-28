'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier la session via l'API
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/login');
          return;
        }

        const sessionData = await sessionResponse.json();
        
        if (sessionData.user?.role !== 'ADMIN') {
          router.push('/unauthorized');
          return;
        }

        // Récupérer les statistiques (simulé pour l'instant)
        // Dans une application réelle, vous feriez un appel API ici
        const mockStats: Stats = {
          totalUsers: 1242,
          activeUsers: 873,
          totalOrders: 5489,
          revenue: 125430.50,
        };

        setStats(mockStats);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Une erreur est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(() => console.info('Data fetched successfully'));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNavbar />
        <div className="py-10">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-800 shadow rounded-lg p-6">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
                    <div className="h-64 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNavbar />
        <div className="py-10">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNavbar />
      
      <div className="py-6 md:py-10 px-2 sm:px-4">
        <header className="mb-6">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Tableau de bord</h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="py-4 sm:py-6">
              {/* Cartes de statistiques */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Utilisateurs totaux */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-300 truncate">Utilisateurs totaux</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats?.totalUsers.toLocaleString()}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilisateurs actifs */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-300 truncate">Utilisateurs actifs</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats?.activeUsers.toLocaleString()}
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="sr-only">Augmenté de</span>
                              {stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commandes totales */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-300 truncate">Commandes totales</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats?.totalOrders.toLocaleString()}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenu total */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-300 truncate">Revenu total</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats?.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphique des ventes récentes */}
              <div className="mt-6 sm:mt-8 bg-gray-800 shadow rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-4 sm:mb-6">Ventes récentes</h2>
                <div className="h-56 sm:h-64 flex items-center justify-center bg-gray-700 rounded-md">
                  <p className="text-sm sm:text-base text-gray-300 text-center px-4">Graphique des ventes récentes</p>
                </div>
              </div>

              {/* Dernières commandes */}
              <div className="mt-6 sm:mt-8">
                <h2 className="text-lg font-medium text-white mb-4">Dernières commandes</h2>
                <div className="bg-gray-800 shadow overflow-x-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          N° commande
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Client
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Statut
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Montant
                        </th>
                        <th scope="col" className="relative px-4 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                          <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                            #ORD-{1000 + i}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                            Client {i}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                              Payé
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                            {(Math.random() * 1000).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <a href="#" className="text-blue-400 hover:text-blue-300">Voir</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
