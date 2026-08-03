import { z } from 'zod';

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../constants/index.js';

// ── Password validator ─────────────────────────────────────
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password minimal ${PASSWORD_MIN_LENGTH} karakter`)
  .max(PASSWORD_MAX_LENGTH, `Password maksimal ${PASSWORD_MAX_LENGTH} karakter`)
  .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
  .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
  .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
  .regex(/[^A-Za-z0-9]/, 'Password harus mengandung minimal 1 karakter spesial');

// ── Register ───────────────────────────────────────────────
export const RegisterSchema = z.object({
  email: z.string().email('Format email tidak valid').toLowerCase().trim(),
  password: passwordSchema,
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim()
    .optional(),
  consentAnalytics: z.boolean().optional().default(false),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

// ── Login ──────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid').toLowerCase().trim(),
  password: z.string().min(1, 'Password tidak boleh kosong'),
  deviceFingerprint: z.string().max(255).optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ── Refresh Token ──────────────────────────────────────────
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token tidak boleh kosong'),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

// ── Logout ─────────────────────────────────────────────────
export const LogoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token tidak boleh kosong'),
});

export type LogoutInput = z.infer<typeof LogoutSchema>;

// ── Verify Email ───────────────────────────────────────────
export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token tidak boleh kosong'),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

// ── JWT Payload ────────────────────────────────────────────
export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// ── Token Verify Request (internal — API Gateway → Auth Service) ──
export const VerifyTokenSchema = z.object({
  token: z.string().min(1),
});

export type VerifyTokenInput = z.infer<typeof VerifyTokenSchema>;
