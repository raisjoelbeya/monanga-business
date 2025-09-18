'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AuthButtons } from '@/components/AuthButtons';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-2xl font-bold text-white">MB</span>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Monanga Business
            </h1>
          </div>
          <p className="text-gray-400 mt-2">
            Connectez-vous pour accéder à votre espace personnel
          </p>
        </div>
        
        {/* Carte du formulaire */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Connectez-vous à votre compte
          </h2>

          {error && (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-400">{message}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" action="/api/auth/login" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Adresse email
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Mot de passe
                </label>
                <a href="/forgot-password" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Se souvenir de moi
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Se connecter
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Ou continuez avec</span>
              </div>
            </div>

            <div className="mt-6">
              <AuthButtons />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Pas encore de compte ?{' '}
                <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </div>
          
          {/* Lien de retour */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
