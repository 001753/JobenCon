---
name: Phase 0 setup & TypeScript quirks
description: Durable lessons from getting auth-service + api-gateway running on Replit — Prisma Bytes typing, $transaction parameter type, env var layout.
---

# Phase 0 Setup — Durable Lessons

## Prisma Bytes field requires `Uint8Array<ArrayBuffer>`, not `Buffer`

**Rule:** When writing to a Prisma `Bytes` field, do not pass a `Buffer` directly. TypeScript will reject it because `Buffer.buffer` is `ArrayBufferLike`, not `ArrayBuffer`.

**Fix:**
```typescript
const buf = Buffer.from(data);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
return new Uint8Array(ab); // return type: Uint8Array<ArrayBuffer>
```

**Why:** Prisma v6 types `Bytes` as `Uint8Array<ArrayBuffer>`. Node's `Buffer` has `buffer: ArrayBufferLike` (could be `SharedArrayBuffer`). The `slice()` copy always produces a plain `ArrayBuffer`.

## Prisma `$transaction` callback — use `Prisma.TransactionClient`

**Rule:** Type the transaction callback parameter as `Prisma.TransactionClient`, not `typeof this.prisma`.

```typescript
import { Prisma, PrismaClient } from '@prisma/client';
// ...
await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => { ... });
```

**Why:** `typeof this.prisma` includes `$connect`, `$disconnect`, `$on`, `$transaction`, `$extends` which are stripped from the transaction client. TypeScript overload resolution falls back to the array form and the callback result loses its type.

## Environment variable layout

All non-secret env vars are set via `setEnvVars({ environment: "shared" })`. Secrets via `requestSecrets`.

**Secrets needed at runtime:**
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — JWT signing (min 32 chars)
- `AUTH_SERVICE_INTERNAL_SECRET` — API Gateway → Auth Service internal calls
- `SESSION_SECRET` — session signing
- `DATABASE_URL` — runtime-managed by Replit (do not set manually)

**Non-secrets already set in shared:**
`API_GATEWAY_HOST`, `API_GATEWAY_PORT`, `AUTH_SERVICE_HOST`, `AUTH_SERVICE_PORT`, `AUTH_SERVICE_URL`, `CORS_ORIGINS`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `LOG_LEVEL`, `NODE_ENV`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`

## Email encryption — Phase 0 limitation

Email stored as deterministic HMAC-SHA256 (not reversible). During JWT refresh, email in payload is a placeholder `user_{id}@internal`. Phase 1 must migrate to pgcrypto AES-256 for reversible encryption. See `prisma/sql/timescaledb_init.sql` and PRD Appendix B.

## How to apply

- Before any Prisma `Bytes` write: use `Uint8Array<ArrayBuffer>` pattern above.
- Before any `$transaction` with callback: use `Prisma.TransactionClient`.
- Before setting env vars: check `viewEnvVars` first; avoid duplicates.
