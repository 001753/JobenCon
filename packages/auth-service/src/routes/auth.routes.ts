import type { FastifyInstance } from 'fastify';
import {
  LoginSchema,
  LogoutSchema,
  RefreshTokenSchema,
  RegisterSchema,
  VerifyEmailSchema,
  VerifyTokenSchema,
} from '@jobencon/shared';

import { AuthService } from '../services/auth.service.js';

const AUTH_RATE_LIMIT = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: 60_000,
    },
  },
};

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService(app.prisma);

  // ── POST /auth/register ────────────────────────────────
  app.post(
    '/register',
    {
      ...AUTH_RATE_LIMIT,
      schema: {
        description: 'Daftarkan akun baru',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 10 },
            name: { type: 'string' },
            consentAnalytics: { type: 'boolean' },
          },
        },
      },
    },
    async (request, reply) => {
      const input = RegisterSchema.parse(request.body);
      const result = await authService.register(input, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });
      return reply.status(201).send({ success: true, data: result });
    },
  );

  // ── POST /auth/login ───────────────────────────────────
  app.post(
    '/login',
    {
      ...AUTH_RATE_LIMIT,
      schema: {
        description: 'Login dengan email dan password',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            deviceFingerprint: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const input = LoginSchema.parse(request.body);
      const result = await authService.login(input, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });
      return reply.status(200).send({ success: true, data: result });
    },
  );

  // ── POST /auth/refresh ─────────────────────────────────
  app.post(
    '/refresh',
    {
      schema: {
        description: 'Refresh access token menggunakan refresh token',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const input = RefreshTokenSchema.parse(request.body);
      const result = await authService.refreshToken(input.refreshToken, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });
      return reply.status(200).send({ success: true, data: result });
    },
  );

  // ── POST /auth/logout ──────────────────────────────────
  app.post(
    '/logout',
    {
      schema: {
        description: 'Logout dan revoke refresh token',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const input = LogoutSchema.parse(request.body);
      await authService.logout(input.refreshToken);
      return reply.status(200).send({
        success: true,
        data: { message: 'Logout berhasil' },
      });
    },
  );

  // ── POST /auth/verify-email ────────────────────────────
  app.post(
    '/verify-email',
    {
      ...AUTH_RATE_LIMIT,
      schema: {
        description: 'Verifikasi email dengan token',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const input = VerifyEmailSchema.parse(request.body);
      const result = await authService.verifyEmail(input.token);
      return reply.status(200).send({ success: true, data: result });
    },
  );

  // ── POST /auth/verify-token (internal — API Gateway only) ──
  app.post(
    '/verify-token',
    {
      schema: {
        description: 'Internal: verifikasi JWT access token (dipanggil API Gateway)',
        tags: ['auth-internal'],
        body: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const internalSecret = process.env['AUTH_SERVICE_INTERNAL_SECRET'];
      const providedSecret = request.headers['x-internal-secret'];

      if (
        internalSecret !== undefined &&
        internalSecret.length > 0 &&
        providedSecret !== internalSecret
      ) {
        return reply.status(403).send({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Akses ditolak' },
        });
      }

      const input = VerifyTokenSchema.parse(request.body);
      const result = await authService.verifyToken(input.token);
      return reply.status(200).send({ success: true, data: result });
    },
  );
}
