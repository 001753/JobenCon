/**
 * Manual Asset Routes
 * CRUD untuk aset yang diinput manual.
 */

import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { CreateManualAssetSchema, UpdateManualAssetSchema, AssetIdParamSchema } from '@jobencon/shared';
import {
  createManualAsset,
  listManualAssets,
  getManualAsset,
  updateManualAsset,
  deleteManualAsset,
} from '../services/manual-asset.service.js';

export async function manualAssetRoutes(app: FastifyInstance) {
  // ── GET /v1/assets ─ list semua manual assets ─────────────────────
  app.get('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    const query = request.query as { category?: string };
    const assets = await listManualAssets(app.prisma, userId, query.category);
    return reply.send({ success: true, data: assets });
  });

  // ── POST /v1/assets ─ tambah manual asset ─────────────────────────
  app.post('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    let input;
    try {
      input = CreateManualAssetSchema.parse(request.body);
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
    const asset = await createManualAsset(app.prisma, userId, input);
    return reply.status(201).send({ success: true, data: asset });
  });

  // ── GET /v1/assets/:assetId ─ detail asset ────────────────────────
  app.get('/:assetId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { assetId } = AssetIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const asset = await getManualAsset(app.prisma, userId, assetId);
    return reply.send({ success: true, data: asset });
  });

  // ── PATCH /v1/assets/:assetId ─ update asset ──────────────────────
  app.patch('/:assetId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    let input;
    try {
      input = UpdateManualAssetSchema.parse(request.body);
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

    const { assetId } = AssetIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const updated = await updateManualAsset(app.prisma, userId, assetId, input);
    return reply.send({ success: true, data: updated });
  });

  // ── DELETE /v1/assets/:assetId ─ hapus asset ──────────────────────
  app.delete('/:assetId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { assetId } = AssetIdParamSchema.parse(request.params);
    const userId = request.userId!;
    await deleteManualAsset(app.prisma, userId, assetId);
    return reply.status(204).send();
  });
}
