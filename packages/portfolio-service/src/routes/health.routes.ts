import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    let dbStatus = 'ok';
    try {
      await app.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const status = dbStatus === 'ok' ? 'healthy' : 'degraded';
    return reply.status(dbStatus === 'ok' ? 200 : 503).send({
      status,
      service: 'portfolio-service',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      checks: { database: dbStatus },
    });
  });
}
