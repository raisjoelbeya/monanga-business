-- Align columns with existing "users" table. All operations are idempotent.
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "email" text,
  ADD COLUMN IF NOT EXISTS "name" text,
  ADD COLUMN IF NOT EXISTS "image" text,
  ADD COLUMN IF NOT EXISTS "emailVerified" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "role" text NOT NULL DEFAULT 'USER',
  ADD COLUMN IF NOT EXISTS "resetToken" text,
  ADD COLUMN IF NOT EXISTS "resetTokenExpiry" timestamptz,
  ADD COLUMN IF NOT EXISTS "emailVerificationToken" text,
  ADD COLUMN IF NOT EXISTS "emailVerificationExpires" timestamptz;

-- Ensure unique index on users.email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" ("email");
