/**
 * Auth Proxy Routes
 * Meneruskan request auth ke auth-service via HTTP proxy.
 * API Gateway tidak punya business logic auth — hanya routing + rate limit.
 */

import { request as undiciRequest } from 'undici';
import type { FastifyInstance } from 'fastify';

const AUTH_SERVICE_URL =
  process.env['AUTH_SERVICE_URL'] ?? 'http://localhost:3001';

/**
 * Helper: forward request ke auth-service dan stream response kembali.
 */
async function proxyToAuth(
  path: string,
  method: string,
  body: unknown,
  headers: Record<string, string | undefined>,
) {
  const url = `${AUTH_SERVICE_URL}/auth${path}`;

  const requestHeaders: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (headers['x-forwarded-for'] !== undefined) {
    requestHeaders['x-forwarded-for'] = headers['x-forwarded-for'];
  }
  if (headers['user-agent'] !== undefined) {
    requestHeaders['user-agent'] = headers['user-agent'];
  }
  if (headers['x-request-id'] !== undefined) {
    requestHeaders['x-request-id'] = headers['x-request-id'];
  }

  // Internal secret untuk auth-service verify-token endpoint
  const internalSecret = process.env['AUTH_SERVICE_INTERNAL_SECRET'];
  if (internalSecret !== undefined && internalSecret.length > 0) {
    requestHeaders['x-internal-secret'] = internalSecret;
  }

  const { statusCode, body: responseBody } = await undiciRequest(url, {
    method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers: requestHeaders,
    body: JSON.stringify(body),
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

export async function authProxyRoutes(app: FastifyInstance) {
  const AUTH_RATE_LIMIT = {
    config: { rateLimit: { max: 10, timeWindow: 60_000 } },
  };

  // ── POST /v1/auth/register ──────────────────────────────
  app.post('/register', AUTH_RATE_LIMIT, async (request, reply) => {
    const { statusCode, data } = await proxyToAuth(
      '/register',
      'POST',
      request.body,
      {
        'x-forwarded-for': request.ip,
        'user-agent': request.headers['user-agent'],
        'x-request-id': request.id,
      },
    );
    return reply.status(statusCode).send(data);
  });

  // ── POST /v1/auth/login ─────────────────────────────────
  app.post('/login', AUTH_RATE_LIMIT, async (request, reply) => {
    const { statusCode, data } = await proxyToAuth('/login', 'POST', request.body, {
      'x-forwarded-for': request.ip,
      'user-agent': request.headers['user-agent'],
      'x-request-id': request.id,
    });
    return reply.status(statusCode).send(data);
  });

  // ── POST /v1/auth/refresh ───────────────────────────────
  app.post('/refresh', async (request, reply) => {
    const { statusCode, data } = await proxyToAuth('/refresh', 'POST', request.body, {
      'x-forwarded-for': request.ip,
      'user-agent': request.headers['user-agent'],
      'x-request-id': request.id,
    });
    return reply.status(statusCode).send(data);
  });

  // ── POST /v1/auth/logout ────────────────────────────────
  app.post('/logout', async (request, reply) => {
    const { statusCode, data } = await proxyToAuth('/logout', 'POST', request.body, {
      'x-forwarded-for': request.ip,
      'user-agent': request.headers['user-agent'],
      'x-request-id': request.id,
    });
    return reply.status(statusCode).send(data);
  });

  // ── POST /v1/auth/verify-email ──────────────────────────
  app.post('/verify-email', AUTH_RATE_LIMIT, async (request, reply) => {
    const { statusCode, data } = await proxyToAuth(
      '/verify-email',
      'POST',
      request.body,
      {
        'x-forwarded-for': request.ip,
        'user-agent': request.headers['user-agent'],
        'x-request-id': request.id,
      },
    );
    return reply.status(statusCode).send(data);
  });
}
