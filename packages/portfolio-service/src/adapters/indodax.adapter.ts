/**
 * Indodax Connector Adapter
 * Dokumentasi: https://indodax.com/downloads/INDODAXAPI.pdf
 * Endpoint: POST https://indodax.com/tapi (method=getInfo)
 */

import { createHmac } from 'node:crypto';
import { request } from 'undici';
import type { ConnectorAdapter, ConnectorAdapterResult, ConnectorCredentials, UdsHolding } from '@jobencon/shared';

const TAPI_URL = 'https://indodax.com/tapi';

function sign(body: string, secret: string): string {
  return createHmac('sha512', secret).update(body).digest('hex');
}

interface IndodaxBalance {
  [currency: string]: string;
}

interface IndodaxResponse {
  success: number;
  error?: string;
  return?: {
    balance: IndodaxBalance;
    balance_hold: IndodaxBalance;
  };
}

export const indodaxAdapter: ConnectorAdapter = {
  connectorType: 'indodax',
  tier: 'TIER_1',

  async validateCredentials(credentials: ConnectorCredentials) {
    try {
      const nonce = Date.now().toString();
      const bodyStr = `method=getInfo&nonce=${nonce}`;
      const signature = sign(bodyStr, credentials.apiSecret);

      const { statusCode, body } = await request(TAPI_URL, {
        method: 'POST',
        headers: {
          Key: credentials.apiKey,
          Sign: signature,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyStr,
        bodyTimeout: 10_000,
        headersTimeout: 10_000,
      });

      const data = (await body.json()) as IndodaxResponse;

      if (statusCode === 200 && data.success === 1) {
        return { valid: true };
      }
      return { valid: false, error: data.error ?? `HTTP ${statusCode}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { valid: false, error: `Tidak bisa terhubung ke Indodax: ${message}` };
    }
  },

  async fetchHoldings(credentials: ConnectorCredentials): Promise<ConnectorAdapterResult> {
    const fetchedAt = new Date();
    try {
      const nonce = Date.now().toString();
      const bodyStr = `method=getInfo&nonce=${nonce}`;
      const signature = sign(bodyStr, credentials.apiSecret);

      const { statusCode, body } = await request(TAPI_URL, {
        method: 'POST',
        headers: {
          Key: credentials.apiKey,
          Sign: signature,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyStr,
        bodyTimeout: 15_000,
        headersTimeout: 15_000,
      });

      const data = (await body.json()) as IndodaxResponse;

      if (statusCode !== 200 || data.success !== 1 || data.return === undefined) {
        return {
          success: false,
          holdings: [],
          errorCode: 'INDODAX_ERROR',
          errorMessage: data.error ?? `HTTP ${statusCode}`,
          fetchedAt,
        };
      }

      const balance = data.return.balance;
      const holdings: UdsHolding[] = [];

      for (const [currency, amountStr] of Object.entries(balance)) {
        const amount = parseFloat(amountStr);
        if (amount <= 0) continue;

        // Indodax menggunakan lowercase untuk semua mata uang
        const identifier = currency.toUpperCase();

        // IDR adalah fiat — masukkan sebagai CURRENCY bukan CRYPTO
        if (identifier === 'IDR') {
          holdings.push({
            assetIdentifier: 'IDR',
            assetCategory: 'CURRENCY',
            quantity: amount,
            rawData: { currency, amount: amountStr, source: 'indodax' },
          });
        } else {
          holdings.push({
            assetIdentifier: identifier,
            assetCategory: 'CRYPTO',
            quantity: amount,
            rawData: { currency, amount: amountStr, source: 'indodax' },
          });
        }
      }

      return { success: true, holdings, fetchedAt };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        holdings: [],
        errorCode: 'INDODAX_NETWORK_ERROR',
        errorMessage: message,
        fetchedAt,
      };
    }
  },
};
