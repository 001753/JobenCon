/**
 * Portfolio Engine
 * Kalkulasi net worth, P/L unrealized, breakdown per kategori.
 * Menggunakan data dari connector_holdings, manual_assets, dan currency_holdings.
 */

import type { PrismaClient } from '@prisma/client';

import type { PortfolioSummary, PortfolioAssetBreakdown, PortfolioCategoryBreakdown, AssetCategory } from '@jobencon/shared';
import { getPricesBatch } from './price.service.js';

type PriceMap = Map<string, { priceIdr: number | null; priceUsd: number | null; source: string; isStale: boolean }>;

function toNumber(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

/**
 * Kalkulasi portfolio untuk satu user.
 * Return PortfolioSummary tanpa menyimpan ke DB.
 */
export async function computePortfolio(
  prisma: PrismaClient,
  userId: string,
): Promise<PortfolioSummary> {
  const computedAt = new Date();

  // ── 1. Ambil semua data ──────────────────────────────────────
  const [connectorHoldings, manualAssets, currencyHoldings] = await Promise.all([
    prisma.connectorHolding.findMany({ where: { userId } }),
    prisma.manualAsset.findMany({ where: { userId } }),
    prisma.currencyHolding.findMany({ where: { userId } }),
  ]);

  // ── 2. Kumpulkan semua aset yang butuh harga ──────────────────
  const priceRequests: Array<{ identifier: string; category: string }> = [];

  const seenAssets = new Set<string>();
  const addPriceRequest = (identifier: string, category: string) => {
    const key = `${category}:${identifier}`;
    if (!seenAssets.has(key)) {
      seenAssets.add(key);
      priceRequests.push({ identifier, category });
    }
  };

  for (const h of connectorHoldings) {
    addPriceRequest(h.assetIdentifier, h.assetCategory);
  }
  for (const a of manualAssets) {
    if (a.assetIdentifier !== null) {
      addPriceRequest(a.assetIdentifier, a.category);
    }
  }
  for (const c of currencyHoldings) {
    addPriceRequest(c.currencyCode, 'CURRENCY');
  }

  // ── 3. Fetch harga ───────────────────────────────────────────
  const pricesRaw = await getPricesBatch(prisma, priceRequests);

  const prices: PriceMap = new Map();
  for (const [key, price] of pricesRaw) {
    prices.set(key, {
      priceIdr: price.priceIdr,
      priceUsd: price.priceUsd,
      source: price.source,
      isStale: price.isStale,
    });
  }

  // ── 4. Build asset breakdown ──────────────────────────────────
  const assets: PortfolioAssetBreakdown[] = [];

  let totalAssets = 0;
  let assetsWithPrice = 0;

  // Dari connector holdings
  for (const h of connectorHoldings) {
    const qty = toNumber(h.quantity) ?? 0;
    const priceData = prices.get(`${h.assetCategory}:${h.assetIdentifier}`);
    const priceIdr = priceData?.priceIdr ?? null;
    const priceUsd = priceData?.priceUsd ?? null;
    const totalIdr = priceIdr !== null ? qty * priceIdr : null;
    const totalUsd = priceUsd !== null ? qty * priceUsd : null;

    const avgBuy = toNumber(h.avgBuyPrice);
    const avgBuyCur = h.avgBuyCurrency ?? 'IDR';
    let unrealizedPlIdr: number | null = null;
    let unrealizedPlPct: number | null = null;

    if (avgBuy !== null && priceIdr !== null && avgBuyCur === 'IDR') {
      const costIdr = avgBuy * qty;
      unrealizedPlIdr = totalIdr! - costIdr;
      unrealizedPlPct = costIdr > 0 ? (unrealizedPlIdr / costIdr) * 100 : null;
    } else if (avgBuy !== null && priceUsd !== null && (avgBuyCur === 'USD' || avgBuyCur === 'USDT')) {
      const costUsd = avgBuy * qty;
      const unrealizedUsd = totalUsd! - costUsd;
      unrealizedPlPct = costUsd > 0 ? (unrealizedUsd / costUsd) * 100 : null;
    }

    assets.push({
      assetIdentifier: h.assetIdentifier,
      assetCategory: h.assetCategory as AssetCategory,
      source: 'connector',
      connectorType: undefined,
      quantity: qty,
      currentPriceIdr: priceIdr,
      currentPriceUsd: priceUsd,
      totalValueIdr: totalIdr,
      totalValueUsd: totalUsd,
      avgBuyPrice: avgBuy ?? undefined,
      avgBuyCurrency: avgBuyCur,
      unrealizedPlIdr,
      unrealizedPlPct,
      priceIsStale: priceData?.isStale ?? true,
      priceSource: priceData?.source ?? 'unknown',
    });

    totalAssets++;
    if (priceData?.priceIdr !== null && priceData !== undefined) assetsWithPrice++;
  }

  // Dari manual assets
  for (const a of manualAssets) {
    const qty = toNumber(a.quantity) ?? 0;
    const priceKey = a.assetIdentifier !== null ? `${a.category}:${a.assetIdentifier}` : null;
    const priceData = priceKey !== null ? prices.get(priceKey) : null;

    const priceIdr = priceData?.priceIdr ?? null;
    const priceUsd = priceData?.priceUsd ?? null;
    const totalIdr = priceIdr !== null ? qty * priceIdr : null;
    const totalUsd = priceUsd !== null ? qty * priceUsd : null;

    const avgBuy = toNumber(a.avgBuyPrice);
    const avgBuyCur = a.avgBuyPriceCurrency ?? 'IDR';
    let unrealizedPlIdr: number | null = null;
    let unrealizedPlPct: number | null = null;

    if (avgBuy !== null && totalIdr !== null && avgBuyCur === 'IDR') {
      const costIdr = avgBuy * qty;
      unrealizedPlIdr = totalIdr - costIdr;
      unrealizedPlPct = costIdr > 0 ? (unrealizedPlIdr / costIdr) * 100 : null;
    }

    assets.push({
      assetIdentifier: a.assetIdentifier ?? a.label ?? 'Unknown',
      assetCategory: a.category as AssetCategory,
      label: a.label ?? undefined,
      source: 'manual',
      quantity: qty,
      currentPriceIdr: priceIdr,
      currentPriceUsd: priceUsd,
      totalValueIdr: totalIdr,
      totalValueUsd: totalUsd,
      avgBuyPrice: avgBuy ?? undefined,
      avgBuyCurrency: avgBuyCur,
      unrealizedPlIdr,
      unrealizedPlPct,
      priceIsStale: priceData?.isStale ?? true,
      priceSource: priceData?.source ?? 'manual',
    });

    totalAssets++;
    if (priceData?.priceIdr !== null && priceData !== undefined) assetsWithPrice++;
  }

  // Dari currency holdings
  for (const c of currencyHoldings) {
    const amount = toNumber(c.amount) ?? 0;
    const priceData = prices.get(`CURRENCY:${c.currencyCode}`);
    const rateToIdr = priceData?.priceIdr ?? (c.currencyCode === 'IDR' ? 1 : null);
    const totalIdr = rateToIdr !== null ? amount * rateToIdr : null;
    const priceUsd = priceData?.priceUsd ?? null;
    const totalUsd = priceUsd !== null ? amount * priceUsd : null;

    assets.push({
      assetIdentifier: c.currencyCode,
      assetCategory: 'CURRENCY',
      label: c.label ?? undefined,
      source: 'manual',
      quantity: amount,
      currentPriceIdr: rateToIdr,
      currentPriceUsd: priceUsd,
      totalValueIdr: totalIdr,
      totalValueUsd: totalUsd,
      unrealizedPlIdr: null,
      unrealizedPlPct: null,
      priceIsStale: priceData?.isStale ?? (c.currencyCode !== 'IDR'),
      priceSource: priceData?.source ?? 'fixed',
    });

    totalAssets++;
    if (totalIdr !== null) assetsWithPrice++;
  }

  // ── 5. Agregasi ───────────────────────────────────────────────
  const categoryMap = new Map<string, PortfolioCategoryBreakdown>();

  let totalNetWorthIdr = 0;
  let totalNetWorthUsd: number | null = 0;
  let totalCostIdr = 0;
  let hasCostData = false;

  for (const asset of assets) {
    const idrVal = asset.totalValueIdr ?? 0;
    totalNetWorthIdr += idrVal;

    if (asset.totalValueUsd !== null && totalNetWorthUsd !== null) {
      totalNetWorthUsd += asset.totalValueUsd;
    } else {
      totalNetWorthUsd = null;
    }

    if (asset.unrealizedPlIdr !== null && asset.avgBuyPrice !== undefined) {
      const costIdr = (asset.totalValueIdr ?? 0) - asset.unrealizedPlIdr;
      totalCostIdr += costIdr;
      hasCostData = true;
    }

    const cat = asset.assetCategory;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, {
        category: cat as AssetCategory,
        totalValueIdr: 0,
        totalValueUsd: 0,
        allocationPct: 0,
        assets: [],
      });
    }
    const catEntry = categoryMap.get(cat)!;
    catEntry.totalValueIdr += idrVal;
    if (asset.totalValueUsd !== null) catEntry.totalValueUsd! += asset.totalValueUsd;
    catEntry.assets.push(asset);
  }

  // Hitung alokasi persen per kategori
  const breakdownByCategory: Record<string, number> = {};
  for (const [cat, entry] of categoryMap) {
    entry.allocationPct =
      totalNetWorthIdr > 0 ? (entry.totalValueIdr / totalNetWorthIdr) * 100 : 0;
    breakdownByCategory[cat] = entry.totalValueIdr;
  }

  // P/L total
  const unrealizedPlIdr =
    hasCostData && totalCostIdr > 0 ? totalNetWorthIdr - totalCostIdr : null;
  const unrealizedPlPct =
    unrealizedPlIdr !== null && totalCostIdr > 0
      ? (unrealizedPlIdr / totalCostIdr) * 100
      : null;

  // Data quality score
  const dataQualityScore =
    totalAssets > 0 ? (assetsWithPrice / totalAssets) * 100 : 100;

  return {
    totalNetWorthIdr,
    totalNetWorthUsd,
    unrealizedPlIdr,
    unrealizedPlPct,
    breakdownByCategory,
    dataQualityScore,
    categories: Array.from(categoryMap.values()),
    assetCount: totalAssets,
    computedAt,
  };
}

