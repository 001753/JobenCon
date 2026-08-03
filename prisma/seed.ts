/**
 * Prisma seed — initial data untuk Phase 0
 * Jalankan: pnpm db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('🌱 Seeding database...');

  // ── Plans ──────────────────────────────────────────────────────────────
  const plans = [
    {
      name: 'free',
      displayName: 'Free',
      priceMonthlyIdr: 0,
      priceYearlyIdr: 0,
      sortOrder: 0,
      maxConnectors: 1,
      maxManualAssets: 10,
      apiQuotaHourly: null,
      apiQuotaDaily: null,
      portfolioHistoryDays: 30,
      features: {
        webhook: false,
        data_export: false,
        push_notification: false,
        priority_support: false,
        risk_engine: false,
        multi_user_workspace: false,
        audit_log_export: false,
        custom_category: false,
      },
    },
    {
      name: 'starter',
      displayName: 'Starter',
      priceMonthlyIdr: 49000,
      priceYearlyIdr: 490000,
      sortOrder: 1,
      maxConnectors: 3,
      maxManualAssets: 50,
      apiQuotaHourly: null,
      apiQuotaDaily: null,
      portfolioHistoryDays: 90,
      features: {
        webhook: false,
        data_export: true,
        push_notification: true,
        priority_support: false,
        risk_engine: false,
        multi_user_workspace: false,
        audit_log_export: false,
        custom_category: false,
      },
    },
    {
      name: 'pro',
      displayName: 'Pro',
      priceMonthlyIdr: 149000,
      priceYearlyIdr: 1490000,
      sortOrder: 2,
      maxConnectors: 10,
      maxManualAssets: null, // unlimited
      apiQuotaHourly: 1000,
      apiQuotaDaily: 10000,
      portfolioHistoryDays: 365,
      features: {
        webhook: true,
        data_export: true,
        push_notification: true,
        priority_support: false,
        risk_engine: false,
        multi_user_workspace: false,
        audit_log_export: false,
        custom_category: true,
      },
    },
    {
      name: 'business',
      displayName: 'Business',
      priceMonthlyIdr: 499000,
      priceYearlyIdr: 4990000,
      sortOrder: 3,
      maxConnectors: null, // unlimited
      maxManualAssets: null, // unlimited
      apiQuotaHourly: 10000,
      apiQuotaDaily: 100000,
      portfolioHistoryDays: null, // unlimited
      features: {
        webhook: true,
        data_export: true,
        push_notification: true,
        priority_support: true,
        risk_engine: true,
        multi_user_workspace: true,
        audit_log_export: true,
        custom_category: true,
      },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
    console.info(`  ✓ Plan "${plan.name}" upserted`);
  }

  console.info('✅ Seed selesai');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
