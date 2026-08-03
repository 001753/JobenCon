/**
 * Connector Routes
 * Semua endpoint butuh autentikasi (verifyJwt).
 */

import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AddConnectorSchema, ConnectorIdParamSchema } from '@jobencon/shared';
import {
  addConnector,
  listConnectors,
  getConnector,
  removeConnector,
  getConnectorCatalog,
  getConnectorHoldings,
} from '../services/connector.service.js';
import { syncConnector } from '../services/sync.service.js';

export async function connectorRoutes(app: FastifyInstance) {
  // ── GET /v1/connectors/catalog ─ daftar connector yang tersedia ──
  app.get('/catalog', async (_request, reply) => {
    const catalog = await getConnectorCatalog();
    return reply.send({ success: true, data: catalog });
  });

  // ── GET /v1/connectors ─ list connector milik user ───────────────
  app.get('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    const connectors = await listConnectors(app.prisma, userId);
    return reply.send({ success: true, data: connectors });
  });

  // ── POST /v1/connectors ─ tambah connector baru ──────────────────
  app.post('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    let input;
    try {
      input = AddConnectorSchema.parse(request.body);
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
    const connector = await addConnector(app.prisma, userId, input);
    return reply.status(201).send({ success: true, data: connector });
  });

  // ── GET /v1/connectors/:connectorId ─ detail connector ───────────
  app.get('/:connectorId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { connectorId } = ConnectorIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const connector = await getConnector(app.prisma, userId, connectorId);
    return reply.send({ success: true, data: connector });
  });

  // ── DELETE /v1/connectors/:connectorId ─ hapus connector ─────────
  app.delete('/:connectorId', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { connectorId } = ConnectorIdParamSchema.parse(request.params);
    const userId = request.userId!;
    await removeConnector(app.prisma, userId, connectorId);
    return reply.status(204).send();
  });

  // ── POST /v1/connectors/:connectorId/sync ─ trigger manual sync ──
  app.post('/:connectorId/sync', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { connectorId } = ConnectorIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const result = await syncConnector(app.prisma, connectorId, userId);

    if (!result.success) {
      return reply.status(502).send({
        success: false,
        error: {
          code: result.errorCode ?? 'SYNC_FAILED',
          message: result.errorMessage ?? 'Sync gagal',
        },
        data: result,
      });
    }

    return reply.send({ success: true, data: result });
  });

  // ── GET /v1/connectors/:connectorId/holdings ─ holdings dari connector ──
  app.get('/:connectorId/holdings', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const { connectorId } = ConnectorIdParamSchema.parse(request.params);
    const userId = request.userId!;
    const holdings = await getConnectorHoldings(app.prisma, userId, connectorId);
    return reply.send({ success: true, data: holdings });
  });
}
