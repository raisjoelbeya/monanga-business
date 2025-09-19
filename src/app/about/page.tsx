import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - Monanga Business",
  description: "Découvrez l'histoire et la mission de Monanga Business, votre partenaire e-commerce de confiance à Kinshasa.",
};

export default function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">À propos de Monanga Business</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>
      
      <div className="space-y-8 text-lg text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Notre Histoire</h2>
          <p className="mb-4">
            Fondée en 2023 à Kinshasa, Monanga Business est née d&apos;une passion pour l&apos;innovation et le service client d&apos;exception. Notre objectif est de révolutionner l&apos;expérience d&apos;achat en ligne en République Démocratique du Congo.
          </p>
          <p>
            Depuis nos débuts, nous nous sommes engagés à fournir des produits de qualité, un service client réactif et une expérience d&apos;achat fluide à tous nos clients de Kinshasa.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Notre Mission</h2>
          <p className="mb-4">
            Notre mission est de simplifier la vie des habitants de Kinshasa en leur offrant un accès facile à des produits de qualité, livrés rapidement à leur porte. Nous croyons en la qualité, la fiabilité et la transparence dans toutes nos interactions.
          </p>
          <p>
            Nous nous engageons à soutenir l&apos;économie locale en collaborant avec des fournisseurs locaux chaque fois que possible, tout en maintenant des normes de qualité élevées pour tous nos produits.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Notre Équipe</h2>
          <p className="mb-4">
            Notre équipe est composée de professionnels passionnés et dévoués, déterminés à offrir le meilleur service possible. Chaque membre de notre équipe partage notre engagement envers l&apos;excellence du service client et la satisfaction de nos clients.
          </p>
          <p>
            Nous sommes fiers de notre culture d&apos;entreprise qui met l&apos;accent sur l&apos;innovation, l&apos;intégrité et le service communautaire.
          </p>
        </section>
        
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Nos Valeurs</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <h3 className="font-semibold">Qualité</h3>
                <p>Nous sélectionnons rigoureusement chaque produit pour garantir votre satisfaction.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <h3 className="font-semibold">Fiabilité</h3>
                <p>Nous tenons nos promesses et livrons dans les délais impartis.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <h3 className="font-semibold">Service Client</h3>
                <p>Notre équipe est disponible 24/7 pour répondre à vos questions et résoudre vos problèmes.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <h3 className="font-semibold">Innovation</h3>
                <p>Nous adoptons constamment de nouvelles technologies pour améliorer votre expérience d&apos;achat.</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
