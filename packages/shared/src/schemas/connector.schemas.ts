import { z } from 'zod';

// ── Connector Types ─────────────────────────────────────────────
export const SUPPORTED_CONNECTOR_TYPES = ['binance', 'bybit', 'indodax'] as const;
export type SupportedConnectorType = (typeof SUPPORTED_CONNECTOR_TYPES)[number];

// ── Add Connector ───────────────────────────────────────────────
export const AddConnectorSchema = z.object({
  connectorType: z.enum(SUPPORTED_CONNECTOR_TYPES, {
    errorMap: () => ({
      message: `connectorType harus salah satu dari: ${SUPPORTED_CONNECTOR_TYPES.join(', ')}`,
    }),
  }),
  apiKey: z
    .string()
    .min(8, 'API key minimal 8 karakter')
    .max(256, 'API key maksimal 256 karakter'),
  apiSecret: z
    .string()
    .min(8, 'API secret minimal 8 karakter')
    .max(512, 'API secret maksimal 512 karakter'),
  /** Passphrase untuk exchange yang membutuhkan (e.g. OKX). Opsional. */
  passphrase: z.string().max(128).optional(),
  label: z.string().max(100).optional(),
});

export type AddConnectorInput = z.infer<typeof AddConnectorSchema>;

// ── Remove Connector ────────────────────────────────────────────
export const ConnectorIdParamSchema = z.object({
  connectorId: z.string().uuid('connectorId harus berupa UUID yang valid'),
});

export type ConnectorIdParam = z.infer<typeof ConnectorIdParamSchema>;
