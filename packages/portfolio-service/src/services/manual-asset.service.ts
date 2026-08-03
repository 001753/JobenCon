/**
 * Manual Asset Service
 * CRUD untuk aset yang diinput secara manual (saham, emas, kripto OTC, dll).
 */

import type { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@jobencon/shared';
import type { CreateManualAssetInput, UpdateManualAssetInput } from '@jobencon/shared';

export async function createManualAsset(
  prisma: PrismaClient,
  userId: string,
  input: CreateManualAssetInput,
) {
  return prisma.manualAsset.create({
    data: {
      userId,
      category: input.category,
      assetIdentifier: input.assetIdentifier ?? null,
      label: input.label ?? null,
      quantity: input.quantity,
      unit: input.unit ?? null,
      avgBuyPrice: input.avgBuyPrice ?? null,
      avgBuyPriceCurrency: input.avgBuyPriceCurrency ?? 'IDR',
      notes: input.notes ?? null,
    },
  });
}

export async function listManualAssets(
  prisma: PrismaClient,
  userId: string,
  category?: string,
) {
  return prisma.manualAsset.findMany({
    where: {
      userId,
      ...(category !== undefined ? { category } : {}),
    },
    orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getManualAsset(
  prisma: PrismaClient,
  userId: string,
  assetId: string,
) {
  const asset = await prisma.manualAsset.findFirst({
    where: { id: assetId, userId },
  });

  if (asset === null) {
    throw new NotFoundError('ASSET_NOT_FOUND', 'Aset tidak ditemukan');
  }

  return asset;
}

export async function updateManualAsset(
  prisma: PrismaClient,
  userId: string,
  assetId: string,
  input: UpdateManualAssetInput,
) {
  // Verifikasi ownership
  await getManualAsset(prisma, userId, assetId);

  return prisma.manualAsset.update({
    where: { id: assetId },
    data: {
      ...(input.category !== undefined && { category: input.category }),
      ...(input.assetIdentifier !== undefined && { assetIdentifier: input.assetIdentifier }),
      ...(input.label !== undefined && { label: input.label }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
      ...(input.unit !== undefined && { unit: input.unit }),
      ...(input.avgBuyPrice !== undefined && { avgBuyPrice: input.avgBuyPrice }),
      ...(input.avgBuyPriceCurrency !== undefined && {
        avgBuyPriceCurrency: input.avgBuyPriceCurrency,
      }),
      ...(input.notes !== undefined && { notes: input.notes }),
    },
  });
}

export async function deleteManualAsset(
  prisma: PrismaClient,
  userId: string,
  assetId: string,
): Promise<void> {
  // Verifikasi ownership
  await getManualAsset(prisma, userId, assetId);

  await prisma.manualAsset.delete({ where: { id: assetId } });
}
