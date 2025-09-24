-- Migration pour aligner la structure de la base de données avec le schéma Prisma

-- 1. Renommer la table 'users' en 'auth_user' si elle existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Sauvegarder les données existantes si nécessaire
        CREATE TEMP TABLE temp_users AS SELECT * FROM users;
        
        -- Supprimer les contraintes existantes
        ALTER TABLE IF EXISTS "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
        
        -- Renommer la table
        ALTER TABLE users RENAME TO auth_user;
        
        -- Recréer les index
        CREATE INDEX IF NOT EXISTS idx_auth_user_email ON auth_user(email);
        
        -- Restaurer les données
        INSERT INTO auth_user (id, email, name, password, "emailVerified", "created_at", "updated_at", role)
        SELECT id, email, name, password, "emailVerified", "createdAt" as "created_at", 
               "updatedAt" as "updated_at", 'USER' as role
        FROM temp_users
        ON CONFLICT (id) DO NOTHING;
        
        DROP TABLE temp_users;
    END IF;
END $$;

-- 2. Mettre à jour la table des sessions
DO $$
BEGIN
    -- Renommer la table Session si elle existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Session') THEN
        ALTER TABLE "Session" RENAME TO user_session;
        ALTER TABLE user_session RENAME COLUMN "userId" TO user_id;
        ALTER TABLE user_session RENAME COLUMN "expiresAt" TO expires_at;
        
        -- Ajouter la colonne created_at si elle n'existe pas
        ALTER TABLE user_session ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Créer les index manquants
    CREATE INDEX IF NOT EXISTS idx_user_session_user_id ON user_session(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_session_expires_at ON user_session(expires_at);
    
    -- Mettre à jour les clés étrangères
    ALTER TABLE user_session 
    DROP CONSTRAINT IF EXISTS "Session_userId_fkey",
    ADD CONSTRAINT user_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE;
END $$;
