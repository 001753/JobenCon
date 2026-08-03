import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { errorHandler } from './plugins/error-handler.js';
import { authPlugin } from './plugins/auth.plugin.js';
import { healthRoutes } from './routes/health.routes.js';
import { authProxyRoutes } from './routes/auth-proxy.routes.js';

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
    // Request ID untuk tracing
    genReqId: () =>
      `gw-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  });

  // ── Security Headers ──────────────────────────────────
  await app.register(helmet, {
    crossOriginEmbedderPolicy: false, // Perlu false untuk beberapa frontend frameworks
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
  });

  // ── CORS ──────────────────────────────────────────────
  const allowedOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  await app.register(cors, {
    origin: (origin, cb) => {
      if (origin === undefined) {
        cb(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-API-Key'],
    credentials: true,
  });

  // ── Global Rate Limiting ──────────────────────────────
  await app.register(rateLimit, {
    global: true,
    max: parseInt(process.env['RATE_LIMIT_MAX'] ?? '100', 10),
    timeWindow: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '60000', 10),
    keyGenerator: (request) => {
      // Prioritas: API Key → User ID (dari JWT) → IP
      const apiKey = request.headers['x-api-key'];
      if (typeof apiKey === 'string' && apiKey.length > 0) {
        return `apikey:${apiKey.slice(0, 10)}`;
      }
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

  // ── Auth Plugin (JWT verification) ───────────────────
  await app.register(authPlugin);

  // ── Error Handler ─────────────────────────────────────
  app.setErrorHandler(errorHandler);

  // ── Routes ────────────────────────────────────────────
  await app.register(healthRoutes);

  // Auth routes — proxy ke auth-service
  await app.register(authProxyRoutes, { prefix: '/v1/auth' });

  // TODO Phase 1: register routes untuk portfolio, connectors, manual-assets
  // await app.register(portfolioRoutes, { prefix: '/v1/portfolio' });
  // await app.register(connectorRoutes, { prefix: '/v1/connectors' });
  // await app.register(manualAssetRoutes, { prefix: '/v1/assets' });

  return app;
}
