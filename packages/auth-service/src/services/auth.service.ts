import { createHmac, randomBytes } from 'node:crypto';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  AUDIT_ACTIONS,
  BCRYPT_ROUNDS,
  EMAIL_VERIFICATION_EXPIRES_HOURS,
  JWT_ALGORITHM,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN_DAYS,
  AuthError,
  ConflictError,
  ValidationError,
  sha256,
  sha256Raw,
  generateToken,
  type JwtPayload,
  type LoginInput,
  type RegisterInput,
} from '@jobencon/shared';

interface RequestContext {
  ipAddress?: string;
  userAgent?: string | undefined;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

function requireEnv(name: string): string {
  const val = process.env[name];
  if (val === undefined || val.length === 0) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return val;
}

/**
 * Encrypt email menggunakan HMAC-SHA256 dengan JWT_SECRET sebagai key.
 * Di production, ganti dengan pgcrypto AES-256 via Prisma raw query.
 * Phase 0: HMAC cukup untuk isolasi data; Phase 1 migrasi ke pgcrypto.
 */
function encryptEmail(email: string): Buffer {
  const secret = requireEnv('JWT_SECRET');
  const hmac = createHmac('sha256', secret);
  hmac.update(email.toLowerCase().trim());
  // Store as deterministic bytes — allows unique constraint
  return Buffer.from(hmac.digest('hex'), 'utf-8');
}

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  // ── Register ───────────────────────────────────────────
  async register(input: RegisterInput, ctx: RequestContext) {
    const email = input.email.toLowerCase().trim();
    const emailHash = sha256(email);

    // Cek apakah email sudah terdaftar
    const existing = await this.prisma.user.findUnique({
      where: { emailHash },
      select: { id: true },
    });

    if (existing !== null) {
      throw new ConflictError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    // Encrypt email untuk storage
    const encryptedEmail = encryptEmail(email);

    // Buat user dan trigger email verification dalam satu transaction
    const user = await this.prisma.$transaction(async (tx: typeof this.prisma) => {
      const newUser = await tx.user.create({
        data: {
          email: encryptedEmail,
          emailHash,
          name: input.name ?? null,
          passwordHash,
          isEmailVerified: false,
        },
        select: {
          id: true,
          name: true,
          isEmailVerified: true,
          mfaEnabled: true,
          createdAt: true,
        },
      });

      // Buat email verification token
      const rawToken = generateToken(32);
      const tokenHash = sha256Raw(rawToken);
      const expiresAt = new Date(
        Date.now() + EMAIL_VERIFICATION_EXPIRES_HOURS * 60 * 60 * 1000,
      );

      await tx.emailVerification.create({
        data: {
          userId: newUser.id,
          tokenHash,
          expiresAt,
        },
      });

      // Buat personal tenant
      await tx.tenant.create({
        data: {
          name: `${input.name ?? email}'s Workspace`,
          ownerId: newUser.id,
        },
      });

      // Consent log
      if (input.consentAnalytics === true) {
        await tx.consentLog.create({
          data: {
            userId: newUser.id,
            consentType: 'analytics',
            granted: true,
            policyVersion: '1.0.0',
            ipAddress: ctx.ipAddress ?? null,
          },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId: newUser.id,
          actorType: 'user',
          action: AUDIT_ACTIONS.AUTH.REGISTER,
          targetType: 'user',
          targetId: newUser.id,
          ipAddress: ctx.ipAddress ?? null,
          userAgent: ctx.userAgent ?? null,
          metadata: { email: emailHash },
        },
      });

      // TODO (Phase 1): Kirim email verifikasi via email service
      // await emailService.sendVerificationEmail(email, rawToken);
      console.info(`[DEV] Email verification token for ${emailHash}: ${rawToken}`);

      return { ...newUser, rawVerificationToken: rawToken };
    });

    return {
      user: {
        id: user.id,
        email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
        createdAt: user.createdAt.toISOString(),
      },
      message:
        'Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun.',
    };
  }

  // ── Login ──────────────────────────────────────────────
  async login(input: LoginInput, ctx: RequestContext) {
    const email = input.email.toLowerCase().trim();
    const emailHash = sha256(email);

    const user = await this.prisma.user.findUnique({
      where: { emailHash },
      select: {
        id: true,
        name: true,
        passwordHash: true,
        isEmailVerified: true,
        mfaEnabled: true,
        status: true,
        createdAt: true,
      },
    });

    // Timing-safe: selalu hash meskipun user tidak ditemukan
    const dummyHash = '$2a$12$dummy.hash.for.timing.safety.xxxxxxxxxxxxxxxxxxxxxxx';
    const hashToCompare = user?.passwordHash ?? dummyHash;

    const passwordValid = await bcrypt.compare(input.password, hashToCompare);

    if (user === null || !passwordValid) {
      throw new AuthError('INVALID_CREDENTIALS', 'Email atau password tidak valid');
    }

    if (user.status === 'suspended') {
      throw new AuthError('ACCOUNT_SUSPENDED', 'Akun Anda telah ditangguhkan');
    }

    if (user.status === 'deleted') {
      throw new AuthError('ACCOUNT_DELETED', 'Akun tidak ditemukan');
    }

    // Issue tokens dan buat session
    const tokens = await this.createSession(user.id, email, user.isEmailVerified, {
      ...(input.deviceFingerprint !== undefined ? { deviceFingerprint: input.deviceFingerprint } : {}),
      ...(ctx.ipAddress !== undefined ? { ipAddress: ctx.ipAddress } : {}),
      ...(ctx.userAgent !== undefined ? { userAgent: ctx.userAgent } : {}),
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorType: 'user',
        action: AUDIT_ACTIONS.AUTH.LOGIN,
        targetType: 'user',
        targetId: user.id,
        ipAddress: ctx.ipAddress ?? null,
        userAgent: ctx.userAgent ?? null,
      },
    });

    return {
      tokens,
      user: {
        id: user.id,
        email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  // ── Refresh Token ──────────────────────────────────────
  async refreshToken(rawRefreshToken: string, ctx: RequestContext) {
    const refreshTokenHash = sha256Raw(rawRefreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        refreshTokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            emailHash: true,
            isEmailVerified: true,
            status: true,
          },
        },
      },
    });

