/**
 * Auth Service — Entry point
 * Bertanggung jawab: registrasi, login, JWT, refresh token, email verification
 */

import { buildApp } from './app.js';

const PORT = parseInt(process.env['AUTH_SERVICE_PORT'] ?? '3001', 10);
const HOST = process.env['AUTH_SERVICE_HOST'] ?? '0.0.0.0';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.info(`🔐 Auth Service running on http://${HOST}:${PORT}`);
    console.info(`   Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

await main();
