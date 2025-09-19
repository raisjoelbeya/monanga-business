'use client';

import {useSearchParams} from 'next/navigation';

interface AuthButtonsProps {
    title?: string;
    className?: string;
}

export function AuthButtons({ title = 'Se connecter avec', className = '' }: AuthButtonsProps) {
    const searchParams = useSearchParams();
    const redirectTo = searchParams?.get('redirect_to') || '/';

    const handleAuth = async (provider: string) => {
        try {
            const authUrl = new URL('/api/auth', window.location.origin);
            authUrl.searchParams.set('provider', provider);
            authUrl.searchParams.set('redirect_to', redirectTo);
            window.location.href = authUrl.toString();
        } catch (error) {
            console.error(`Erreur lors de la connexion avec ${provider}:`, error);
            alert(`Erreur lors de la connexion avec ${provider}. Veuillez réessayer.`);
        }
    };

    return (
        <div className={`space-y-4 w-full max-w-md mx-auto ${className}`}>
            <div className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                {title && (
                    <h3 className="text-lg font-medium text-white mb-6 text-center">
                        {title}
                    </h3>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => handleAuth("google")}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                        type="button"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Continuer avec Google</span>
                    </button>

                    <button
                        onClick={() => handleAuth("facebook")}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
                        type="button"
                    >
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                        </svg>
                        <span>Continuer avec Facebook</span>
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-400 text-center">
                        En cliquant sur un bouton, vous acceptez nos{' '}
                        <a href="/terms" className="text-blue-600 hover:underline font-medium">
                            conditions d&apos;utilisation
                        </a>{' '}
                        et notre{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                            politique de confidentialité
                        </a>.
                    </p>
                </div>
            </div>
        </div>);
}