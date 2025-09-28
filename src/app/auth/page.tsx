'use client';

import {useRouter} from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
    const router = useRouter();

    return (<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            {/* Logo et titre */}

            {/* Carte du formulaire */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                <AuthForm/>

                {/* Lien de retour */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Retour à l&apos;accueil
                    </button>
                </div>
            </div>
        </div>
    </div>);
}
