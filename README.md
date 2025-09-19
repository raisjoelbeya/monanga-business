# Monanga Business

[![CI/CD](https://github.com/votre-utilisateur/monanga-business/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/votre-utilisateur/monanga-business/actions/workflows/ci-cd.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fmonanga-business)

Plateforme e-commerce moderne pour Monanga Business, offrant une expérience d'achat fluide et sécurisée à Kinshasa.

🌐 **Site en production** : [https://monanga-business.vercel.app/](https://monanga-business.vercel.app/)

## 🚀 Fonctionnalités

- 🔐 Authentification sécurisée avec email/mot de passe et OAuth (Google, Facebook)
- 🛡️ Protection contre les attaques par force brute avec limitation de taux (rate limiting)
- 📊 Journalisation détaillée des événements de sécurité et des erreurs
- 🛒 Gestion des produits et catégories
- 🚚 Suivi des commandes en temps réel
- 💳 Paiement en ligne sécurisé
- 📱 Design responsive pour tous les appareils

## 🛠️ Configuration requise

- Node.js 20+
- PostgreSQL 15+
- pnpm 8+

## 🔒 Sécurité

### Limitation de taux (Rate Limiting)

L'application implémente une limitation de taux pour protéger les points d'entrée sensibles :

- **Authentification** : 10 requêtes par minute par adresse IP/email
- **API Publique** : 100 requêtes par minute par adresse IP
- **Actions sensibles** : 3 tentatives par heure (ex: réinitialisation de mot de passe)

### Journalisation

Toutes les activités importantes sont enregistrées dans les journaux :

- Tentatives de connexion (réussies et échouées)
- Erreurs d'authentification
- Activités suspectes
- Opérations sensibles (changement de mot de passe, mise à jour du profil)

Les journaux incluent des métadonnées détaillées pour le débogage et l'audit.

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
   Copiez le fichier `.env.example` vers `.env.local` et remplissez les valeurs requises :
   
   ```bash
   cp .env.example .env.local
   ```
   
   Remplissez les variables d'environnement dans `.env.local` :
   
   ```env
   # URL de l'application (sans barre oblique à la fin)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="votre-clé-secrète-très-longue" # Générez avec: openssl rand -base64 32
   
   # Configuration des logs
   LOG_LEVEL="info" # Niveaux disponibles: error, warn, info, debug
   ENABLE_REQUEST_LOGGING="true" # Activer la journalisation des requêtes
   
   # Configuration de la limitation de taux (en millisecondes)
   RATE_LIMIT_WINDOW_MS="60000" # 1 minute
   AUTH_RATE_LIMIT="10" # 10 requêtes par fenêtre
   API_RATE_LIMIT="100" # 100 requêtes par fenêtre
   SENSITIVE_RATE_LIMIT="3" # 3 tentatives par fenêtre
   
   # Configuration de la base de données
   DATABASE_URL="postgresql://user:password@localhost:5432/xxx?schema=public"
   
   # Configuration Google OAuth (obtenez ces valeurs depuis Google Cloud Console)
   GOOGLE_CLIENT_ID="votre-google-client-id"
   GOOGLE_CLIENT_SECRET="votre-google-client-secret"
   
   # Configuration Facebook OAuth (obtenez ces valeurs depuis Facebook Developer)
   FACEBOOK_CLIENT_ID="votre-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="votre-facebook-app-secret"
   
   # Configuration de l'email (pour les notifications et réinitialisation de mot de passe)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="votre-email@example.com"
   EMAIL_SERVER_PASSWORD="votre-mot-de-passe-email"
   EMAIL_FROM="Monanga Business <no-reply@example.com>"
   ```

4. **Configurer les fournisseurs OAuth**

   **Google OAuth**
   1. Allez sur la [Google Cloud Console](https://console.cloud.google.com/)
   2. Créez un nouveau projet ou sélectionnez-en un existant
   3. Allez dans "APIs & Services" > "Credentials"
   4. Créez un nouvel "OAuth 2.0 Client ID"
   5. Ajoutez l'URI de redirection : `http://localhost:3000/api/auth/callback/google`
   6. Copiez le Client ID et le Client Secret dans votre `.env.local`

   **Facebook OAuth**
   1. Allez sur le [Facebook for Developers](https://developers.facebook.com/)
   2. Créez une nouvelle application
   3. Allez dans "Settings" > "Basic"
   4. Ajoutez l'URL du site : `http://localhost:3000`
   5. Allez dans "Facebook Login" > "Settings"
   6. Ajoutez l'URI de redirection : `http://localhost:3000/api/auth/callback/facebook`
   7. Copiez l'App ID et l'App Secret dans votre `.env.local`

5. **Configurer la base de données**
   Assurez-vous que PostgreSQL est installé et en cours d'exécution, puis exécutez :
   
   ```bash
   # Appliquer les migrations
   pnpm prisma migrate dev --name init
   
   # Générer le client Prisma
   pnpm prisma generate
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
# Exécuter tous les tests
pnpm test

# Exécuter les tests de sécurité
pnpm test:security

# Exécuter les tests de charge (avec k6)
pnpm test:load
```

## 🛡️ Tests de sécurité

L'application inclut des tests de sécurité pour vérifier :

- Protection CSRF
- En-têtes de sécurité HTTP
- Validation des entrées
- Protection contre l'injection SQL
- Configuration CORS sécurisée

Exécutez les tests de sécurité avec :

```bash
pnpm test:security
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
