/**
 * Currency Wallet Service
 * CRUD untuk saldo mata uang fiat.
 */

import type { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '@jobencon/shared';
import type { CreateCurrencyHoldingInput, UpdateCurrencyHoldingInput } from '@jobencon/shared';

export async function createCurrencyHolding(
  prisma: PrismaClient,
  userId: string,
  input: CreateCurrencyHoldingInput,
) {
  // Cek duplikat (userId + currencyCode + label)
  const label = input.label ?? null;
  const existing = await prisma.currencyHolding.findFirst({
    where: { userId, currencyCode: input.currencyCode, label },
  });

  if (existing !== null) {
    throw new ConflictError(
      'CURRENCY_HOLDING_EXISTS',
      `Entri ${input.currencyCode}${label !== null ? ` (${label})` : ''} sudah ada. Gunakan update untuk mengubah jumlahnya.`,
    );
  }

  return prisma.currencyHolding.create({
    data: {
      userId,
      currencyCode: input.currencyCode,
      amount: input.amount,
      label: input.label ?? null,
    },
  });
}

export async function listCurrencyHoldings(
  prisma: PrismaClient,
  userId: string,
) {
  return prisma.currencyHolding.findMany({
    where: { userId },
    orderBy: [{ currencyCode: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getCurrencyHolding(
  prisma: PrismaClient,
  userId: string,
  holdingId: string,
) {
  const holding = await prisma.currencyHolding.findFirst({
    where: { id: holdingId, userId },
  });

  if (holding === null) {
    throw new NotFoundError('CURRENCY_HOLDING_NOT_FOUND', 'Currency holding tidak ditemukan');
  }

  return holding;
}

export async function updateCurrencyHolding(
  prisma: PrismaClient,
  userId: string,
  holdingId: string,
  input: UpdateCurrencyHoldingInput,
) {
  await getCurrencyHolding(prisma, userId, holdingId);

  return prisma.currencyHolding.update({
    where: { id: holdingId },
    data: {
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.label !== undefined && { label: input.label }),
    },
  });
}

export async function deleteCurrencyHolding(
  prisma: PrismaClient,
  userId: string,
  holdingId: string,
): Promise<void> {
  await getCurrencyHolding(prisma, userId, holdingId);
  await prisma.currencyHolding.delete({ where: { id: holdingId } });
}
