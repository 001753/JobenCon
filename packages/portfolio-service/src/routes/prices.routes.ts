/**
 * Price Routes
 * Endpoint untuk harga aset terkini.
 */

import type { FastifyInstance } from 'fastify';
import { getPrice, getPricesBatch } from '../services/price.service.js';

export async function priceRoutes(app: FastifyInstance) {
  // ── GET /v1/prices/:identifier?category=CRYPTO ─ harga satu aset ──
  app.get('/:identifier', async (request, reply) => {
    const { identifier } = request.params as { identifier: string };
    const query = request.query as { category?: string };
    const category = (query.category ?? 'CRYPTO').toUpperCase();

    const price = await getPrice(app.prisma, identifier.toUpperCase(), category);

    if (price === null) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'PRICE_NOT_FOUND',
          message: `Harga untuk ${identifier} (${category}) tidak tersedia`,
        },
      });
    }

    return reply.send({ success: true, data: price });
  });

  // ── POST /v1/prices/batch ─ harga banyak aset sekaligus ───────────
  app.post('/batch', async (request, reply) => {
    const body = request.body as {
      assets?: Array<{ identifier: string; category?: string }>;
    };

    if (!Array.isArray(body.assets) || body.assets.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'assets harus berupa array yang tidak kosong' },
      });
    }

    if (body.assets.length > 50) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Maksimal 50 aset per request' },
      });
    }

    const requests = body.assets.map((a) => ({
      identifier: a.identifier.toUpperCase(),
      category: (a.category ?? 'CRYPTO').toUpperCase(),
    }));

    const pricesMap = await getPricesBatch(app.prisma, requests);
    const result: Record<string, unknown> = {};
    for (const [key, price] of pricesMap) {
      result[key] = price;
    }

    return reply.send({ success: true, data: result });
  });
}
