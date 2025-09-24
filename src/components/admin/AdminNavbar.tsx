'use client';

import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {auth} from '@/lib/auth';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import { UserGreeting } from '../UserGreeting';

interface User {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role: string;
}

export default function AdminNavbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const sessionId = document.cookie
                    .split('; ')
                    .find(row => row.startsWith(auth.sessionCookieName + '='))
                    ?.split('=')[1];

                if (!sessionId) {
                    router.push('/login');
                    return;
                }

                const {user} = await auth.validateSession(sessionId);

                if (!user || user.role !== 'ADMIN') {
                    router.push('/unauthorized');
                    return;
                }

                setUser(user);
            } catch (error) {
                console.error('Erreur de vérification de session:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            const sessionId = document.cookie
                .split('; ')
                .find(row => row.startsWith(auth.sessionCookieName + '='))
                ?.split('=')[1];

            if (sessionId) {
                await auth.invalidateSession(sessionId);
            }

            // Supprimer le cookie de session
            document.cookie = `${auth.sessionCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

            router.push('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    if (isLoading) {
        return (<nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>))}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>);
    }

    if (!user) {
        return null;
    }

    return (<nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/admin">
                            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link
                            href="/admin/dashboard"
                            className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Tableau de bord
                        </Link>
                        <Link
                            href="/admin/users"
                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Utilisateurs
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Paramètres
                        </Link>
                    </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <div className="ml-3 relative">
                        <div>
                            <button
                                type="button"
                                className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                id="user-menu"
                                aria-expanded="false"
                                aria-haspopup="true"
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            >
                                <span className="sr-only">Ouvrir le menu utilisateur</span>
                                {user.image ? (<Image
                                        className="h-8 w-8 rounded-full"
                                        src={user.image}
                                        alt={`${user.name || 'Utilisateur'}`}
                                        width={32}
                                        height={32}
                                    />) : (<div
                                        className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </div>)}
                            </button>
                        </div>

                        {isProfileMenuOpen && (<div
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu"
                            >
                                <Link
                                    href="/admin/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Votre profil
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Paramètres
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Déconnexion
                                </button>
                            </div>)}
                    </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                    <button
                        type="button"
                        className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="sr-only">Ouvrir le menu principal</span>
                        <svg
                            className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        <svg
                            className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        {/* Menu mobile */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/admin/dashboard"
            className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Tableau de bord
          </Link>
          <Link
            href="/admin/users"
            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Utilisateurs
          </Link>
          <Link
            href="/admin/settings"
            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Paramètres
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  className="h-8 w-8 rounded-full"
                  src={user.image}
                  alt=""
                  width={32}
                  height={32}
                />
              ) : (
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="ml-3">
              <UserGreeting />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">
                {user.name || user.email}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="/admin/profile"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Votre profil
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Paramètres
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
