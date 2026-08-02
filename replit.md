# Joben Connect — Project Overview

## Deskripsi
Platform agregasi data aset keuangan multi-kategori (crypto, saham IDX, emas, mata uang, reksa dana) untuk Indonesia & SEA. Menggabungkan connected exchange/broker, manual asset entry, multi-currency wallet, dan developer API dalam satu platform.

## Dokumen Utama
- `PRD/PRD-FINAL-Joben-Connect.md` — PRD lengkap v1.0.0 (188KB, ~10.000 baris)

## Stack yang Ditetapkan (per PRD)
- **Backend:** Node.js (LTS) + Fastify
- **Database:** PostgreSQL 16 + TimescaleDB extension
- **ORM/Migration:** Prisma
- **Cache & Queue:** Redis + BullMQ
- **Secret Vault:** HashiCorp Vault / AWS KMS
- **Payment Gateway:** Midtrans (primary), Xendit (backup)
- **Validasi Schema:** Zod
- **Observability:** OpenTelemetry + Grafana Stack

## Fase Pembangunan
1. Phase 0: Legal + Infra Baseline (2 bulan)
2. Phase 1: MVP Core (3 bulan)
3. Phase 2: Developer Platform + Billing (3 bulan)
4. Phase 3: Ekspansi Kategori + Risk Engine (4 bulan)
5. Phase 4: Marketplace + Agent Access (6 bulan)

## User Preferences
- Bahasa komunikasi: Bahasa Indonesia
- Pendekatan: Diskusi dulu sebelum build — konfirmasi keputusan besar sebelum implementasi
- PRD adalah dokumen hidup — setiap perubahan arsitektur signifikan harus dicatat di Decision Log (Appendix B PRD)
