/**
 * Connector Service
 * CRUD untuk exchange connectors.
 */

import type { PrismaClient } from '@prisma/client';
import { ConflictError, NotFoundError, ValidationError, SUPPORTED_CONNECTORS } from '@jobencon/shared';
import type { AddConnectorInput, PublicConnector, ConnectorCatalogItem } from '@jobencon/shared';
import { getAdapter } from '../adapters/connector.interface.js';
import { storeCredentials, deleteCredentials } from './vault.service.js';

function toPublicConnector(c: {
  id: string;
  connectorType: string;
  connectorTier: string;
  status: string;
  lastSyncAt: Date | null;
  lastSyncStatus: string | null;
  createdAt: Date;
  _count?: { holdings: number };
}): PublicConnector {
  return {
    id: c.id,
    connectorType: c.connectorType as PublicConnector['connectorType'],
    connectorTier: c.connectorTier,
    status: c.status,
    lastSyncAt: c.lastSyncAt,
    lastSyncStatus: c.lastSyncStatus,
    createdAt: c.createdAt,
    holdingsCount: c._count?.holdings ?? undefined,
  };
}

export async function addConnector(
  prisma: PrismaClient,
  userId: string,
  input: AddConnectorInput,
): Promise<PublicConnector> {
  // Cek duplikat
  const existing = await prisma.connector.findFirst({
    where: { userId, connectorType: input.connectorType },
  });

  if (existing !== null) {
    throw new ConflictError(
      'CONNECTOR_EXISTS',
      `Connector ${input.connectorType} sudah terhubung. Hapus yang lama terlebih dahulu.`,
    );
  }

  // Validasi credentials ke exchange
  const adapter = getAdapter(input.connectorType);
  if (adapter === undefined) {
    throw new ValidationError(
      'UNSUPPORTED_CONNECTOR',
      `Connector ${input.connectorType} belum didukung`,
    );
  }

  const credentials = {
    apiKey: input.apiKey,
    apiSecret: input.apiSecret,
    passphrase: input.passphrase,
  };

  const validationResult = await adapter.validateCredentials(credentials);
  if (!validationResult.valid) {
    throw new ValidationError(
      'INVALID_CREDENTIALS',
      `Kredensial tidak valid: ${validationResult.error ?? 'Gagal terhubung ke exchange'}`,
    );
  }

  // Simpan credentials ke vault
  const credentialRef = await storeCredentials(prisma, userId, credentials);

  const connectorMeta = SUPPORTED_CONNECTORS[input.connectorType as keyof typeof SUPPORTED_CONNECTORS];

  // Buat connector
  const connector = await prisma.connector.create({
    data: {
      userId,
      connectorType: input.connectorType,
      connectorTier: connectorMeta.tier,
      connectorClass: 'OFFICIAL_API',
      credentialRef,
      status: 'active',
      syncIntervalSec: 300,
    },
    include: { _count: { select: { holdings: true } } },
  });

  return toPublicConnector(connector);
}

export async function listConnectors(
  prisma: PrismaClient,
  userId: string,
): Promise<PublicConnector[]> {
  const connectors = await prisma.connector.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { holdings: true } } },
  });

  return connectors.map(toPublicConnector);
}

export async function getConnector(
  prisma: PrismaClient,
  userId: string,
  connectorId: string,
): Promise<PublicConnector> {
  const connector = await prisma.connector.findFirst({
    where: { id: connectorId, userId },
    include: { _count: { select: { holdings: true } } },
  });

  if (connector === null) {
    throw new NotFoundError('CONNECTOR_NOT_FOUND', 'Connector tidak ditemukan');
  }

  return toPublicConnector(connector);
}

export async function removeConnector(
  prisma: PrismaClient,
  userId: string,
  connectorId: string,
): Promise<void> {
  const connector = await prisma.connector.findFirst({
    where: { id: connectorId, userId },
  });

  if (connector === null) {
    throw new NotFoundError('CONNECTOR_NOT_FOUND', 'Connector tidak ditemukan');
  }

  // Hapus credentials dari vault
  await deleteCredentials(prisma, connector.credentialRef, userId);

  // Hapus connector (cascade akan hapus holdings + sync_log)
  await prisma.connector.delete({ where: { id: connectorId } });
}

export async function getConnectorCatalog(): Promise<ConnectorCatalogItem[]> {
  return Object.entries(SUPPORTED_CONNECTORS).map(([type, meta]) => ({
    connectorType: type as ConnectorCatalogItem['connectorType'],
    displayName: meta.displayName,
    tier: meta.tier,
    description: meta.description,
    requiredFields: [...meta.requiredFields],
  }));
}

export async function getConnectorHoldings(
  prisma: PrismaClient,
  userId: string,
  connectorId: string,
) {
  // Verifikasi ownership
  const connector = await prisma.connector.findFirst({
    where: { id: connectorId, userId },
  });

  if (connector === null) {
    throw new NotFoundError('CONNECTOR_NOT_FOUND', 'Connector tidak ditemukan');
  }

  return prisma.connectorHolding.findMany({
    where: { connectorId, userId },
    orderBy: [{ assetCategory: 'asc' }, { assetIdentifier: 'asc' }],
  });
}
