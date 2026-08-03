import type { SupportedConnectorType } from '../schemas/connector.schemas.js';

// ── UDS (Universal Data Standard) ───────────────────────────────
/** Format kanonik untuk holding aset setelah normalisasi dari sumber manapun */
export interface UdsHolding {
  /** BTC | ETH | BBCA | IDR | dll */
  assetIdentifier: string;
  /** CRYPTO | STOCKS | GOLD | CURRENCY | MUTUAL_FUND */
  assetCategory: string;
  /** Jumlah yang dimiliki */
  quantity: number;
  /** Harga beli rata-rata (opsional — tidak semua exchange menyediakan) */
  avgBuyPrice?: number;
  /** Mata uang harga beli: IDR | USDT | USD */
  avgBuyCurrency?: string;
  /** Data mentah dari exchange sebelum normalisasi */
  rawData?: Record<string, unknown>;
}

// ── Connector Adapter Interface ──────────────────────────────────
export interface ConnectorCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
}

export interface ConnectorAdapterResult {
  success: boolean;
  holdings: UdsHolding[];
  errorCode?: string;
  errorMessage?: string;
  /** Waktu saat fetch dilakukan */
  fetchedAt: Date;
}

export interface ConnectorAdapter {
  readonly connectorType: SupportedConnectorType;
  readonly tier: 'TIER_1' | 'TIER_2';
  /** Validasi credential (test koneksi ke exchange tanpa fetch data penuh) */
  validateCredentials(credentials: ConnectorCredentials): Promise<{ valid: boolean; error?: string }>;
  /** Fetch semua holdings dari exchange */
  fetchHoldings(credentials: ConnectorCredentials): Promise<ConnectorAdapterResult>;
}

// ── Public Connector (tanpa credential) ─────────────────────────
export interface PublicConnector {
  id: string;
  connectorType: SupportedConnectorType;
  connectorTier: string;
  status: string;
  lastSyncAt: Date | null;
  lastSyncStatus: string | null;
  createdAt: Date;
  holdingsCount?: number;
}

// ── Sync Result ──────────────────────────────────────────────────
export interface SyncResult {
  connectorId: string;
  connectorType: string;
  success: boolean;
  assetsSynced: number;
  durationMs: number;
  errorCode?: string;
  errorMessage?: string;
}

// ── Connector Catalog (metadata tentang connector yang tersedia) ──
export interface ConnectorCatalogItem {
  connectorType: SupportedConnectorType;
  displayName: string;
  tier: 'TIER_1' | 'TIER_2';
  description: string;
  logoUrl?: string;
  requiredFields: ('apiKey' | 'apiSecret' | 'passphrase')[];
  documentationUrl?: string;
}
