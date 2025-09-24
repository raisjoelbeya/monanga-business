'use client';

import {useUser} from "@/lib/hooks/use-user";

interface UserGreetingProps {
    className?: string;
    showEmail?: boolean;
}

export function UserGreeting({className = '', showEmail = false}: UserGreetingProps) {
    const {user, isLoading} = useUser();

    if (isLoading || !user) {
        return <span className={className}>Bonjour</span>;
    }

    // Utilisation de firstName, puis username, puis email comme fallback
    const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username;
    const displayName = user.firstName || user.username || fullName || user.email?.split('@')[0] || 'Utilisateur';

    return (<div className={className}>
            <span>Bonjour {displayName}</span>
            {showEmail && user.email && (<span className="block text-sm text-gray-500">{user.email}</span>)}
        </div>);
}
