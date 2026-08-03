import { z } from 'zod';
import { ASSET_CATEGORIES } from '../constants/index.js';

// ── Manual Asset ─────────────────────────────────────────────────
export const CreateManualAssetSchema = z.object({
  category: z.enum(ASSET_CATEGORIES, {
    errorMap: () => ({ message: `category harus salah satu dari: ${ASSET_CATEGORIES.join(', ')}` }),
  }),
  assetIdentifier: z.string().max(50).optional(),
  label: z.string().max(200).optional(),
  quantity: z
    .number()
    .positive('quantity harus lebih dari 0')
    .finite('quantity harus berupa angka yang valid'),
  unit: z.string().max(20).optional(),
  avgBuyPrice: z.number().nonnegative().finite().optional(),
  avgBuyPriceCurrency: z.string().length(3).toUpperCase().default('IDR'),
  notes: z.string().max(500).optional(),
});

export type CreateManualAssetInput = z.infer<typeof CreateManualAssetSchema>;

export const UpdateManualAssetSchema = CreateManualAssetSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Minimal satu field harus diisi' },
);

export type UpdateManualAssetInput = z.infer<typeof UpdateManualAssetSchema>;

export const AssetIdParamSchema = z.object({
  assetId: z.string().uuid('assetId harus berupa UUID yang valid'),
});

// ── Currency Wallet ───────────────────────────────────────────────
export const CreateCurrencyHoldingSchema = z.object({
  currencyCode: z
    .string()
    .length(3, 'currencyCode harus 3 karakter ISO 4217')
    .toUpperCase(),
  amount: z
    .number()
    .nonnegative('amount tidak boleh negatif')
    .finite('amount harus berupa angka yang valid'),
  label: z.string().max(100).optional(),
});

export type CreateCurrencyHoldingInput = z.infer<typeof CreateCurrencyHoldingSchema>;

export const UpdateCurrencyHoldingSchema = z.object({
  amount: z.number().nonnegative().finite().optional(),
  label: z.string().max(100).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Minimal satu field harus diisi',
});

export type UpdateCurrencyHoldingInput = z.infer<typeof UpdateCurrencyHoldingSchema>;

export const CurrencyHoldingIdParamSchema = z.object({
  holdingId: z.string().uuid('holdingId harus berupa UUID yang valid'),
});
