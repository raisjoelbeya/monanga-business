'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/lib/auth-helpers';

interface Settings {
	notifications: {
		email: boolean;
		push: boolean;
		newsletter: boolean;
	};
	language: string;
	timezone: string;
}

export default function AdminSettings() {
	const [settings, setSettings] = useState<Settings>({
		notifications: {
			email: true,
			push: false,
			newsletter: true,
		},
		language: 'fr',
		timezone: 'Europe/Paris',
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const router = useRouter();
	
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const { user } = await getClientSession();
				if (!user) {
					router.push('/login');
					return;
				}
			} catch (error) {
				console.error('Erreur lors de la récupération des paramètres:', error);
			} finally {
				setLoading(false);
			}
		};
		
		fetchSettings();
	}, [router]);
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const target = e.target as HTMLInputElement;
		const { name, value, type, checked } = target;
		
		if (name.startsWith('notifications.')) {
			const notificationType = name.split('.')[1];
			setSettings(prev => ({
				...prev,
				notifications: {
					...prev.notifications,
					[notificationType]: checked,
				},
			}));
		} else if (type === 'checkbox') {
			setSettings(prev => ({
				...prev,
				[name]: checked,
			}));
		} else {
			setSettings(prev => ({
				...prev,
				[name]: value,
			}));
		}
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setSaveSuccess(false);
		
		try {
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} catch (error) {
			console.error('Erreur lors de la sauvegarde des paramètres:', error);
		} finally {
			setSaving(false);
		}
	};
	
	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}
	
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-100">Paramètres</h1>
				{saveSuccess && (
					<div className="px-4 py-2 bg-green-600 text-white rounded-md text-sm">
						Paramètres enregistrés avec succès !
					</div>
				)}
			</div>
			
			<form onSubmit={handleSubmit} className="max-w-3xl">
				{/* Section Notifications */}
				<div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
					<h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
					
					<div className="space-y-4">
						{/* Notification Email */}
						<label className="flex items-start justify-between gap-4 p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
							<div className="flex-1">
								<div className="flex items-center mb-1">
									<svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<span className="text-gray-100 font-medium">Notifications par email</span>
								</div>
								<p className="text-sm text-gray-400 ml-7">Recevoir des mises à jour par email</p>
							</div>
							<div className="relative inline-flex items-center h-6">
								<input
									type="checkbox"
									name="notifications.email"
									id="email-notifications"
									checked={settings.notifications.email}
									onChange={handleChange}
									className="sr-only"
								/>
								<div className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${settings.notifications.email ? 'bg-blue-600' : 'bg-gray-600'}`}>
									<div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications.email ? 'translate-x-5' : ''}`}></div>
								</div>
							</div>
						</label>
						
						{/* Notification Push */}
						<label className="flex items-start justify-between gap-4 p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
							<div className="flex-1">
								<div className="flex items-center mb-1">
									<svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
									</svg>
									<span className="text-gray-100 font-medium">Notifications push</span>
								</div>
								<p className="text-sm text-gray-400 ml-7">Activer les notifications du navigateur</p>
							</div>
							<div className="relative inline-flex items-center h-6">
								<input
									type="checkbox"
									name="notifications.push"
									id="push-notifications"
									checked={settings.notifications.push}
									onChange={handleChange}
									className="sr-only"
								/>
								<div className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${settings.notifications.push ? 'bg-blue-600' : 'bg-gray-600'}`}>
									<div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications.push ? 'translate-x-5' : ''}`}></div>
								</div>
							</div>
						</label>
						
						{/* Newsletter */}
						<label className="flex items-start justify-between gap-4 p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
							<div className="flex-1">
								<div className="flex items-center mb-1">
									<svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
									</svg>
									<span className="text-gray-100 font-medium">Lettre d&apos;information</span>
								</div>
								<p className="text-sm text-gray-400 ml-7">Recevoir notre newsletter</p>
							</div>
							<div className="relative inline-flex items-center h-6">
								<input
									type="checkbox"
									name="notifications.newsletter"
									id="newsletter"
									checked={settings.notifications.newsletter}
									onChange={handleChange}
									className="sr-only"
								/>
								<div className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${settings.notifications.newsletter ? 'bg-blue-600' : 'bg-gray-600'}`}>
									<div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications.newsletter ? 'translate-x-5' : ''}`}></div>
								</div>
							</div>
						</label>
					</div>
				</div>
				
				{/* Section Préférences */}
				<div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
					<h2 className="text-xl font-semibold text-white mb-6">Préférences</h2>
					
					<div className="space-y-6">
						{/* Langue */}
						<div>
							<label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
								Langue
							</label>
							<select
								id="language"
								name="language"
								value={settings.language}
								onChange={handleChange}
								className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							>
								<option value="fr">Français</option>
								<option value="en">English</option>
								<option value="es">Español</option>
								<option value="pt">Português</option>
							</select>
						</div>
						
						{/* Fuseau horaire */}
						<div>
							<label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-1">
								Fuseau horaire
							</label>
							<select
								id="timezone"
								name="timezone"
								value={settings.timezone}
								onChange={handleChange}
								className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							>
								<option value="Europe/Paris">(GMT+1) Paris</option>
								<option value="Europe/London">(GMT+0) Londres</option>
								<option value="America/New_York">(GMT-4) New York</option>
								<option value="Asia/Tokyo">(GMT+9) Tokyo</option>
							</select>
						</div>
					</div>
				</div>
				
				{/* Boutons d'action */}
				<div className="flex justify-end space-x-3">
					<button
						type="button"
						onClick={() => router.back()}
						className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Annuler
					</button>
					<button
						type="submit"
						disabled={saving}
						className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{saving ? 'Enregistrement...' : 'Enregistrer'}
					</button>
				</div>
			</form>
		</div>
	);
}
