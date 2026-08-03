-- CreateTable
CREATE TABLE "credential_vault" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "encrypted_data" BYTEA NOT NULL,
    "iv" VARCHAR(32) NOT NULL,
    "tag" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "credential_vault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credential_vault_user_id_idx" ON "credential_vault"("user_id");
