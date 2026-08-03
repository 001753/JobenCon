/**
 * Binance Connector Adapter
 * Dokumentasi: https://binance-docs.github.io/apidocs/spot/en/
 * Endpoint: GET /api/v3/account (membutuhkan READ info permission)
 */

import { createHmac } from 'node:crypto';
import { request } from 'undici';
import type { ConnectorAdapter, ConnectorAdapterResult, ConnectorCredentials, UdsHolding } from '@jobencon/shared';

const BASE_URL = 'https://api.binance.com';

function sign(queryString: string, secret: string): string {
  return createHmac('sha256', secret).update(queryString).digest('hex');
}

interface BinanceBalance {
  asset: string;
  free: string;
  locked: string;
}

interface BinanceAccountResponse {
  balances: BinanceBalance[];
  canRead: boolean;
}

export const binanceAdapter: ConnectorAdapter = {
  connectorType: 'binance',
  tier: 'TIER_1',

  async validateCredentials(credentials: ConnectorCredentials) {
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = sign(queryString, credentials.apiSecret);

      const { statusCode, body } = await request(
        `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`,
        {
          method: 'GET',
          headers: {
            'X-MBX-APIKEY': credentials.apiKey,
          },
          bodyTimeout: 10_000,
          headersTimeout: 10_000,
        },
      );

      const data = (await body.json()) as BinanceAccountResponse;

      if (statusCode === 200 && data.balances !== undefined) {
        return { valid: true };
      }

      if (statusCode === 401) {
        return { valid: false, error: 'API key tidak valid atau expired' };
      }

      return { valid: false, error: `HTTP ${statusCode}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { valid: false, error: `Tidak bisa terhubung ke Binance: ${message}` };
    }
  },

  async fetchHoldings(credentials: ConnectorCredentials): Promise<ConnectorAdapterResult> {
    const fetchedAt = new Date();
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = sign(queryString, credentials.apiSecret);

      const { statusCode, body } = await request(
        `${BASE_URL}/api/v3/account?${queryString}&signature=${signature}`,
        {
          method: 'GET',
          headers: {
            'X-MBX-APIKEY': credentials.apiKey,
          },
          bodyTimeout: 15_000,
          headersTimeout: 15_000,
        },
      );

      if (statusCode !== 200) {
        const errData = (await body.json()) as { code?: number; msg?: string };
        return {
          success: false,
          holdings: [],
          errorCode: `BINANCE_${errData.code ?? statusCode}`,
          errorMessage: errData.msg ?? `HTTP ${statusCode}`,
          fetchedAt,
        };
      }

      const data = (await body.json()) as BinanceAccountResponse;

      // Filter saldo > 0 dan normalisasi ke UDS
      const holdings: UdsHolding[] = data.balances
        .filter((b) => {
          const total = parseFloat(b.free) + parseFloat(b.locked);
          return total > 0;
        })
        .map((b) => ({
          assetIdentifier: b.asset.toUpperCase(),
          assetCategory: 'CRYPTO',
          quantity: parseFloat(b.free) + parseFloat(b.locked),
          rawData: { free: b.free, locked: b.locked, asset: b.asset },
        }));

      return { success: true, holdings, fetchedAt };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        holdings: [],
        errorCode: 'BINANCE_NETWORK_ERROR',
        errorMessage: message,
        fetchedAt,
      };
    }
  },
};
