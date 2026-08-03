/**
 * Price Intelligence Service
 *
 * Sumber data:
 * - Crypto: CoinGecko free API (https://api.coingecko.com/api/v3)
 * - Currency rates: Frankfurter API (https://api.frankfurter.app) — gratis, tanpa key
 * - Gold (XAU): Hitung dari XAU/USD × USD/IDR rate
 *
 * Cache: in-memory dengan TTL per kategori.
 * Phase 2: migrasi ke Redis.
 */

import { request } from 'undici';
import type { PrismaClient } from '@prisma/client';
import type { AssetPrice } from '@jobencon/shared';

// ── In-memory cache ──────────────────────────────────────────────
interface CacheEntry {
  data: AssetPrice;
  expiresAt: number;
}

const priceCache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = {
  CRYPTO: 5 * 60 * 1000,      // 5 menit
  CURRENCY: 30 * 60 * 1000,   // 30 menit
  GOLD: 60 * 60 * 1000,       // 60 menit
  STOCKS: 60 * 60 * 1000,     // 60 menit
} as const;

function cacheKey(identifier: string, category: string) {
  return `${category}:${identifier}`;
}

function getCached(identifier: string, category: string): AssetPrice | null {
  const key = cacheKey(identifier, category);
  const entry = priceCache.get(key);
  if (entry === undefined) return null;
  if (Date.now() > entry.expiresAt) {
    priceCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(price: AssetPrice, ttlMs: number): void {
  const key = cacheKey(price.assetIdentifier, price.assetCategory);
  priceCache.set(key, { data: price, expiresAt: Date.now() + ttlMs });
}

// ── CoinGecko ID mapping ─────────────────────────────────────────
const COINGECKO_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  ADA: 'cardano',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  AVAX: 'avalanche-2',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  XLM: 'stellar',
  ALGO: 'algorand',
  FIL: 'filecoin',
  NEAR: 'near',
  SHIB: 'shiba-inu',
  PEPE: 'pepe',
  USDT: 'tether',
  USDC: 'usd-coin',
  BUSD: 'binance-usd',
  XAU: 'gold', // Gold (ounce troy)
};

function getCoingeckoId(symbol: string): string | undefined {
  return COINGECKO_ID_MAP[symbol.toUpperCase()];
}

// ── Fetch crypto prices from CoinGecko ────────────────────────────
async function fetchCryptoPrices(symbols: string[]): Promise<Map<string, AssetPrice>> {
  const results = new Map<string, AssetPrice>();

  // Map ke CoinGecko IDs
  const idToSymbol = new Map<string, string>();
  const ids: string[] = [];

  for (const sym of symbols) {
    const cgId = getCoingeckoId(sym);
    if (cgId !== undefined) {
      ids.push(cgId);
      idToSymbol.set(cgId, sym.toUpperCase());
    }
  }

  if (ids.length === 0) return results;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=idr,usd&include_last_updated_at=true`;
    const { statusCode, body } = await request(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      bodyTimeout: 10_000,
      headersTimeout: 10_000,
    });

    if (statusCode !== 200) return results;

    const data = (await body.json()) as Record<
      string,
      { idr?: number; usd?: number; last_updated_at?: number }
    >;

    const fetchedAt = new Date();
    for (const [cgId, prices] of Object.entries(data)) {
      const symbol = idToSymbol.get(cgId);
      if (symbol === undefined || prices.usd === undefined) continue;

      const category = symbol === 'XAU' ? 'GOLD' : 'CRYPTO';
      const price: AssetPrice = {
        assetIdentifier: symbol,
        assetCategory: category as AssetPrice['assetCategory'],
        priceIdr: prices.idr ?? null,
        priceUsd: prices.usd,
        priceCurrency: 'USD',
        priceNative: prices.usd,
        source: 'coingecko',
        fetchedAt,
        isStale: false,
        delayMinutes: 0,
      };

      results.set(symbol, price);
      setCache(price, category === 'CRYPTO' ? CACHE_TTL_MS.CRYPTO : CACHE_TTL_MS.GOLD);
    }
  } catch {
    // Gagal fetch — return apa yang sudah ada
  }

  return results;
}

// ── Fetch currency rates dari Frankfurter API ─────────────────────
async function fetchCurrencyRates(
  baseCurrency: string,
  targetCurrencies: string[],
): Promise<Map<string, number>> {
  const rates = new Map<string, number>();

  try {
    const url = `https://api.frankfurter.app/latest?from=${baseCurrency}&to=${targetCurrencies.join(',')}`;
    const { statusCode, body } = await request(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      bodyTimeout: 8_000,
      headersTimeout: 8_000,
    });

    if (statusCode !== 200) return rates;

    const data = (await body.json()) as { base: string; rates: Record<string, number> };
    for (const [currency, rate] of Object.entries(data.rates)) {
      rates.set(currency.toUpperCase(), rate);
    }
  } catch {
    // Fallback: tidak ada rates
  }

  return rates;
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Ambil harga satu aset. Return dari cache jika masih fresh.
 */
