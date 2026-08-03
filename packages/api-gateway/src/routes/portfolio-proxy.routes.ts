/**
 * Portfolio Proxy Routes
 * Meneruskan request ke portfolio-service via HTTP proxy.
 * API Gateway melakukan JWT verification sebelum proxy.
 */

import { request as undiciRequest } from 'undici';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const PORTFOLIO_SERVICE_URL =
  process.env['PORTFOLIO_SERVICE_URL'] ?? 'http://localhost:3002';

/**
 * Helper: forward request ke portfolio-service.
 * Meneruskan Authorization header agar portfolio-service bisa verify JWT.
 */
async function proxyToPortfolio(
  path: string,
  method: string,
  body: unknown,
  headers: Record<string, string | undefined>,
) {
  const url = `${PORTFOLIO_SERVICE_URL}${path}`;

  const requestHeaders: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (headers['authorization'] !== undefined) {
    requestHeaders['authorization'] = headers['authorization'];
  }
  if (headers['x-forwarded-for'] !== undefined) {
    requestHeaders['x-forwarded-for'] = headers['x-forwarded-for'];
  }
  if (headers['user-agent'] !== undefined) {
    requestHeaders['user-agent'] = headers['user-agent'];
  }
  if (headers['x-request-id'] !== undefined) {
    requestHeaders['x-request-id'] = headers['x-request-id'];
  }

  const { statusCode, body: responseBody } = await undiciRequest(url, {
    method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    headers: requestHeaders,
    body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(body) : undefined,
    bodyTimeout: 30_000,
    headersTimeout: 30_000,
  });

  const responseText = await responseBody.text();
  let responseJson: unknown;
  try {
    responseJson = JSON.parse(responseText);
  } catch {
    responseJson = { success: false, error: { code: 'UPSTREAM_ERROR', message: responseText } };
  }

  return { statusCode, data: responseJson };
}

function makeProxyHandler(getPath: (params: Record<string, string>) => string, method: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const path = getPath(request.params as Record<string, string>);
    const { statusCode, data } = await proxyToPortfolio(path, method, request.body, {
      authorization: request.headers['authorization'],
      'x-forwarded-for': request.ip,
      'user-agent': request.headers['user-agent'],
      'x-request-id': request.id,
    });
    return reply.status(statusCode).send(data);
  };
}

export async function portfolioProxyRoutes(app: FastifyInstance) {
  // ── /v1/me ────────────────────────────────────────────────────────
  app.get('/me', makeProxyHandler(() => '/v1/me', 'GET'));

  // ── /v1/portfolio ─────────────────────────────────────────────────
  app.get('/portfolio', makeProxyHandler(() => '/v1/portfolio', 'GET'));
  app.post('/portfolio/snapshot', makeProxyHandler(() => '/v1/portfolio/snapshot', 'POST'));
  app.get('/portfolio/history', makeProxyHandler(() => '/v1/portfolio/history', 'GET'));
  app.get('/portfolio/assets', makeProxyHandler(() => '/v1/portfolio/assets', 'GET'));

  // ── /v1/connectors ─────────────────────────────────────────────────
  app.get('/connectors/catalog', makeProxyHandler(() => '/v1/connectors/catalog', 'GET'));
  app.get('/connectors', makeProxyHandler(() => '/v1/connectors', 'GET'));
  app.post('/connectors', makeProxyHandler(() => '/v1/connectors', 'POST'));
  app.get('/connectors/:connectorId', makeProxyHandler(
    (p) => `/v1/connectors/${p['connectorId']}`, 'GET'));
  app.delete('/connectors/:connectorId', makeProxyHandler(
    (p) => `/v1/connectors/${p['connectorId']}`, 'DELETE'));
  app.post('/connectors/:connectorId/sync', makeProxyHandler(
    (p) => `/v1/connectors/${p['connectorId']}/sync`, 'POST'));
  app.get('/connectors/:connectorId/holdings', makeProxyHandler(
    (p) => `/v1/connectors/${p['connectorId']}/holdings`, 'GET'));

  // ── /v1/assets (manual assets) ────────────────────────────────────
  app.get('/assets', makeProxyHandler(() => '/v1/assets', 'GET'));
  app.post('/assets', makeProxyHandler(() => '/v1/assets', 'POST'));
  app.get('/assets/:assetId', makeProxyHandler((p) => `/v1/assets/${p['assetId']}`, 'GET'));
  app.patch('/assets/:assetId', makeProxyHandler((p) => `/v1/assets/${p['assetId']}`, 'PATCH'));
  app.delete('/assets/:assetId', makeProxyHandler((p) => `/v1/assets/${p['assetId']}`, 'DELETE'));

  // ── /v1/wallet (currency holdings) ───────────────────────────────
  app.get('/wallet', makeProxyHandler(() => '/v1/wallet', 'GET'));
  app.post('/wallet', makeProxyHandler(() => '/v1/wallet', 'POST'));
  app.get('/wallet/:holdingId', makeProxyHandler((p) => `/v1/wallet/${p['holdingId']}`, 'GET'));
  app.patch('/wallet/:holdingId', makeProxyHandler(
    (p) => `/v1/wallet/${p['holdingId']}`, 'PATCH'));
  app.delete('/wallet/:holdingId', makeProxyHandler(
    (p) => `/v1/wallet/${p['holdingId']}`, 'DELETE'));

  // ── /v1/prices ────────────────────────────────────────────────────
  app.get('/prices/:identifier', makeProxyHandler(
    (p) => `/v1/prices/${p['identifier']}`, 'GET'));
  app.post('/prices/batch', makeProxyHandler(() => '/v1/prices/batch', 'POST'));
}
