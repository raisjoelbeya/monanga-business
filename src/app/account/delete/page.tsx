'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteAccountPage() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleDeleteAccount = async () => {
        // Utilisation de confirm pour une confirmation explicite
        if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
            return;
        }

        setIsDeleting(true);
        setError('');

        try {
            const response = await fetch('/api/account/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Échec de la suppression du compte');
            }

            // Déconnexion de l'utilisateur
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            router.push('/auth/signin');
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du compte';
            setError(errorMessage);
        } finally {
            setIsDeleting(false); // Toujours réinitialiser isDeleting, même en cas d'erreur
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Supprimer mon compte</h1>

            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <h2 className="text-lg font-semibold text-red-700 mb-2">Attention !</h2>
                <p className="text-red-600">
                    La suppression de votre compte est une action irréversible. Toutes vos données personnelles seront
                    définitivement supprimées de nos serveurs.
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
            )}

            <div className="mb-6">
                <p className="mb-4">Êtes-vous sûr de vouloir supprimer votre compte ?</p>
                <p className="text-sm text-gray-600 mb-4">
                    Cette action ne peut pas être annulée. Toutes vos données seront définitivement supprimées.
                </p>
                <p className="text-sm text-gray-500">
                    Pour plus d&apos;informations sur la gestion de vos données, consultez notre{' '}
                    <a
                        href="/privacy"
                        className="text-blue-500 hover:text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        politique de confidentialité
                    </a>
                    .
                </p>
            </div>

            <div className="flex flex-col space-y-3">
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className={`px-4 py-2 rounded-md text-white ${
                        isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors`}
                >
                    {isDeleting ? 'Suppression en cours...' : 'Oui, supprimer mon compte'}
                </button>

                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}