export async function getPrice(
  prisma: PrismaClient,
  identifier: string,
  category: string,
): Promise<AssetPrice | null> {
  const sym = identifier.toUpperCase();

  // Cek cache
  const cached = getCached(sym, category);
  if (cached !== null) return cached;

  if (category === 'CRYPTO' || category === 'GOLD') {
    const prices = await fetchCryptoPrices([sym]);
    return prices.get(sym) ?? null;
  }

  if (category === 'CURRENCY') {
    // IDR ke IDR = 1:1
    if (sym === 'IDR') {
      const price: AssetPrice = {
        assetIdentifier: 'IDR',
        assetCategory: 'CURRENCY',
        priceIdr: 1,
        priceUsd: null,
        priceCurrency: 'IDR',
        priceNative: 1,
        source: 'fixed',
        fetchedAt: new Date(),
        isStale: false,
        delayMinutes: 0,
      };
      return price;
    }

    const rates = await fetchCurrencyRates(sym, ['IDR', 'USD']);
    const idrRate = rates.get('IDR');
    if (idrRate === undefined) return null;

    const price: AssetPrice = {
      assetIdentifier: sym,
      assetCategory: 'CURRENCY',
      priceIdr: idrRate,
      priceUsd: rates.get('USD') ?? null,
      priceCurrency: 'IDR',
      priceNative: idrRate,
      source: 'frankfurter',
      fetchedAt: new Date(),
      isStale: false,
      delayMinutes: 0,
    };
    setCache(price, CACHE_TTL_MS.CURRENCY);
    return price;
  }

  return null;
}

/**
 * Batch fetch harga untuk banyak aset sekaligus.
 */
export async function getPricesBatch(
  prisma: PrismaClient,
  assets: Array<{ identifier: string; category: string }>,
): Promise<Map<string, AssetPrice>> {
  const results = new Map<string, AssetPrice>();

  // Pisah berdasarkan kategori
  const cryptoSymbols: string[] = [];
  const currencySymbols: string[] = [];

  for (const asset of assets) {
    const sym = asset.identifier.toUpperCase();
    const cached = getCached(sym, asset.category);
    if (cached !== null) {
      results.set(`${asset.category}:${sym}`, cached);
      continue;
    }

    if (asset.category === 'CRYPTO' || asset.category === 'GOLD') {
      cryptoSymbols.push(sym);
    } else if (asset.category === 'CURRENCY') {
      if (sym !== 'IDR') currencySymbols.push(sym);
    }
  }

  // Fetch crypto batch
  if (cryptoSymbols.length > 0) {
    const prices = await fetchCryptoPrices(cryptoSymbols);
    for (const [sym, price] of prices) {
      results.set(`${price.assetCategory}:${sym}`, price);
    }
  }

  // Fetch currency rates (terhadap IDR)
  if (currencySymbols.length > 0) {
    // Fetch semua vs IDR menggunakan satu request dari USD
    const rates = await fetchCurrencyRates('USD', ['IDR', ...currencySymbols]);
    const usdToIdr = rates.get('IDR') ?? null;

    for (const sym of currencySymbols) {
      const usdToSym = rates.get(sym);
      if (usdToSym === undefined || usdToIdr === null) continue;

      const symToIdr = usdToIdr / usdToSym;
      const price: AssetPrice = {
        assetIdentifier: sym,
        assetCategory: 'CURRENCY',
        priceIdr: symToIdr,
        priceUsd: 1 / usdToSym,
        priceCurrency: 'IDR',
        priceNative: symToIdr,
        source: 'frankfurter',
        fetchedAt: new Date(),
        isStale: false,
        delayMinutes: 0,
      };
      results.set(`CURRENCY:${sym}`, price);
      setCache(price, CACHE_TTL_MS.CURRENCY);
    }

    // IDR fixed
    const idrPrice: AssetPrice = {
      assetIdentifier: 'IDR',
      assetCategory: 'CURRENCY',
      priceIdr: 1,
      priceUsd: usdToIdr !== null ? 1 / usdToIdr : null,
      priceCurrency: 'IDR',
      priceNative: 1,
      source: 'fixed',
      fetchedAt: new Date(),
      isStale: false,
      delayMinutes: 0,
    };
    results.set('CURRENCY:IDR', idrPrice);
  }

  return results;
}

/**
 * Simpan price snapshot ke DB untuk histori.
 */
export async function savePriceSnapshot(
  prisma: PrismaClient,
  price: AssetPrice,
): Promise<void> {
  await prisma.priceSnapshot.upsert({
    where: {
      ts_assetIdentifier_assetCategory: {
        ts: price.fetchedAt,
        assetIdentifier: price.assetIdentifier,
        assetCategory: price.assetCategory,
      },
    },
    create: {
      ts: price.fetchedAt,
      assetIdentifier: price.assetIdentifier,
      assetCategory: price.assetCategory,
      priceIdr: price.priceIdr,
      priceUsd: price.priceUsd,
      priceCurrency: price.priceCurrency,
      priceNative: price.priceNative,
      source: price.source,
      delayMinutes: price.delayMinutes,
    },
    update: {},
  });
}
