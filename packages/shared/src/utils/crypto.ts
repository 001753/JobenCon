import { createHash, randomBytes } from 'node:crypto';

/**
 * SHA-256 hash dari input string.
 * Dipakai untuk: email_hash, token_hash, refresh_token_hash, dll.
 * Input di-lowercase dan di-trim sebelum hash.
 */
export function sha256(input: string): string {
  return createHash('sha256').update(input.toLowerCase().trim()).digest('hex');
}

/**
 * SHA-256 hash tanpa normalisasi — untuk token (case-sensitive).
 */
export function sha256Raw(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Generate random URL-safe token (default 32 bytes = 64 hex chars).
 */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Constant-time string comparison untuk mencegah timing attacks.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
