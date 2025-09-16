'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

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
            {isLogin 
              ? 'Connectez-vous pour accéder à votre espace personnel' 
              : 'Rejoignez-nous et profitez de nos offres exclusives'}
          </p>
        </div>
        
        {/* Carte du formulaire */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <AuthForm />
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              {isLogin ? "Première visite ? " : 'Déjà membre ? '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>

        {/* Lien de retour */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
