import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from 'jsonwebtoken';
import fp from 'fastify-plugin';

import type { FastifyInstance, FastifyRequest } from 'fastify';
import { AuthError, type JwtPayload } from '@jobencon/shared';

import { prismaPlugin } from './plugins/prisma.js';
import { errorHandler } from './plugins/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
import { connectorRoutes } from './routes/connectors.routes.js';
import { manualAssetRoutes } from './routes/manual-assets.routes.js';
import { currencyWalletRoutes } from './routes/currency-wallet.routes.js';
import { portfolioRoutes } from './routes/portfolio.routes.js';
import { priceRoutes } from './routes/prices.routes.js';
import { meRoutes } from './routes/me.routes.js';

// ── Auth decorators ─────────────────────────────────────────────
declare module 'fastify' {
  interface FastifyInstance {
    verifyJwt: (request: FastifyRequest) => Promise<void>;
    requireEmailVerified: (request: FastifyRequest) => Promise<void>;
  }
  interface FastifyRequest {
    jwtPayload?: JwtPayload;
    userId?: string;
  }
}

const authPlugin = fp(async function (app: FastifyInstance) {
  app.decorate('verifyJwt', async function verifyJwt(request: FastifyRequest) {
    const authHeader = request.headers['authorization'];
    if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('MISSING_TOKEN', 'Token autentikasi diperlukan');
    }

    const token = authHeader.slice(7);
    const secret = process.env['JWT_SECRET'];
    if (secret === undefined || secret.length === 0) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      const payload = jwt.verify(token, secret) as JwtPayload;
      request.jwtPayload = payload;
      request.userId = payload.sub;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AuthError('TOKEN_EXPIRED', 'Token sudah kadaluarsa. Silakan refresh token Anda.');
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new AuthError('INVALID_TOKEN', 'Token tidak valid');
      }
      throw err;
    }
  });

  app.decorate('requireEmailVerified', async function requireEmailVerified(
    request: FastifyRequest,
  ) {
    if (request.jwtPayload === undefined) {
      throw new AuthError('MISSING_TOKEN', 'Autentikasi diperlukan');
    }
    if (!request.jwtPayload.emailVerified) {
      throw new AuthError(
        'EMAIL_NOT_VERIFIED',
        'Verifikasi email Anda terlebih dahulu sebelum menggunakan fitur ini.',
      );
    }
  });
}, { name: 'auth-plugin' });

export async function buildApp() {
  const app = Fastify({
    logger:
      process.env['NODE_ENV'] === 'production'
        ? true
        : {
            transport: {
              target: 'pino-pretty',
              options: { colorize: true },
            },
          },
    disableRequestLogging: process.env['NODE_ENV'] === 'test',
    genReqId: () =>
      `ps-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  });

  // ── Security Headers ────────────────────────────────────────
  await app.register(helmet, {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  });

  // ── CORS ─────────────────────────────────────────────────────
  const allowedOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  await app.register(cors, {
    origin: (origin, cb) => {
      if (origin === undefined) { cb(null, true); return; }
      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Internal-Secret'],
    credentials: true,
  });

  // ── Rate Limiting ─────────────────────────────────────────────
  await app.register(rateLimit, {
    global: true,
    max: parseInt(process.env['RATE_LIMIT_MAX'] ?? '100', 10),
    timeWindow: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '60000', 10),
    keyGenerator: (request) => {
      const apiKey = request.headers['x-api-key'];
      if (typeof apiKey === 'string' && apiKey.length > 0) return `apikey:${apiKey.slice(0, 10)}`;
      return `ip:${request.ip}`;
    },
    errorResponseBuilder: (_req, context) => ({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak request. Coba lagi nanti.',
        retryAfter: context.after,
      },
    }),
  });

  // ── Plugins ────────────────────────────────────────────────────
  await app.register(prismaPlugin);
  await app.register(authPlugin);
  app.setErrorHandler(errorHandler);

  // ── Routes ─────────────────────────────────────────────────────
  await app.register(healthRoutes);
  await app.register(meRoutes, { prefix: '/v1/me' });
  await app.register(connectorRoutes, { prefix: '/v1/connectors' });
  await app.register(manualAssetRoutes, { prefix: '/v1/assets' });
  await app.register(currencyWalletRoutes, { prefix: '/v1/wallet' });
  await app.register(portfolioRoutes, { prefix: '/v1/portfolio' });
  await app.register(priceRoutes, { prefix: '/v1/prices' });

  return app;
}
