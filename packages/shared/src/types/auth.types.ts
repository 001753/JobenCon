// ── Auth Response Types ────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Access token expiry (Unix timestamp) */
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface RegisterResponse {
  user: AuthUser;
  message: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  payload?: {
    sub: string;
    email: string;
    emailVerified: boolean;
    iat: number;
    exp: number;
  };
}
