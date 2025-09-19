import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Monanga Business',
  description: 'Découvrez comment nous protégeons et utilisons vos données personnelles conformément au RGPD et aux lois en vigueur.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
        <p className="text-xl text-gray-300">Dernière mise à jour : 17 septembre 2025</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="mb-8">
          <p className="mb-4">
            Chez Monanga Business, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité vous explique quelles données nous collectons, comment nous les utilisons et comment nous les protégeons.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données est la société Monanga Business, immatriculée au registre du commerce de Kinshasa sous le numéro [NUMERO_RCCM], dont le siège social est situé au 123 Avenue de la Paix, Gombe, Kinshasa, RDC.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Données collectées</h2>
          <p className="mb-4">
            Nous pouvons collecter et traiter les catégories de données personnelles suivantes :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Informations d&apos;identification : nom, prénom, adresse email, numéro de téléphone</li>
            <li>Informations de facturation et de livraison : adresse postale, code postal, ville, pays</li>
            <li>Données de paiement : informations de carte bancaire (gérées par nos prestataires de paiement sécurisés)</li>
            <li>Données de navigation : adresse IP, type de navigateur, pages consultées, durée de visite</li>
            <li>Données de localisation : pays, ville (déduits de votre adresse IP)</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Finalités du traitement</h2>
          <p className="mb-4">
            Nous utilisons vos données personnelles aux fins suivantes :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Exécution des commandes et fourniture des services demandés</li>
            <li>Gestion de la relation client (service après-vente, réponses aux demandes)</li>
            <li>Envoi d&apos;informations sur nos produits et offres promotionnelles (avec votre consentement)</li>
            <li>Amélioration de notre site web et de nos services</li>
            <li>Prévention de la fraude et sécurisation des transactions</li>
            <li>Respect de nos obligations légales et réglementaires</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Base légale du traitement</h2>
          <p className="mb-4">
            Le traitement de vos données est fondé sur :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>L&apos;exécution d&apos;un contrat pour la fourniture de nos services</li>
            <li>Votre consentement pour les envois marketing</li>
            <li>Notre intérêt légitime pour améliorer nos services et prévenir les fraudes</li>
            <li>Le respect de nos obligations légales</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Durée de conservation</h2>
          <p className="mb-4">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Données des clients actifs : durée de la relation commerciale + 3 ans</li>
            <li>Données des prospects : 3 ans à compter du dernier contact</li>
            <li>Données de facturation : 10 ans (obligation légale)</li>
            <li>Données de navigation : 13 mois maximum</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Destinataires des données</h2>
          <p className="mb-4">
            Vos données personnelles peuvent être communiquées à :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Nos équipes internes (service commercial, service client, service technique)</li>
            <li>Nos prestataires de services (hébergeur, prestataire de paiement, transporteur)</li>
            <li>Les autorités compétentes en cas d&apos;obligation légale</li>
          </ul>
          <p>
            Nous nous assurons que tous nos partenaires respectent des exigences strictes en matière de protection des données.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Transferts de données hors UE</h2>
          <p>
            Certains de nos prestataires sont situés en dehors de l&apos;Union Européenne. Dans ce cas, nous mettons en place les garanties appropriées pour assurer un niveau de protection adéquat de vos données, notamment par l&apos;adoption de clauses contractuelles types de la Commission européenne.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Cookies et technologies similaires</h2>
          <p className="mb-4">
            Notre site utilise des cookies et technologies similaires pour :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Assurer le bon fonctionnement du site (cookies techniques)</li>
            <li>Mémoriser vos préférences (langue, panier d&apos;achat)</li>
            <li>Analyser l&apos;audience et améliorer nos services (cookies analytiques)</li>
            <li>Vous proposer des publicités ciblées (cookies publicitaires, avec votre consentement)</li>
          </ul>
          <p>
            Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur ou via notre bannière de consentement.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Sécurité des données</h2>
          <p className="mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction. Parmi ces mesures :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Chiffrement des données sensibles (mots de passe, informations de paiement)</li>
            <li>Systèmes de détection et prévention des intrusions</li>
            <li>Sauvegardes régulières</li>
            <li>Contrôle d&apos;accès strict aux données</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Vos droits</h2>
          <p className="mb-4">
            Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Droit d&apos;accès à vos données personnelles</li>
            <li>Droit de rectification des données inexactes</li>
            <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Définir des directives relatives au sort de vos données après votre décès</li>
          </ul>
          <p className="mb-4">
            Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse : dpo@monangabusiness.com ou par courrier à l&apos;adresse du siège social en joignant une copie de votre pièce d&apos;identité.
          </p>
          <p>
            Vous avez également le droit d&apos;introduire une réclamation auprès de l&apos;autorité de contrôle compétente si vous estimez que le traitement de vos données n&apos;est pas conforme à la réglementation.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">11. Mises à jour de la politique de confidentialité</h2>
          <p>
            Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute mise à jour sera publiée sur cette page avec une mention de la date de dernière mise à jour. Nous vous encourageons à consulter régulièrement cette page pour rester informé des éventuelles modifications.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">12. Nous contacter</h2>
          <p className="mb-2">Pour toute question concernant la présente politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Par email : dpo@monangabusiness.com</li>
            <li>Par téléphone : +243 817 828 734</li>
            <li>Par courrier : DPO Monanga Business, 123 Avenue de la Paix, Gombe, Kinshasa, RDC</li>
          </ul>
        </div>

        <div className="text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6">
          <p>Dernière mise à jour : 17 septembre 2025</p>
          <p>© 2025 Monanga Business. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
