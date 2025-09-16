'use client';

import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1597075558724-af092979f798?auto=format&fit=crop&w=1950&q=80')"
                }}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-4xl text-center z-10 p-4">
                    <div className="flex items-center justify-center mb-6">
                        {/* Logo Placeholder */}
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl font-bold text-white">MB</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white">Monanga Business</h2>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                        Votre Partenaire <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                          E-commerce à Kinshasa
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                        Découvrez une sélection exclusive de produits premium livrés rapidement
                        dans toute la ville de Kinshasa. Service client 24/7.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Découvrir les produits
                        </Link>
                        <Link 
                            href="/auth/register"
                            className="px-8 py-4 bg-white text-gray-800 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            S'inscrire gratuitement
                        </Link>
                    </div>
                </div>
            </header>

            {/* Le reste du contenu de la page d'accueil peut être conservé ici */}
            {/* ... */}
        </div>
    );
}
