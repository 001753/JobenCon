/**
 * Currency Wallet Routes
 * CRUD untuk saldo mata uang fiat.
 */

import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import {
  CreateCurrencyHoldingSchema,
  UpdateCurrencyHoldingSchema,
  CurrencyHoldingIdParamSchema,
} from '@jobencon/shared';
import {
  createCurrencyHolding,
  listCurrencyHoldings,
  getCurrencyHolding,
  updateCurrencyHolding,
  deleteCurrencyHolding,
} from '../services/currency-wallet.service.js';

export async function currencyWalletRoutes(app: FastifyInstance) {
  // ── GET /v1/wallet ─ list semua currency holdings ─────────────────
  app.get('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    const holdings = await listCurrencyHoldings(app.prisma, userId);
    return reply.send({ success: true, data: holdings });
  });

  // ── POST /v1/wallet ─ tambah currency holding ─────────────────────
  app.post('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    let input;
    try {
      input = CreateCurrencyHoldingSchema.parse(request.body);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input tidak valid',
            details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      throw err;
    }

    const userId = request.userId!;
    const holding = await createCurrencyHolding(app.prisma, userId, input);
    return reply.status(201).send({ success: true, data: holding });
  });

  // ── GET /v1/wallet/:holdingId ─ detail holding ────────────────────
  app.get('/:holdingId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { holdingId } = CurrencyHoldingIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const holding = await getCurrencyHolding(app.prisma, userId, holdingId);
    return reply.send({ success: true, data: holding });
  });

  // ── PATCH /v1/wallet/:holdingId ─ update holding ──────────────────
  app.patch('/:holdingId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    let input;
    try {
      input = UpdateCurrencyHoldingSchema.parse(request.body);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input tidak valid',
            details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      throw err;
    }

    const { holdingId } = CurrencyHoldingIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const updated = await updateCurrencyHolding(app.prisma, userId, holdingId, input);
    return reply.send({ success: true, data: updated });
  });

  // ── DELETE /v1/wallet/:holdingId ─ hapus holding ──────────────────
  app.delete('/:holdingId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { holdingId } = CurrencyHoldingIdParamSchema.parse(request.params);
    const userId = request.userId!;
    await deleteCurrencyHolding(app.prisma, userId, holdingId);
    return reply.status(204).send();
  });
}
