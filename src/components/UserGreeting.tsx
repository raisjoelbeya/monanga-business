'use client';

import {useUser} from "@/lib/hooks/use-user";

interface UserGreetingProps {
    readonly className?: string;
}

export function UserGreeting({className = ''}: Readonly<UserGreetingProps>) {
    const {user, isLoading} = useUser();

    if (isLoading || !user) {
        return <span className={className}></span>;
    }

    // Utilisation de firstName, puis username, puis email comme fallback
    const displayName = user.firstName || user.username || user.email?.split('@')[0] || '';

    return <span className={className}>{displayName}</span>;
}
