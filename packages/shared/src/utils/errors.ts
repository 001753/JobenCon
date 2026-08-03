// ============================================================
// Domain error types untuk Joben Connect
// ============================================================

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Auth Errors ────────────────────────────────────────────

export class AuthError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(code, message, 401, details);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Akses ditolak') {
    super('FORBIDDEN', message, 403);
    this.name = 'ForbiddenError';
  }
}

// ── Validation Errors ──────────────────────────────────────

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 422, details);
    this.name = 'ValidationError';
  }
}

// ── Resource Errors ───────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super('NOT_FOUND', `${resource} tidak ditemukan`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
  }
}

// ── Rate Limit Errors ──────────────────────────────────────

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds?: number) {
    super(
      'RATE_LIMIT_EXCEEDED',
      'Terlalu banyak request. Coba lagi nanti.',
      429,
      retryAfterSeconds !== undefined ? { retryAfterSeconds } : undefined,
    );
    this.name = 'RateLimitError';
  }
}

// ── Type guards ────────────────────────────────────────────

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
