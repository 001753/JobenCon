/**
 * Unit tests — Auth Service
 * Fokus: shared utilities dan schema validation (tanpa DB connection).
 */

import { sha256, sha256Raw, generateToken } from '@jobencon/shared';

// Set required env vars
process.env['JWT_SECRET'] = 'test-jwt-secret-that-is-at-least-32-chars-long';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-that-is-at-least-32-chars';

// ── Crypto utilities ─────────────────────────────────────────────────
describe('Crypto utilities', () => {
  it('sha256 normalizes input (lowercase + trim)', () => {
    expect(sha256('USER@EXAMPLE.COM ')).toBe(sha256('user@example.com'));
    expect(sha256(' test ')).toBe(sha256('test'));
  });

  it('sha256 returns 64-char hex string', () => {
    const result = sha256('test@example.com');
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('sha256Raw is case-sensitive', () => {
    expect(sha256Raw('ABC')).not.toBe(sha256Raw('abc'));
  });

  it('generateToken returns hex string of correct length', () => {
    const token = generateToken(32);
    expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
    expect(token).toMatch(/^[0-9a-f]+$/);
  });

  it('generateToken produces unique values', () => {
    const t1 = generateToken();
    const t2 = generateToken();
    expect(t1).not.toBe(t2);
  });
});

// ── Auth schemas ──────────────────────────────────────────────────────
describe('RegisterSchema', () => {
  let RegisterSchema: (typeof import('@jobencon/shared'))['RegisterSchema'];

  beforeAll(async () => {
    const shared = await import('@jobencon/shared');
    RegisterSchema = shared.RegisterSchema;
  });

  it('accepts valid input', () => {
    const result = RegisterSchema.safeParse({
      email: 'test@example.com',
      password: 'StrongPass1!',
      name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  it('normalizes email to lowercase', () => {
    const result = RegisterSchema.safeParse({
      email: 'TEST@EXAMPLE.COM',
      password: 'StrongPass1!',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('rejects short password (< 10 chars)', () => {
    const result = RegisterSchema.safeParse({
      email: 'test@example.com',
      password: 'Short1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = RegisterSchema.safeParse({
      email: 'test@example.com',
      password: 'weakpassword1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without special char', () => {
    const result = RegisterSchema.safeParse({
      email: 'test@example.com',
      password: 'WeakPassword123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = RegisterSchema.safeParse({
      email: 'not-an-email',
      password: 'StrongPass1!',
    });
    expect(result.success).toBe(false);
  });
});

describe('LoginSchema', () => {
  let LoginSchema: (typeof import('@jobencon/shared'))['LoginSchema'];

  beforeAll(async () => {
    const shared = await import('@jobencon/shared');
    LoginSchema = shared.LoginSchema;
  });

  it('accepts valid input', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: 'anypassword',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

// ── Error classes ─────────────────────────────────────────────────────
describe('Error classes', () => {
  it('AppError has correct properties', async () => {
    const { AppError, isAppError } = await import('@jobencon/shared');
    const err = new AppError('TEST_CODE', 'Test message', 400);
    expect(err.code).toBe('TEST_CODE');
    expect(err.message).toBe('Test message');
    expect(err.statusCode).toBe(400);
    expect(isAppError(err)).toBe(true);
    expect(isAppError(new Error('plain'))).toBe(false);
  });

  it('AuthError has statusCode 401', async () => {
    const { AuthError } = await import('@jobencon/shared');
    const err = new AuthError('INVALID_CREDENTIALS', 'Invalid');
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('INVALID_CREDENTIALS');
  });

  it('ConflictError has statusCode 409', async () => {
    const { ConflictError } = await import('@jobencon/shared');
    const err = new ConflictError('Duplicate');
    expect(err.statusCode).toBe(409);
  });

  it('NotFoundError has statusCode 404', async () => {
    const { NotFoundError } = await import('@jobencon/shared');
    const err = new NotFoundError('User');
    expect(err.statusCode).toBe(404);
  });
});
