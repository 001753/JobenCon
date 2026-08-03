import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (_req, reply) => {
    // Cek koneksi database
    let dbStatus: 'ok' | 'error' = 'ok';
    try {
      await app.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const status = dbStatus === 'ok' ? 'healthy' : 'degraded';
    const httpStatus = status === 'healthy' ? 200 : 503;

    return reply.status(httpStatus).send({
      status,
      service: 'auth-service',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
      },
    });
  });
}
