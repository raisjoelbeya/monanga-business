import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monanga Business - Votre partenaire e-commerce à Kinshasa",
  description: "Découvrez une sélection exclusive de produits premium livrés rapidement dans toute la ville de Kinshasa.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen flex flex-col`}>
        <header className="bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Logo size="md" withText />
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/products" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Produits
                </Link>
                <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  À propos
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <Link 
                  href="/auth" 
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-gray-300 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
	                <Logo size="sm" withText={true} />
                </div>
                <p className="text-sm">
                  Votre partenaire e-commerce de confiance à Kinshasa, offrant une large gamme de produits de qualité.
                </p>
              </div>
              
              <div>
                <h3 className="text-blue-300 text-lg font-bold mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link href="/products" className="hover:text-white transition">Produits</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">À propos</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-blue-300 text-lg font-bold mb-4">Service Client</h3>
                <ul className="space-y-2">
                  <li><Link href="/help" className="hover:text-white transition">Centre d&apos;aide</Link></li>
                  <li><Link href="/returns" className="hover:text-white transition">Retours</Link></li>
                  <li><Link href="/shipping" className="hover:text-white transition">Livraison</Link></li>
                  <li><Link href="/payments" className="hover:text-white transition">Paiements</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-blue-300 text-lg font-bold mb-4">Contact</h3>
                <p className="mb-2">Kinshasa, RDC</p>
                <p className="mb-2">contact@monangabusiness.com</p>
                <p>+243 817 828 734</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Monanga Business. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition">
                  Conditions d&apos;utilisation
                </Link>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition">
                  Politique de confidentialité
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
