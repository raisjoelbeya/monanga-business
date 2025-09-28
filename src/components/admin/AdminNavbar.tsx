'use client';

import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {auth} from '@/lib/auth';
import {useEffect, useState} from 'react';
import Image from 'next/image';

// Composant UserGreeting intégré directement
const UserGreeting = ({ user, className = '' }: { 
    user: User | null;
    className?: string 
}) => {
    // Afficher le prénom, le nom d'utilisateur ou la première lettre de l'email
    const getDisplayName = () => {
        if (!user) return 'Utilisateur';
        
        if (user.firstName) return user.firstName;
        if (user.username) return user.username;
        if (user.email) return user.email.split('@')[0];
        
        return 'Utilisateur';
    };
    
    return <span className={`font-semibold ${className}`}>{getDisplayName()}</span>;
};

interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    image?: string | null;
    role: string;
    // Pour la rétrocompatibilité
    name?: string | null;
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
                const response = await fetch('/api/auth/session');
                
                if (!response.ok) {
                    throw new Error('Session invalide');
                }
                
                const data = await response.json();
                console.log('Données utilisateur reçues:', data);
                
                if (!data.user || data.user.role !== 'ADMIN') {
                    console.error('Utilisateur non autorisé ou rôle invalide:', data.user);
                    router.push('/unauthorized');
                    return;
                }
                
                console.log('Définition des données utilisateur:', data.user);
                setUser({
                    id: data.user.id || '',
                    email: data.user.email || '',
                    firstName: data.user.firstName || data.user.name || null,
                    lastName: data.user.lastName || null,
                    username: data.user.username || null,
                    image: data.user.image || null,
                    role: data.user.role || 'USER'
                });
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
            // Vérifier que auth est correctement initialisé
            if (!auth || typeof auth !== 'object') {
                console.error('Auth is not properly initialized');
                router.push('/login');
                return;
            }

            // Use the session cookie name from auth object or fallback to default
            const cookieName = 'session' in auth && auth.sessionCookieName 
              ? auth.sessionCookieName 
              : 'auth_session';
            
            // Récupérer l'ID de session depuis les cookies
            const sessionId = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${cookieName}=`))
                ?.split('=')[1];

            // Invalider la session si elle existe
            if (sessionId && 'invalidateSession' in auth && typeof auth.invalidateSession === 'function') {
                try {
                    await auth.invalidateSession(sessionId);
                } catch (error) {
                    console.error('Error invalidating session:', error);
                }
            }

            // Supprimer le cookie de session
            document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

            router.push('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    if (isLoading) {
        return (<nav className="bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>))}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>);
    }

    if (!user) {
        return null;
    }

    return (<nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Link href="/admin">
                            <span className="text-xl font-bold text-white">Admin Panel</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link
                            href="/admin/users"
                            className="border-transparent text-gray-300 hover:border-gray-500 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-semibold"
                        >
                            Utilisateurs
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="border-transparent text-gray-300 hover:border-gray-500 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-semibold"
                        >
                            Paramètres
                        </Link>
                    </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <div className="hidden sm:ml-6 sm:flex items-center text-sm text-gray-300">
                        <UserGreeting user={user} className="ml-1 text-white font-semibold" />
                    </div>
                    <div className="ml-3 relative">
                        <div>
                            <button
                                type="button"
                                className="bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                id="user-menu"
                                aria-expanded="false"
                                aria-haspopup="true"
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            >
                                <span className="sr-only">Ouvrir le menu utilisateur</span>
                                {isLoading ? (
                                    <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
                                ) : user?.image ? (
                                    <Image
                                        className="h-8 w-8 rounded-full"
                                        src={user.image}
                                        alt={user.firstName && user.lastName 
                                            ? `${user.firstName} ${user.lastName}` 
                                            : user.username || 'Utilisateur'}
                                        width={32}
                                        height={32}
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                                        {user?.firstName ?
                                            user.firstName.charAt(0).toUpperCase()
                                            : user?.username ?
                                                user.username.charAt(0).toUpperCase()
                                                : user?.email ?
                                                    user.email.charAt(0).toUpperCase()
                                                    : 'U'}
                                    </div>
                                )}
                            </button>
                        </div>

                        {isProfileMenuOpen && (<div
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu"
                            >
                                <Link
                                    href="/admin/profile"
                                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                    role="menuitem"
                                >
                                    Votre profil
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                    role="menuitem"
                                >
                                    Paramètres
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
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
                        className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-gray-800`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/admin/users"
            className="border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Utilisateurs
          </Link>
          <Link
            href="/admin/settings"
            className="border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Paramètres
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-4">
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
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-700">
                  <svg
                    className="h-full w-full text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm font-medium text-gray-300">
                {user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="/admin/profile"
              className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Votre profil
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Paramètres
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
