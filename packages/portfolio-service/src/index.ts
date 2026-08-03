import { buildApp } from './app.js';
import { ADAPTER_REGISTRY, registerAdapter } from './adapters/connector.interface.js';
import { binanceAdapter } from './adapters/binance.adapter.js';
import { bybitAdapter } from './adapters/bybit.adapter.js';
import { indodaxAdapter } from './adapters/indodax.adapter.js';

// ── Register semua adapter ────────────────────────────────────────
registerAdapter(binanceAdapter);
registerAdapter(bybitAdapter);
registerAdapter(indodaxAdapter);

const PORT = parseInt(process.env['PORTFOLIO_SERVICE_PORT'] ?? '3002', 10);
const HOST = process.env['PORTFOLIO_SERVICE_HOST'] ?? '0.0.0.0';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`💼 Portfolio Service running on http://${HOST}:${PORT}`);
    console.log(`   Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
    console.log(`   Adapters registered: ${Array.from(ADAPTER_REGISTRY.keys()).join(', ')}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
