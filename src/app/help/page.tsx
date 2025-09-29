'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const helpSections = [
  {
    title: 'Commandes et Paiements',
    description: 'Tout sur le processus de commande et les options de paiement',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 3v2m10-2v2m-9 8h10M7 14h10m-9 4h10m-9 4h10M6 21h12a3 3 0 003-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v12a3 3 0 003 3z" />
      </svg>
    ),
    links: [
      { text: 'Comment passer commande ?', href: '/faq#commande' },
      { text: 'Modes de paiement acceptés', href: '/faq#paiement' },
      { text: 'Problème de paiement', href: '/contact' },
      { text: 'Facturation et reçus', href: '/faq#facturation' },
    ],
  },
  {
    title: 'Livraison et Suivi',
    description: 'Informations sur les délais, frais et suivi de commande',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    links: [
      { text: 'Délais de livraison', href: '/shipping' },
      { text: 'Suivre ma commande', href: '/faq#suivi' },
      { text: 'Zones de livraison', href: '/shipping#zones' },
      { text: 'Frais de livraison', href: '/shipping#frais' },
    ],
  },
  {
    title: 'Retours et Remboursements',
    description: 'Comment retourner un article et demander un remboursement',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 0h4m-12 4a4 4 0 01-.22-7.997" />
      </svg>
    ),
    links: [
      { text: 'Politique de retour', href: '/returns' },
      { text: 'Demander un retour', href: '/returns#demande' },
      { text: 'Suivre mon retour', href: '/returns#suivi' },
      { text: 'Politique de remboursement', href: '/returns#remboursement' },
    ],
  },
  {
    title: 'Mon Compte',
    description: 'Gérez votre compte et vos informations personnelles',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    links: [
      { text: 'Créer un compte', href: '/auth/register' },
      { text: 'Mot de passe oublié', href: '/auth/forgot-password' },
      { text: 'Modifier mes informations', href: '/dashboard/profile' },
      { text: 'Supprimer mon compte', href: '/dashboard/delete-account' },
    ],
  },
  {
    title: 'Sécurité et Confidentialité',
    description: 'Protection de vos données et sécurité des paiements',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    links: [
      { text: 'Sécurité des paiements', href: '/privacy#paiements' },
      { text: 'Politique de confidentialité', href: '/privacy' },
      { text: 'Cookies et suivi', href: '/privacy#cookies' },
      { text: 'Protection des données', href: '/privacy#donnees' },
    ],
  },
  {
    title: 'Service Client',
    description: 'Contactez notre équipe pour toute question',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    links: [
      { text: 'Nous contacter', href: '/contact' },
      { text: 'Heures d\'ouverture', href: '/contact#heures' },
      { text: 'Chat en direct', href: '/contact#chat' },
      { text: 'Réseaux sociaux', href: '/contact#social' },
    ],
  },
];

export default function HelpPage() {
  const router = useRouter();
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Comment pouvons-nous vous aider ?</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Trouvez des réponses à vos questions ou contactez notre service client pour une assistance personnalisée.
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grille des sections d'aide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {helpSections.map((section, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>
              <p className="text-gray-300 mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Section d'aide supplémentaire */}
      <div className="mt-16 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Notre équipe de support est disponible pour vous aider avec toutes vos questions et préoccupations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/contact" 
            className="px-6 py-3 bg-white text-blue-800 font-medium rounded-lg hover:bg-blue-100 transition-colors"
          >
            Nous contacter
          </Link>
          <Link 
            href="/faq" 
            className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Voir la FAQ complète
          </Link>
        </div>
      </div>
      
      {/* Bouton de retour à l'accueil */}
      <div className="mt-12 text-center">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}
