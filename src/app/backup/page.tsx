import { Button } from '@/components/ui/button';
import { ShoppingBasket, Leaf, Shield, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';

const features = [
  {
    icon: <Leaf className="h-8 w-8 text-green-600" />,
    title: 'Produits Naturels',
    description: 'Des produits 100% naturels et authentiques',
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: 'Qualité Garantie',
    description: 'Sélection rigoureuse des meilleurs produits',
  },
  {
    icon: <Truck className="h-8 w-8 text-green-600" />,
    title: 'Livraison Rapide',
    description: 'Expédition sous 24-48h',
  },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Huile de Baobab',
    price: '12,99 €',
    category: 'Cosmétiques',
    image: '/placeholder-product.svg',
    description: 'Huile 100% pure et naturelle extraite des graines de baobab',
  },
  {
    id: 2,
    name: 'Poudre de Moringa',
    price: '9,99 €',
    category: 'Épicerie',
    image: '/placeholder-product.svg',
    description: 'Poudre riche en nutriments et antioxydants',
  },
  {
    id: 3,
    name: 'Beurre de Karité',
    price: '14,99 €',
    category: 'Cosmétiques',
    image: '/placeholder-product.svg',
    description: 'Beurre pur non raffiné pour le soin de la peau et des cheveux',
  },
  {
    id: 4,
    name: 'Café d\'Éthiopie',
    price: '8,99 €',
    category: 'Boissons',
    image: '/placeholder-product.svg',
    description: 'Café arabica bio d\'Éthiopie, notes fruitées et florales',
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Découvrez les saveurs authentiques d&apos;Afrique
            </h1>
            <p className="text-xl mb-8">
              Des produits naturels et de qualité, directement importés pour vous
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/products">
                  Voir nos produits <ShoppingBasket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nos Produits Phares</h2>
          <Button variant="outline" asChild>
            <Link href="/products">Voir tout</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              showDescription={false}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/products" className="group">
              Voir tous nos produits
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir nos produits ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous dès maintenant pour bénéficier de 10% de réduction sur votre première commande
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Créer un compte</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
