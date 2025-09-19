import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suppression des Données - Monanga Business',
  description: 'Comment demander la suppression de vos données personnelles conformément au RGPD',
};

export default function DeleteDataPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">Suppression de vos Données Personnelles</h1>
            <p className="text-xl text-gray-300">Dernière mise à jour : 17 septembre 2025</p>
            <div className="w-24 h-1 bg-blue-400 mx-auto mt-4"></div>
          </div>

      <div className="text-gray-300 max-w-3xl mx-auto">
        <div className="mb-8 bg-gray-700 p-6 rounded-lg">
          <p className="mb-4 text-lg">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez le droit de demander la suppression de vos données personnelles. Cette page vous explique comment exercer ce droit.
          </p>
        </div>

        <div className="mb-8 bg-gray-700 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Comment demander la suppression de vos données ?</h2>
          <p className="mb-6 text-lg">
            Pour demander la suppression de vos données personnelles, veuillez nous envoyer un email à l&apos;adresse suivante :
          </p>
          <div className="bg-gray-800 p-6 rounded-lg mb-6 border-l-4 border-blue-400">
            <a 
              href="mailto:joelbeya.bj@outlook.com" 
              className="text-blue-400 hover:text-blue-300 font-medium text-xl transition-colors duration-300"
            >
              joelbeya.bj@outlook.com
            </a>
          </div>
          <p className="mb-4 text-lg">
            Veuillez inclure dans votre email les informations suivantes :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-3 text-lg">
            <li className="text-gray-300">Votre nom complet</li>
            <li className="text-gray-300">L&apos;adresse email associée à votre compte</li>
            <li className="text-gray-300">La mention <span className="font-mono bg-gray-800 px-2 py-1 rounded">Demande de suppression de données personnelles</span> dans l&apos;objet du message</li>
          </ul>
        </div>

        <div className="mb-8 bg-gray-700 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Délai de traitement</h2>
          <p className="mb-4 text-lg">
            Nous nous engageons à traiter votre demande dans un délai maximum de 30 jours à compter de sa réception. Vous recevrez une confirmation par email une fois la suppression effectuée.
          </p>
        </div>

        <div className="mb-8 bg-gray-700 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Données conservées</h2>
          <p className="mb-4 text-lg">
            Certaines données pourront être conservées conformément à nos obligations légales, notamment pour :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-3 text-lg">
            <li className="text-gray-300">Les factures (conservation de 10 ans)</li>
            <li className="text-gray-300">Les données nécessaires à la constatation, l&apos;exercice ou la défense de droits en justice</li>
            <li className="text-gray-300">Les données nécessaires au respect d&apos;obligations légales ou réglementaires</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg border border-gray-600">
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">Besoin d&#39;aide ?</h3>
          <p className="text-lg">
            Pour toute question concernant la protection de vos données, n&#39;hésitez pas à nous contacter à l&#39;adresse{' '}
            <a 
              href="mailto:joelbeya.bj@outlook.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            >
              joelbeya.bj@outlook.com
            </a>
          </p>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
}
