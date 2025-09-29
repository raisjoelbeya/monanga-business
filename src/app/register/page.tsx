'use client';

import {Suspense, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {AuthButtons} from '@/components/AuthButtons';
import {Logo} from "@/components/Logo";

function RegisterContent() {
	const [formData, setFormData] = useState({
		firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [registrationSuccess] = useState(false);
	const router = useRouter();
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData(prev => ({
			...prev, [name]: value
		}));
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		
		// Validation simple
		if (formData.password !== formData.confirmPassword) {
			setError('Les mots de passe ne correspondent pas');
			return;
		}
		
		if (formData.password.length < 6) {
			setError('Le mot de passe doit contenir au moins 6 caractères');
			return;
		}
		
		setLoading(true);
		
		try {
			console.log('Début de l\'inscription pour:', formData.email);
			
			// Étape 1: Enregistrement de l'utilisateur
			const response = await fetch('/api/auth/register', {
				method: 'POST', headers: {
					'Content-Type': 'application/json',
				}, body: JSON.stringify({
					firstName: formData.firstName.trim(),
					lastName: formData.lastName.trim(),
					email: formData.email.trim().toLowerCase(),
					password: formData.password,
				}),
			});
			
			const data = await response.json();
			console.log('Réponse de l\'inscription:', data);
			
			if (!response.ok) {
				throw new Error(data.error || 'Une erreur est survenue lors de l\'inscription');
			}
			
			// Étape 2: Connexion automatique
			console.log('Tentative de connexion automatique...');
			const loginResponse = await fetch('/api/auth/login', {
				method: 'POST', headers: {
					'Content-Type': 'application/json',
				}, body: JSON.stringify({
					username: formData.email.trim().toLowerCase(), password: formData.password,
				}), credentials: 'include', // Important pour les cookies
			});
			
			const loginData = await loginResponse.json();
			console.log('Réponse de la connexion:', loginData);
			
			if (!loginResponse.ok) {
				throw new Error(loginData.error || 'Connexion automatique échouée');
			}
			
			console.log('Redirection vers /dashboard');
			// Rediriger vers le tableau de bord
			window.location.href = '/dashboard'; // Utiliser window.location pour forcer un rechargement complet
		} catch (err) {
			console.error('Erreur lors de l\'inscription:', err);
			setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
		} finally {
			setLoading(false);
		}
	};
	
	const searchParams = useSearchParams();
	const message = searchParams?.get('message');
	const successParam = searchParams?.get('success');
	
	return (<div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
			
				
				{registrationSuccess ? (
					<div className="p-4 text-green-400 bg-green-900/30 border border-green-800 rounded-lg text-center">
						<p className="font-medium">Compte créé avec succès !</p>
						<p className="text-sm mt-1">Redirection vers la page de connexion...</p>
					</div>) : error ? (<div className="p-4 text-red-400 bg-red-900/30 border border-red-800 rounded-lg">
						{error}
					</div>) : null}
				
				{message && (<div
						className={`p-4 ${successParam === 'true' ? 'text-green-400 bg-green-900/30 border-green-800' : 'text-red-400 bg-red-900/30 border-red-800'} border rounded-lg`}>
						{decodeURIComponent(message)}
					</div>)}
				
				<div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
					<div className="flex flex-col items-center justify-center mb-6">
						<div className="mb-5">
							<Logo size="lg" withText={false} />
						</div>
						<h2 className="text-3xl font-extrabold text-white">
							Créer un compte
						</h2>
					</div>
					<h2 className="text-gray-400 mt-2 mb-6 text-center">
						Rejoignez-nous et découvrez nos offres exclusives.
					</h2>
					
					
					
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (<div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
								{error}
							</div>)}
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
									value={formData.firstName}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
									value={formData.lastName}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								/>
							</div>
						</div>
						
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
								Adresse email *
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								/>
							</div>
						</div>
						
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
								Mot de passe
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									required
									value={formData.password}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								/>
							</div>
							<p className="mt-1 text-xs text-gray-400">Le mot de passe doit contenir au moins 6 caractères</p>
						</div>
						
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
								Confirmer le mot de passe
							</label>
							<div className="mt-1">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								/>
							</div>
						</div>
						
						<div className="flex items-start">
							<div className="flex items-center h-5">
								<input
									id="terms"
									name="terms"
									type="checkbox"
									required
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
								/>
							</div>
							<label htmlFor="terms" className="ml-3 text-sm text-gray-300">
								J&apos;accepte les{' '}
								<Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
									conditions d&apos;utilisation
								</Link>{' '}
								et la{' '}
								<Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
									politique de confidentialité
								</Link>
							</label>
						</div>
						
						<div className="pt-2">
							<button
								type="submit"
								disabled={loading || registrationSuccess}
								className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${registrationSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
							>
								{loading ? (<>
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
										     fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
											        strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor"
											      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Création en cours...
									</>) : registrationSuccess ? (<>
										<svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
										</svg>
										Compte créé !
									</>) : ('Créer un compte')}
							</button>
						</div>
					</form>
					
					<div className="mt-8">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-600"></div>
							</div>
							<div className="relative flex justify-center">
                <span className="px-3 bg-gray-800 text-sm text-gray-400">
                  Ou inscrivez-vous avec
                </span>
							</div>
						</div>
						
						<div className="mt-6">
							<AuthButtons title="" className="max-w-none"/>
						</div>
					</div>
					
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
		</div>);
}

export default function RegisterPage() {
	return (<Suspense fallback={null}>
			<RegisterContent/>
		</Suspense>);
}
