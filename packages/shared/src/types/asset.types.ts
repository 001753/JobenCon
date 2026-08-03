import type { AssetCategory } from '../constants/index.js';

// ── Price ────────────────────────────────────────────────────────
export interface AssetPrice {
  assetIdentifier: string;
  assetCategory: AssetCategory;
  priceIdr: number | null;
  priceUsd: number | null;
  priceCurrency: string;
  priceNative: number;
  source: string;
  fetchedAt: Date;
  /** Apakah harga ini stale (>1 jam untuk crypto, >24 jam untuk lainnya) */
  isStale: boolean;
  /** Berapa menit delay dari sumber data */
  delayMinutes: number;
}

// ── Portfolio ────────────────────────────────────────────────────
export interface PortfolioAssetBreakdown {
  assetIdentifier: string;
  assetCategory: AssetCategory;
  label?: string;
  source: 'connector' | 'manual';
  connectorType?: string;
  quantity: number;
  currentPriceIdr: number | null;
  currentPriceUsd: number | null;
  totalValueIdr: number | null;
  totalValueUsd: number | null;
  avgBuyPrice?: number;
  avgBuyCurrency?: string;
  unrealizedPlIdr: number | null;
  unrealizedPlPct: number | null;
  priceIsStale: boolean;
  priceSource: string;
}

export interface PortfolioCategoryBreakdown {
  category: AssetCategory;
  totalValueIdr: number;
  totalValueUsd: number | null;
  allocationPct: number;
  assets: PortfolioAssetBreakdown[];
}

export interface PortfolioSummary {
  totalNetWorthIdr: number;
  totalNetWorthUsd: number | null;
  unrealizedPlIdr: number | null;
  unrealizedPlPct: number | null;
  breakdownByCategory: Record<string, number>;
  dataQualityScore: number;
  categories: PortfolioCategoryBreakdown[];
  assetCount: number;
  computedAt: Date;
}

// ── Currency Rate ────────────────────────────────────────────────
export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  fetchedAt: Date;
}
