'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {getClientSession} from '@/lib/auth-helpers';
import {toTitleCase} from '@/lib/utils/string';
import Image from 'next/image';
import {ChangePasswordForm} from '@/components/ChangePasswordForm';
import {UserGreeting} from '@/components/UserGreeting';
import {LogoutButton} from '@/components/LogoutButton';

type User = {
	id: string;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	image?: string | null;
	role?: string; // Pour la rétrocompatibilité
	name?: string | null;
} | null;

export default function Dashboard() {
	const [user, setUser] = useState<User>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const {user: currentUser} = await getClientSession();
				
				if (!currentUser) {
					router.push('/login');
					return;
				}
				
				setUser(currentUser);
			} catch (error) {
				console.error('Erreur de vérification de session:', error);
				router.push('/login');
			} finally {
				setLoading(false);
			}
		};
		
		checkAuth();
	}, [router]);
	
	// La déconnexion est maintenant gérée par le composant LogoutButton
	
	if (loading) {
		return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
				<p className="mt-4 text-gray-600">Chargement...</p>
			</div>
		</div>);
	}
	
	// La redirection est gérée par le composant LogoutButton
	
	if (!user) {
		return (<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
			<div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
				<p className="text-red-400 text-lg mb-6">Vous devez être connecté pour accéder à cette page.</p>
				<LogoutButton/>
			</div>
		</div>);
	}
	
	return (<div className="min-h-screen bg-black text-white">
		{/* En-tête */}
		<header className="bg-gray-900 shadow-lg">
			<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
				<h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
				<div className="flex items-center space-x-4">
					<UserGreeting className="text-xl text-white font-bold capitalize"/>
					<div className="flex items-center">
						{user?.image && (<Image
							src={user.image}
							alt="Photo de profil"
							className="h-10 w-10 rounded-full border-2 border-blue-500"
							width={40}
							height={40}
						/>)}
					</div>
					<LogoutButton />
				</div>
			</div>
		</header>
		
		{/* Contenu principal */}
		<main className="bg-black">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
						<div className="px-6 py-8">
							<h2 className="text-2xl font-bold text-white mb-6">
								Bienvenue, {(() => {
								if (user.firstName && user.lastName) {
									return `${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`;
								}
								return user.username || 'Utilisateur';
							})()} !
							</h2>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								{/* Carte Statistiques */}
								<div className="bg-gray-800 p-6 rounded-lg">
									<div className="flex items-center">
										<div className="bg-blue-600 p-3 rounded-lg">
											<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
											     stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
												      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-400">Commandes</p>
											<p className="text-2xl font-semibold text-white">0</p>
										</div>
									</div>
								</div>
								
								{/* Carte Dépenses */}
								<div className="bg-gray-800 p-6 rounded-lg">
									<div className="flex items-center">
										<div className="bg-green-600 p-3 rounded-lg">
											<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
											     stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
												      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-400">Dépenses totales</p>
											<p className="text-2xl font-semibold text-white">0 €</p>
										</div>
									</div>
								</div>
								
								{/* Carte Dernière connexion */}
								<div className="bg-gray-800 p-6 rounded-lg">
									<div className="flex items-center">
										<div className="bg-yellow-500 p-3 rounded-lg">
											<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
											     stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
												      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-400">Dernière connexion</p>
											<p className="text-2xl font-semibold text-white">
												{new Date().toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							</div>
							
							{/* Section Activités récentes */}
							<div className="mt-8">
								<h3 className="text-xl font-semibold text-white mb-4">Activités récentes</h3>
								<div className="bg-gray-800 rounded-lg overflow-hidden">
									<ul className="divide-y divide-gray-700">
										<li className="p-4 hover:bg-gray-700 transition-colors">
											<div className="flex items-center">
												<div className="bg-blue-600 p-2 rounded-full">
													<svg className="h-5 w-5 text-white" fill="none"
													     viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round"
														      strokeWidth={2}
														      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
													</svg>
												</div>
												<div className="ml-4">
													<p className="text-sm font-medium text-white">Nouvelle
														commande</p>
													<p className="text-sm text-gray-400">Votre commande #12345 a été
														passée avec succès</p>
													<p className="text-xs text-gray-500 mt-1">Il y a 2 jours</p>
												</div>
											</div>
										</li>
										<li className="p-4 hover:bg-gray-700 transition-colors">
											<div className="flex items-center">
												<div className="bg-green-600 p-2 rounded-full">
													<svg className="h-5 w-5 text-white" fill="none"
													     viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round"
														      strokeWidth={2}
														      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
													</svg>
												</div>
												<div className="ml-4">
													<p className="text-sm font-medium text-white">Confirmation
														d&apos;email</p>
													<p className="text-sm text-gray-400">Votre adresse email a été
														vérifiée avec succès</p>
													<p className="text-xs text-gray-500 mt-1">Il y a 1 semaine</p>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
							
							{/* Section Paramètres */}
							<div className="mt-12">
								<h3 className="text-xl font-semibold text-white mb-6">Paramètres du compte</h3>
								<div className="bg-gray-800 rounded-lg p-6">
									<div className="space-y-6">
										<div className="border-b border-gray-700 pb-6">
											<h4 className="text-lg font-medium text-white mb-4">Informations
												personnelles</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-400">Prénom</p>
													<p className="text-white">{user.firstName || 'Non défini'}</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-400">Nom</p>
													<p className="text-white">{user.lastName || 'Non défini'}</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-400">Nom
														d&apos;utilisateur</p>
													<p className="text-white">{user.username || 'Non défini'}</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-400">Email</p>
													<p className="text-white">{user.email}</p>
												</div>
											</div>
										</div>
										
										<div className="border-b border-gray-700 pb-6">
											<h4 className="text-lg font-medium text-white mb-4">Sécurité</h4>
											<div className="space-y-4">
												<div className="bg-gray-700/50 p-4 rounded-lg">
													<h5 className="font-medium text-white mb-3">Changer le mot de
														passe</h5>
													<ChangePasswordForm/>
												</div>
												{/*<LogoutButton/>*/}
											</div>
										</div>
										
										<div className="pt-2">
											<h4 className="text-lg font-medium text-red-500 mb-4">Zone
												dangereuse</h4>
											<div className="rounded-md bg-red-900/30 border border-red-900/50 p-4">
												<div
													className="flex flex-col md:flex-row md:items-center md:justify-between">
													<div className="mb-4 md:mb-0">
														<h5 className="font-medium text-red-400">Supprimer mon
															compte</h5>
														<p className="text-sm text-red-300">Une fois votre compte
															supprimé, toutes vos données seront définitivement
															effacées.</p>
													</div>
													<button
														onClick={() => router.push('/account/delete')}
														className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
													>
														Supprimer mon compte
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>);
}
