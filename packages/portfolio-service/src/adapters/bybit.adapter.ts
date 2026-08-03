/**
 * Bybit Connector Adapter
 * Dokumentasi: https://bybit-exchange.github.io/docs/v5/account/wallet-balance
 * Endpoint: GET /v5/account/wallet-balance?accountType=UNIFIED
 */

import { createHmac } from 'node:crypto';
import { request } from 'undici';
import type { ConnectorAdapter, ConnectorAdapterResult, ConnectorCredentials, UdsHolding } from '@jobencon/shared';

const BASE_URL = 'https://api.bybit.com';
const RECV_WINDOW = '5000';

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

interface BybitCoin {
  coin: string;
  walletBalance: string;
  availableToWithdraw: string;
  usdValue: string;
}

interface BybitWallet {
  accountType: string;
  coin: BybitCoin[];
}

interface BybitResponse {
  retCode: number;
  retMsg: string;
  result: { list: BybitWallet[] };
}

export const bybitAdapter: ConnectorAdapter = {
  connectorType: 'bybit',
  tier: 'TIER_1',

  async validateCredentials(credentials: ConnectorCredentials) {
    try {
      const timestamp = Date.now().toString();
      const queryStr = 'accountType=UNIFIED&limit=1';
      const signPayload = `${timestamp}${credentials.apiKey}${RECV_WINDOW}${queryStr}`;
      const signature = sign(signPayload, credentials.apiSecret);

      const { statusCode, body } = await request(
        `${BASE_URL}/v5/account/wallet-balance?${queryStr}`,
        {
          method: 'GET',
          headers: {
            'X-BAPI-API-KEY': credentials.apiKey,
            'X-BAPI-SIGN': signature,
            'X-BAPI-SIGN-MSG-HASH-ALGO': 'SHA256',
            'X-BAPI-TIMESTAMP': timestamp,
            'X-BAPI-RECV-WINDOW': RECV_WINDOW,
          },
          bodyTimeout: 10_000,
          headersTimeout: 10_000,
        },
      );

      const data = (await body.json()) as BybitResponse;

      if (statusCode === 200 && data.retCode === 0) {
        return { valid: true };
      }
      return { valid: false, error: data.retMsg ?? `HTTP ${statusCode}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { valid: false, error: `Tidak bisa terhubung ke Bybit: ${message}` };
    }
  },

  async fetchHoldings(credentials: ConnectorCredentials): Promise<ConnectorAdapterResult> {
    const fetchedAt = new Date();
    try {
      const timestamp = Date.now().toString();
      const queryStr = 'accountType=UNIFIED';
      const signPayload = `${timestamp}${credentials.apiKey}${RECV_WINDOW}${queryStr}`;
      const signature = sign(signPayload, credentials.apiSecret);

      const { statusCode, body } = await request(
        `${BASE_URL}/v5/account/wallet-balance?${queryStr}`,
        {
          method: 'GET',
          headers: {
            'X-BAPI-API-KEY': credentials.apiKey,
            'X-BAPI-SIGN': signature,
            'X-BAPI-SIGN-MSG-HASH-ALGO': 'SHA256',
            'X-BAPI-TIMESTAMP': timestamp,
            'X-BAPI-RECV-WINDOW': RECV_WINDOW,
          },
          bodyTimeout: 15_000,
          headersTimeout: 15_000,
        },
      );

      const data = (await body.json()) as BybitResponse;

      if (statusCode !== 200 || data.retCode !== 0) {
        return {
          success: false,
          holdings: [],
          errorCode: `BYBIT_${data.retCode}`,
          errorMessage: data.retMsg,
          fetchedAt,
        };
      }

      const holdings: UdsHolding[] = [];
      for (const wallet of data.result.list) {
        for (const coin of wallet.coin) {
          const qty = parseFloat(coin.walletBalance);
          if (qty > 0) {
            holdings.push({
              assetIdentifier: coin.coin.toUpperCase(),
              assetCategory: 'CRYPTO',
              quantity: qty,
              rawData: {
                walletBalance: coin.walletBalance,
                availableToWithdraw: coin.availableToWithdraw,
                usdValue: coin.usdValue,
                accountType: wallet.accountType,
              },
            });
          }
        }
      }

      return { success: true, holdings, fetchedAt };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        holdings: [],
        errorCode: 'BYBIT_NETWORK_ERROR',
        errorMessage: message,
        fetchedAt,
      };
    }
  },
};
