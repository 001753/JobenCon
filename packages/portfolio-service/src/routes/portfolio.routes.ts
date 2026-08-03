/**
 * Portfolio Routes
 * Endpoint untuk kalkulasi net worth, history, dan asset breakdown.
 */

import type { FastifyInstance } from 'fastify';
import { computePortfolio, computeAndSaveSnapshot, getPortfolioHistory } from '../services/portfolio.service.js';

export async function portfolioRoutes(app: FastifyInstance) {
  // ── GET /v1/portfolio ─ portfolio snapshot terkini ────────────────
  app.get('/', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    // Compute real-time (tidak disimpan)
    const portfolio = await computePortfolio(app.prisma, userId);
    return reply.send({ success: true, data: portfolio });
  });

  // ── POST /v1/portfolio/snapshot ─ compute + simpan snapshot ──────
  app.post('/snapshot', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    const snapshot = await computeAndSaveSnapshot(app.prisma, userId);
    return reply.status(201).send({ success: true, data: snapshot });
  });

  // ── GET /v1/portfolio/history ─ net worth history ─────────────────
  app.get('/history', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    const query = request.query as { days?: string };
    const days = query.days !== undefined ? parseInt(query.days, 10) : 30;
    const history = await getPortfolioHistory(app.prisma, userId, days);
    return reply.send({ success: true, data: history });
  });

  // ── GET /v1/portfolio/assets ─ daftar semua aset dalam portfolio ──
  app.get('/assets', {
    preHandler: [app.verifyJwt],
  }, async (request, reply) => {
    const userId = request.userId!;
    const portfolio = await computePortfolio(app.prisma, userId);

    // Flatten semua aset dari semua kategori
    const allAssets = portfolio.categories.flatMap((cat) => cat.assets);
    return reply.send({ success: true, data: allAssets });
  });
}
