'use client';

import {useState} from 'react';
import {auth} from '@/lib/api';
// L'import de useRouter a été supprimé car il n'est pas utilisé
import { Logo } from '@/components/Logo';

type AuthMode = 'login' | 'signup';

export default function AuthForm() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    // La navigation est gérée via window.location

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation pour la connexion
        if (mode === 'login') {
            if (!formData.email || !formData.password) {
                setError('Veuillez remplir tous les champs');
                setLoading(false);
                return;
            }
        }
        // Validation pour l'inscription
        else {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
                setError('Veuillez remplir tous les champs obligatoires');
                setLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères');
                setLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Les mots de passe ne correspondent pas');
                setLoading(false);
                return;
            }

            if (!termsAccepted) {
                setError('Veuillez accepter les conditions d\'utilisation');
                setLoading(false);
                return;
            }
        }

        try {
            if (mode === 'login') {
                const {data, error} = await auth.login(formData.email, formData.password);
                console.log('Login response:', { data, error });
                if (error) throw new Error(error);
                
                if (data?.user) {
                    console.log('User role:', data.user.role);
                    
                    // Rafraîchir la session côté client
                    await fetch('/api/auth/session', { 
                        credentials: 'include' 
                    });
                    
                    // Rediriger vers /admin si l'utilisateur est un administrateur
                    const redirectPath = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
                    console.log('Redirecting to', redirectPath);
                    window.location.href = redirectPath;
                }
            } else {
                // Inscription
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        firstName: formData.firstName,
                        lastName: formData.lastName
                    })
                });

                const data = await response.json();
                console.log('Réponse inscription:', data);

                if (!response.ok) {
                    throw new Error(data.error || 'Erreur lors de l\'inscription');
                }

                console.log('Tentative de connexion automatique...');
                // Connexion automatique après inscription réussie
                const loginResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.email,
                        password: formData.password,
                    }),
                    credentials: 'include',
                });

                const loginData = await loginResponse.json();
                console.log('Réponse connexion:', loginData);

                if (!loginResponse.ok) {
                    throw new Error(loginData.error || 'Échec de la connexion automatique');
                }

                // Rafraîchir la session côté client
                await fetch('/api/auth/session', { 
                    credentials: 'include' 
                });

                console.log('Redirection vers /dashboard');
                // Forcer un rechargement complet pour s'assurer que les cookies sont bien pris en compte
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error('Erreur lors de l\'authentification:', err);
            const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
            setError(errorMessage.includes('fetch') ? 'Erreur de connexion au serveur' : errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer les redirections OAuth
    const handleOAuthClick = (provider: string) => {
        const redirectTo = mode === 'login' ? '/dashboard' : '/complete-signup';
        window.location.href = `/api/auth?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
    };

    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="mb-5">
              <Logo size="lg" withText={false} />
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="mt-2 text-gray-400">
              {mode === 'login' ? 'Bienvenue de retour ! Connectez-vous à votre compte.' : 'Rejoignez-nous et découvrez nos offres exclusives.'}
            </p>
          </div>
        </div>

        {error && (<div className="p-4 text-red-400 bg-red-900/30 border border-red-800 rounded-lg">
            {error}
        </div>)}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                {/* Nom complet - Seulement pour l'inscription */}
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                        Prénom *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                        Nom *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* Email - Toujours visible */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Adresse email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Mot de passe */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Mot de passe
                        </label>
                        {mode === 'login' && (
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                Mot de passe oublié ?
                            </a>)}
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder={mode === 'login' ? 'Votre mot de passe' : 'Créez un mot de passe'}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {mode === 'signup' && (<p className="mt-1 text-xs text-gray-400">
                        Le mot de passe doit contenir au moins 6 caractères
                    </p>)}
                </div>

                {/* Confirmation mot de passe - Seulement pour l'inscription */}
                {mode === 'signup' && (<div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirmez le mot de passe
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>)}

                {/* Conditions d'utilisation - Seulement pour l'inscription */}
                {mode === 'signup' && (<div className="flex items-start mt-4">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-300 cursor-pointer">
                            J&apos;accepte les{' '}
                            <a href="/conditions-utilisation" className="text-blue-400 hover:text-blue-300">
                                conditions d&apos;utilisation
                            </a>{' '}
                            et la{' '}
                            <a href="/confidentialite" className="text-blue-400 hover:text-blue-300">
                                politique de confidentialité
                            </a>
                        </label>
                    </div>
                </div>)}
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white ${loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300`}
                >
                    {loading ? (<span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Traitement...
                            </span>) : mode === 'login' ? 'Se connecter' : "Créer un compte"}
                </button>
            </div>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">
                        Ou continuez avec
                    </span>
            </div>
        </div>

        {/* Boutons OAuth avec icônes corrigées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google */}
            <button
                type="button"
                onClick={() => handleOAuthClick('google')}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <div className="w-5 h-5 mr-2">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                Google
            </button>

            {/* Facebook */}
            <button
                type="button"
                onClick={() => handleOAuthClick('facebook')}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-[#1877F2] rounded-lg shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <div className="w-5 h-5 mr-2">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.656 9.083 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                </div>
                Facebook
            </button>
        </div>

        <div className="text-center text-sm text-gray-400">
            {mode === 'login' ? (<p>
                Pas encore de compte ?{' '}
                <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Créer un compte
                </button>
            </p>) : (<p>
                Déjà un compte ?{' '}
                <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Se connecter
                </button>
            </p>)}
        </div>
    </div>);
}