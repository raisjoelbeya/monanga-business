'use client';

import { useRouter } from 'next/navigation';

const paymentMethods = [
  {
    name: 'Carte Bancaire',
    description: 'Paiement sécurisé par carte Visa, Mastercard ou autres cartes de crédit/débit',
    icon: (
      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-1-5h1m4 0h1m-9 0H8m0 0H5m3 0V8m12 0h-1.5a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h1.5a1 1 0 001-1V9a1 1 0 00-1-1z" />
      </svg>
    ),
    details: [
      'Paiement sécurisé via notre partenaire de paiement certifié PCI DSS',
      'Cryptage SSL 256 bits pour toutes les transactions',
      'Aucune information bancaire n\'est stockée sur nos serveurs',
      'Acceptation des cartes internationales',
    ],
    security: [
      '3D Secure pour une protection renforcée',
      'Vérification de l\'adresse (AVS)',
      'Vérification du code de sécurité (CVV)',
    ],
  },
  {
    name: 'Mobile Money',
    description: 'Paiement rapide et sécurisé via votre compte Mobile Money',
    icon: (
      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    details: [
      'Orange Money, M-Pesa, Airtel Money et autres portefeuilles mobiles',
      'Confirmation par code PIN',
      'Reçu instantané par SMS',
      'Disponible 24/7',
    ],
    security: [
      'Authentification à deux facteurs',
      'Confirmation par code unique (OTP)',
      'Chiffrement de bout en bout',
    ],
  },
  {
    name: 'Virement Bancaire',
    description: 'Paiement par virement bancaire national ou international',
    icon: (
      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    details: [
      'Coordonnées bancaires fournies après commande',
      'Traitement sous 24-48h après réception du paiement',
      'Reçu par email après validation du paiement',
      'Frais bancaires à la charge de l\'expéditeur',
    ],
    security: [
      'Vérification manuelle de chaque virement',
      'Confirmation par email obligatoire',
      'Protection contre la fraude',
    ],
  },
  {
    name: 'Paiement à la Livraison',
    description: 'Payez en espèces ou par carte à la réception de votre commande',
    icon: (
      <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    details: [
      'Uniquement disponible pour Kinshasa',
      'Paiement en espèces ou par carte bancaire',
      'Facture fournie avec la commande',
      'Supplément de 2 000 CDF pour cette option',
    ],
    security: [
      'Identification du livreur obligatoire',
      'Reçu papier fourni sur place',
      'Suivi de commande en temps réel',
    ],
  },
];

const securityMeasures = [
  {
    title: 'Chiffrement SSL 256 bits',
    description: 'Toutes les transactions sont cryptées pour une sécurité maximale',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Certification PCI DSS',
    description: 'Conformité aux normes de sécurité des données de l\'industrie des cartes de paiement',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Protection contre la fraude',
    description: 'Système avancé de détection des transactions suspectes',
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
      </svg>
    ),
  },
  {
    title: 'Données sécurisées',
    description: 'Aucune information de paiement n\'est stockée sur nos serveurs',
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "Quelles sont les cartes bancaires acceptées ?",
    answer: "Nous acceptons les cartes Visa, Mastercard, American Express et autres cartes de crédit/débit internationales. Toutes nos transactions sont sécurisées par notre partenaire de paiement certifié PCI DSS."
  },
  {
    question: "Est-ce que mes informations de paiement sont sécurisées ?",
    answer: "Oui, toutes les transactions sur notre site sont cryptées avec la technologie SSL 256 bits. Nous ne stockons jamais les informations de votre carte bancaire sur nos serveurs. Les données sensibles sont gérées par nos partenaires de paiement agréés."
  },
  {
    question: "Comment fonctionne le paiement à la livraison ?",
    answer: "Le paiement à la livraison est disponible uniquement pour Kinshasa. Vous pouvez payer en espèces ou par carte bancaire directement au livreur lors de la réception de votre commande. Des frais supplémentaires de 2 000 CDF s'appliquent pour cette option."
  },
  {
    question: "Puis-je obtenir une facture pour mon achat ?",
    answer: "Oui, une facture détaillée est automatiquement générée pour chaque commande et vous est envoyée par email. Si vous payez à la livraison, une facture papier vous sera également remise avec votre commande."
  },
  {
    question: "Que se passe-t-il si mon paiement est refusé ?",
    answer: "Si votre paiement est refusé, vérifiez que les informations de votre carte sont correctes et que votre solde est suffisant. Si le problème persiste, contactez votre banque. Vous pouvez également essayer une autre méthode de paiement ou nous contacter pour obtenir de l'aide."
  },
  {
    question: "Comment fonctionne le remboursement en cas de retour ?",
    answer: "En cas de retour d'un article éligible, le remboursement sera effectué selon votre méthode de paiement d'origine. Les délais de remboursement varient : jusqu'à 5 jours ouvrés pour les cartes bancaires, 24-48h pour Mobile Money, et 3-5 jours ouvrés pour les virements bancaires."
  }
];

export default function PaymentsPage() {
  const router = useRouter();
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Méthodes de Paiement</h1>
        <p className="text-xl text-gray-300">Paiements sécurisés et sans souci</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {paymentMethods.map((method, index) => (
          <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {method.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{method.name}</h2>
                  <p className="text-gray-300">{method.description}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Avantages :</h3>
                <ul className="space-y-2 mb-6">
                  {method.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Sécurité :</h3>
                <ul className="space-y-2">
                  {method.security.map((security, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>{security}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Sécurité des Paiements</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityMeasures.map((measure, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {measure.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{measure.title}</h3>
              <p className="text-gray-300">{measure.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-gray-800 p-6 rounded-lg">
              <summary className="flex justify-between items-center cursor-pointer">
                <span className="text-lg font-medium">{faq.question}</span>
                <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 text-gray-300">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="bg-blue-900/30 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Besoin d&apos;aide ?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Notre équipe est disponible pour répondre à toutes vos questions concernant les paiements et la sécurité.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="/contact" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nous contacter
          </a>
          <a 
            href="/faq" 
            className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Voir la FAQ complète
          </a>
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6 text-center">
        <p>Dernière mise à jour : 17 septembre 2025</p>
        <p> 2025 Monanga Business. Tous droits réservés.</p>
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
