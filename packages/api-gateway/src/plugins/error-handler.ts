import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { isAppError } from '@jobencon/shared';

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  // ── Zod validation errors ──────────────────────────────
  if (error instanceof ZodError) {
    void reply.status(422).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input tidak valid',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // ── Domain errors ──────────────────────────────────────
  if (isAppError(error)) {
    void reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    });
    return;
  }

  // ── Fastify built-in errors ────────────────────────────
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    void reply.status(error.statusCode).send({
      success: false,
      error: {
        code: 'REQUEST_ERROR',
        message: error.message,
      },
    });
    return;
  }

  // ── Unknown errors ─────────────────────────────────────
  request.log.error({ err: error, reqId: request.id }, 'Unhandled error in API Gateway');
  void reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan pada server. Mohon coba lagi.',
    },
  });
}
