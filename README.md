# Monanga Business

[![CI/CD](https://github.com/votre-utilisateur/monanga-business/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/votre-utilisateur/monanga-business/actions/workflows/ci-cd.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fmonanga-business)

Plateforme e-commerce moderne pour Monanga Business, offrant une expérience d'achat fluide et sécurisée à Kinshasa.

🌐 **Site en production** : [https://monanga-business.vercel.app/](https://monanga-business.vercel.app/)

## 🚀 Fonctionnalités

- 🔐 Authentification sécurisée avec email/mot de passe
- 🛒 Gestion des produits et catégories
- 🚚 Suivi des commandes en temps réel
- 💳 Paiement en ligne sécurisé
- 📱 Design responsive pour tous les appareils

## 🛠️ Configuration requise

- Node.js 20+
- PostgreSQL 15+
- pnpm 8+

## 🚀 Installation locale

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/monanga-business.git
   cd monanga-business
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configurer l'environnement**
   Créez un fichier `.env.local` à la racine du projet :
   ```env
   # Base de données locale
   DATABASE_URL="postgresql://monanga:monangapass@localhost:5432/monanga_db"
   
   # Clé secrète (générez-en une avec : openssl rand -base64 32)
   AUTH_SECRET="votre_clé_secrète"
   
   # URL de l'application
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_URL_INTERNAL="http://localhost:3000"
   ```

4. **Démarrer la base de données**
   ```bash
   docker-compose up -d
   ```

5. **Appliquer les migrations**
   ```bash
   psql postgresql://monanga:monangapass@localhost:5432/monanga_db -f migrations/001_initial_schema.sql
   ```

6. **Démarrer l'application**
   ```bash
   pnpm dev
   ```
   L'application sera disponible sur http://localhost:3000

## 🧪 Exécuter les tests

```bash
pnpm test
```

## 🚀 Déploiement

Le projet est configuré pour un déploiement automatique sur Vercel. À chaque push sur la branche `main`, le workflow CI/CD se déclenche pour :

1. Exécuter les tests
2. Builder l'application
3. Déployer sur Vercel

### Variables d'environnement requises pour la production

- `DATABASE_URL` - URL de connexion à la base de données PostgreSQL
- `AUTH_SECRET` - Clé secrète pour l'authentification
- `NEXTAUTH_URL` - URL de production de l'application

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## ✨ Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Contact

Pour toute question, contactez-nous à contact@monangabusiness.com

---

Développé avec ❤️ par l'équipe Monanga Business
