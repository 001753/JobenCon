/**
 * Credential Vault Service
 * Enkripsi/dekripsi credentials exchange menggunakan AES-256-GCM.
 * Key diambil dari env VAULT_ENCRYPTION_KEY (min 32 chars).
 *
 * Phase 0/1: implementasi lokal tanpa external vault service.
 * Phase 2+: migrasi ke HashiCorp Vault atau AWS KMS.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

import type { PrismaClient } from '@prisma/client';

import type { ConnectorCredentials } from '@jobencon/shared';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV untuk GCM
const TAG_LENGTH = 16; // 128-bit auth tag
const SALT = 'jobencon-vault-v1'; // deterministik — key derivation dari env var

let _derivedKey: Buffer | null = null;

function getKey(): Buffer {
  if (_derivedKey !== null) return _derivedKey;

  const rawKey = process.env['VAULT_ENCRYPTION_KEY'];
  if (rawKey === undefined || rawKey.length < 32) {
    throw new Error('VAULT_ENCRYPTION_KEY is not set or is too short (min 32 chars)');
  }

  // Derive 32-byte key dari env var menggunakan scrypt
  _derivedKey = scryptSync(rawKey, SALT, 32);
  return _derivedKey;
}

export function encryptCredentials(credentials: ConnectorCredentials): {
  encryptedData: Buffer;
  iv: string;
  tag: string;
} {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  const plaintext = JSON.stringify(credentials);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

export function decryptCredentials(
  encryptedData: Buffer,
  ivBase64: string,
  tagBase64: string,
): ConnectorCredentials {
  const key = getKey();
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8')) as ConnectorCredentials;
}

// ── DB-backed vault operations ──────────────────────────────────

export async function storeCredentials(
  prisma: PrismaClient,
  userId: string,
  credentials: ConnectorCredentials,
): Promise<string> {
  const { encryptedData, iv, tag } = encryptCredentials(credentials);

  const entry = await prisma.credentialVault.create({
    data: {
      userId,
      encryptedData,
      iv,
      tag,
    },
  });

  return entry.id;
}

export async function retrieveCredentials(
  prisma: PrismaClient,
  credentialRef: string,
  userId: string,
): Promise<ConnectorCredentials> {
  const entry = await prisma.credentialVault.findFirst({
    where: { id: credentialRef, userId },
  });

  if (entry === null) {
    throw new Error(`Credential vault entry tidak ditemukan: ${credentialRef}`);
  }

  return decryptCredentials(entry.encryptedData, entry.iv, entry.tag);
}

export async function deleteCredentials(
  prisma: PrismaClient,
  credentialRef: string,
  userId: string,
): Promise<void> {
  await prisma.credentialVault.deleteMany({
    where: { id: credentialRef, userId },
  });
}
