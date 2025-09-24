-- Migration pour migrer de auth_user vers users

-- Désactiver temporairement les triggers pour éviter les conflits
SET session_replication_role = 'replica';

-- 1. Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    password TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationExpires" TIMESTAMP,
    image TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP,
    role TEXT DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Copier les données de auth_user vers users si elles n'existent pas déjà
INSERT INTO users (
    id, username, email, name, password, "emailVerified", 
    "emailVerificationToken", "emailVerificationExpires",
    image, "resetToken", "resetTokenExpiry", role, created_at, updated_at
)
SELECT 
    id, username, email, name, password, "emailVerified", 
    "emailVerificationToken", "emailVerificationExpires",
    image, "resetToken", "resetTokenExpiry", 
    COALESCE(role, 'USER'), 
    COALESCE("createdAt", NOW()), 
    COALESCE("updatedAt", NOW())
FROM auth_user
ON CONFLICT (id) DO NOTHING;

-- 3. Mettre à jour les contraintes de clé étrangère pour user_session
ALTER TABLE user_session 
    DROP CONSTRAINT IF EXISTS "user_session_user_id_fkey",
    ADD CONSTRAINT user_session_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 4. Supprimer l'ancienne table si elle existe et est vide
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auth_user') THEN
        -- Vérifier si la table est vide
        IF (SELECT COUNT(*) FROM auth_user) = 0 THEN
            DROP TABLE auth_user;
        ELSE
            RAISE NOTICE 'La table auth_user n''est pas vide et n''a pas été supprimée';
        END IF;
    END IF;
END $$;

-- Réactiver les triggers
SET session_replication_role = 'origin';
