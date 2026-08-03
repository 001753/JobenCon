import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

import { AuthError, type JwtPayload } from '@jobencon/shared';

declare module 'fastify' {
  interface FastifyRequest {
    /** Populated untuk semua authenticated requests */
    jwtPayload?: JwtPayload;
    userId?: string;
  }
}

async function authPluginFn(app: FastifyInstance) {
  /**
   * Decorator: verifikasi JWT dari Authorization header.
   * Lempar AuthError jika token tidak valid.
   */
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

  /**
   * Decorator: wajib verifikasi email sebelum akses resource.
   */
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
}

export const authPlugin = fp(authPluginFn, { name: 'auth-plugin' });
