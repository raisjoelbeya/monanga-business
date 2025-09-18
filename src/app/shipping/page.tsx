import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Livraison - Monanga Business',
  description: 'Découvrez nos options de livraison, délais et frais pour la RDC et Kinshasa.',
};

export default function ShippingPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Livraison</h1>
        <p className="text-xl text-gray-300">Options de livraison rapide et sécurisée dans toute la RDC</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="mb-12 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Options de livraison disponibles</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Livraison Standard</h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Délai : 2-3 jours ouvrés à Kinshasa</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Frais : 5 000 CDF pour les commandes &lt; 100 000 CDF</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Suivi de commande disponible</span>
                </li>
              </ul>
              <p className="text-sm text-gray-400">* Livraison gratuite pour les commandes supérieures à 100 000 CDF</p>
            </div>

            <div className="border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Livraison Express</h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Délai : 24h à Kinshasa (commande avant 12h)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Frais : 10 000 CDF</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Suivi en temps réel</span>
                </li>
              </ul>
              <p className="text-sm text-gray-400">* Non disponible pour les commandes volumineuses</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Zones de livraison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Kinshasa</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Gombe</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lingwala</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kintambo</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ngaliema</span>
                </li>
                <li className="text-gray-400 text-sm">... et toutes les autres communes de Kinshasa</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Hors Kinshasa</h3>
              <p className="mb-4">Nous livrons dans les principales villes de la RDC :</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Matadi</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Lubumbashi</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Goma</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Kisangani</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-400">
                * Les délais et frais de livraison hors Kinshasa varient en fonction de la destination. Contactez-nous pour un devis personnalisé.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Suivi de commande</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="mb-4">
              Une fois votre commande expédiée, vous recevrez un email de confirmation avec un numéro de suivi. Vous pourrez suivre l&apos;état de votre livraison en temps réel via notre système de suivi.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Comment suivre ma commande ?</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Connectez-vous à votre compte Monanga Business</li>
                <li>Allez dans la section &quot;Mes commandes&quot;</li>
                <li>Sélectionnez la commande que vous souhaitez suivre</li>
                <li>Cliquez sur &quot;Suivre ma commande&quot;</li>
              </ol>
              <p className="mt-4 text-sm text-gray-400">
                Vous n&apos;avez pas de compte ? <a href="/auth/register" className="text-blue-400 hover:underline">Créez-en un ici</a> ou utilisez notre <a href="/order-tracking" className="text-blue-400 hover:underline">outil de suivi de commande</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">FAQ sur la livraison</h2>
          <div className="space-y-4">
            <details className="group bg-gray-800 p-4 rounded-lg">
              <summary className="flex justify-between items-center cursor-pointer">
                <span className="font-medium">Quels sont les délais de livraison ?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 text-gray-300">
                <p>Les délais de livraison varient en fonction de votre localisation :</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Kinshasa : 1-3 jours ouvrés (Livraison Express : 24h)</li>
                  <li>Villes principales de la RDC : 5-10 jours ouvrés</li>
                  <li>Zones reculées : 10-15 jours ouvrés</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400">Les délais commencent à compter de la confirmation de votre commande.</p>
              </div>
            </details>

            <details className="group bg-gray-800 p-4 rounded-lg">
              <summary className="flex justify-between items-center cursor-pointer">
                <span className="font-medium">Comment sont calculés les frais de livraison ?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 text-gray-300">
                <p>Les frais de livraison sont calculés en fonction de :</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>La zone de livraison</li>
                  <li>Le poids total du colis</li>
                  <li>La taille du colis</li>
                  <li>L&apos;option de livraison choisie (Standard ou Express)</li>
                </ul>
                <p className="mt-2">Livraison gratuite à partir de 100 000 CDF à Kinshasa.</p>
              </div>
            </details>

            <details className="group bg-gray-800 p-4 rounded-lg">
              <summary className="flex justify-between items-center cursor-pointer">
                <span className="font-medium">Puis-je modifier mon adresse de livraison après avoir passé commande ?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 text-gray-300">
                <p>Vous pouvez modifier votre adresse de livraison uniquement si votre commande n&apos;a pas encore été expédiée. Contactez-nous dès que possible au +243 817 828 734 ou à contact@monangabusiness.com avec votre numéro de commande.</p>
                <p className="mt-2 text-sm text-yellow-400">Une fois la commande expédiée, il n&apos;est plus possible de modifier l&apos;adresse de livraison.</p>
              </div>
            </details>

            <details className="group bg-gray-800 p-4 rounded-lg">
              <summary className="flex justify-between items-center cursor-pointer">
                <span className="font-medium">Que se passe-t-il si je suis absent lors de la livraison ?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 text-gray-300">
                <p>Si vous n&apos;êtes pas présent au moment de la livraison :</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Le livreur tentera de vous contacter au numéro fourni</li>
                  <li>Un avis de passage sera laissé avec des instructions pour reprogrammer la livraison</li>
                  <li>Votre colis sera conservé dans notre centre de distribution pendant 7 jours</li>
                  <li>Après ce délai, la commande sera annulée et remboursée (frais de retour déduits)</li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        <div className="bg-blue-900/30 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Besoin d&apos;aide ?</h2>
          <p className="mb-4">
            Notre équipe est disponible pour répondre à toutes vos questions concernant la livraison :
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email : <a href="mailto:livraison@monangabusiness.com" className="text-blue-400 hover:underline">livraison@monangabusiness.com</a></span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Téléphone : +243 817 828 734 (du lundi au samedi, de 8h à 18h)</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Adresse : 123 Avenue de la Paix, Gombe, Kinshasa, RDC</span>
            </li>
          </ul>
          <p className="mt-4">
            Notre équipe est à votre écoute pour vous fournir les meilleurs délais de livraison et vous accompagner tout au long du processus.
          </p>
        </div>

        <div className="text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6">
          <p>Dernière mise à jour : 17 septembre 2025</p>
          <p>© 2025 Monanga Business. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