    if (session === null) {
      throw new AuthError('INVALID_REFRESH_TOKEN', 'Refresh token tidak valid atau sudah kadaluarsa');
    }

    if (session.user.status !== 'active') {
      throw new AuthError('ACCOUNT_INACTIVE', 'Akun tidak aktif');
    }

    // Revoke session lama (token rotation)
    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    // Dapatkan email dari hash (tidak bisa decrypt, gunakan placeholder untuk payload)
    // Di production: decrypt dengan pgcrypto
    const emailPlaceholder = `user_${session.user.id}@internal`;

    // Issue token baru
    const tokens = await this.createSession(
      session.user.id,
      emailPlaceholder,
      session.user.isEmailVerified,
      {
        ...(ctx.ipAddress !== undefined ? { ipAddress: ctx.ipAddress } : {}),
        ...(ctx.userAgent !== undefined ? { userAgent: ctx.userAgent } : {}),
      },
    );

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        actorType: 'user',
        action: AUDIT_ACTIONS.AUTH.REFRESH,
        ipAddress: ctx.ipAddress ?? null,
        userAgent: ctx.userAgent ?? null,
      },
    });

    return { tokens };
  }

  // ── Logout ─────────────────────────────────────────────
  async logout(rawRefreshToken: string) {
    const refreshTokenHash = sha256Raw(rawRefreshToken);

    const session = await this.prisma.session.findFirst({
      where: { refreshTokenHash, revokedAt: null },
      select: { id: true, userId: true },
    });

    if (session === null) {
      // Idempotent logout — tidak error jika token tidak ditemukan
      return;
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorType: 'user',
        action: AUDIT_ACTIONS.AUTH.LOGOUT,
        targetType: 'session',
        targetId: session.id,
      },
    });
  }

  // ── Verify Email ───────────────────────────────────────
  async verifyEmail(rawToken: string) {
    const tokenHash = sha256Raw(rawToken);

    const verification = await this.prisma.emailVerification.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, userId: true },
    });

    if (verification === null) {
      throw new ValidationError('Token verifikasi tidak valid atau sudah kadaluarsa');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: verification.userId },
        data: { isEmailVerified: true },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: verification.userId,
          actorType: 'user',
          action: AUDIT_ACTIONS.AUTH.EMAIL_VERIFY,
          targetType: 'user',
          targetId: verification.userId,
        },
      }),
    ]);

    return { message: 'Email berhasil diverifikasi' };
  }

  // ── Verify Token (internal) ────────────────────────────
  async verifyToken(token: string) {
    try {
      const secret = requireEnv('JWT_SECRET');
      const payload = jwt.verify(token, secret) as JwtPayload;
      return {
        valid: true,
        payload: {
          sub: payload.sub,
          email: payload.email,
          emailVerified: payload.emailVerified,
          iat: payload.iat,
          exp: payload.exp,
        },
      };
    } catch {
      return { valid: false };
    }
  }

  // ── Private helpers ────────────────────────────────────

  private async createSession(
    userId: string,
    email: string,
    emailVerified: boolean,
    opts: {
      deviceFingerprint?: string;
      ipAddress?: string;
      userAgent?: string | undefined;
    },
  ): Promise<TokenPair> {
    const secret = requireEnv('JWT_SECRET');
    const refreshSecret = requireEnv('JWT_REFRESH_SECRET');

    // Access token (15m)
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      emailVerified,
    };

    const accessToken = jwt.sign(payload, secret, {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_EXPIRES_IN,
    });

    // Refresh token (30d)
    const rawRefreshToken = randomBytes(48).toString('hex');
    const refreshTokenHash = sha256Raw(rawRefreshToken);

    const expiresAt = new Date(
      Date.now() + JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
    );

    // Signed refresh token (untuk transport)
    const signedRefreshToken = jwt.sign(
      { sub: userId, jti: rawRefreshToken },
      refreshSecret,
      { expiresIn: `${JWT_REFRESH_EXPIRES_IN_DAYS}d` },
    );

    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        deviceFingerprint: opts.deviceFingerprint ?? null,
        ipAddress: opts.ipAddress ?? null,
        userAgent: opts.userAgent ?? null,
        expiresAt,
      },
    });

    const decoded = jwt.decode(accessToken) as { exp: number };

    return {
      accessToken,
      refreshToken: signedRefreshToken,
      expiresAt: decoded.exp,
      tokenType: 'Bearer' as const satisfies 'Bearer',
    };
  }
}
