# reset.ps1
# Script PowerShell pour nettoyer et relancer le projet

Write-Host "🚀 Arrêt de Node.js et Docker..."

# 1. Tuer tous les processus node
taskkill /F /IM node.exe /T 2>$null

# 2. Stopper et supprimer les conteneurs Docker
docker-compose down

# 3. Nettoyage des répertoires et fichiers
Write-Host "🧹 Nettoyage du projet..."
rimraf .\node_modules\
rimraf .\.next\
rimraf .\dist\
rimraf .\pnpm-lock.yaml
rimraf .\prisma\migrations\  # (optionnel si tu veux reset les migrations)

# 4. Réinstallation des dépendances
Write-Host "📦 Réinstallation des dépendances..."
pnpm install

# 5. Redémarrage de la base de données avec Docker
Write-Host "🐳 Relance de Docker..."
docker-compose up -d

# 6. Synchroniser Prisma avec la DB
Write-Host "🗄️ Migration Prisma..."
npx prisma migrate dev --name init

# 7. Regénérer le client Prisma
npx prisma generate

# 8. Build du projet
Write-Host "🏗️ Build du projet..."
pnpm build

# 9. Démarrage en mode dev (si tu veux directement lancer le serveur)
Write-Host "▶️ Lancement du serveur..."
pnpm dev