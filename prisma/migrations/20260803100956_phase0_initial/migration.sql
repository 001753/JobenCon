-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "connector_status" AS ENUM ('active', 'error', 'paused', 'revoked');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('active', 'past_due', 'cancelled', 'trial');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('pending', 'paid', 'failed', 'void');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" BYTEA NOT NULL,
    "email_hash" VARCHAR(64) NOT NULL,
    "name" VARCHAR(100),
    "password_hash" VARCHAR(255) NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret_ref" UUID,
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "last_login_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "refresh_token_hash" VARCHAR(64) NOT NULL,
    "device_fingerprint" VARCHAR(255),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_recovery_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "code_hash" VARCHAR(64) NOT NULL,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "mfa_recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "consent_type" VARCHAR(100) NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "policy_version" VARCHAR(20) NOT NULL,
    "ip_address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "owner_id" UUID NOT NULL,
    "plan_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connectors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "connector_type" VARCHAR(50) NOT NULL,
    "connector_tier" VARCHAR(20) NOT NULL,
    "connector_class" VARCHAR(20) NOT NULL,
    "credential_ref" UUID NOT NULL,
    "status" "connector_status" NOT NULL DEFAULT 'active',
    "last_sync_at" TIMESTAMPTZ,
    "last_sync_status" VARCHAR(20),
    "last_sync_error" TEXT,
    "sync_interval_sec" INTEGER NOT NULL DEFAULT 300,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "connectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connector_holdings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "connector_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "asset_identifier" VARCHAR(50) NOT NULL,
    "asset_category" VARCHAR(50) NOT NULL,
    "quantity" DECIMAL(30,18) NOT NULL,
    "avg_buy_price" DECIMAL(30,8),
    "avg_buy_currency" CHAR(3),
    "synced_at" TIMESTAMPTZ NOT NULL,
    "raw_data" JSONB,

    CONSTRAINT "connector_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "connector_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "status" VARCHAR(20) NOT NULL,
    "assets_synced" INTEGER NOT NULL DEFAULT 0,
    "error_code" VARCHAR(50),
    "error_message" TEXT,
    "duration_ms" INTEGER,

    CONSTRAINT "sync_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "asset_identifier" VARCHAR(50),
    "label" VARCHAR(200),
    "quantity" DECIMAL(30,18) NOT NULL,
    "unit" VARCHAR(20),
    "avg_buy_price" DECIMAL(30,8),
    "avg_buy_price_currency" CHAR(3) NOT NULL DEFAULT 'IDR',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "manual_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_holdings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "currency_code" CHAR(3) NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL,
    "label" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "currency_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_snapshots" (
    "ts" TIMESTAMPTZ NOT NULL,
    "asset_identifier" VARCHAR(50) NOT NULL,
    "asset_category" VARCHAR(50) NOT NULL,
    "price_idr" DECIMAL(30,8),
    "price_usd" DECIMAL(30,8),
    "price_currency" CHAR(3) NOT NULL,
    "price_native" DECIMAL(30,8) NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "delay_minutes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "price_snapshots_pkey" PRIMARY KEY ("ts","asset_identifier","asset_category")
);

