import type { ConnectorAdapter } from '@jobencon/shared';

export type { ConnectorAdapter };

/**
 * Registry semua adapter yang tersedia.
 * Import adapter di sini agar mudah ditambah/diubah.
 */
export const ADAPTER_REGISTRY: Map<string, ConnectorAdapter> = new Map();

export function registerAdapter(adapter: ConnectorAdapter): void {
  ADAPTER_REGISTRY.set(adapter.connectorType, adapter);
}

export function getAdapter(connectorType: string): ConnectorAdapter | undefined {
  return ADAPTER_REGISTRY.get(connectorType);
}
