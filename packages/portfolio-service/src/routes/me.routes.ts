/**
 * Me Routes
 * Profil user dan info akun.
 */

import type { FastifyInstance } from 'fastify';

export async function meRoutes(app: FastifyInstance) {
  // ── GET /v1/me ─ profil user ──────────────────────────────────────
  app.get('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;

    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        isEmailVerified: true,
        mfaEnabled: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            plan: { select: { name: true, displayName: true } },
            status: true,
            currentPeriodEnd: true,
          },
        },
        _count: {
          select: {
            connectors: { where: { status: 'active' } },
            manualAssets: true,
            currencyHoldings: true,
          },
        },
      },
    });

    if (user === null) {
      return reply.status(404).send({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User tidak ditemukan' },
      });
    }

    return reply.send({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
        status: user.status,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        subscription: user.subscriptions[0] ?? null,
        stats: {
          connectors: user._count.connectors,
          manualAssets: user._count.manualAssets,
          currencyHoldings: user._count.currencyHoldings,
        },
      },
    });
  });
}
