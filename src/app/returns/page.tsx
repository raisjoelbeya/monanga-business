'use client';

import { useRouter } from 'next/navigation';

export default function ReturnsPage() {
  const router = useRouter();
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Politique de Retours</h1>
        <p className="text-xl text-gray-300">Retournez facilement vos articles dans les 7 jours</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Résumé de la politique de retours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Délai de retour</h3>
              <p className="text-sm text-gray-300">7 jours à compter de la réception</p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Condition des articles</h3>
              <p className="text-sm text-gray-300">Neuf, non utilisé, dans son emballage d&apos;origine</p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Remboursement</h3>
              <p className="text-sm text-gray-300">Sous 14 jours après réception du retour</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Conditions générales de retour</h2>
          <p className="mb-4">
            Chez Monanga Business, nous voulons que vous soyez entièrement satisfait de votre achat. Si ce n&apos;est pas le cas, vous pouvez nous retourner les produits dans les conditions suivantes :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Le délai de retour est de 7 jours à compter de la date de réception de votre commande</li>
            <li>Les articles doivent être retournés dans leur état d&apos;origine, neufs, non utilisés, avec leurs étiquettes et dans leur emballage d&apos;origine</li>
            <li>Les produits défectueux ou endommagés lors de la livraison sont couverts par notre garantie</li>
            <li>Les produits personnalisés ou sur mesure ne peuvent pas être retournés, sauf en cas de défaut de fabrication</li>
            <li>Les produits d&apos;hygiène et de beauté ne peuvent être retournés que s&apos;ils sont dans leur emballage d&apos;origine, scellé</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Procédure de retour</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Contactez notre service client</h3>
                <p className="text-gray-300">
                  Avant de nous retourner un article, veuillez d&apos;abord nous contacter à <a href="mailto:retours@monangabusiness.com" className="text-blue-400 hover:underline">retours@monangabusiness.com</a> ou appelez-nous au +243 817 828 734 pour obtenir une autorisation de retour (RMA).
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Préparez votre colis</h3>
                <p className="text-gray-300">
                  Emballez soigneusement le ou les articles à retourner dans leur emballage d&apos;origine si possible. Incluez tous les accessoires, manuels et documents. N&apos;oubliez pas d&apos;inclure le bon de livraison d&apos;origine et la raison du retour.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Expédiez le colis</h3>
                <p className="text-gray-300">
                  Expédiez le colis à l&apos;adresse suivante en recommandé avec accusé de réception :<br />
                  <span className="font-medium">Service Retours Monanga Business</span><br />
                  123 Avenue de la Paix<br />
                  Gombe, Kinshasa<br />
                  RDC
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  * Les frais de retour sont à la charge du client, sauf en cas d&apos;erreur de notre part ou d&apos;article défectueux.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Remboursements et échanges</h2>
          <h3 className="text-xl font-semibold mb-2 text-white">Remboursements</h3>
          <p className="mb-4">
            Une fois que nous aurons reçu et inspecté l&apos;article retourné, nous vous enverrons un email pour vous confirmer que nous l&apos;avons reçu. Nous vous informerons également de l&apos;approbation ou du rejet de votre remboursement.
          </p>
          <p className="mb-4">
            Si votre remboursement est approuvé, il sera traité et un crédit sera automatiquement appliqué à votre carte de crédit ou à votre méthode de paiement d&apos;origine, sous 14 jours ouvrables.
          </p>
          
          <h3 className="text-xl font-semibold mb-2 mt-6 text-white">Échanges</h3>
          <p className="mb-4">
            Nous ne proposons pas d&apos;échange direct. Si vous souhaitez un article différent, veuillez retourner l&apos;article que vous avez acheté et effectuer un nouvel achat séparé pour l&apos;article souhaité.
          </p>
          
          <h3 className="text-xl font-semibold mb-2 mt-6 text-white">Remboursements en retard ou manquants</h3>
          <p className="mb-4">
            Si vous n&apos;avez pas encore reçu votre remboursement, vérifiez d&apos;abord votre compte bancaire à nouveau. Contactez ensuite votre société de carte de crédit, car le remboursement peut prendre un certain temps avant d&apos;être officiellement affiché.
          </p>
          <p className="mb-4">
            Si vous avez effectué toutes ces étapes et que vous n&apos;avez toujours pas reçu votre remboursement, veuillez nous contacter à <a href="mailto:remboursements@monangabusiness.com" className="text-blue-400 hover:underline">remboursements@monangabusiness.com</a>.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Articles en soldes ou en promotion</h2>
          <p className="mb-4">
            Seuls les articles à prix régulier peuvent être remboursés, malheureusement les articles en solde ou en promotion ne peuvent pas être remboursés.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Retours internationaux</h2>
          <p className="mb-4">
            Pour les retours internationaux, veuillez noter que les frais d&apos;expédition ne sont pas remboursés. Les droits de douane et les taxes à l&apos;importation sont à votre charge et ne sont pas remboursés. Le montant du remboursement sera calculé sur la valeur marchande de l&apos;article et n&apos;inclura pas les frais d&apos;expédition.
          </p>
        </div>

        <div className="mb-8 bg-blue-900/30 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Besoin d&apos;aide ?</h2>
          <p className="mb-4">
            Pour toute question concernant les retours et les remboursements, n&apos;hésitez pas à nous contacter :
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email : <a href="mailto:retours@monangabusiness.com" className="text-blue-400 hover:underline">retours@monangabusiness.com</a></span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Téléphone : +243 817 828 734 (du lundi au vendredi, de 9h à 17h)</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Adresse : 123 Avenue de la Paix, Gombe, Kinshasa, RDC</span>
            </li>
          </ul>
          <p>
            Notre équipe est là pour vous aider et s&apos;efforcera de répondre à toutes vos demandes dans les plus brefs délais.
          </p>
        </div>

        <div className="text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6">
          <p>Dernière mise à jour : 17 septembre 2025</p>
          <p>© 2025 Monanga Business. Tous droits réservés</p>
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
    </div>
  );
}