/**
 * Compute portfolio dan simpan snapshot ke DB.
 */
export async function computeAndSaveSnapshot(
  prisma: PrismaClient,
  userId: string,
): Promise<PortfolioSummary> {
  const summary = await computePortfolio(prisma, userId);

  await prisma.portfolioSnapshot.create({
    data: {
      userId,
      computedAt: summary.computedAt,
      totalNetWorthIdr: summary.totalNetWorthIdr,
      totalNetWorthUsd: summary.totalNetWorthUsd,
      unrealizedPlIdr: summary.unrealizedPlIdr,
      unrealizedPlPct: summary.unrealizedPlPct,
      breakdownByCategory: summary.breakdownByCategory,
      dataQualityScore: summary.dataQualityScore,
    },
  });

  return summary;
}

/**
 * Ambil history portfolio snapshots.
 */
export async function getPortfolioHistory(
  prisma: PrismaClient,
  userId: string,
  days = 30,
) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return prisma.portfolioSnapshot.findMany({
    where: {
      userId,
      computedAt: { gte: since },
    },
    orderBy: { computedAt: 'desc' },
    select: {
      id: true,
      computedAt: true,
      totalNetWorthIdr: true,
      totalNetWorthUsd: true,
      unrealizedPlIdr: true,
      unrealizedPlPct: true,
      breakdownByCategory: true,
      dataQualityScore: true,
    },
  });
}
