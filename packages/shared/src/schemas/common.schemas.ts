import { z } from 'zod';

// ── UUID ───────────────────────────────────────────────────
export const UuidSchema = z.string().uuid('ID harus berformat UUID');

// ── Pagination ─────────────────────────────────────────────
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// ── Standard API Response ──────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ── Helpers ────────────────────────────────────────────────
export function successResponse<T>(data: T, meta?: Record<string, unknown>): ApiSuccess<T> {
  return { success: true, data, ...(meta !== undefined ? { meta } : {}) };
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
): ApiError {
  return {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
}
