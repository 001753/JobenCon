import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  // Health check publik — tidak perlu auth
  app.get('/health', async (_req, reply) => {
    return reply.status(200).send({
      status: 'healthy',
      service: 'api-gateway',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    });
  });

  // Root
  app.get('/', async (_req, reply) => {
    return reply.status(200).send({
      service: 'Joben Connect API Gateway',
      version: '0.1.0',
      docs: '/docs',
      health: '/health',
    });
  });
}
