/**
 * API Gateway (BFF — Backend for Frontend)
 * Single entry point untuk semua request eksternal.
 * Bertanggung jawab: auth verification, rate limiting, routing ke internal services.
 */

import { buildApp } from './app.js';

const PORT = parseInt(process.env['API_GATEWAY_PORT'] ?? '3000', 10);
const HOST = process.env['API_GATEWAY_HOST'] ?? '0.0.0.0';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.info(`🌐 API Gateway running on http://${HOST}:${PORT}`);
    console.info(`   Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
    console.info(`   Auth Service: ${process.env['AUTH_SERVICE_URL'] ?? 'http://localhost:3001'}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

await main();
