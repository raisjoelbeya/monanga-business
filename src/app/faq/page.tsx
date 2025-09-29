'use client'

import {useRouter} from "next/navigation";

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Nous effectuons les livraisons dans un délai de 24 à 48 heures à Kinshasa. Pour les commandes passées le week-end, la livraison aura lieu le lundi ou le mardi suivant."
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les paiements par Mobile Money (Orange Money, M-Pesa, Airtel Money), virement bancaire, et paiement à la livraison (uniquement à Kinshasa)."
  },
  {
    question: "Puis-je annuler ou modifier ma commande ?",
    answer: "Vous pouvez annuler ou modifier votre commande dans les 2 heures suivant sa validation. Pour ce faire, veuillez nous contacter au +243 817 828 734 ou par email à support@monangabusiness.com."
  },
  {
    question: "Quelle est votre politique de retour et de remboursement ?",
    answer: "Nous acceptons les retours sous 7 jours après réception de la commande. Les articles doivent être dans leur emballage d'origine, non utilisés et en parfait état. Les frais de retour sont à la charge du client, sauf en cas d'erreur de notre part."
  },
  {
    question: "Livrez-vous en dehors de Kinshasa ?",
    answer: "Actuellement, nos livraisons sont limitées à la ville de Kinshasa. Nous envisageons d'étendre notre service à d'autres villes de la RDC dans un avenir proche."
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Dès que votre commande est expédiée, vous recevrez un email avec un numéro de suivi et un lien pour suivre votre colis en temps réel. Vous pouvez également suivre votre commande depuis votre espace client sur notre site."
  },
  {
    question: "Proposez-vous des réductions pour les commandes en gros ?",
    answer: "Oui, nous proposons des tarifs préférentiels pour les commandes en gros. Veuillez nous contacter à l'adresse pro@monangabusiness.com pour plus d'informations sur nos offres professionnelles."
  },
  {
    question: "Comment contacter le service client ?",
    answer: "Notre service client est disponible du lundi au vendredi de 8h à 18h et le samedi de 9h à 13h. Vous pouvez nous joindre par téléphone au +243 817 828 734, par email à support@monangabusiness.com ou via le formulaire de contact sur notre site."
  }
];

export default function FAQPage() {
	const router = useRouter();
	
	return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Foire aux questions</h1>
        <p className="text-xl text-gray-300">Trouvez des réponses à vos questions</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                <h2 className="text-lg font-medium text-white">{faq.question}</h2>
                <svg 
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 bg-gray-800 text-gray-300">
                <p>{faq.answer}</p>
              </div>
            </details>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-900/30 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Vous ne trouvez pas de réponse à votre question ?</h2>
        <p className="mb-6 text-gray-300">Notre équipe est là pour vous aider. N&apos;hésitez pas à nous contacter pour toute demande d&apos;information complémentaire.</p>
        <a 
          href="/contact" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Nous contacter
        </a>
	      {/* Bouton de retour à l'accueil */}
	      <div className="mt-8 text-center">
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
