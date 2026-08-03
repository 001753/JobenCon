import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError, AuthError, NotFoundError, ConflictError, ValidationError } from '@jobencon/shared';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  // Zod validation error
  if (error instanceof ZodError) {
    return reply.status(400).send({
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
  }

  // App errors
  if (error instanceof AuthError) {
    return reply.status(401).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  }

  if (error instanceof ValidationError) {
    return reply.status(422).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  }

  if (error instanceof AppError) {
    const statusCode = error.statusCode ?? 500;
    return reply.status(statusCode).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  }

  // Fastify built-in errors (e.g. 404 Not Found)
  if (error.statusCode !== undefined) {
    return reply.status(error.statusCode).send({
      success: false,
      error: { code: 'HTTP_ERROR', message: error.message },
    });
  }

  // Unhandled
  console.error('[portfolio-service] Unhandled error:', error);
  return reply.status(500).send({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal' },
  });
}
