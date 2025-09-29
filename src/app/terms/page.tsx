'use client';

import {useRouter} from 'next/navigation';

export default function TermsPage() {
	const router = useRouter();
	return (<div className="bg-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
		<div className="text-center mb-12">
			<h1 className="text-4xl font-bold mb-4">Conditions Générales d&apos;Utilisation</h1>
			<p className="text-xl text-gray-300">En vigueur au 17/09/2025</p>
			<div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
		</div>
		
		<div className="prose prose-invert max-w-none">
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Préambule</h2>
				<p className="mb-4">
					Les présentes conditions générales d&apos;utilisation (ci-après dénommées « CGU ») ont pour objet
					l&apos;encadrement juridique des modalités de mise à disposition des services du site Monanga Business et
					leur utilisation par « l&apos;Utilisateur ».
				</p>
				<p>
					Les présentes CGU sont accessibles sur le site à la rubrique « Conditions générales ». Toute inscription ou
					utilisation du site implique l&apos;acceptation sans aucune réserve ni restriction des présentes CGU par
					l&apos;utilisateur. Lors de l&apos;inscription sur le site via le Formulaire d&apos;inscription, chaque
					utilisateur accepte expressément les présentes CGU en cochant la case précédant le texte suivant : « Je
					reconnais avoir lu et compris les CGU et je les accepte ».
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Description des services fournis</h2>
				<p>
					Le site Monanga Business a pour objet de fournir une plateforme de vente en ligne de produits divers.
					Monanga Business s&apos;efforce de fournir sur le site des informations aussi précises que possible.
					Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise
					à jour, qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces
					informations.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Propriété intellectuelle</h2>
				<p className="mb-4">
					La structure du site, ainsi que les textes, graphiques, images, photographies, sons, vidéos et applications
					informatiques qui le composent, sont la propriété de l&apos;éditeur et sont protégés comme tels par les lois
					en vigueur sur la propriété intellectuelle.
				</p>
				<p>
					Toute représentation, reproduction, adaptation ou exploitation partielle ou totale des contenus, marques et
					services proposés par le site, par quelque procédé que ce soit, sans l&apos;autorisation préalable, expresse
					et écrite de Monanga Business, est strictement interdite et serait susceptible de constituer une contrefaçon
					au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Données personnelles</h2>
				<p className="mb-4">
					Les informations et données vous concernant font l&apos;objet d&apos;un traitement informatique et sont
					exclusivement destinées à la société Monanga Business. En application des articles 39 et suivants de la loi
					n°78-17 du 6 janvier 1978 modifiée en 2004 relative à l&apos;informatique, aux fichiers et aux libertés,
					vous disposez des droits d&apos;opposition, d&apos;accès, de rectification et de suppression des données
					vous concernant.
				</p>
				<p>
					Pour exercer ce droit, adressez-vous à : contact@monangabusiness.com ou par courrier à l&apos;adresse
					suivante : 123 Avenue de la Paix, Gombe, Kinshasa, RDC.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Commandes et paiement</h2>
				<p className="mb-4">
					Les produits proposés sont valables dans la limite des stocks disponibles. Les prix sont indiqués en dollars
					américains (USD) toutes taxes comprises (TVA et autres taxes applicables), hors frais de livraison.
				</p>
				<p className="mb-4">
					Le règlement des achats s&apos;effectue par les moyens de paiement suivants :
				</p>
				<ul className="list-disc pl-6 mb-4 space-y-2">
					<li>Carte bancaire (Visa, Mastercard, etc.)</li>
					<li>Mobile Money (Orange Money, M-Pesa, Airtel Money)</li>
					<li>Virement bancaire</li>
					<li>Paiement à la livraison (uniquement pour Kinshasa)</li>
				</ul>
				<p>
					Toute commande passée sur le site suppose l&apos;adhésion aux présentes Conditions Générales. Toute
					confirmation de commande entraîne votre adhésion pleine et entière aux présentes conditions générales de
					vente, sans exception ni réserve.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Livraison</h2>
				<p className="mb-4">
					Les délais de livraison indiqués lors de la passation de la commande sont donnés à titre indicatif. Ils ne
					constituent pas un engagement ferme et définitif. En cas de retard de livraison, Monanga Business ne pourra
					être tenu pour responsable des conséquences dues à ce retard.
				</p>
				<p>
					Les livraisons sont effectuées par nos soins ou par un transporteur partenaire à l&apos;adresse de livraison
					que vous avez indiquée lors de la commande. Il appartient à l&apos;acheteur de vérifier l&apos;état des
					produits à la livraison et de formuler toutes réserves nécessaires sur le bon de livraison en cas de
					dommage.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Droit de rétractation</h2>
				<p className="mb-4">
					Conformément à la législation en vigueur, vous disposez d&apos;un délai de 7 jours à compter de la réception
					de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de
					pénalités.
				</p>
				<p>
					Pour exercer ce droit, vous devez nous renvoyer le produit dans son emballage d&apos;origine, accompagné de
					tous ses accessoires, en parfait état de revente, à l&apos;adresse suivante : Service Retours, Monanga
					Business, 123 Avenue de la Paix, Gombe, Kinshasa, RDC.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Garanties</h2>
				<p className="mb-4">
					Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, dans
					les conditions prévues par la loi.
				</p>
				<p>
					La garantie ne couvre pas les défauts et dommages résultant d&apos;une mauvaise utilisation, d&apos;une
					négligence, d&apos;un choc, d&apos;un accident ou d&apos;une modification effectuée par une personne non
					autorisée par Monanga Business.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Responsabilité</h2>
				<p className="mb-4">
					Les produits proposés sont conformes à la législation en vigueur en République Démocratique du Congo. Il
					appartient à l&apos;acheteur de vérifier auprès des autorités locales les possibilités d&apos;importation ou
					d&apos;utilisation des produits qu&apos;il envisage de commander.
				</p>
				<p>
					Monanga Business ne pourra être tenu pour responsable des dommages résultant d&apos;une mauvaise utilisation
					du produit acheté. De même, la responsabilité de Monanga Business ne pourra être engagée en cas de
					non-respect de la législation du pays dans lequel le produit est livré, qu&apos;il appartient à
					l&apos;acheteur de vérifier.
				</p>
			</div>
			
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Droit applicable et juridiction compétente</h2>
				<p className="mb-4">
					Les présentes conditions générales de vente sont soumises au droit congolais. En cas de litige, les
					tribunaux de la République Démocratique du Congo seront seuls compétents.
				</p>
				<p>
					Pour toute question ou réclamation, vous pouvez nous contacter par email à l&apos;adresse
					contact@monangabusiness.com ou par téléphone au +243 817 828 734.
				</p>
			</div>
			
			<div className="text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6">
				<p>Dernière mise à jour : 17 septembre 2025</p>
				<p>© 2025 Monanga Business. Tous droits réservés.</p>
			</div>
			
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
	</div>);
}
