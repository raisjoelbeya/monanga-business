import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { Logo } from "@/components/Logo";

// Composant réutilisable pour les cartes de fonctionnalités
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="text-center p-6 bg-gray-700 rounded-lg hover:scale-105 transition-transform duration-300">
    <div className="w-16 h-16 mx-auto text-blue-400 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// Composant réutilisable pour les témoignages
const TestimonialCard = ({ name, location, children }: { name: string; location: string; children: React.ReactNode }) => (
  <div className="bg-gray-800 p-6 rounded-lg text-center">
    <div className="mb-4 h-10 w-10 mx-auto rounded-full bg-blue-200 text-blue-600 flex items-center justify-center">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
    <blockquote className="mb-4 text-gray-400 text-base italic">
      {children}
    </blockquote>
    <p className="text-gray-300 font-semibold">{name}</p>
    <p className="text-gray-500 text-sm">{location}</p>
  </div>
);

// Composant réutilisable pour les icônes de réseaux sociaux
const SocialIcon = ({ href, icon, label, colorClass }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  colorClass: string;
}) => (
  <a 
    href={href} 
    className={`text-white text-2xl hover:${colorClass} transition-all duration-300`}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

// Le composant NewsletterForm a été déplacé dans un fichier séparé
// pour gérer les interactions côté client

// Composant réutilisable pour le pied de page
const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-10">
    <div className="max-w-6xl mx-auto px-6 sm:px-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
	          <Logo size="sm" withText={true} />
          </div>
          <p className="text-gray-400 text-sm mb-4 max-w-xs">
            Votre partenaire e-commerce de confiance à Kinshasa, offrant une large gamme de produits de qualité.
          </p>
        </div>

        <div>
          <h3 className="text-blue-300 text-xl font-bold mb-4">Navigation</h3>
          <ul className="space-y-3">
            <li><Link href="/products" className="hover:text-white transition duration-300">Catalogue</Link></li>
            <li><Link href="/about" className="hover:text-white transition duration-300">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-white transition duration-300">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-white transition duration-300">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-blue-300 text-xl font-bold mb-4">Service Client</h3>
          <ul className="space-y-3">
            <li><Link href="/help" className="hover:text-white transition duration-300">Centre d&apos;aide</Link></li>
            <li><Link href="/returns" className="hover:text-white transition duration-300">Retours</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition duration-300">Livraison</Link></li>
            <li><Link href="/payments" className="hover:text-white transition duration-300">Paiements</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-blue-300 text-xl font-bold mb-4">Contact</h3>
          <p className="text-gray-400 mb-4">Kinshasa, République Démocratique du Congo</p>
          <p className="text-gray-400 mb-4">support@monangabusiness.com</p>
          <p className="text-gray-400">+243 817 828 734</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700 mt-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mt-2 sm:mt-0">
          {new Date().getFullYear()} Monanga Business. Tous droits réservés.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-4 sm:mt-0">
          <Link 
            href="/terms" 
            className="text-blue-400 hover:text-blue-300 transition duration-300 text-sm"
          >
            Conditions Générales
          </Link>
          <Link 
            href="/privacy" 
            className="text-blue-400 hover:text-blue-300 transition duration-300 text-sm"
          >
            Politique de Confidentialité
          </Link>
          <Link 
            href="/delete-data" 
            className="text-blue-400 hover:text-blue-300 transition duration-300 text-sm"
          >
            Suppression des Données
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home() {
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
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="mb-8">
              <Logo size="xl" withText={true} />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Votre Partenaire <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                E-commerce à Kinshasa
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Découvrez une sélection exclusive de produits premium livrés rapidement
            dans toute la ville de Kinshasa. Service client 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Découvrir les produits
            </Link>
            <Link 
              href="/auth"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-800 text-lg sm:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              S&apos;inscrire / Se connecter
            </Link>
          </div>
        </div>
      </header>

            {/* Features Section */}
            <section className="py-16 bg-gray-800">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">Pourquoi choisir Monanga Business ?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            title="Livraison Rapide"
                            description="Réception garantie entre 6h et 24h selon votre emplacement"
                            icon={
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Service Premium"
                            description="Assistance personnalisée 7 jours/7, 24h/24"
                            icon={
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            title="Produits Sélectionnés"
                            description="Équipe de professionnels garantissant la qualité"
                            icon={
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">Nos Clients Disent</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <TestimonialCard 
                            name="Jean Mbokani" 
                            location="Client à Kinshasa"
                        >
                            Je suis très satisfait des produits que j&apos;ai reçus. La qualité est exceptionnelle et les délais de livraison sont respectés. Un service irréprochable !
                        </TestimonialCard>
                        
                        <TestimonialCard 
                            name="Marie Kabasele" 
                            location="Client à Limete"
                        >
                            Livraison ultra-rapide et produits de qualité supérieure. Je recommande vivement Monanga Business pour son sérieux et son professionnalisme.
                        </TestimonialCard>
                        
                        <TestimonialCard 
                            name="Pascal Tshisekedi" 
                            location="Client à Gombe"
                        >
                            Service client réactif et à l&apos;écoute. Les produits correspondent parfaitement à la description. Je ne vais plus ailleurs pour mes achats en ligne !
                        </TestimonialCard>
                    </div>
                </div>
            </section>

            {/* Social Media Section */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-white">Suivez-nous</h2>
                    <div className="flex justify-center gap-6 mb-8">
                        <SocialIcon 
                            href="#" 
                            label="Facebook"
                            colorClass="text-blue-400"
                            icon={
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12v4c0 1.103.897 2 2 2h2.177C6.812 20.252 9.855 21 12 21c2.145 0 5.188-.748 7.823-2H22c1.103 0 2-.897 2-2v-4c0-5.523-4.477-10-10-10zM12 9c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5z" />
                                </svg>
                            }
                        />
                        <SocialIcon 
                            href="#" 
                            label="Instagram"
                            colorClass="text-pink-400"
                            icon={
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.475 5.327 2.775.715 1.53 1.093 3.538.923 5.547-.167 1.974-.703 4.006-1.548 5.673-1.153 2.163-3.128 3.756-5.425 4.332-1.068.346-2.24.518-3.434.518-.892 0-1.786-.095-2.662-.291-.906-.19-.191-.846-.273-1.643-.066-.665-.11-1.364-.127-2.078H12c.044 1.214.228 2.338.508 3.389C13.937 18.364 14.61 18.846 15.327 18.897c.532.039 1.337-.296 1.617-.593.24-.255.443-.735.483-1.26.068-1.365-.6-2.625-1.603-3.525C13.173 12.67 12.496 12 12 12c-1.3 0-2.4 1.1-2.4 2.4 0 .277.035.55.095.81C9.845 15.85 11.216 17 12.623 17 .57 15.982 1.208 14.077 1.339 13.366.522 10.78 0 8.81 0 6.647 0 3.156 2.595 0 6.8 0 9.771 0 12.735 3.476 12 7.673zm4.667-4h-4c-1.94 0-3.41.694-3.866 1.533-.096.206-.242.454-.393.758C7.659 4.812 6.699 5 5.658 5c-1.64 0-3.345-.602-4.717-1.548l-.007-.004.021.018h10.056l-.003.004c.386.312.703.796.703 1.394C11.22 5.815 11.497 6 12 6s1-.217 1.448-.646c.596-.503.971-1.086.971-1.76-.001-1.11-.902-2-2.033-2z" />
                                </svg>
                            }
                        />
                        <SocialIcon 
                            href="#" 
                            label="LinkedIn"
                            colorClass="text-green-400"
                            icon={
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.483 9.442a3.764 3.764 0 01-3.769 0h-4.718c.38-.75.595-1.6.595-2.543V4.429a1.375 1.375 0 011.371-1.375h4.716a3.758 3.758 0 013.768 3.768v4.716c0 .38-.071.76-.211 1.116zM6.14 22.2c.153.187.317.363.484.522C5.842 21.27 5.585 20.72 5.248 20.17c-.236-.356-.49-.703-.756-1.038A12.725 12.725 0 017.86 19.4c.697.184 1.4 1.078 1.4 2.14v.391c0 .297-.127.578-.356.766zm4.858-4.7a5.547 5.547 0 01-1.04-3.59c.5-1.75 2.608-2.75 4.313-1.74a5.417 5.417 0 011.649 5.08H16.44c-.207-1.72-.986-2.88-2.43-3.76a8.07 8.07 0 00-4.26 1.27c-.74.53-1.1 1.4-1.22 2.47a4.11 4.11 0 00-.14 1.276h3.179z" />
                                </svg>
                            }
                        />
                        <SocialIcon 
                            href="#" 
                            label="Twitter"
                            colorClass="text-orange-400"
                            icon={
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 22.09 4.31C22.16 5.12 22.07 5.95 21.82 6.73C21.69 6.53 21.54 6.34 21.35 6.18C21.52 6.01 21.67 5.83 21.8 5.64C21.33 5.07 20.63 4.67 19.85 4.53C20.58 4.15 21.2 3.55 21.62 2.82C20.76 3.16 19.87 3.38 18.98 3.46C19.45 2.74 19.67 1.89 19.61 1C17.82 1.8 16.36 2.9 15.21 4.19C14.48 3.93 13.69 3.84 12.9 3.92C13.46 4.48 13.86 5.16 14.07 5.91C12.27 5.53 10.5 5.5 8.8 5.84C7.97 6.13 7.28 6.62 6.77 7.22C6.19 5.93 6.49 4.39 7.69 3.44C5.97 3.27 4.2 3.88 2.87 5.02C3.67 6.76 5.42 7.9 7.32 7.9C7.96 7.9 8.57 7.78 9.14 7.57C7.43 9.09 6.79 11.34 7.59 13.16C8.77 14.96 11.02 15.86 12.9 15.23C11.76 16.45 10.18 17.17 8.43 17.13C8.92 18.63 10.29 19.75 12 19.75C16.77 19.75 20.75 15.79 20.75 10.96C20.75 10.57 20.73 10.16 20.7 9.77C22.3 9.6 23.84 8.98 25 8C25.07 7.34 24.33 6.87 23.59 6.93C22.8 6.61 22.11 6.34 21.45 6.16C21.84 6.38 22.17 6.71 22.42 7.12C22.05 6.71 21.62 6.4 21.15 6.21C21.54 6.17 21.94 6.15 22.35 6.14Z" />
                                </svg>
                            }
                        />
                    </div>
                    <p className="text-gray-400 text-sm mt-6">
                        Suivez notre actualité et restez à l&apos;affût des dernières promotions
                    </p>
                </div>
            </section>

            {/* Call-to-action Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Recevez nos meilleurs deals</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-8">
                        Inscrivez-vous à notre newsletter pour profiter d&apos;offres exclusives, de promotions
                        flash et de réductions personnalisées selon vos centres d&apos;intérêt.
                    </p>
                    <NewsletterForm />
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}