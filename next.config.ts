import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Activation du mode strict
    reactStrictMode: true,

    // Configure packages that need to be transpiled
    transpilePackages: [
        // Add your internal packages or UI libraries that need transpilation
        // Example: 'ui', 'shared'
    ],
    
    // Configuration des packages externes pour les composants serveur
    serverExternalPackages: ['@prisma/client'],
    
    // Configuration expérimentale
    experimental: {
        // Options expérimentales ici
    },

    // Configuration des en-têtes de sécurité
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                ],
            },
        ];
    },

    // Configuration des redirections
    async redirects() {
        return [
            { source: '/auth/signin', destination: '/login', permanent: true },
            { source: '/auth/signup', destination: '/register', permanent: true },
        ];
    },

    // Configuration des domaines d'images autorisés
    images: {
        domains: [
            'lh3.googleusercontent.com',
            'platform-lookaside.fbsbx.com',
            's.gravatar.com',
            'avatars.githubusercontent.com',
        ],
    },

    // Configuration Webpack personnalisée
    webpack: (config) => {
        return config;
    },
};

export default nextConfig;
