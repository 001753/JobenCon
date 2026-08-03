import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { prismaPlugin } from './plugins/prisma.js';
import { authRoutes } from './routes/auth.routes.js';
import { healthRoutes } from './routes/health.routes.js';
import { errorHandler } from './plugins/error-handler.js';

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
  });

  // ── Security headers ──────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    originAgentCluster: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    strictTransportSecurity: {
      maxAge: 31_536_000,
      includeSubDomains: true,
      preload: true,
    },
  });

  // ── CORS ──────────────────────────────────────────────────
  const allowedOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  await app.register(cors, {
    origin: (origin, cb) => {
      // Internal service calls (no origin)
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
  });

  // ── Rate Limiting ─────────────────────────────────────────
  await app.register(rateLimit, {
    global: false, // Per-route override
    max: 100,
    timeWindow: 60_000,
    errorResponseBuilder: (_req, context) => ({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak request. Coba lagi nanti.',
        retryAfter: context.after,
      },
    }),
  });

  // ── Database ──────────────────────────────────────────────
  await app.register(prismaPlugin);

  // ── Error handler ─────────────────────────────────────────
  app.setErrorHandler(errorHandler);

  // ── Routes ────────────────────────────────────────────────
  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: '/auth' });

  return app;
}
