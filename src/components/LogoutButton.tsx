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
      });

      if (response.ok) {
        // Rediriger vers la page de connexion avec le paramètre logout=true
        window.location.href = '/';
      } else {
        console.error('Échec de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
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
