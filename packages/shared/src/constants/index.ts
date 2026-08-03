// ============================================================
// JOBEN CONNECT — Application Constants
// ============================================================

// ── JWT ────────────────────────────────────────────────────
export const JWT_ALGORITHM = 'HS256' as const;
export const JWT_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN_DAYS = 30;
export const JWT_REFRESH_EXPIRES_IN = '30d';

// ── Auth ───────────────────────────────────────────────────
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;
export const BCRYPT_ROUNDS = 12;

/** Token email verification berlaku 24 jam */
export const EMAIL_VERIFICATION_EXPIRES_HOURS = 24;

/** Token password reset berlaku 1 jam */
export const PASSWORD_RESET_EXPIRES_HOURS = 1;

// ── Rate Limiting ──────────────────────────────────────────
export const RATE_LIMIT = {
  /** Auth endpoints — lebih ketat */
  AUTH: {
    MAX: 10,
    WINDOW_MS: 60_000, // 1 menit
  },
  /** Endpoint publik biasa */
  GENERAL: {
    MAX: 100,
    WINDOW_MS: 60_000, // 1 menit
  },
  /** API key (developer) */
  API_KEY: {
    HOURLY: 1000,
    DAILY: 10_000,
  },
} as const;

// ── Asset Categories ───────────────────────────────────────
export const ASSET_CATEGORIES = [
  'CRYPTO',
  'STOCKS',
  'GOLD',
  'CURRENCY',
  'MUTUAL_FUND',
  'OTHER',
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

// ── Subscription Plans ─────────────────────────────────────
export const PLAN_NAMES = ['free', 'starter', 'pro', 'business'] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

// ── User Status ────────────────────────────────────────────
export const USER_STATUS = ['active', 'suspended', 'deleted'] as const;
export type UserStatusType = (typeof USER_STATUS)[number];

// ── Connector Status ───────────────────────────────────────
export const CONNECTOR_STATUS = ['active', 'error', 'paused', 'revoked'] as const;
export type ConnectorStatusType = (typeof CONNECTOR_STATUS)[number];

// ── Connector Tiers ────────────────────────────────────────
export const CONNECTOR_TIERS = ['TIER_1', 'TIER_2', 'TIER_3', 'COMMUNITY'] as const;
export type ConnectorTier = (typeof CONNECTOR_TIERS)[number];

// ── Audit Log Actions ──────────────────────────────────────
export const AUDIT_ACTIONS = {
  AUTH: {
    REGISTER: 'auth:register',
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    REFRESH: 'auth:refresh',
    EMAIL_VERIFY: 'auth:email_verify',
    PASSWORD_RESET_REQUEST: 'auth:password_reset_request',
    PASSWORD_RESET: 'auth:password_reset',
    MFA_ENROLL: 'auth:mfa_enroll',
    MFA_VERIFY: 'auth:mfa_verify',
  },
  USER: {
    UPDATE: 'user:update',
    DELETE: 'user:delete',
  },
  CONNECTOR: {
    ADD: 'connector:add',
    REMOVE: 'connector:remove',
    SYNC: 'connector:sync',
  },
  MANUAL_ASSET: {
    CREATE: 'manual_asset:create',
    UPDATE: 'manual_asset:update',
    DELETE: 'manual_asset:delete',
  },
  API_KEY: {
    CREATE: 'api_key:create',
    REVOKE: 'api_key:revoke',
  },
} as const;

// ── HTTP Status Messages ───────────────────────────────────
export const HTTP_MESSAGES = {
  OK: 'OK',
  CREATED: 'Created',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  TOO_MANY_REQUESTS: 'Too Many Requests',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
} as const;

// ── Service Ports ──────────────────────────────────────────
export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  AUTH_SERVICE: 3001,
} as const;