-- CreateTable
CREATE TABLE "portfolio_snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "computed_at" TIMESTAMPTZ NOT NULL,
    "total_net_worth_idr" DECIMAL(30,8),
    "total_net_worth_usd" DECIMAL(30,8),
    "unrealized_pl_idr" DECIMAL(30,8),
    "unrealized_pl_pct" DECIMAL(10,4),
    "breakdown_by_category" JSONB,
    "data_quality_score" DECIMAL(5,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "price_monthly_idr" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "price_yearly_idr" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "max_connectors" INTEGER,
    "max_manual_assets" INTEGER,
    "api_quota_hourly" INTEGER,
    "api_quota_daily" INTEGER,
    "portfolio_history_days" INTEGER,
    "features" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "subscription_status" NOT NULL,
    "current_period_start" TIMESTAMPTZ NOT NULL,
    "current_period_end" TIMESTAMPTZ NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "payment_method_ref" VARCHAR(255),
    "gateway_subscription_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscription_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount_idr" DECIMAL(15,2) NOT NULL,
    "status" "invoice_status" NOT NULL,
    "issued_at" TIMESTAMPTZ NOT NULL,
    "paid_at" TIMESTAMPTZ,
    "due_at" TIMESTAMPTZ,
    "gateway_invoice_id" VARCHAR(255),
    "pdf_url" TEXT,
    "metadata" JSONB,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_meters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "metric_name" VARCHAR(50) NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "period_start" TIMESTAMPTZ NOT NULL,
    "period_end" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "usage_meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_clients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "client_id" VARCHAR(100) NOT NULL,
    "client_secret_hash" VARCHAR(255) NOT NULL,
    "redirect_uris" TEXT[],
    "allowed_scopes" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" VARCHAR(100) NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" VARCHAR(64) NOT NULL,
    "scope" TEXT[],
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "redirect_uri" TEXT NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "client_id" UUID,
    "key_hash" VARCHAR(64) NOT NULL,
    "key_prefix" VARCHAR(10) NOT NULL,
    "environment" VARCHAR(20) NOT NULL,
    "allowed_scopes" TEXT[],
    "last_used_at" TIMESTAMPTZ,
    "expires_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ts" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" UUID,
    "actor_type" VARCHAR(20) NOT NULL DEFAULT 'user',
    "action" VARCHAR(100) NOT NULL,
    "target_type" VARCHAR(50),
    "target_id" UUID,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_hash_key" ON "users"("email_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_refresh_token_hash_idx" ON "sessions"("refresh_token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "connectors_user_id_connector_type_key" ON "connectors"("user_id", "connector_type");

-- CreateIndex
CREATE INDEX "connector_holdings_user_id_asset_category_idx" ON "connector_holdings"("user_id", "asset_category");

-- CreateIndex
CREATE INDEX "connector_holdings_connector_id_asset_identifier_idx" ON "connector_holdings"("connector_id", "asset_identifier");

-- CreateIndex
CREATE INDEX "sync_log_connector_id_started_at_idx" ON "sync_log"("connector_id", "started_at");

-- CreateIndex
CREATE INDEX "manual_assets_user_id_category_idx" ON "manual_assets"("user_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "currency_holdings_user_id_currency_code_label_key" ON "currency_holdings"("user_id", "currency_code", "label");

-- CreateIndex
CREATE INDEX "idx_price_snapshots_lookup" ON "price_snapshots"("asset_identifier", "asset_category", "ts" DESC);

-- CreateIndex
CREATE INDEX "idx_portfolio_snapshots_user_time" ON "portfolio_snapshots"("user_id", "computed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "invoices_user_id_idx" ON "invoices"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "usage_meters_user_id_metric_name_period_start_key" ON "usage_meters"("user_id", "metric_name", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_client_id_key" ON "oauth_clients"("client_id");

-- CreateIndex
CREATE INDEX "oauth_authorization_codes_code_hash_idx" ON "oauth_authorization_codes"("code_hash");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_id_ts_idx" ON "audit_log"("actor_id", "ts" DESC);

-- CreateIndex
CREATE INDEX "audit_log_ts_idx" ON "audit_log"("ts" DESC);

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_recovery_codes" ADD CONSTRAINT "mfa_recovery_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_log" ADD CONSTRAINT "consent_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connectors" ADD CONSTRAINT "connectors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connector_holdings" ADD CONSTRAINT "connector_holdings_connector_id_fkey" FOREIGN KEY ("connector_id") REFERENCES "connectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connector_holdings" ADD CONSTRAINT "connector_holdings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_log" ADD CONSTRAINT "sync_log_connector_id_fkey" FOREIGN KEY ("connector_id") REFERENCES "connectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_assets" ADD CONSTRAINT "manual_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currency_holdings" ADD CONSTRAINT "currency_holdings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_snapshots" ADD CONSTRAINT "portfolio_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_meters" ADD CONSTRAINT "usage_meters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_clients" ADD CONSTRAINT "oauth_clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
