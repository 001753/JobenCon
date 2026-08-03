# Joben Connect — Project Overview

## Deskripsi
Platform agregasi data aset keuangan multi-kategori (crypto, saham IDX, emas, mata uang, reksa dana) untuk Indonesia & SEA. Menggabungkan connected exchange/broker, manual asset entry, multi-currency wallet, dan developer API dalam satu platform.

## Dokumen Utama
- `PRD/PRD-FINAL-Joben-Connect.md` — PRD lengkap v1.0.0 (188KB, ~10.000 baris)

## Stack (Phase 0 baseline)
- **Backend:** Node.js 24 + Fastify v5
- **Database:** PostgreSQL 16 (Replit built-in) + Prisma ORM
- **Language:** TypeScript (strict mode)
- **Monorepo:** pnpm workspaces

## Struktur Project
```
packages/
  shared/        — Shared types, Zod schemas, constants, utils
  auth-service/  — Auth: register, login, JWT, refresh token, email verify (port 3001)
  api-gateway/   — API Gateway: routing, auth middleware, rate limiting (port 3000)
prisma/
  schema.prisma  — Full DB schema sesuai PRD Section 7.2
  migrations/    — Prisma migration files
  seed.ts        — Seed data (plans: free, starter, pro, business)
  sql/           — Raw SQL (TimescaleDB init, audit log trigger)
.github/
  workflows/
    ci.yml       — GitHub Actions: lint → typecheck → test → build
```

## Cara Menjalankan

### Setup awal
```bash
pnpm install
pnpm db:migrate      # Jalankan migration
pnpm db:seed         # Seed plans data
```

### Development
```bash
pnpm dev             # Start semua services (parallel)
pnpm dev:auth        # Auth Service saja (port 3001)
pnpm dev:gateway     # API Gateway saja (port 3000)
```

### Testing
```bash
pnpm test            # Semua tests
pnpm test:ci         # Tests dengan coverage
```

### Database
```bash
pnpm db:migrate      # Apply migrations (dev)
pnpm db:migrate:deploy  # Apply migrations (production)
pnpm db:seed         # Seed initial data
pnpm db:studio       # Buka Prisma Studio
```

### Build
```bash
pnpm build           # Build semua packages
pnpm typecheck       # TypeScript type check
pnpm lint            # ESLint
pnpm format:check    # Prettier check
```

## Environment Variables

Secrets (di Replit Secrets):
- `JWT_SECRET` — JWT access token signing key (min. 32 chars)
- `JWT_REFRESH_SECRET` — JWT refresh token signing key (berbeda dari JWT_SECRET)
- `AUTH_SERVICE_INTERNAL_SECRET` — Untuk komunikasi internal API Gateway → Auth Service
- `SESSION_SECRET` — Session signing key
- `DATABASE_URL` — Auto-provided oleh Replit PostgreSQL

Non-secret (di Replit env vars):
- `NODE_ENV` — development / production
- `AUTH_SERVICE_PORT` — 3001
- `API_GATEWAY_PORT` — 3000
- `AUTH_SERVICE_URL` — http://localhost:3001

## API Endpoints

### API Gateway (port 3000)
- `GET /health` — Health check
- `GET /` — Service info
- `POST /v1/auth/register` — Registrasi user baru
- `POST /v1/auth/login` — Login, dapat access + refresh token
- `POST /v1/auth/refresh` — Refresh access token
- `POST /v1/auth/logout` — Logout, revoke refresh token
- `POST /v1/auth/verify-email` — Verifikasi email

### Auth Service (port 3001 — internal)
- `GET /health` — Health check
- `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/verify-email`
- `POST /auth/verify-token` — Internal JWT verification (dipanggil API Gateway)

## Database Schema
Schema lengkap di `prisma/schema.prisma`, sesuai PRD Section 7.2:
- `users`, `email_verifications`, `sessions`, `mfa_recovery_codes`, `consent_log`
- `tenants` (Phase 4 multi-user)
- `connectors`, `connector_holdings`, `sync_log`
- `manual_assets`, `currency_holdings`
- `price_snapshots` (TimescaleDB hypertable di production)
- `portfolio_snapshots`
- `plans`, `subscriptions`, `invoices`, `usage_meters`
- `oauth_clients`, `oauth_authorization_codes`, `api_keys`
- `audit_log` (append-only, enforced via trigger)

## Fase Pembangunan
1. **Phase 0** ✅ — Legal + Infra Baseline (monorepo, DB schema, auth, CI/CD)
2. Phase 1 — MVP Core (crypto connector + portfolio dashboard)
3. Phase 2 — Developer Platform + Billing
4. Phase 3 — Ekspansi Kategori + Risk Engine
5. Phase 4 — Marketplace + Agent Access

## Decision Log (Phase 0)
- `argon2` → `bcryptjs`: Bcryptjs dipilih karena tidak butuh native bindings, sesuai PRD
- `@fastify/jwt` → `jsonwebtoken` langsung: `@fastify/jwt` diblok package firewall Replit
- Email encryption: Phase 0 pakai HMAC-SHA256 sebagai proxy enkripsi; Phase 1 migrasi ke pgcrypto AES-256
- TimescaleDB: Schema sudah siap, tapi TimescaleDB extension skip di Replit dev (pakai plain PostgreSQL table). Script init ada di `prisma/sql/timescaledb_init.sql`

## User Preferences
- Bahasa komunikasi: Bahasa Indonesia
- Presisi tinggi — konfirmasi keputusan besar sebelum implementasi
- PRD adalah dokumen hidup — setiap perubahan arsitektur signifikan harus dicatat di Decision Log (Appendix B PRD)
- Push ke GitHub setelah setiap milestone selesai
