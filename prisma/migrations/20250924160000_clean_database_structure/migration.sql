-- Migration pour nettoyer et réorganiser la base de données

-- Désactiver temporairement les triggers pour éviter les conflits
SET session_replication_role = 'replica';

-- 1. Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT,
  "username" TEXT,
  "firstName" TEXT,
  "lastName" TEXT,
  "fullName" TEXT DEFAULT '',
  "image" TEXT,
  "password" TEXT,
  "emailVerified" BOOLEAN DEFAULT false,
  "resetToken" TEXT,
  "resetTokenExpiry" TIMESTAMP,
  "role" TEXT DEFAULT 'USER',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_email_key" UNIQUE ("email"),
  CONSTRAINT "users_username_key" UNIQUE ("username")
);

-- 2. Migrer les données de auth_user vers users si nécessaire
DO $$
BEGIN
  -- Vérifier si auth_user existe et contient des données
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auth_user') THEN
    -- Copier les données de auth_user vers users
    INSERT INTO "users" (
      "id", "username", "email", "password", "created_at", "updated_at", 
      "emailVerified", "role"
    )
    SELECT 
      id, 
      username, 
      email, 
      password, 
      created_at, 
      updated_at,
      COALESCE("emailVerified", false) as "emailVerified",
      COALESCE(role, 'USER') as "role"
    FROM "auth_user"
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Données migrées de auth_user vers users avec succès';
  END IF;
END $$;

-- 3. Créer la table des sessions si elle n'existe pas
CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "user_agent" TEXT,
  "ip_address" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- 4. Créer les index nécessaires
CREATE INDEX IF NOT EXISTS "idx_session_expires_at" ON "sessions"("expires_at");
CREATE INDEX IF NOT EXISTS "idx_session_user_id" ON "sessions"("user_id");

-- 5. Créer ou mettre à jour la fonction update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer ou mettre à jour le déclencheur pour updated_at
DO $$
BEGIN
  -- Supprimer le déclencheur existant s'il existe
  DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
  
  -- Créer le nouveau déclencheur
  EXECUTE 'CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON "users"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();';
END $$;

-- 7. Supprimer les anciennes tables si elles existent
-- D'abord supprimer les contraintes de clé étrangère
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_session') THEN
    ALTER TABLE IF EXISTS "user_session" DROP CONSTRAINT IF EXISTS "user_session_user_id_fkey";
    DROP TABLE IF EXISTS "user_session";
    RAISE NOTICE 'Ancienne table user_session supprimée';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Session') THEN
    ALTER TABLE IF EXISTS "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
    DROP TABLE IF EXISTS "Session";
    RAISE NOTICE 'Ancienne table Session supprimée';
  END IF;
  
  -- Vérifier si auth_user peut être supprimée (après migration des données)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auth_user') THEN
    -- Vérifier si toutes les données ont été migrées
    IF (SELECT COUNT(*) FROM "auth_user" WHERE id NOT IN (SELECT id FROM "users")) = 0 THEN
      DROP TABLE "auth_user";
      RAISE NOTICE 'Ancienne table auth_user supprimée après migration des données';
    ELSE
      RAISE NOTICE 'La table auth_user n''a pas pu être supprimée car certaines données n''ont pas été migrées';
    END IF;
  END IF;
END $$;

-- Réactiver les triggers
SET session_replication_role = 'origin';
