import type { UserStatusType } from '../constants/index.js';

// ── User Types ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string; // decrypted
  emailHash: string;
  name: string | null;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  status: UserStatusType;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export type PublicUser = Pick<
  User,
  'id' | 'email' | 'name' | 'isEmailVerified' | 'mfaEnabled' | 'status' | 'createdAt'
>;
