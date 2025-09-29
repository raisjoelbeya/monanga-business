'use client';

// L'import d'useRouter a été supprimé, car il n'est pas utilisé

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = '' }: Readonly<LogoutButtonProps>) {
  // La navigation est gérée via window.location.href
  const handleLogout = async () => {
    try {
      // Appel à l'API de déconnexion
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies
      });

      const data = await response.json();
      
      if (response.ok) {
        // Forcer un rechargement complet pour s'assurer que tous les états sont réinitialisés
        window.location.href = '/';
      } else {
        const errorMessage = data?.error || 'Erreur inconnue';
        console.error('Échec de la déconnexion:', errorMessage);
        alert(`Impossible de se déconnecter: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la déconnexion:', errorMessage);
      alert(`Une erreur est survenue lors de la déconnexion: ${errorMessage}`);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-sm font-extrabold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
    >
      Se déconnecter
    </button>
  );
}
