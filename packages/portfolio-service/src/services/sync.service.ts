/**
 * Connector Sync Service
 * Mengambil holdings dari exchange dan menyimpannya ke DB.
 * Phase 1: synchronous, on-demand atau dijadwalkan via node-cron.
 * Phase 2: migrasi ke BullMQ untuk async job queue.
 */

import type { PrismaClient } from '@prisma/client';

import type { SyncResult } from '@jobencon/shared';
import { getAdapter } from '../adapters/connector.interface.js';
import { retrieveCredentials } from './vault.service.js';

export async function syncConnector(
  prisma: PrismaClient,
  connectorId: string,
  userId: string,
): Promise<SyncResult> {
  const startedAt = new Date();

  // Ambil connector
  const connector = await prisma.connector.findFirst({
    where: { id: connectorId, userId },
  });

  if (connector === null) {
    return {
      connectorId,
      connectorType: 'unknown',
      success: false,
      assetsSynced: 0,
      durationMs: 0,
      errorCode: 'CONNECTOR_NOT_FOUND',
      errorMessage: 'Connector tidak ditemukan',
    };
  }

  if (connector.status === 'paused' || connector.status === 'revoked') {
    return {
      connectorId,
      connectorType: connector.connectorType,
      success: false,
      assetsSynced: 0,
      durationMs: 0,
      errorCode: 'CONNECTOR_INACTIVE',
      errorMessage: `Connector dalam status ${connector.status}`,
    };
  }

  const adapter = getAdapter(connector.connectorType);
  if (adapter === undefined) {
    return {
      connectorId,
      connectorType: connector.connectorType,
      success: false,
      assetsSynced: 0,
      durationMs: Date.now() - startedAt.getTime(),
      errorCode: 'ADAPTER_NOT_FOUND',
      errorMessage: `Adapter untuk ${connector.connectorType} tidak tersedia`,
    };
  }

  // Ambil credentials dari vault
  let credentials;
  try {
    credentials = await retrieveCredentials(prisma, connector.credentialRef, userId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    await updateConnectorAfterSync(prisma, connectorId, 'failed', 'VAULT_ERROR', msg);
    return {
      connectorId,
      connectorType: connector.connectorType,
      success: false,
      assetsSynced: 0,
      durationMs: Date.now() - startedAt.getTime(),
      errorCode: 'VAULT_ERROR',
      errorMessage: msg,
    };
  }

  // Fetch holdings dari exchange
  const result = await adapter.fetchHoldings(credentials);
  const durationMs = Date.now() - startedAt.getTime();

  if (!result.success) {
    await updateConnectorAfterSync(
      prisma,
      connectorId,
      'failed',
      result.errorCode,
      result.errorMessage,
    );
    await prisma.syncLog.create({
      data: {
        connectorId,
        startedAt,
        completedAt: new Date(),
        status: 'failed',
        assetsSynced: 0,
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        durationMs,
      },
    });

    return {
      connectorId,
      connectorType: connector.connectorType,
      success: false,
      assetsSynced: 0,
      durationMs,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
    };
  }

  // Upsert holdings — hapus yang lama, insert yang baru
  await prisma.$transaction(async (tx) => {
    // Hapus holdings lama
    await tx.connectorHolding.deleteMany({ where: { connectorId } });

    // Insert holdings baru
    if (result.holdings.length > 0) {
      await tx.connectorHolding.createMany({
        data: result.holdings.map((h) => ({
          connectorId,
          userId,
          assetIdentifier: h.assetIdentifier,
          assetCategory: h.assetCategory,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice ?? null,
          avgBuyCurrency: h.avgBuyCurrency ?? null,
          syncedAt: result.fetchedAt,
          rawData: h.rawData ?? null,
        })),
      });
    }
  });

  await updateConnectorAfterSync(prisma, connectorId, 'success');
  await prisma.syncLog.create({
    data: {
      connectorId,
      startedAt,
      completedAt: new Date(),
      status: 'success',
      assetsSynced: result.holdings.length,
      durationMs,
    },
  });

  return {
    connectorId,
    connectorType: connector.connectorType,
    success: true,
    assetsSynced: result.holdings.length,
    durationMs,
  };
}

async function updateConnectorAfterSync(
  prisma: PrismaClient,
  connectorId: string,
  status: 'success' | 'partial' | 'failed',
  errorCode?: string,
  errorMessage?: string,
) {
  await prisma.connector.update({
    where: { id: connectorId },
    data: {
      lastSyncAt: new Date(),
      lastSyncStatus: status,
      lastSyncError: errorMessage ?? null,
      status: status === 'failed' ? 'error' : 'active',
    },
  });
}
