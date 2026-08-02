# PRD Final — Joben Connect
**Versi:** 1.0.0  
**Tanggal:** 1 Agustus 2026  
**Status:** FINAL — Dokumen Kerja Resmi  
**Penulis:** Tim Produk Joben  
**Berlaku untuk:** Seluruh tim engineering, desain, produk, legal, dan investor

---

> **Cara membaca dokumen ini:**  
> PRD ini dirancang untuk bertahan **10 tahun ke depan** — bukan karena semua fiturnya dibangun sekarang, tetapi karena setiap keputusan desain, arsitektur, dan bisnis dibuat dengan sadar terhadap arah jangka panjang. Baca Phase 0–1 untuk memulai. Baca Phase 2–4 untuk memahami ke mana kita pergi. Baca Bagian Arsitektur dan Compliance untuk memahami mengapa keputusan teknis dibuat seperti itu.

---

## DAFTAR ISI

```
BAGIAN 0 — EXECUTIVE SUMMARY
  0.1  Visi & Misi
  0.2  Positioning & Diferensiasi
  0.3  Prinsip Produk (tidak boleh dilanggar)
  0.4  Ringkasan Fase Pembangunan
  0.5  Metrik Keberhasilan Utama

BAGIAN 1 — COMPLIANCE & LEGAL FRAMEWORK
  1.1  Landscape Regulasi Indonesia
  1.2  UU Perlindungan Data Pribadi (UU PDP)
  1.3  Regulasi OJK & BI SNAP
  1.4  Data Residency & Sovereignty
  1.5  Terms of Service & Liability Framework
  1.6  Connector Legal Classification
  1.7  Compliance Roadmap per Fase

BAGIAN 2 — PRODUCT OVERVIEW
  2.1  Apa itu Joben Connect
  2.2  Target Pengguna & Segmentasi
  2.3  Core Use Cases
  2.4  Bukan Apa — Batasan Produk
  2.5  Competitive Landscape
  2.6  Posisi Kompetitif Joben Connect

BAGIAN 3 — KATEGORI ASET & CONNECTOR STRATEGY
  3.1  Taksonomi Kategori Aset
  3.2  Definisi "Connector" vs "Manual Asset"
  3.3  Currency Wallet & Multi-Currency Support
  3.4  Connector Classification: Tier 1/2/3 + Community
  3.5  Build vs Partner Matrix (per kategori)
  3.6  Prioritas Connector per Fase
  3.7  Connector Lifecycle Management

BAGIAN 4 — CONNECTOR RELIABILITY FRAMEWORK
  4.1  Tiering SLA
  4.2  Connector Health Monitoring
  4.3  Automated Contract Testing
  4.4  Graceful Degradation Policy
  4.5  Deprecation Policy
  4.6  Public Health Dashboard

BAGIAN 5 — SECURITY ARCHITECTURE
  5.1  Threat Model Spesifik Platform Ini
  5.2  Secret & Credential Management
  5.3  Authentication & Authorization
  5.4  Data Protection
  5.5  Application Security (Node.js spesifik)
  5.6  Audit & Compliance
  5.7  Incident Response Plan

BAGIAN 6 — ARSITEKTUR SISTEM
  6.1  Prinsip Arsitektur
  6.2  Gambaran Umum (Diagram)
  6.3  Service Breakdown
  6.4  PostgreSQL & TimescaleDB Design
  6.5  Caching & Queue Architecture
  6.6  Observability & Monitoring
  6.7  Infrastructure & Deployment
  6.8  Stack Summary

BAGIAN 7 — DATA MODEL & UNIVERSAL DATA STANDARD (UDS)
  7.1  Filosofi UDS
  7.2  Schema Database Lengkap
  7.3  UDS: Canonical Asset Object
  7.4  UDS: Canonical Price Object
  7.5  UDS: Portfolio Snapshot Object
  7.6  Data Versioning & Migration Policy

BAGIAN 8 — PRODUCT FEATURES DETAIL
  8.1  Dashboard Portfolio
  8.2  Connector Management
  8.3  Manual Asset Engine
  8.4  Currency Wallet (Multi-Currency)
  8.5  Price Intelligence Layer
  8.6  Portfolio Engine & Net Worth Calculation
  8.7  Risk & Analytics Engine (Phase 3+)
  8.8  Notification System
  8.9  Data Export
  8.10 Developer Platform & Public API
  8.11 Connector Marketplace (Phase 2+)
  8.12 AI Agent Access (Phase 3+)

BAGIAN 9 — SUBSCRIPTION & BILLING SYSTEM
  9.1  Filosofi Model Subscription
  9.2  Tier Definition & Limits
  9.3  Backend-Driven Feature Flags
  9.4  Pricing (indikatif)
  9.5  Halaman Langganan (Frontend)
  9.6  Upgrade/Downgrade Flow
  9.7  Quota Enforcement Architecture
  9.8  Payment Gateway Integration
  9.9  Invoice & Billing Data Model
  9.10 Usage Metering

BAGIAN 10 — FASE PEMBANGUNAN LENGKAP
  10.1  Phase 0 — Legal + Infra Baseline
  10.2  Phase 1 — MVP Core
  10.3  Phase 2 — Developer Platform + Billing
  10.4  Phase 3 — Ekspansi Kategori + Risk Engine
  10.5  Phase 4 — Marketplace + Scale + Agent Access
  10.6  Fase 5+ — Post-Scale (10-tahun horizon)
  10.7  Dependency Map Antar Fase
  10.8  Tim per Fase

BAGIAN 11 — AI & AGENT READINESS
  11.1  Mengapa Ini Penting untuk 10 Tahun
  11.2  Desain API yang Agent-Compatible
  11.3  Scoped Consent untuk Agent Access
  11.4  MCP-style Interface (Phase 4)
  11.5  Keamanan: Agent vs Human Access

BAGIAN 12 — SUCCESS METRICS & ANALYTICS
  12.1  North Star Metric: AUA
  12.2  Metrics per Fase
  12.3  Health Metrics Platform
  12.4  Business Metrics
  12.5  Anti-Metrics (yang tidak diukur)

BAGIAN 13 — RISK REGISTER & MITIGASI
  13.1  Risiko Regulasi
  13.2  Risiko Teknis
  13.3  Risiko Bisnis
  13.4  Risiko Keamanan
  13.5  Risiko Ekosistem (Provider pihak ketiga)

BAGIAN 14 — OPEN QUESTIONS & KEPUTUSAN TERTUNDA
```

---

# BAGIAN 0 — EXECUTIVE SUMMARY

## 0.1 Visi & Misi

**Visi:**  
Menjadi lapisan infrastruktur data aset keuangan yang paling dipercaya di Indonesia dan Asia Tenggara — tempat di mana setiap individu, developer, dan platform keuangan bisa melihat gambaran aset keuangan yang lengkap, akurat, dan aman dalam satu tempat.

**Misi:**  
Menghilangkan fragmentasi data keuangan personal. Hari ini, seorang investor Indonesia mungkin punya: kripto di Binance dan Indodax, saham di Ajaib dan Stockbit, emas di Pegadaian, dolar di rekening, dan properti yang nilainya hanya dia yang tahu. Tidak ada satu pun aplikasi yang bisa menunjukkan gambaran utuh ini secara akurat dan real-time. Joben Connect hadir untuk menyelesaikan problem ini.

**Pernyataan Posisi:**  
*"Joben Connect adalah lapisan agregasi data aset keuangan multi-kategori pertama yang dirancang khusus untuk ekosistem Indonesia dan SEA — menggabungkan connected exchange, manual asset entry, multi-currency wallet, dan developer API dalam satu platform yang aman, transparan, dan bisa diaudit."*

## 0.2 Positioning & Diferensiasi

### Analogi Industri
Joben Connect berada di posisi yang sama dengan **Plaid** (untuk data perbankan AS) atau **Yodlee** (agregator finansial global) — tetapi dengan fokus yang sangat berbeda:

| Dimensi | Plaid/Yodlee | Zerion/DeBank | Joben Connect |
|---|---|---|---|
| Fokus utama | Rekening bank (AS/Global) | Crypto/DeFi on-chain | Multi-aset: crypto + saham + emas + mata uang |
| Geografis | AS, Eropa | Global on-chain | Indonesia & SEA sebagai prioritas utama |
| Broker lokal | Tidak ada | Tidak relevan | **Diferensiasi utama** — broker IDX, aset lokal |
| Model bisnis | B2B API | B2C app | **Dual**: B2C portfolio + B2B API platform |
| Bahasa & regulasi | Inggris, GDPR/PSD2 | Tidak diatur | **Bahasa Indonesia, UU PDP, SNAP BI** |

### Keunggulan Kompetitif Joben Connect

1. **Lokal by design** — Connector untuk Indodax, Tokocrypto, Ajaib, Stockbit, Pegadaian, dan puluhan broker/exchange Indonesia yang tidak diperhatikan oleh pemain global.

2. **Multi-kategori sejak awal** — Bukan hanya crypto (seperti Zerion) atau hanya saham — tapi crypto + saham IDX + emas + mata uang fiat + aset manual lainnya dalam satu net worth view.

3. **Data kepercayaan B2B** — Connector Health Dashboard publik, SLA per tier, audit log — standar yang dibutuhkan oleh wealth manager, fintech, dan aplikasi keuangan yang ingin memakai data ini.

4. **Compliance-first** — Dibangun dengan UU PDP dan potensi regulasi OJK/BI dari awal, bukan ditambahkan belakangan setelah terkena masalah hukum.

5. **Developer ecosystem** — SDK terbuka untuk pihak ketiga membangun connector mereka sendiri (marketplace model), satu-satunya cara mencapai skala tanpa membangun semuanya sendiri.

## 0.3 Prinsip Produk (Tidak Boleh Dilanggar)

Prinsip-prinsip berikut adalah **konstrain desain**, bukan aspirasi. Setiap fitur baru, setiap keputusan arsitektur, dan setiap perubahan produk harus diuji terhadap prinsip ini.

### P1 — Never Hold Money
Joben Connect **tidak pernah memegang, mentransfer, atau memfasilitasi perpindahan uang/aset**. Ini bukan hanya soal regulasi (meski itu penting) — ini adalah identitas produk. Joben Connect adalah *pembaca*, bukan *pemegang*. Implikasi: semua connector hanya punya permission read-only. Tidak ada fitur trading, withdrawal, atau transfer.

### P2 — Data Selalu Milik User
User bisa menghapus seluruh datanya kapan saja, secara permanen, dalam waktu ≤72 jam (sesuai UU PDP). Tidak ada "soft delete" yang data-nya masih tersimpan di tempat lain. Implikasi: skema database harus mendukung cascading delete sejak Phase 0.

### P3 — Transparansi Data adalah Fitur
Setiap data yang ditampilkan ke user harus memiliki atribut yang jelas: dari mana datanya, kapan di-update terakhir, seberapa akurat (real-time vs delayed vs manual). User tidak pernah melihat angka yang tidak jelas asal-usulnya. Implikasi: setiap data point di UI harus punya "data provenance" yang bisa dilihat.

### P4 — Keamanan Bukan Tradeoff
Tidak ada fitur baru yang boleh di-deploy jika ada kerentanan keamanan yang belum dimitigasi. Development speed tidak pernah menjadi alasan untuk melangkahi security review. Implikasi: security checklist masuk ke Definition of Done untuk setiap feature.

### P5 — Degradasi Elegan, Bukan Silent Failure
Saat satu connector gagal sync, user **tahu** dengan jelas: mana data yang stale, mana yang akurat, dan apa yang perlu dilakukan. Tidak ada angka palsu yang ditampilkan seolah akurat padahal data-nya sudah 3 hari tidak di-update. Implikasi: setiap nilai di portfolio harus punya timestamp dan confidence indicator.

### P6 — Bangun yang Membedakan, Partner untuk yang Komoditas
Joben Connect tidak bersaing dengan AWS, CoinGecko, atau Moralis. Fokus tim internal ke connector broker/bank/exchange lokal Indonesia-SEA yang tidak diprioritaskan pemain global. Semua data komoditas (harga crypto global, data blockchain multi-chain) didapat lewat partnership, bukan dibangun dari nol. Implikasi: setiap proposal "bangun sendiri" harus diuji dengan pertanyaan "apakah ini diferensiasi kompetitif kita, atau sudah ada yang lebih baik melakukannya?"

### P7 — Subscription Dikontrol dari Backend
Setiap batas kuota, fitur yang diaktifkan, dan harga subscription **harus bisa diubah dari backend tanpa deploy baru**. Frontend hanya membaca state dari backend. Ini memungkinkan eksperimen pricing, custom deal, dan penyesuaian tier secara real-time. Implikasi: tidak boleh ada hardcode fitur/limit di frontend.

## 0.4 Ringkasan Fase Pembangunan

| Fase | Nama | Durasi | Output Utama |
|---|---|---|---|
| **Phase 0** | Legal + Infra Baseline | 2 bulan | Auth berjalan, legal dasar selesai, CI/CD siap |
| **Phase 1** | MVP Core | 3 bulan | Portfolio pertama jalan: crypto + saham + emas |
| **Phase 2** | Developer Platform + Billing | 3 bulan | Billing live, Public API v1, connector marketplace awal |
| **Phase 3** | Ekspansi Kategori + Risk | 4 bulan | Reksa dana, emas fisik, risk engine ringan |
| **Phase 4** | Marketplace + Scale + Agent | 6 bulan | SDK pihak ketiga, MCP agent access, enterprise SLA |
| **Fase 5+** | Post-Scale | Ongoing | Enterprise, internasionalisasi SEA, data intelligence |

## 0.5 Metrik Keberhasilan Utama

**North Star Metric: Assets Under Aggregation (AUA)**  
Total nilai aset yang diagregasi platform, dalam IDR. Ini adalah metrik paling jujur untuk mengukur nilai yang diberikan Joben Connect kepada pengguna dan kepercayaan yang diberikan pengguna ke platform.

| Milestone | AUA Target | User Target | Revenue Target |
|---|---|---|---|
| Phase 1 selesai | Rp 1 T+ | 1.000 MAU | - (belum monetisasi) |
| Phase 2 selesai | Rp 10 T+ | 5.000 MAU | Rp 50 juta MRR |
| Phase 3 selesai | Rp 100 T+ | 25.000 MAU | Rp 250 juta MRR |
| Phase 4 selesai | Rp 1.000 T+ | 100.000 MAU | Rp 1,5 M MRR |

*Catatan: Target ini indikatif untuk perencanaan internal. Bukan komitmen ke investor.*

---

# BAGIAN 1 — COMPLIANCE & LEGAL FRAMEWORK

> **Kenapa ini Bagian 1, bukan appendix?**  
> Karena compliance bukan "tambahan belakangan." Di sebuah platform yang menyimpan data keuangan personal jutaan orang, pelanggaran regulasi bisa berarti shutdown, denda, atau yang lebih buruk: hilangnya kepercayaan permanen. Lebih murah membangun dengan benar dari awal daripada refactor sistem yang sudah terlanjur salah.

## 1.1 Landscape Regulasi Indonesia

### Regulasi yang Relevan Langsung

| Regulasi | Instansi | Relevansi ke Joben Connect |
|---|---|---|
| **UU No. 27 Tahun 2022 (UU PDP)** | Kominfo / Otoritas PDP | Wajib — Joben Connect memproses data pribadi (email, data finansial) jutaan orang |
| **PP No. 71 Tahun 2019** | Kominfo | Data strategis/keuangan WNI wajib di server lokal Indonesia |
| **POJK No. 77/2016** (Fintech lending) | OJK | *Tidak langsung* — tapi sebagai platform data finansial, perlu monitor evolusi regulasinya |
| **SNAP (Standar Nasional Open API Pembayaran)** | Bank Indonesia | Relevan jika ada koneksi ke rekening bank di masa depan (Phase 5+) |
| **POJK No. 57/2020** (Inovasi Keuangan Digital) | OJK | Sandbox regulasi OJK — bisa digunakan untuk uji coba fitur baru yang masuk area abu-abu |
| **UU ITE No. 11/2008 jo 19/2016** | Kominfo | Berlaku untuk keamanan sistem elektronik dan data |
| **UU No. 8/1999 (Perlindungan Konsumen)** | BPKN/Kemendag | Kewajiban transparansi informasi ke user |

### Landscape Regulasi yang Perlu Dimonitor

| Perkembangan | Status | Implikasi |
|---|---|---|
| Turunan UU PDP (PP/Perpres implementasi) | *Dalam proses penerbitan* | Bisa menambah kewajiban teknis spesifik |
| Regulasi Account Aggregator BI/OJK | *Belum ada*, tapi kemungkinan muncul | Jika muncul, Joben Connect kemungkinan masuk cakupannya |
| ASEAN Data Framework | *Dalam diskusi* | Relevan jika ekspansi ke SEA |
| Regulasi AI untuk data keuangan | *Sangat awal* | Perlu dimonitor seiring AI readiness di Phase 4 |

## 1.2 UU Perlindungan Data Pribadi (UU PDP)

### Kewajiban Utama

**A. Consent Management**

Joben Connect harus mengimplementasikan sistem consent yang granular:

```
Consent Categories yang harus ada:
├── [WAJIB] Data Akun Dasar (email, nama) — tanpa ini, akun tidak bisa dibuat
├── [PILIHAN] Data Portofolio (dikirim ke analitik internal untuk improvement)
├── [PILIHAN] Data Perilaku (fitur yang dipakai, flow navigasi)
├── [PILIHAN] Pemasaran (newsletter, penawaran upgrade)
└── [PILIHAN] Third-party data sharing (jika B2B API dipakai)
```

Setiap consent harus:
- Diberikan secara eksplisit (bukan pre-checked)
- Bisa ditarik kapan saja dari settings
- Dicatat dengan timestamp dan versi dokumen privacy policy yang berlaku saat consent diberikan
- Disimpan di tabel `consent_log` yang append-only

**B. Hak-hak Subjek Data**

| Hak | Kewajiban Platform | Implementasi Teknis |
|---|---|---|
| Hak akses | User bisa melihat semua data yang disimpan tentang mereka | Endpoint `GET /me/data-export` yang mengembalikan semua data user |
| Hak koreksi | User bisa meminta koreksi data | Form di settings + ticketing manual untuk data yang tidak bisa self-service |
| Hak penghapusan | Hapus semua data dalam ≤72 jam setelah permintaan | Background job cascading delete, audit trail penghapusan disimpan tanpa PII |
| Hak portabilitas | Data bisa di-export dalam format yang machine-readable | Export JSON/CSV dari semua data portfolio |
| Hak keberatan | User bisa keberatan terhadap processing tertentu | Toggle per consent category |

**C. Data Retention Policy**

```
Data               | Retensi Aktif | Retensi Setelah Hapus Akun
-------------------|---------------|---------------------------
Data profil user   | Selama aktif  | Hapus dalam 72 jam
Data portfolio     | Selama aktif  | Hapus dalam 72 jam
Harga historis     | Tidak ada PII | Tetap simpan (agregat anonim)
Audit log          | 5 tahun       | Hapus PII, simpan event anonim
Invoice/pembayaran | 10 tahun      | Kewajiban pajak — tetap simpan
```

**D. Data Breach Notification**

Jika terjadi kebocoran data yang mempengaruhi data pribadi:
- Notifikasi ke Otoritas PDP: **dalam 14 hari kalender**
- Notifikasi ke user yang terdampak: **dalam waktu yang tidak terlambat** (segera setelah verifikasi scope)
- Dokumen incident response tersedia (lihat Bagian 5.7)

### Privacy by Design Checklist

Setiap fitur baru harus menjawab:
1. Data pribadi apa yang dikumpulkan?
2. Apa dasar hukum pemrosesannya? (Persetujuan / Kewajiban kontrak / Kepentingan sah)
3. Berapa lama data disimpan?
4. Siapa yang bisa mengakses data ini? (Internal tim mana, third-party apa)
5. Apakah ada mekanisme penghapusan jika user minta?
6. Apakah data ini perlu cross-border transfer?

## 1.3 Regulasi OJK & BI SNAP

### Status Joben Connect terhadap Regulasi OJK

**Posisi saat ini (Phase 0–3):** Joben Connect **tidak** memegang uang, tidak memfasilitasi transfer, tidak memberikan rekomendasi investasi. Posisi ini menempatkan Joben Connect di luar jangkauan izin OJK yang ada saat ini.

**Yang perlu diperhatikan:**
- Jangan sampai ada fitur yang bergerak ke arah "investment advice" (mis. "sebaiknya jual saham ini") — ini butuh izin Investment Adviser dari OJK
- Monitor perkembangan regulasi "Account Aggregator" yang sedang dikembangkan
- Jika di masa depan ada partnership dengan lembaga keuangan berizin (bank, broker), pastikan ada perjanjian data sharing yang sesuai

**Rekomendasi:** Konsultasikan dengan hukum/konsultan OJK sejak Phase 0 untuk mendapatkan legal opinion tentang posisi Joben Connect terhadap regulasi yang berlaku.

### BI SNAP

**Relevansi saat ini:** Tidak ada — karena Joben Connect tidak menghubungkan rekening bank (sesuai keputusan produk: Phase 1–4 tanpa koneksi bank).

**Relevansi masa depan (Phase 5+):** Jika koneksi rekening bank ditambahkan, wajib melalui SNAP BI yang merupakan standar resmi Open Banking Indonesia. Ini artinya:
- Harus mendaftar sebagai *Third Party Provider* (TPP) yang teregistrasi di BI
- Implementasi SNAP API standar (bukan scraping)
- Kemungkinan butuh izin khusus

**Keputusan saat ini:** Rekening bank **tidak** masuk scope Phase 1–4. Jika masuk Phase 5+, evaluasi dari awal sebagai product initiative terpisah dengan compliance pathway tersendiri.

## 1.4 Data Residency & Sovereignty

### Kewajiban

PP No. 71/2019 mengklasifikasikan data keuangan sebagai **data strategis** yang wajib diproses dan disimpan di pusat data (data center) yang berlokasi di **wilayah Indonesia**.

### Implementasi

```
Infrastruktur yang wajib di Indonesia:
├── Database utama (PostgreSQL) — server di Indonesia
├── Secret vault (HashiCorp Vault) — server di Indonesia
├── Backup database — infrastruktur lokal Indonesia
├── Audit log — server di Indonesia
└── Cache/queue (Redis) — server di Indonesia

Infrastruktur yang boleh di luar Indonesia:
├── CDN static assets (Cloudflare, dsb) — boleh global
├── Email delivery (SendGrid/Mailgun) — boleh
└── Payment gateway (Midtrans/Xendit sudah lokal)
```

### Provider Cloud Pilihan

Rekomendasi provider yang punya region Indonesia:
1. **AWS (ap-southeast-3 Jakarta)** — pilihan utama, ekosistem terlengkap
2. **GCP (asia-southeast2 Jakarta)** — alternatif yang baik
3. **Alibaba Cloud (Indonesia)** — opsi lokal

*Catatan: Pilihan provider cloud ditetapkan di Phase 0 dan tidak mudah diganti — pertimbangkan biaya lock-in sebelum memilih.*

## 1.5 Terms of Service & Liability Framework

### Struktur Dokumen Legal

```
Dokumen legal yang harus ada sebelum Phase 1 launch:
├── Terms of Service (ToS)
│   ├── Definisi layanan dan batasan
│   ├── Hak dan kewajiban user
│   ├── Disclaimer akurasi data
│   └── Ketentuan terminasi akun
├── Privacy Policy
│   ├── Data apa yang dikumpulkan
│   ├── Bagaimana data digunakan
│   ├── Dengan siapa data dibagi
│   └── Hak-hak user
├── Cookie Policy
└── Community Connector Disclaimer (khusus)
```

### Disclaimer Akurasi Data (Kritis)

Joben Connect **menampilkan** data dari sumber eksternal (exchange, broker, price provider). Joben Connect tidak bertanggung jawab atas:
- Ketidakakuratan data dari sumber eksternal
- Keputusan investasi berdasarkan data yang ditampilkan
- Kerugian yang terjadi akibat data yang stale/delay
- Downtime atau perubahan API pihak ketiga

Disclaimer ini **harus terlihat jelas di UI**, bukan hanya di ToS. Setiap angka portofolio harus disertai konteks: sumber data, waktu update terakhir, dan level ketidakpastian.

### Liability Caps

- Untuk kerugian akibat pelanggaran keamanan platform Joben Connect: ganti rugi terbatas pada biaya subscription yang dibayarkan dalam 12 bulan terakhir
- Untuk kerugian akibat data tidak akurat dari sumber eksternal: tidak ada kewajiban (force majeure dari pihak ketiga)
- Untuk pelanggan B2B (API): SLA dan liability cap diatur dalam kontrak terpisah

## 1.6 Connector Legal Classification

Ini adalah framework penting untuk menentukan posisi hukum setiap connector:

### Tier Legalitas Connector

**Class A — Official API Connector**
- Terhubung melalui API resmi yang dipublikasikan oleh exchange/broker
- Tidak butuh sharing credential sensitif
- Termasuk: Binance API, Indodax API, dll yang punya dokumentasi publik

**Class B — Partnership Connector**
- Dibangun berdasarkan perjanjian resmi dengan institusi
- Data mengalir melalui channel yang disetujui secara hukum oleh kedua pihak
- Termasuk: integrasi dengan broker yang punya API privat tapi mau partnership

**Class C — Community Connector (Unverified)**
- Dibangun oleh komunitas atau tim internal untuk target yang tidak punya API resmi
- Menggunakan screen scraping atau metode non-resmi
- **Wajib disclaimer eksplisit kepada user:**
  > *"Connector ini tidak resmi diotorisasi oleh [nama institusi]. Koneksi ini menggunakan metode akses yang tidak dijamin dukungannya dan dapat berhenti bekerja kapan saja tanpa pemberitahuan. Gunakan dengan pemahaman risiko penuh. Joben Connect tidak bertanggung jawab atas ketidakakuratan atau gangguan yang diakibatkan oleh connector ini."*
- User harus memberikan consent aktif (bukan opt-out) untuk mengaktifkan Community Connector

**Class D — Connector Deprecated/Blocked**
- Connector yang telah dicabut karena melanggar ToS sumber data, alasan hukum, atau sudah tidak berfungsi
- Tidak bisa diaktifkan oleh user manapun

### Matriks Legalitas

```
Connector Type    | ToS Pihak Ketiga | Metode Akses    | User Disclaimer
------------------|------------------|-----------------|------------------
Official API      | ✅ Sesuai        | API Key resmi   | Minimal
Partnership       | ✅ Perjanjian    | API privat       | Minimal
Community         | ❓ Tidak jelas   | Screen scraping  | WAJIB eksplisit
Blocked           | ❌ Melanggar     | -               | N/A
```

## 1.7 Compliance Roadmap per Fase

| Fase | Kewajiban Compliance |
|---|---|
| **Phase 0** | Draft ToS + Privacy Policy, Consent flow saat registrasi, Data residency setup (server di Indonesia), Legal opinion OJK, Penunjukan DPO (Data Protection Officer) informal |
| **Phase 1** | ToS + Privacy Policy final (reviewed oleh lawyer), Right-to-delete implemented, Consent log table, Community Connector disclaimer |
| **Phase 2** | Full UU PDP compliance audit, Data processing agreements dengan payment gateway, Invoice retention system |
| **Phase 3** | Pentest independen pertama, Partnership agreements untuk connector Class B, Data residency audit |
| **Phase 4** | SOC 2 Type I prep, Bug bounty program, Agent access consent framework |

---

# BAGIAN 2 — PRODUCT OVERVIEW

## 2.1 Apa itu Joben Connect

Joben Connect adalah **platform agregasi data aset keuangan** yang memungkinkan:

1. **Individual user** — melihat seluruh portofolio aset keuangan mereka dalam satu dashboard: kripto dari berbagai exchange, saham di berbagai broker, emas, reksa dana, mata uang fiat multi-currency, dan aset lainnya — lengkap dengan net worth real-time, P/L, dan breakdown.

2. **Developer & perusahaan fintech** — mengakses data portofolio user (dengan consent eksplisit) melalui API terstandardisasi, untuk membangun aplikasi wealth management, tax app, financial planning, dan sebagainya.

3. **Pihak ketiga (connector builders)** — membangun dan mendistribusikan connector untuk exchange/broker/platform baru melalui marketplace terbuka (Phase 2+).

### Komponen Utama

```
┌─────────────────────────────────────────────────────┐
│                   JOBEN CONNECT                     │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Connected  │  │   Manual    │  │  Currency   │ │
│  │  Exchanges  │  │   Assets    │  │   Wallet    │ │
│  │  & Brokers  │  │   Engine    │  │  (Multi-FX) │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │         │
│         └────────────────┼────────────────┘         │
│                          │                          │
│               ┌──────────▼──────────┐               │
│               │   Portfolio Engine  │               │
│               │  (Net Worth, P/L,   │               │
│               │   Allocation)       │               │
│               └──────────┬──────────┘               │
│                          │                          │
│         ┌────────────────┼────────────────┐         │
│         │                │                │         │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼───────┐ │
│  │  Dashboard  │  │  Public API │  │ Notification│ │
│  │    (B2C)    │  │  (B2B/Dev)  │  │   System    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 2.2 Target Pengguna & Segmentasi

### Primary Users (B2C)

**Segment 1: Individual Investor Multi-Aset (20-45 tahun)**
- Punya kripto di 2-3 exchange berbeda
- Punya saham IDX di 1-2 broker
- Mungkin punya emas (fisik atau digital)
- Problem: tidak ada satu tempat untuk melihat gambaran utuh
- Value proposition: "lihat semua aset kamu di satu tempat"

**Segment 2: Crypto Trader Aktif (18-35 tahun)**
- Volume transaksi tinggi
- Butuh tracking P/L yang akurat
- Punya akun di banyak exchange
- Value proposition: "track semua exchange sekaligus, hitung P/L gabungan"

**Segment 3: Investor Konservatif (30-55 tahun)**
- Portfolio lebih ke emas, reksa dana, saham blue chip
- Tidak terlalu tech-savvy
- Butuh UI yang sederhana dan angka yang bisa dipercaya
- Value proposition: "satu halaman untuk semua investasi kamu, mudah dimengerti"

**Segment 4: High Net Worth Individual / Family Office**
- AUM besar (Rp 1M+)
- Butuh reporting lebih detail
- Mungkin melibatkan lebih dari satu orang (keluarga, advisor)
- Value proposition: "platform profesional untuk kelola dan monitor portofolio besar"

### Secondary Users (B2B/Developer)

**Segment 5: Fintech Developer / Startup**
- Sedang membangun aplikasi wealth management, tax app, dll
- Butuh data portofolio user yang clean dan terstandardisasi
- Tidak mau bangun connector sendiri dari nol
- Value proposition: "akses data portofolio user kamu via API, tanpa perlu bangun connector"

**Segment 6: Wealth Management Firm**
- Advisor dengan banyak klien
- Butuh visibility ke portofolio klien secara agregat
- Butuh compliance dan audit trail
- Value proposition: "platform data untuk advisor, dengan audit log dan SLA"

### Tertiary: Connector Builder (Ecosystem)

**Segment 7: Independent Developer / Fintech Kecil**
- Punya akses ke data exchange/broker tertentu
- Ingin memonetisasi dengan membangun connector di marketplace Joben
- Value proposition: "bangun connector, dapat revenue share dari pengguna yang pakai connector kamu"

## 2.3 Core Use Cases

### UC-001: Lihat Net Worth Total
**Sebagai** investor dengan aset di beberapa tempat,  
**Saya ingin** melihat total kekayaan bersih saya dalam satu angka,  
**Agar** saya tahu posisi finansial saya secara keseluruhan.

**Acceptance Criteria:**
- Net worth ditampilkan dalam IDR (default) dengan opsi tampil dalam USD/SGD/dll
- Breakdown per kategori (kripto, saham, emas, cash)
- Setiap angka punya label "Last updated: X menit lalu" dan sumber data
- Jika satu connector offline, bagian tersebut ditandai "Data mungkin tidak terbaru" dengan timestamp terakhir yang valid

### UC-002: Hubungkan Exchange/Broker
**Sebagai** pengguna baru,  
**Saya ingin** menghubungkan akun Binance saya ke Joben Connect,  
**Agar** saldo kripto saya otomatis sinkron.

**Acceptance Criteria:**
- User memasukkan API Key + API Secret dari Binance
- Sistem memvalidasi bahwa key hanya punya permission "read" (bukan trade/withdraw)
- Jika key punya permission lebih dari read, tolak dan tampilkan instruksi cara membuat read-only key
- Sinkronisasi pertama selesai dalam ≤60 detik
- User bisa mencabut akses kapan saja dengan 1 klik, dan key langsung dihapus dari vault

### UC-003: Input Aset Manual
**Sebagai** pengguna yang punya emas fisik,  
**Saya ingin** mencatat kepemilikan emas saya secara manual,  
**Agar** emas fisik saya masuk ke perhitungan net worth.

**Acceptance Criteria:**
- Input: jenis aset (emas), satuan (gram), jumlah, harga beli rata-rata (opsional)
- Harga pasar saat ini (Antam/Pegadaian) otomatis di-fetch dan ditampilkan
- Nilai dalam IDR dihitung otomatis berdasarkan quantity × harga pasar terkini
- User bisa update quantity kapan saja
- Bisa menambah multiple entries (mis. beli emas di tanggal berbeda)

### UC-004: Multi-Currency Wallet
**Sebagai** pengguna yang punya simpanan USD dan SGD,  
**Saya ingin** mencatat mata uang yang saya pegang,  
**Agar** nilai mata uang asing saya dikonversi ke IDR secara otomatis.

**Acceptance Criteria:**
- Input: mata uang (dari list BI/ISO 4217), jumlah
- Kurs konversi diambil dari provider resmi (BI kurs tengah + provider fallback)
- Kurs di-update setidaknya setiap hari kerja (mengikuti update kurs BI)
- Nilai IDR dihitung otomatis: quantity × kurs tengah
- Kurs yang dipakai ditampilkan dengan transparansi: "Kurs USD/IDR: 16.350 (BI, 1 Agu 2026)"

### UC-005: Lihat Unrealized P/L
**Sebagai** investor yang ingin tahu untung/rugi portofolio,  
**Saya ingin** melihat P/L unrealized per aset dan total,  
**Agar** saya tahu posisi keuntungan/kerugian saya saat ini.

**Acceptance Criteria:**
- P/L dihitung berdasarkan: (Harga Pasar Saat Ini − Harga Beli Rata-rata) × Quantity
- Untuk aset dari connector live (exchange): harga beli rata-rata diambil dari data transaksi jika tersedia, atau user bisa input manual
- Ditampilkan: P/L nominal (IDR) dan P/L persentase
- Color coding: hijau untuk profit, merah untuk loss
- "N/A" untuk aset yang tidak ada data harga beli (bukan nol — itu menyesatkan)

### UC-006: Developer Access via API
**Sebagai** developer yang membangun aplikasi tax,  
**Saya ingin** mengakses data portofolio user saya (dengan consent mereka) via API,  
**Agar** aplikasi saya bisa menampilkan data aset mereka tanpa membangun connector sendiri.

**Acceptance Criteria:**
- Developer mendaftar, membuat API key di developer dashboard
- Ketika user connect ke aplikasi developer, flow OAuth2 meminta consent eksplisit
- Data yang bisa diakses: sesuai scope yang diizinkan user (bisa hanya portfolio read, atau termasuk transaction history)
- Setiap API call tercatat di audit log
- User bisa mencabut akses aplikasi developer kapan saja dari settings mereka

## 2.4 Bukan Apa — Batasan Produk

Ini penting untuk scope clarity — hal-hal yang **tidak** dilakukan Joben Connect:

| Bukan ini | Penjelasan | Catatan |
|---|---|---|
| Bukan trading platform | Tidak ada eksekusi order, tidak ada fitur beli/jual | Prinsip P1 |
| Bukan investment advisor | Tidak ada rekomendasi "sebaiknya beli X" atau "jual Y" | Butuh izin OJK |
| Bukan banking/neobank | Tidak ada rekening, tidak ada transfer uang | Di luar scope |
| Bukan tax calculation engine | Tampilkan data transaksi, tapi tidak hitung pajak — itu untuk aplikasi partner | Scope creep |
| Bukan price alert platform | Alert bisa ada (notifikasi), tapi bukan fitur inti — data agregasi yang utama | Prioritas |
| Bukan social/community | Tidak ada fitur berbagi portofolio, leaderboard, dll | Fokus utility |
| Bukan DeFi protocol | Tidak ada smart contract, tidak ada liquidity pool | Di luar scope |

## 2.5 Competitive Landscape

### Kompetitor Langsung (Regional/Lokal)

| Platform | Fokus | Kekuatan | Kelemahan vs Joben |
|---|---|---|---|
| **Stockbit** | Saham IDX | Community kuat, data IDX bagus | Hanya saham, tidak multi-aset |
| **Ajaib** | Reksa dana + saham | UX bagus, user base besar | Tidak ada crypto, tidak ada "all-in-one view" |
| **Indodax** | Crypto Indonesia | Exchange terbesar Indonesia | Hanya crypto, tidak ada portofolio lintas platform |
| **Celengan** | Personal finance | Budgeting + tracking | Tidak ada connector exchange, lebih ke spending |

### Kompetitor Tidak Langsung (Global, Bisa Masuk Indonesia)

| Platform | Fokus | Threat Level |
|---|---|---|
| **CoinStats** | Crypto portfolio | Medium — tapi tidak ada saham IDX/broker lokal |
| **Koinly** | Crypto tax + portfolio | Low untuk portfolio, tapi bisa jadi mitra |
| **Kubera** | Multi-asset portfolio (premium) | Medium — tapi mahal, UI untuk HNW global, tidak ada lokal |
| **Zerion** | DeFi/on-chain portfolio | Low — focus DeFi, tidak ada saham/emas |
| **Delta** | Crypto + stock portfolio | Medium — tapi tidak ada koneksi broker IDX |

### Analisis: Kenapa Joben Connect Menang

**Di mana pemain global lemah:**
1. **Broker IDX** — Tidak ada satu pun pemain global yang punya connector ke Ajaib, Stockbit, BCA Sekuritas, Mandiri Sekuritas, dll. Ini moat nyata.
2. **Exchange crypto Indonesia** — Indodax, Tokocrypto, Pintu — tidak ada di platform global manapun
3. **Emas Indonesia** — Harga emas Antam/Pegadaian, unit gram — tidak ada platform global yang handle ini
4. **Bahasa & UX Indonesia** — Lebih dari sekadar terjemahan, tapi benar-benar dirancang untuk konteks Indonesia
5. **Compliance lokal** — UU PDP, data residency di Indonesia — keunggulan regulasi yang pemain global tidak siap

## 2.6 Posisi Kompetitif Jangka Panjang

**Moat yang dibangun:**

1. **Data moat** — Semakin banyak connector yang ada, semakin komprehensif data yang bisa diagregasi. Connector ke broker IDX adalah aset strategis yang butuh waktu lama untuk direplikasi.

2. **Trust moat** — Reputasi sebagai platform yang aman, akurat, dan transparan. Hilangnya kepercayaan di industri data keuangan hampir tidak bisa dipulihkan — ini menjadi barrier to entry untuk kompetitor baru.

3. **Network moat** — Semakin banyak developer yang membangun di atas Joben Connect API, semakin sulit user untuk pindah (switching cost meningkat karena ekosistem aplikasi yang bergantung).

4. **Regulatory moat** — Compliance UU PDP, data residency, dan potensi izin resmi dari OJK/BI di masa depan adalah barrier yang signifikan untuk pemain baru atau asing.

---

# BAGIAN 3 — KATEGORI ASET & CONNECTOR STRATEGY

## 3.1 Taksonomi Kategori Aset

Semua aset yang dikelola Joben Connect masuk ke dalam taksonomi hierarkis berikut:

```
ASSET_TAXONOMY
│
├── CRYPTO
│   ├── Exchange Crypto (via connector)
│   │   ├── CEX (Centralized Exchange): Binance, Bybit, OKX, Indodax, Tokocrypto, dll
│   │   └── DEX/On-chain (via address scan): ETH wallet, SOL wallet, BTC address
│   └── [Manual] Token/Coin yang tidak ada connector-nya
│
├── STOCKS
│   ├── IDX (Bursa Efek Indonesia)
│   │   └── Via broker connector (Ajaib, Stockbit, BCA Sekuritas, dll)
│   │   └── [Manual] Input manual jika broker belum ada connector
│   └── Foreign Stocks (Phase 3+)
│       └── [Manual] Input USD value + jumlah lot
│
├── PRECIOUS_METALS
│   ├── Emas Digital
│   │   └── Via connector (Pegadaian Digital, Tokopedia Emas, dll) atau manual
│   ├── Emas Fisik [Manual]
│   │   └── Input: gram, auto-price dari harga Antam/Pegadaian
│   └── Perak, Platinum [Manual] (Phase 3+)
│
├── MUTUAL_FUNDS (Phase 3)
│   ├── Via connector marketplace data (jika ada)
│   └── [Manual] Input: nama reksa dana, nilai investasi awal, NAB saat ini
│
├── CURRENCY (Multi-Currency Wallet)
│   ├── IDR (base currency)
│   ├── USD, SGD, EUR, MYR, JPY, AUD, GBP, HKD, CNY
│   └── Mata uang lain (ISO 4217 compliant)
│   Semua diinput manual, kurs otomatis dari provider
│
├── PROPERTY (Phase 3+) [Manual Only]
│   ├── Properti Residensial
│   ├── Properti Komersial
│   └── Tanah
│   Input: tipe, lokasi (kota/kabupaten saja — tidak perlu alamat presisi),
│          luas, estimasi harga pasar (manual update)
│
└── OTHERS [Manual]
    ├── Obligasi / Surat Utang
    ├── Bisnis / Equity tidak tercatat
    ├── Kendaraan
    └── Custom (user bisa buat kategori sendiri di tier Pro+)
```

## 3.2 Definisi "Connector" vs "Manual Asset"

**Connector** = Integrasi otomatis ke platform eksternal yang secara periodic (atau real-time) men-sync data aset ke Joben Connect. User tidak perlu update manual.

**Manual Asset** = Entry yang di-input dan di-maintain secara manual oleh user. Platform menyediakan harga pasar otomatis (jika tersedia), tapi jumlah/lot kepemilikan adalah tanggung jawab user.

**Hybrid** = Beberapa aset memiliki dua mode: bisa via connector (jika ada) atau manual entry. User bisa pilih mode mana yang dipakai.

### Aturan Penting: No Double Counting

Sistem harus mencegah penghitungan ganda. Jika user:
- Punya ETH di MetaMask (via connector) DAN juga input manual "ETH" dengan jumlah yang sama → sistem harus mendeteksi ini sebagai potensi duplikasi dan memperingatkan user.
- Punya saham BBCA via Ajaib (connector) DAN input manual BBCA → peringatan yang sama.

Implementasi: setiap aset punya `asset_identifier` yang bisa dicocokkan. Jika dua asset record punya `asset_identifier` yang sama dan `user_id` yang sama, sistem tampilkan warning di UI.

## 3.3 Currency Wallet & Multi-Currency Support

Ini adalah fitur khas Joben Connect yang membedakannya dari crypto tracker biasa.

### Konsep

User bisa mencatat simpanan mata uang fiat dalam denominasi aslinya. Platform akan:
1. Menyimpan record: "User X punya USD 5.000"
2. Secara otomatis mengkonversi ke IDR berdasarkan kurs terkini
3. Memasukkan nilai IDR-equivalent ke dalam perhitungan net worth total

### Mata Uang yang Didukung (Phase 1)

IDR (base), USD, SGD, EUR, MYR, JPY, AUD, GBP, HKD

### Mata Uang Tambahan (Phase 2+)

Semua mata uang ISO 4217 yang punya pair aktif di provider kurs utama

### Provider Kurs

| Provider | Type | Kualitas | Dipakai untuk |
|---|---|---|---|
| Bank Indonesia (BI) | Official | ✅ Terpercaya, resmi | Kurs tengah IDR untuk display |
| Open Exchange Rates | Commercial | ✅ Lengkap, update sering | Primary rate provider |
| Fixer.io | Commercial | ✅ Backup | Fallback jika provider utama down |
| Frankfurter (ECB) | Free | ✅ Untuk non-IDR pairs | Backup tambahan |

**Catatan transparansi:** Di UI, selalu tampilkan kurs yang dipakai beserta sumber dan waktu update-nya. Contoh: *"USD/IDR: 16.350 (BI Kurs Tengah, 1 Agu 2026 11:00)"*

### Kurs Update Frequency

- **Hari kerja:** Update mengikuti kurs BI (pagi + siang)
- **Weekend/libur:** Pakai kurs terakhir dengan label "Kurs hari kerja terakhir"
- **Fallback jika BI down:** Pakai Open Exchange Rates dengan label yang berbeda

### Data Model Currency Wallet

```sql
currency_holdings (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL,
  currency_code   CHAR(3) NOT NULL,  -- ISO 4217
  amount          DECIMAL(20, 8) NOT NULL,  -- presisi tinggi
  label           VARCHAR(100),  -- opsional: "Rekening BCA", "Tabungan USD"
  created_at      TIMESTAMPTZ NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

currency_rates (
  id              UUID PRIMARY KEY,
  base_currency   CHAR(3) NOT NULL,  -- biasanya IDR
  quote_currency  CHAR(3) NOT NULL,
  rate            DECIMAL(20, 8) NOT NULL,  -- berapa IDR per 1 unit foreign currency
  source          VARCHAR(50) NOT NULL,  -- 'BI', 'open_exchange_rates', dll
  fetched_at      TIMESTAMPTZ NOT NULL,
  
  INDEX (base_currency, quote_currency, fetched_at)
)
```

## 3.4 Connector Classification: Tier 1/2/3 + Community

### Tier 1 — Mission Critical

**Definisi:** Connector ke platform terbesar/terpopuler dengan API resmi yang stabil.

**SLA:** 99.9% uptime per bulan (maksimum ~44 menit downtime/bulan)

**Karakteristik:**
- API resmi dan terdokumentasi dengan baik
- Platform target punya dukungan developer yang aktif
- Diuji secara intensif oleh tim internal
- Monitoring aktif 24/7 dengan alert otomatis
- Automated contract testing setiap 1 jam

**Contoh:** Binance, Bybit, OKX, Indodax

**Respons saat gagal:** Alert ke on-call engineer dalam ≤5 menit. Target fix dalam ≤1 jam.

### Tier 2 — Standard

**Definisi:** Connector dengan API resmi tetapi platform lebih kecil atau API kurang stabil/terdokumentasi.

**SLA:** 99% uptime per bulan (maksimum ~7 jam downtime/bulan)

**Karakteristik:**
- API resmi ada, tapi mungkin versi lama atau tidak selalu update
- Tim internal tetap maintain
- Monitoring aktif dengan alert
- Automated contract testing setiap 4 jam

**Contoh:** Exchange menengah Indonesia, Tokocrypto, platform saham dengan API terbatas

**Respons saat gagal:** Alert ke on-call dalam ≤15 menit. Target fix dalam ≤4 jam.

### Tier 3 — Community Maintained (Official API)

**Definisi:** Connector dengan API resmi tetapi di-maintain oleh komunitas (bukan tim internal Joben).

**SLA:** Best effort — tidak ada komitmen uptime formal

**Karakteristik:**
- API resmi ada
- Di-maintain oleh connector builder di marketplace (Phase 2+)
- Monitoring dasar dengan alert
- Tim internal review kode sebelum listed

**Contoh:** Exchange/broker kecil yang di-submit oleh komunitas

### Community Connector (Unofficial)

**Definisi:** Connector yang tidak menggunakan API resmi (screen scraping, unofficial endpoint, dll).

**SLA:** Tidak ada SLA — "as-is, best-effort"

**Disclaimer wajib:** User harus read dan accept disclaimer spesifik sebelum mengaktifkan.

**Karakteristik:**
- Metode akses tidak resmi
- Bisa berhenti bekerja kapan saja tanpa pemberitahuan
- Monitoring ada, tapi respon mungkin lebih lambat
- Tim Joben tidak bertanggung jawab atas akurasi atau ketersediaan

**Contoh:** Broker IDX yang belum punya API publik (Ajaib*, Stockbit* — *jika tidak ada API resmi*)

*Catatan: status Ajaib dan Stockbit perlu diverifikasi — keduanya mungkin punya API internal yang bisa di-negotiasi untuk Class B Partnership.*

## 3.5 Build vs Partner Matrix

Ini adalah keputusan strategis yang menentukan alokasi resource tim. Prinsip dasar: **bangun apa yang membedakan, partner untuk apa yang komoditas.**

| Kategori | Strategi | Alasan | Siapa Yang Lakukan |
|---|---|---|---|
| **CEX Crypto Indonesia** (Indodax, Tokocrypto, Pintu) | Build in-house | Diferensiasi utama, tidak ada pemain lain | Tim connector internal |
| **CEX Crypto Global Tier 1** (Binance, Bybit, OKX) | Build in-house | API standar, volume user tinggi, worth the effort | Tim connector internal |
| **CEX Crypto Global Tier 2-3** | Community/Partner | Terlalu banyak untuk maintain semua | Connector marketplace |
| **Blockchain/On-chain data** (Ethereum, Solana, BTC, dll) | Partner | Sangat mahal bangun sendiri, sudah ada provider bagus | Covalent, Moralis, Alchemy |
| **Broker Saham IDX Besar** | Build + Partnership negosiasi | Diferensiasi terbesar, tapi butuh kerja sama resmi | Tim connector + BD |
| **Broker Saham IDX Kecil** | Community Connector | Terlalu banyak, prioritas rendah | Connector marketplace |
| **Harga Crypto** | Partner | Komoditas, CoinGecko/CMC sudah excellent | CoinGecko, CMC, fallback |
| **Harga Saham IDX** | Partner | IDX data tersedia via provider | IDX, RTI Business, dll |
| **Harga Emas Indonesia** | Partner | Data Antam/Pegadaian tersedia | Antam API atau scraping resmi |
| **NAB Reksa Dana** | Partner | Data tersedia via APERD/Bareksa | Bareksa, APERD |
| **Kurs Mata Uang** | Partner | Komoditas, BI + provider sudah bagus | BI, Open Exchange Rates |
| **Harga Properti** | Manual only | Tidak ada data pasar yang reliable per unit | - |

### Partner Provider Landscape

**Untuk data blockchain/on-chain:**

| Provider | Coverage | Harga | Pilihan |
|---|---|---|---|
| Covalent (GoldRush) | 200+ blockchain | Commercial | Utama |
| Moralis | ETH, SOL, BNB, dll | Freemium/Commercial | Backup |
| Alchemy | ETH, Polygon, dll | Commercial | Backup |
| Ankr | Multi-chain | Commercial | Backup |

**Untuk harga kripto:**

| Provider | Coverage | Update | Pilihan |
|---|---|---|---|
| CoinGecko Pro | 10.000+ coins | Real-time/1 min | Utama |
| CoinMarketCap Pro | 10.000+ coins | Real-time/1 min | Fallback |
| Binance WebSocket | Top pairs | Real-time | Untuk pairs Binance |
| CryptoCompare | Luas | Delayed OK | Backup tambahan |

**Untuk harga saham IDX:**

| Provider | Coverage | Update | Pilihan |
|---|---|---|---|
| RTI Business | IDX lengkap | Real-time/15 min | Utama |
| IDX Data (langsung) | IDX lengkap | EOD (end of day) | Backup |
| Alpha Vantage | Global + IDX | Delayed | Backup |

## 3.6 Prioritas Connector per Fase

### Phase 1 (MVP) — Connector Wajib Ada

```
Crypto Exchange (CEX):
├── Binance (Tier 1) ← Terbesar secara global, user Indonesia banyak di sini
├── Bybit (Tier 1) ← Populer di Indonesia
└── Indodax (Tier 1) ← Exchange Indonesia terbesar

Crypto Wallet (On-chain via partner):
├── Ethereum wallet address (via Covalent/Moralis)
└── Bitcoin address (via Blockchain.info API)

Manual Assets:
├── Emas (harga Antam otomatis)
├── Saham IDX (manual entry, harga otomatis dari provider)
└── Currency Wallet (semua ISO 4217 major)
```

### Phase 2 — Connector Tambahan

```
Crypto Exchange:
├── OKX (Tier 1)
├── Tokocrypto (Tier 1 — Indonesia)
├── Pintu (Tier 1 — Indonesia)
└── Kucoin (Tier 2)

On-chain (via partner):
├── Solana wallet address
├── BNB Chain address
└── Polygon address

Manual:
└── Reksa dana (input manual, lookup NAB dari provider)
```

### Phase 3 — Ekspansi

```
Crypto Exchange:
├── Gate.io (Tier 2)
├── Bitget (Tier 2)
└── Exchange Indonesia lain sesuai demand

Broker IDX (tergantung API availability + negosiasi):
├── Ajaib (Class B Partnership target / Community fallback)
├── Stockbit (Class B Partnership target / Community fallback)
└── Broker sekuritas lain

On-chain tambahan:
└── Avalanche, Arbitrum, Optimism (via partner)
```

## 3.7 Connector Lifecycle Management

### States sebuah Connector

```
DRAFT → TESTING → ACTIVE → DEGRADED → DEPRECATED → REMOVED
  │         │         │          │           │
  │         │         │          │           └── Tidak bisa diaktifkan
  │         │         │          └── Berfungsi sebagian, ada masalah
  │         │         └── Berfungsi normal
  │         └── Internal testing, belum publik
  └── Dalam pengembangan
```

### Perubahan State dan Notifikasi

| Transisi | Siapa yang Diberitahu | Cara Diberitahu |
|---|---|---|
| ACTIVE → DEGRADED | User yang pakai connector ini | In-app notifikasi + email |
| DEGRADED → ACTIVE | User yang pakai | In-app notifikasi |
| ACTIVE → DEPRECATED | User yang pakai | Email 90 hari sebelum + 30 hari sebelum + 7 hari sebelum |
| DEPRECATED → REMOVED | User yang pakai | Email final + banner di app |

### Connector Version Control

Setiap connector punya versi (semver). Ketika provider mengubah API:
1. Tim Joben (atau komunitas) membuat versi baru connector
2. Testing di staging environment
3. Rollout gradual ke production (5% → 20% → 100%)
4. Versi lama di-deprecate setelah 14 hari (atau segera jika kritis)

---

# BAGIAN 4 — CONNECTOR RELIABILITY FRAMEWORK

## 4.1 Tiering SLA Detail

### SLA Metrics

Setiap connector Tier 1 dan Tier 2 diukur berdasarkan:

| Metric | Tier 1 Target | Tier 2 Target |
|---|---|---|
| **Availability** | 99.9% per bulan | 99% per bulan |
| **Sync Success Rate** | >99% job berhasil | >95% job berhasil |
| **Data Freshness** | ≤5 menit keterlambatan (crypto) | ≤30 menit (saham) |
| **Error Recovery Time** | ≤1 jam untuk critical error | ≤4 jam |
| **Contract Test Pass Rate** | 100% harian | 95% harian |

### SLA Violations & Consequences

Jika SLA Tier 1 dilanggar (availability <99.9% dalam satu bulan):
- Internal: post-mortem wajib dalam 48 jam
- Eksternal (untuk B2B customers): kredit SLA sesuai ketentuan kontrak
- Connector secara otomatis diturunkan ke Tier 2 hingga 30 hari stabilitas terpenuhi

## 4.2 Connector Health Monitoring

### Arsitektur Monitoring

Setiap connector punya health check independen yang berjalan di luar sync job reguler:

```
Connector Health Check Flow:
│
├── Passive Monitoring (dari sync job reguler)
│   ├── Catat: waktu mulai, waktu selesai, status (success/error)
│   ├── Catat: jumlah record yang di-sync
│   ├── Catat: error message jika gagal
│   └── Update: connector_health_metrics table
│
└── Active Probing (scheduled, terpisah dari sync)
    ├── Setiap 1 menit untuk Tier 1
    ├── Setiap 5 menit untuk Tier 2
    ├── Setiap 15 menit untuk Tier 3/Community
    └── Test: ping API endpoint dasar (tidak butuh credential user)
        untuk cek apakah API eksternal masih hidup
```

### Connector Health State Machine

```
HEALTHY → WARNING → CRITICAL → DOWN
    │          │          │
    │          │          └── 3+ consecutive failures
    │          └── 2 consecutive failures atau latency tinggi
    └── Semua check pass
```

**Alert Rules:**

| State Change | Alert Channel | Response Time |
|---|---|---|
| HEALTHY → WARNING | Slack #connector-alerts | 15 menit |
| WARNING → CRITICAL | Slack + PagerDuty | 5 menit |
| CRITICAL → DOWN | PagerDuty (wake up on-call) | Immediate |
| Any state → HEALTHY | Slack #connector-alerts | Informational |

### Connector Health Database

```sql
connector_health_checks (
  id              UUID PRIMARY KEY,
  connector_type  VARCHAR(50) NOT NULL,  -- 'binance', 'indodax', dll
  checked_at      TIMESTAMPTZ NOT NULL,
  check_type      VARCHAR(20) NOT NULL,  -- 'active_probe', 'sync_result'
  status          VARCHAR(20) NOT NULL,  -- 'healthy', 'warning', 'critical', 'down'
  latency_ms      INTEGER,
  error_code      VARCHAR(50),
  error_message   TEXT,
  metadata        JSONB
) PARTITION BY RANGE (checked_at);  -- Partisi per bulan
```

## 4.3 Automated Contract Testing

Ini adalah salah satu komponen paling penting untuk mendeteksi perubahan API pihak ketiga **sebelum** user terdampak.

### Apa itu Contract Test untuk Connector?

Sebuah test yang memverifikasi bahwa:
1. Endpoint API target masih ada dan merespons
2. Response memiliki field yang diharapkan (tidak hilang/berubah nama)
3. Tipe data field masih sesuai (angka tetap angka, bukan string)
4. Nilai yang diharapkan masuk range normal (mis. harga BTC tidak nol)

### Implementasi

```javascript
// Contoh contract test untuk connector Binance
describe('Binance Connector Contract', () => {
  it('GET /api/v3/ticker/price returns expected shape', async () => {
    const response = await binanceApiClient.getTickerPrice('BTCUSDT');
    
    expect(response).toMatchObject({
      symbol: expect.any(String),
      price: expect.stringMatching(/^\d+(\.\d+)?$/)  // numeric string
    });
    
    expect(parseFloat(response.price)).toBeGreaterThan(0);
  });
  
  it('GET /api/v3/account returns balance array when authenticated', async () => {
    const response = await binanceApiClient.getAccountInfo(testCredentials);
    
    expect(response).toHaveProperty('balances');
    expect(Array.isArray(response.balances)).toBe(true);
    
    if (response.balances.length > 0) {
      const balance = response.balances[0];
      expect(balance).toHaveProperty('asset');
      expect(balance).toHaveProperty('free');
      expect(balance).toHaveProperty('locked');
    }
  });
});
```

### Contract Test Scheduling

| Tier | Frequency | Test Credentials |
|---|---|---|
| Tier 1 | Setiap 1 jam | Test account internal Joben (read-only, saldo kecil) |
| Tier 2 | Setiap 4 jam | Test account internal |
| Tier 3/Community | Setiap 12 jam | Public endpoint test (tanpa auth) |

**Jika contract test gagal:**
- Tier 1: Alert langsung, prioritas fix tertinggi
- Tier 2: Alert dalam 15 menit, masuk queue next business hour
- Tier 3/Community: Alert ke maintainer connector di marketplace

## 4.4 Graceful Degradation Policy

Ini menjawab pertanyaan: **"Apa yang user lihat saat satu connector gagal sync?"**

### Levels of Degradation

**Level 1 — Data Stale (Connector OK tapi belum sync)**
- User lihat: Data terakhir yang valid + badge "Data dari [waktu terakhir sync]"
- Contoh: "BTC: Rp 650.000.000 (data 15 menit lalu)"
- Tidak ada error message, tapi ada indikator transparansi

**Level 2 — Connector Warning**
- User lihat: Data terakhir yang valid + badge kuning "Sinkronisasi bermasalah"
- Tooltip menjelaskan: "Connector ke Binance sedang mengalami gangguan. Data mungkin tidak terbaru."
- Link ke Connector Health Dashboard

**Level 3 — Connector Down**
- User lihat: Data terakhir yang valid (bisa beberapa jam lalu) + badge merah "Offline"
- Banner peringatan: "Data dari Binance belum berhasil di-update sejak [timestamp]. Net worth mungkin tidak akurat."
- Opsi user: "Coba reconnect" atau "Lihat status connector"

**Level 4 — Connector Removed (Deprecated)**
- User lihat: Banner merah "Connector ini tidak lagi tersedia"
- Data lama masih bisa dilihat tapi tidak di-update
- Prompt untuk menghapus connector atau beralih ke alternatif

### Rules penting:

1. **Never hide stale data** — Lebih baik tampilkan data lama dengan label yang jelas daripada tampilkan "..." atau angka salah.

2. **Net Worth Accuracy Indicator** — Di bagian total net worth, selalu tampilkan: "Akurasi data: X dari Y connector aktif berhasil sync dalam 1 jam terakhir." Jika ada connector offline, total net worth diberi asterisk (*) dengan catatan.

3. **User-controlled refresh** — User selalu bisa trigger manual sync dengan tombol refresh, bahkan jika jadwal otomatis belum tiba.

## 4.5 Deprecation Policy

### Timeline Deprecation

```
T-90 hari: Email pertama ke semua user yang pakai connector ini
           + Banner in-app (dismissible)

T-30 hari: Email kedua (lebih urgent)
           + Banner in-app (tidak dismissible, hanya bisa minimize)

T-7 hari:  Email final
           + Banner merah di dashboard

T-0:       Connector dimatikan
           + Data historis tetap tersimpan dan bisa dilihat
           + Tidak ada sync baru yang terjadi
```

### Alasan Valid untuk Deprecation

- Exchange/broker tutup atau menghentikan API
- Exchange melanggar ToS Joben Connect
- API berubah total dan tidak ada kapasitas untuk update
- Connector Community tidak ada yang maintain selama 6+ bulan
- Alasan legal/compliance

### Data Retention Pasca-Deprecation

Data historis yang sudah di-sync tetap tersimpan. User tidak kehilangan riwayat data mereka. Yang berubah hanya: tidak ada sync baru.

## 4.6 Public Health Dashboard

### Tujuan

Transparansi adalah fitur bisnis, bukan hanya technical. Developer B2B yang bergantung pada Joben Connect API perlu tahu status setiap connector secara real-time. Health dashboard publik membangun kepercayaan — ini persis yang dilakukan Plaid, Stripe, dan Twilio.

### Konten Dashboard (`status.jobenconnect.id`)

```
JOBEN CONNECT STATUS

Sistem Utama:
├── API (status.jobenconnect.id/api) ........ ✅ Operational
├── Authentication ......................... ✅ Operational
├── Portfolio Engine ....................... ✅ Operational
└── Notification Service .................. ✅ Operational

Connector Status — Crypto Exchange:
├── Binance (Tier 1) ..................... ✅ Operational | Uptime 30d: 99.97%
├── Bybit (Tier 1) ....................... ✅ Operational | Uptime 30d: 99.94%
├── Indodax (Tier 1) ..................... ⚠️  Degraded  | Uptime 30d: 99.21%
├── OKX (Tier 1) ......................... ✅ Operational | Uptime 30d: 99.91%
└── Tokocrypto (Tier 2) .................. ✅ Operational | Uptime 30d: 98.7%

Connector Status — Saham:
├── Manual Asset (IDX pricing) ........... ✅ Operational
└── ...

Price Data Providers:
├── CoinGecko ............................ ✅ Operational
├── RTI Business (IDX) ................... ✅ Operational
└── BI Kurs ............................... ✅ Operational

Recent Incidents:
└── [2026-07-28] Indodax connector mengalami keterlambatan sync 2 jam
    akibat perubahan rate limiting dari sisi Indodax. Resolved.
```

### Technical Implementation

- Dashboard di-serve dari server terpisah dari API utama (tidak boleh down bersamaan)
- Data diambil dari `connector_health_metrics` table melalui read replica
- Update setiap 1 menit
- Incident history tersimpan permanen

---

# BAGIAN 5 — SECURITY ARCHITECTURE

## 5.1 Threat Model Spesifik Platform Ini

Sebelum membahas solusi keamanan, kita harus jelas tentang apa yang kita lindungi dan dari siapa.

### Aset yang Dilindungi (urut dari paling kritis)

1. **API Key/Secret user ke exchange** — Jika ini dicuri, penyerang bisa mengakses (bahkan trade atau withdraw) aset kripto user. Ini adalah target serangan #1.
2. **Credential user ke Joben Connect** — Email + password akun.
3. **Data portfolio & net worth** — Informasi keuangan sensitif.
4. **Data PII** — Email, nomor telepon (jika ada).
5. **Audit trail** — Jika bisa dimanipulasi, hilangnya kemampuan forensik.

### Threat Actors

| Actor | Motivasi | Kemampuan | Contoh Serangan |
|---|---|---|---|
| Attacker eksternal | Finansial | Tinggi (organized) | Breach credential vault, mass API key theft |
| Insider threat | Finansial / sabotase | Tinggi (akses internal) | DBA yang mengakses data user |
| Automated bot | Credential stuffing | Medium | Brute force login |
| Malicious connector dev | Data theft | Medium | Connector berbahaya di marketplace |
| Phishing | Akun user | Low-Medium | Fake Joben Connect login page |

### Threat Scenarios Paling Kritis

**Scenario T1: Credential Vault Breach**
Penyerang berhasil akses ke penyimpanan API key user.  
Dampak: Semua user yang punya crypto connector terdampak.  
Mitigasi: Envelope encryption, vault terpisah, mTLS internal, audit log.

**Scenario T2: Admin Credential Compromise**
Akun admin/engineer dikuasai penyerang.  
Dampak: Akses ke database, bisa lihat data semua user.  
Mitigasi: MFA wajib semua akun internal, least-privilege access, audit log.

**Scenario T3: Malicious Third-Party Connector**
Connector di marketplace mengumpulkan data user yang tidak seharusnya.  
Dampak: Data bocor ke pihak ketiga.  
Mitigasi: Code review wajib, sandbox terisolasi, permission scoping.

**Scenario T4: JWT/Session Token Theft**
Token akses user dicuri via XSS atau network intercept.  
Dampak: Akses ke akun user selama masa berlaku token.  
Mitigasi: Token berumur pendek, httpOnly cookie, CSP headers.

## 5.2 Secret & Credential Management

### Arsitektur Credential Vault

```
User Browser/App
      │
      │ [HTTPS/TLS 1.3]
      ▼
API Gateway (BFF)
      │
      │ [mTLS internal]
      ▼
Auth Service ─────────────────────── Secret Vault Service
      │                                       │
      │ [hanya credential_ref, bukan          │ [Isolated network segment]
      │  secret plaintext yang disimpan]       │ HashiCorp Vault / AWS KMS
      │                                       │
      ▼                                       ▼
Connector Service ─── [Minta secret] ──► Vault Service
      │                                  (decrypt on-demand,
      │                                   tidak store plaintext
      ▼                                   di memory lebih dari
Exchange API                              satu request)
```

### Envelope Encryption

Setiap API key user dienkripsi dengan dua layer:

```
Plaintext API Key  →  [Enkripsi dengan Data Key] → Encrypted API Key
Data Key           →  [Enkripsi dengan Master Key di KMS] → Encrypted Data Key

Yang disimpan di vault: Encrypted API Key + Encrypted Data Key
Yang disimpan di KMS: Master Key (tidak pernah keluar dari KMS)

Untuk decrypt:
1. Request Master Key dari KMS untuk decrypt Data Key
2. Gunakan Data Key untuk decrypt API Key
3. Pakai API Key untuk request ke exchange
4. Hapus plaintext dari memory setelah dipakai
```

### Read-Only Validation

Setiap kali user menambah connector exchange:

```javascript
async function validateConnectorPermissions(apiKey, apiSecret, exchangeType) {
  const exchangeClient = createExchangeClient(exchangeType, apiKey, apiSecret);
  
  // Test: cek apakah bisa baca balance (harus bisa)
  const canRead = await exchangeClient.testReadAccess();
  if (!canRead) {
    throw new Error('API key tidak memiliki permission baca. Pastikan read permission diaktifkan.');
  }
  
  // Test: cek apakah bisa trade (seharusnya TIDAK bisa)
  const canTrade = await exchangeClient.testTradeAccess();
  if (canTrade) {
    throw new Error('API key memiliki permission trading. Untuk keamanan, buat API key baru dengan hanya permission read/view saja.');
  }
  
  // Test: cek apakah bisa withdraw (seharusnya TIDAK bisa)
  const canWithdraw = await exchangeClient.testWithdrawAccess();
  if (canWithdraw) {
    throw new Error('API key memiliki permission withdrawal. Ini berbahaya. Buat API key baru dengan hanya permission read/view saja.');
  }
  
  return { valid: true, permissions: ['read'] };
}
```

Catatan: Tidak semua exchange memungkinkan test permission tanpa melakukan request nyata. Untuk exchange yang tidak bisa di-test, pendekatan alternatif: dry-run endpoint yang tidak menimbulkan efek samping.

### Credential Lifecycle

```
PENAMBAHAN:
1. User input API Key + Secret
2. Validasi permission (read-only check)
3. Enkripsi dengan envelope encryption
4. Simpan Encrypted Key + credential_ref (UUID) ke vault
5. Simpan credential_ref (bukan key) ke tabel connectors di database utama
6. Konfirmasi ke user
7. Log di audit_log: action=CONNECTOR_ADDED, tanpa menyimpan key apapun

PENGGUNAAN:
1. Connector service ambil credential_ref dari database
2. Request ke vault: "berikan decrypted key untuk ref X"
3. Vault decrypt dan return plaintext key (via mTLS)
4. Pakai key untuk request ke exchange
5. Hapus dari memory

PENCABUTAN:
1. User klik "Hapus Connector"
2. Konfirmasi eksplisit dari user
3. Hapus encrypted key dari vault (bukan soft delete — benar-benar dihapus)
4. Update status connector di database: REVOKED
5. Stop semua scheduled sync untuk connector ini
6. Log di audit_log: action=CONNECTOR_REMOVED
```

## 5.3 Authentication & Authorization

### User Authentication Flow

```
Login Request
│
├── Rate limiting check (per IP + per email)
│   └── 5 gagal → lock 15 menit, 10 gagal → lock 1 jam, 20 gagal → manual review
│
├── Credential validation (email + password bcrypt)
│
├── JWT Access Token (expires: 15 menit)
│   └── Payload: user_id, tenant_id, roles[], jti (unique token ID)
│
├── Refresh Token (expires: 30 hari)
│   ├── Simpan di httpOnly Secure cookie
│   ├── Satu refresh token per device/session
│   └── Rotation: setiap kali dipakai, token lama dicabut, token baru diterbitkan
│
└── Session record di database:
    └── {user_id, jti, device_fingerprint, created_at, last_used_at, revoked_at}
```

### MFA (Multi-Factor Authentication)

**Wajib MFA untuk aksi berikut:**
- Menambah connector baru (exchange/broker)
- Menghapus connector
- Mengubah email atau password
- Mengekspos atau generate API key developer
- Mengubah subscription plan
- Mengakses data export lengkap

**Implementasi MFA:**
- TOTP (Time-based One-Time Password) via authenticator app (Google Authenticator, Authy, dll)
- 6-digit code, valid 30 detik
- Recovery codes: 10 kode backup satu-pakai, disimpan terenkripsi
- MFA tidak wajib untuk login biasa (Phase 1) — tapi direkomendasikan dan ada incentive untuk mengaktifkan

**Future MFA (Phase 3+):**
- WebAuthn / Passkeys sebagai opsi tambahan
- SMS OTP (sebagai fallback saja, bukan opsi utama — lebih rentan SIM swap)

### Authorization Model

**RBAC (Role-Based Access Control) — Phase 1 sederhana:**

```
User Roles (per account):
├── OWNER: pemilik akun, akses penuh
├── VIEWER: bisa lihat data tapi tidak bisa edit (untuk Phase 3+ multi-user)
└── DEVELOPER: akses ke developer dashboard & API key management
```

**RBAC Multi-Tenant (Phase 4 Business tier):**

```
Tenant (Organization)
└── Workspace (mis. "Portofolio Keluarga", "Bisnis A")
    ├── OWNER: Admin tenant
    ├── ADMIN: Kelola members, bisa edit
    ├── MEMBER: Bisa edit data sendiri
    └── VIEWER: Baca saja
```

### OAuth2 untuk Developer API

```
Flow Client Credentials (Server-to-Server):
1. Developer daftar di developer.jobenconnect.id
2. Buat OAuth2 App → dapat client_id + client_secret
3. Server developer request: POST /oauth/token
   {grant_type: client_credentials, client_id, client_secret, scope}
4. Response: access_token (expires: 1 jam)
5. Pakai access_token untuk API calls

Flow Authorization Code (User-facing App):
1. App developer redirect user ke Joben OAuth page
2. User login + review permissions yang diminta
3. User klik "Izinkan"
4. Joben redirect ke callback URL dengan authorization_code
5. Server developer exchange code → access_token + refresh_token
6. Akses API dengan scope yang diizinkan user
```

**Scope yang tersedia untuk developer:**

```
portfolio:read         → Baca data portfolio (net worth, breakdown)
assets:read            → Baca daftar aset per kategori
transactions:read      → Baca riwayat transaksi (dari connector)
profile:read           → Baca profil dasar user
webhooks:write         → Daftarkan endpoint webhook
```

## 5.4 Data Protection

### Enkripsi Data at Rest

| Data | Enkripsi | Implementasi |
|---|---|---|
| API Key/Secret user | Envelope encryption AES-256-GCM | Vault terpisah |
| Email user | Column-level encryption | pgcrypto di PostgreSQL |
| Password | Bcrypt (cost factor 12+) | Tidak pernah disimpan plaintext |
| Data portfolio | Disk encryption (database level) | PostgreSQL di-deploy di encrypted storage |
| Backup database | Enkripsi sebelum upload | AES-256, key di KMS |
| Audit log | Tidak dienkripsi per-field (butuh bisa dicari) | Tapi akses dibatasi ketat |

### Enkripsi Data in Transit

- **User ke API:** TLS 1.3 wajib. TLS 1.2 di-support sebagai fallback (dihapus Phase 2). SSLv3/TLS 1.0/1.1 diblokir.
- **Service ke service:** mTLS (mutual TLS) — setiap service punya sertifikat, kedua pihak saling verifikasi.
- **Ke provider eksternal (exchange, price provider):** TLS 1.3 wajib. Jika provider tidak support, escalate dan pertimbangkan tidak mengintegrasikan provider tersebut.

### PII Data Inventory

```
Data PII yang dikumpulkan Joben Connect:
┌─────────────────────────────────────────────────────────────┐
│ Field      │ Kategori   │ Enkripsi  │ Retention │ Shared?   │
├────────────┼────────────┼───────────┼───────────┼───────────┤
│ email      │ Identifer  │ Column    │ Life+72h  │ Payment GW│
│ nama       │ Identifer  │ Plaintext │ Life+72h  │ No        │
│ password   │ Credential │ Bcrypt    │ Life+72h  │ No        │
│ API keys   │ Credential │ Envelope  │ Until rev.│ No        │
│ IP login   │ Technical  │ Plaintext │ 90 hari   │ No        │
│ Portfolio  │ Financial  │ Disk      │ Life+72h  │ w/ consent│
└─────────────────────────────────────────────────────────────┘
```

## 5.5 Application Security (Node.js Spesifik)

### Input Validation

Semua request masuk divalidasi dengan **Zod schema** sebelum masuk business logic:

```typescript
// Contoh: schema untuk tambah manual asset
const AddManualAssetSchema = z.object({
  category: z.enum(['CRYPTO', 'STOCKS', 'PRECIOUS_METALS', 'CURRENCY', 'PROPERTY', 'OTHER']),
  asset_identifier: z.string().min(1).max(50).regex(/^[A-Z0-9\-\.]+$/),
  quantity: z.number().positive().max(1e15),
  avg_buy_price: z.number().positive().optional(),
  label: z.string().max(100).optional(),
});

// Zod otomatis reject jika ada field ekstra (strict mode)
// Zod transform untuk sanitize sebelum save
```

### Database Security

- **Wajib parameterized query** via Prisma ORM. Raw SQL string concatenation dilarang eksplisit.
- Database user di PostgreSQL punya minimal privilege (bukan superuser)
- Separate DB user per service (Connector Service tidak bisa akses tabel billing, dll)

### HTTP Security Headers

Semua response dari API Gateway wajib include headers berikut (via `helmet` middleware):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: [dikonfigurasi per endpoint]
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Rate Limiting

```
Rate limit tiers (via rate-limiter-flexible + Redis):
│
├── Per IP (unauthenticated):
│   ├── Login attempts: 5/menit per IP
│   ├── Registration: 3/jam per IP
│   └── General: 100 req/menit per IP
│
├── Per User (authenticated):
│   ├── API calls: sesuai plan (Free: 100/jam, Starter: 1.000/jam, Pro: 10.000/jam)
│   ├── Connector sync manual: 5/jam per connector
│   └── Sensitive actions (add connector, change password): 3/jam
│
└── Per API Key (developer):
    └── Sesuai plan (Free developer: 1.000/hari, Pro: 100.000/hari)
```

### Dependency Security

- **npm audit** dijalankan di setiap CI build — build gagal jika ada `high` atau `critical` vulnerability
- **Dependabot** atau **Renovate** untuk automated dependency updates
- **Lockfile** (package-lock.json) di-commit dan di-verify di CI (tidak boleh ada drift antara lockfile dan node_modules)
- **Pinning versi** untuk production dependencies (tidak pakai `^` atau `~` untuk minor/patch — terlalu banyak risk supply chain attack)

### Third-Party Connector Sandbox (Phase 4)

Connector pihak ketiga yang masuk marketplace **tidak boleh dieksekusi di process utama**:

```
Sandbox Architecture:
User Request
     │
     ▼
Connector Orchestrator
     │
     └── Spawn: Docker container per connector execution
           │
           ├── Network policy: hanya boleh akses domain yang terdaftar saat connector review
           ├── Resource limit: 256MB RAM, 0.5 CPU, timeout 30 detik
           ├── No filesystem access kecuali /tmp ephemeral
           └── Result: structured JSON response → dikirim ke orchestrator → disimpan ke DB
```

## 5.6 Audit & Compliance

### Audit Log

Tabel `audit_log` adalah **append-only** — tidak ada UPDATE atau DELETE yang boleh dilakukan melalui aplikasi. Implementasi: row-level security di PostgreSQL yang memblokir UPDATE/DELETE, dikombinasi dengan application-level enforcement.

```sql
CREATE TABLE audit_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ts          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id    UUID,        -- user_id yang melakukan aksi (null jika sistem)
  actor_type  VARCHAR(20), -- 'user', 'system', 'developer_api'
  action      VARCHAR(100) NOT NULL,  -- 'CONNECTOR_ADDED', 'LOGIN_SUCCESS', dll
  target_type VARCHAR(50),  -- 'connector', 'portfolio', 'subscription'
  target_id   UUID,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,        -- detail tambahan, tidak ada PII sensitif
  
  -- Append-only enforcement via trigger:
  -- CREATE TRIGGER prevent_audit_modification
  --   BEFORE UPDATE OR DELETE ON audit_log
  --   EXECUTE FUNCTION raise_exception('audit_log is append-only');
) PARTITION BY RANGE (ts);  -- Partisi per bulan
```

**Aksi yang wajib di-audit:**
- Login success/failure
- Logout
- Password change / email change
- MFA enable/disable
- Connector added / removed / sync_failed
- Manual asset created / updated / deleted
- Subscription upgrade / downgrade / cancel
- API key generated / revoked
- Data export requested
- User account deleted
- Admin access ke data user (oleh tim internal)

### Penetration Testing

| Timing | Scope | Provider |
|---|---|---|
| Sebelum Phase 1 launch | Scope: Auth, Connector, API Gateway | External vendor (bukan tim internal) |
| Sebelum Phase 2 launch | Scope: Billing, Public API, Developer Platform | External vendor |
| Setiap tahun (ongoing) | Full scope | External vendor berganti (berbeda tiap tahun) |

### Bug Bounty Program

- Launch: setelah Public API v1 stabil (mid Phase 2)
- Platform: HackerOne atau Bugcrowd
- Scope: API, web app, connector security
- Out of scope: Social engineering, physical, DDoS
- Reward structure: ditentukan berdasarkan severity (CVSS) — dari Rp 500rb (Low) sampai Rp 50jt (Critical)

## 5.7 Incident Response Plan

### Klasifikasi Insiden

| Level | Kriteria | Contoh |
|---|---|---|
| P0 - Critical | Data user bocor, credential vault compromised | Breach ke vault API key |
| P1 - High | Service utama down >30 menit, autentikasi bermasalah | Database down |
| P2 - Medium | Connector Tier 1 down, data tidak akurat | Binance connector gagal |
| P3 - Low | Minor bug, performance degradation | Halaman loading lambat |

### Prosedur P0 (Credential Breach)

```
T+0:   Deteksi anomali (monitoring alert / laporan user / bug bounty)
T+5:   On-call engineer konfirmasi insiden, eskalasi ke CTO/CEO
T+15:  Isolasi: matikan akses dari semua service ke vault
T+30:  Notifikasi awal ke tim internal (Slack #incident-response)
T+1h:  Asses scope: berapa user terdampak, data apa yang bocor
T+2h:  Forced rotation semua token aktif (semua user harus re-login)
T+4h:  Notifikasi awal ke user terdampak via email
T+14d: Laporan lengkap ke Otoritas PDP (kewajiban UU PDP)
T+30d: Post-mortem publik (jika dinilai perlu untuk transparansi)
```

### Kontak Darurat

- On-call engineer: via PagerDuty
- CTO: langsung via nomor pribadi
- Legal/Compliance: via nomor pribadi
- Vendor pentest (untuk incident forensics): pre-agreed SLA response

---

# BAGIAN 6 — ARSITEKTUR SISTEM

## 6.1 Prinsip Arsitektur

1. **Separation of Concerns** — Setiap service punya tanggung jawab yang jelas dan tidak tumpang tindih.
2. **Failure Isolation** — Kegagalan satu service tidak boleh cascade ke service lain. Connector Service down tidak boleh membuat Portfolio Engine down.
3. **Data Consistency over Eventual Consistency** — Untuk data finansial, kita pilih konsistensi daripada availability. Lebih baik tampilkan data lama yang benar daripada data baru yang mungkin salah.
4. **Async by Default** — Operasi yang tidak perlu sinkron (sync connector, repricing, notifikasi) dijadikan async via job queue. Ini membuat API response cepat dan sistem lebih resilient.
5. **Observable by Default** — Setiap service emits traces, metrics, dan logs sejak dari awal. Bukan ditambahkan belakangan.

## 6.2 Gambaran Umum (Arsitektur Diagram)

```
                              INTERNET
                                 │
                         [TLS 1.3 termination]
                                 │
                    ┌────────────▼────────────┐
                    │    API Gateway (BFF)     │
                    │   Node.js / Fastify      │
                    │   - Auth verification    │
                    │   - Rate limiting        │
                    │   - Request routing      │
                    │   - Response aggregation │
                    │   - Schema validation    │
                    └──┬─────┬──────┬──────┬──┘
                       │     │      │      │
          [mTLS internal network]   │      │
                       │     │      │      │
           ┌───────────┘     │      │      └──────────────┐
           │                 │      │                      │
    ┌──────▼──────┐   ┌──────▼─┐  ┌▼────────────┐  ┌─────▼──────────┐
    │ Auth Service│   │Connector│  │Manual Asset │  │   Billing /    │
    │             │   │Service  │  │Engine       │  │  Subscription  │
    │ - Login     │   │         │  │             │  │  Service       │
    │ - JWT       │   │ Crypto  │  │ - CRUD      │  │                │
    │ - MFA       │   │ CEX/DEX │  │ - Currency  │  │ - Plans        │
    │ - OAuth2    │   │         │  │   Wallet    │  │ - Quotas       │
    └─────────────┘   └────┬────┘  └──────┬──────┘  └──────┬─────────┘
                           │              │                  │
                           └──────┬───────┘                  │
                                  │                          │
                         ┌────────▼────────┐         ┌──────▼──────────┐
                         │  Job Queue      │         │ Payment Gateway  │
                         │  BullMQ/Redis   │         │ Midtrans/Xendit  │
                         │                │         └──────────────────┘
                         │ - Sync jobs     │
                         │ - Reprice jobs  │
                         │ - Notif jobs    │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼──────────────┐
                    │             │              │
           ┌────────▼──────┐  ┌───▼────────┐  ┌─▼──────────────┐
           │Price Intel.   │  │ Portfolio  │  │ Notification   │
           │Service        │  │ Engine     │  │ Service        │
           │               │  │            │  │                │
           │ - Fetch harga │  │ - Net worth│  │ - Email        │
           │ - Cache Redis │  │ - P/L calc │  │ - Push         │
           │ - Time-series │  │ - Allocation│ │ - Webhook      │
           │   snapshot    │  │            │  │                │
           └───────┬───────┘  └─────┬──────┘  └────────────────┘
                   │                │
                   └────────┬───────┘
                            │
                ┌───────────▼──────────┐
                │    PostgreSQL         │
                │  (Primary)            │
                │  + TimescaleDB ext    │
                │  + Read Replica       │
                └───────────────────────┘

Additional Infrastructure:
├── Redis (3 separate logical databases)
│   ├── Cache (harga, quota status)
│   ├── Queue (BullMQ — sync/reprice/notif)
│   └── Rate limit counter
├── Secret Vault (HashiCorp Vault)
│   └── Isolated network segment
└── Observability Stack
    ├── OpenTelemetry collector
    ├── Prometheus (metrics)
    ├── Loki (logs)
    └── Grafana (dashboards)
```

## 6.3 Service Breakdown

### API Gateway (BFF — Backend for Frontend)

**Tanggung Jawab:**
- Single entry point untuk semua request dari web app dan public API
- JWT verification untuk setiap request
- Rate limiting (per IP, per user, per API key)
- Request routing ke service yang tepat
- Response aggregation (beberapa call ke service berbeda digabung jadi satu response untuk frontend)
- Request/response logging ke observability stack
- Schema validation (Zod) sebelum diteruskan ke service

**Tidak boleh:**
- Tidak boleh punya business logic sendiri
- Tidak boleh akses database langsung (kecuali baca session/quota dari Redis)

**Stack:** Node.js, Fastify, @fastify/rate-limit, Zod, OpenTelemetry

---

### Auth Service

**Tanggung Jawab:**
- Registrasi user (email + password)
- Login (validate credentials, issue JWT)
- JWT verification endpoint (dipanggil oleh API Gateway)
- Refresh token management
- MFA enrollment dan verification (TOTP)
- Password reset flow
- OAuth2 Authorization Server (untuk developer API)
- Session management

**Database:**
- users, sessions, mfa_configs, oauth_clients, oauth_tokens

**Stack:** Node.js, Fastify, bcrypt, speakeasy (TOTP), jsonwebtoken

---

### Connector Service

**Tanggung Jawab:**
- Manajemen lifecycle connector (add, test, remove)
- Scheduled sync job untuk setiap active connector
- Interface ke vault service untuk retrieve credentials
- Normalisasi data dari exchange ke UDS (Universal Data Standard)
- Report hasil sync ke Portfolio Engine via event

**Arsitektur internal:**

```
Connector Service
├── Connector Registry (daftar semua connector yang tersedia)
├── Sync Scheduler (BullMQ job producer)
├── Exchange Adapters (satu adapter per exchange)
│   ├── BinanceAdapter
│   ├── BybitAdapter
│   ├── IndodaxAdapter
│   └── ... (setiap adapter implement ConnectorInterface)
└── Data Normalizer (exchange data → UDS format)
```

**ConnectorInterface yang wajib diimplementasikan setiap adapter:**

```typescript
interface ConnectorInterface {
  // Validasi credential sebelum disimpan
  validateCredentials(apiKey: string, apiSecret: string): Promise<ValidationResult>;
  
  // Fetch semua holdings saat ini
  fetchHoldings(credentials: DecryptedCredentials): Promise<AssetHolding[]>;
  
  // Fetch transaksi historis (opsional, untuk P/L calculation)
  fetchTransactions(credentials: DecryptedCredentials, since?: Date): Promise<Transaction[]>;
  
  // Health check (tanpa credential)
  healthCheck(): Promise<HealthCheckResult>;
  
  // Metadata
  getConnectorInfo(): ConnectorInfo;  // nama, tier, logo URL, dll
}
```

---

### Manual Asset Engine

**Tanggung Jawab:**
- CRUD operasi untuk manual asset entries
- Currency wallet entries (multi-currency holdings)
- Trigger repricing job saat asset baru ditambah
- Duplikasi detection (peringatkan jika ada potensi double counting)
- Validasi input (quantity positif, satuan valid, dll)

---

### Price Intelligence Service

**Tanggung Jawab:**
- Fetch harga dari provider eksternal (CoinGecko, RTI, BI, Antam, dll)
- Cache harga di Redis dengan TTL berbeda per kategori
- Simpan snapshot harga ke PostgreSQL (TimescaleDB)
- Fallback otomatis ke provider backup jika provider utama down
- Emit event saat ada perubahan harga signifikan (untuk trigger repricing)

**TTL Cache per Kategori:**

| Kategori | Provider Utama | TTL Cache | Update Frequency |
|---|---|---|---|
| Crypto (top 100) | CoinGecko | 60 detik | Real-time (atau 1 menit) |
| Crypto (lainnya) | CoinGecko | 5 menit | Per request |
| Saham IDX | RTI Business | 15 menit | Market hours only |
| Emas (Antam/Pegadaian) | Provider lokal | 1 jam | 1x sehari (harga tidak berubah intraday) |
| Kurs Mata Uang | BI + Open Exchange | 1 jam (hari kerja) | Hari kerja saja |
| Reksa Dana (NAB) | Provider reksa dana | 1 hari | Per-hari setelah cut-off |

---

### Portfolio Engine

**Tanggung Jawab:**
- Kalkulasi net worth (semua aset dalam IDR)
- Kalkulasi P/L unrealized per aset dan total
- Breakdown portofolio per kategori
- Kalkulasi alokasi (% per kategori)
- Simpan portfolio snapshot secara berkala
- Real-time update saat ada event repricing

**Kalkulasi Net Worth:**

```
Net Worth (IDR) = 
  Σ (Crypto Holdings × Harga Crypto dalam IDR) +
  Σ (Saham × Harga Saham × Nilai Lot dalam IDR) +
  Σ (Emas Gram × Harga Gram Emas dalam IDR) +
  Σ (Currency Holdings × Kurs ke IDR) +
  Σ (Reksa Dana Units × NAB per Unit) +
  Σ (Manual Assets dengan harga custom)
```

**P/L Unrealized:**

```
P/L per aset = (Harga Pasar Saat Ini - Avg Buy Price) × Quantity

Catatan:
- Jika avg_buy_price tidak tersedia (tidak diinput user, tidak ada dari transaksi):
  tampilkan "N/A" — BUKAN nol. Nol salah dan menyesatkan.
- Untuk currency holdings: tidak ada P/L concept (ini bukan investasi)
```

---

### Billing/Subscription Service

*(Detail lengkap di Bagian 9)*

**Tanggung Jawab:**
- Manajemen plan dan feature flags per user/tenant
- Integrasi payment gateway (Midtrans/Xendit)
- Quota enforcement (diekspos ke API Gateway)
- Invoice generation
- Webhook handling dari payment gateway
- Usage metering

---

### Notification Service

**Tanggung Jawab:**
- Konsumsi event dari job queue (push notification, email trigger, webhook delivery)
- Email via provider (SendGrid atau Mailgun)
- Push notification via Firebase Cloud Messaging
- Webhook delivery ke developer apps
- Retry logic untuk notifikasi yang gagal terkirim

**Notification Types:**
- Sync gagal (connector error)
- Mendekati batas kuota (80% terpakai)
- Harga perubahan signifikan (threshold yang user set)
- Billing: invoice baru, renewal approaching, payment failed
- Security alerts: login dari device/lokasi baru

## 6.4 PostgreSQL & TimescaleDB Design

### Ekstensi yang Dipakai

```sql
-- Wajib install di PostgreSQL instance:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- Column-level encryption
CREATE EXTENSION IF NOT EXISTS "timescaledb";  -- Time-series untuk price data
CREATE EXTENSION IF NOT EXISTS "pg_partman";   -- Partisi otomatis untuk log tables
```

### Partisi dan Performance

**Tabel yang harus di-partition:**

```sql
-- price_snapshots: TimescaleDB hypertable, partisi per bulan otomatis
SELECT create_hypertable('price_snapshots', 'ts', chunk_time_interval => INTERVAL '1 month');

-- audit_log: partisi per bulan (data tumbuh besar tapi jarang di-query historis)
-- sync_log: partisi per bulan
-- usage_meters: partisi per bulan
```

**Indexing Strategy:**

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Connectors
CREATE INDEX idx_connectors_user_status ON connectors(user_id, status);

-- Manual Assets
CREATE INDEX idx_manual_assets_user_category ON manual_assets(user_id, category);

-- Price Snapshots (TimescaleDB manage sendiri berdasarkan time + identifier)
CREATE INDEX idx_price_snapshots_identifier ON price_snapshots(asset_identifier, category);

-- Audit Log
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id, ts DESC);
CREATE INDEX idx_audit_log_target ON audit_log(target_type, target_id, ts DESC);
```

### Read Replica Strategy

```
Write traffic → PostgreSQL Primary
Read traffic  → PostgreSQL Read Replica (dengan fallback ke primary jika replica lag)

Read replica dipakai untuk:
- Dashboard portfolio queries (berat, baca banyak data)
- Historical chart data
- Audit log queries
- Report generation

Write replica dipakai untuk:
- Semua INSERT/UPDATE/DELETE
- Quota enforcement (harus real-time, bukan eventual)
```

## 6.5 Caching & Queue Architecture

### Redis Instance Separation

Gunakan **3 Redis logical databases** (atau 3 instance terpisah di production):

```
Redis DB 0 — Price Cache
├── Key pattern: price:{category}:{identifier}
├── TTL: per kategori (1 menit untuk crypto, dll)
└── Invalidation: otomatis via TTL, atau manual force-refresh

Redis DB 1 — Job Queue (BullMQ)
├── Queue: connector-sync (high priority)
├── Queue: repricing (medium priority)
├── Queue: notifications (low priority, best-effort)
└── Queue: billing-events (medium priority)

Redis DB 2 — Rate Limit & Session Cache
├── Rate limit counters (per IP, per user)
├── Quota cache (plan limits, usage)
└── Short-term token cache
```

### BullMQ Job Architecture

```javascript
// Job Queue Priority
const QUEUE_CONFIG = {
  'connector-sync': {
    priority: 1,  // highest
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,  // simpan 100 completed jobs untuk debugging
  },
  'repricing': {
    priority: 2,
    attempts: 2,
    backoff: { type: 'fixed', delay: 10000 },
  },
  'billing-events': {
    priority: 2,
    attempts: 5,
    backoff: { type: 'exponential', delay: 3000 },
  },
  'notifications': {
    priority: 3,  // lowest
    attempts: 3,
    backoff: { type: 'exponential', delay: 30000 },
  },
};
```

**Job Types:**

| Job | Trigger | Frequency |
|---|---|---|
| `connector.sync` | Scheduler + manual trigger | Per connector: setiap 5 mnt (crypto), 15 mnt (saham) |
| `price.fetch` | Scheduler | Per kategori sesuai TTL |
| `portfolio.recalculate` | Event: sync selesai / harga berubah | Immediate setelah trigger |
| `notification.send` | Event dari berbagai service | Immediate dari queue |
| `billing.check_renewal` | Scheduler | Setiap hari jam 02:00 WIB |
| `connector.health_probe` | Scheduler | Per tier (1 mnt, 5 mnt, 15 mnt) |

## 6.6 Observability & Monitoring

### Three Pillars of Observability

**1. Metrics (Prometheus)**

```
System metrics:
- CPU, memory, network per service
- Database connection pool utilization
- Redis memory dan eviction rate
- Job queue depth per queue

Business metrics:
- Active users per hour
- Sync success rate per connector
- Net worth calculation latency (P95, P99)
- API response time per endpoint (P50, P95, P99)
- Billing events per hour
```

**2. Logs (Loki + structured JSON)**

```json
{
  "timestamp": "2026-08-01T10:00:00.000Z",
  "level": "info",
  "service": "connector-service",
  "trace_id": "abc123",
  "user_id": "[redacted]",  // jangan log user_id di level info ke bawah
  "connector_type": "binance",
  "event": "sync_completed",
  "duration_ms": 1250,
  "assets_synced": 15
}
```

**3. Traces (OpenTelemetry)**

Setiap request dari user ke API Gateway sampai ke database query harus bisa di-trace end-to-end. Ini penting untuk debug performance issue.

### Alerting Rules

```yaml
Alerting rules (Grafana):
- name: ConnectorSyncFailureRate
  condition: sum(sync_failures) / sum(sync_attempts) > 0.05  # >5% gagal
  severity: warning
  
- name: APILatencyHigh
  condition: p99_latency > 2000ms  # >2 detik P99
  severity: warning
  
- name: DatabaseConnectionPoolExhausted
  condition: active_connections / max_connections > 0.9
  severity: critical
  
- name: QueueDepthHigh
  condition: queue_depth['connector-sync'] > 1000
  severity: warning
  
- name: VaultServiceDown
  condition: vault_health_check == 0
  severity: critical
```

## 6.7 Infrastructure & Deployment

### Environment Setup

```
Environments:
├── development (local, setiap developer)
├── staging (shared, mirror production kecil)
├── production (Indonesia region, full scale)
└── sandbox (untuk developer API testing — isolated data)
```

### CI/CD Pipeline

```
Developer push ke GitHub
          │
          ▼
GitHub Actions:
├── Lint (ESLint + Prettier)
├── Type check (TypeScript)
├── Unit tests (Jest)
├── Integration tests (database + Redis mocked)
├── Security: npm audit (fail on high/critical)
├── Security: SAST scan (Semgrep)
├── Build Docker image
└── Push to registry
          │
          ▼
Staging deploy (auto, setiap push ke main)
├── Run migration (Prisma migrate)
├── Run e2e tests
└── Smoke tests
          │
          ▼
Production deploy (manual trigger, atau auto jika semua pass)
├── Blue/green deployment (zero downtime)
├── Run migration
├── Gradual traffic shift (5% → 25% → 100%)
└── Auto-rollback jika error rate > threshold
```

### Container Strategy

Setiap service di-deploy sebagai Docker container. Orchestrasi dengan Kubernetes (atau AWS ECS sebagai alternatif yang lebih simple untuk phase awal).

```
Kubernetes namespaces:
├── joben-core (API Gateway, Auth, Portfolio Engine)
├── joben-connectors (Connector Service — bisa scale independently)
├── joben-data (Price Intelligence Service)
├── joben-billing (Billing/Subscription Service)
├── joben-notifications (Notification Service)
└── joben-infra (Redis, monitoring)
```

## 6.8 Stack Summary

| Layer | Teknologi | Alasan Pilihan |
|---|---|---|
| Backend Runtime | Node.js LTS | Team familiarity, ekosistem luas, async-first |
| API Framework | Fastify | Lebih cepat dari Express, TypeScript-first, plugin ecosystem |
| Database Primary | PostgreSQL 16+ | ACID, mature, extensible |
| Time-series Extension | TimescaleDB | Price history tanpa database terpisah |
| ORM/Migration | Prisma | Type-safe, migration versioning, developer experience |
| Cache | Redis 7+ | De-facto standard |
| Job Queue | BullMQ | Built on Redis, reliable, good visibility |
| Secret Vault | HashiCorp Vault | Open source, mature, envelope encryption |
| Schema Validation | Zod | TypeScript-first, powerful, composable |
| Auth (TOTP) | Speakeasy | TOTP standard, well-tested |
| HTTP Security | Helmet.js | Automatic security headers |
| Rate Limiting | rate-limiter-flexible | Redis-backed, flexible configuration |
| Observability | OpenTelemetry + Grafana Stack | Open standard, vendor-neutral |
| Payment Gateway | Midtrans primary, Xendit backup | Lokal Indonesia, IDR native |
| Email | SendGrid primary, Mailgun backup | Reliability, deliverability |
| Infrastructure | AWS ap-southeast-3 (Jakarta) | Data residency Indonesia, mature |
| Container | Docker + Kubernetes | Standard, scalable |
| CI/CD | GitHub Actions | Simple, integrated |

---

# BAGIAN 7 — DATA MODEL & UNIVERSAL DATA STANDARD (UDS)

## 7.1 Filosofi UDS

UDS (Universal Data Standard) adalah format kanonik yang digunakan di seluruh internal Joben Connect untuk merepresentasikan data aset, harga, dan portfolio — terlepas dari sumber datanya.

**Mengapa UDS penting:**
- Exchange A mengembalikan saldo BTC sebagai `{"asset": "BTC", "balance": "0.5"}` (string)
- Exchange B mengembalikan sebagai `{"symbol": "BTC", "free": 0.5, "locked": 0.1}` (number)
- Broker IDX mengembalikan saham sebagai `{"kode": "BBCA", "lot": 10, "harga_pasar": 8750}`

Portfolio Engine tidak boleh tahu perbedaan ini. Semua data yang masuk ke Portfolio Engine harus sudah dalam format UDS.

**Siapa yang bertanggung jawab konversi:** Setiap Connector Adapter dan Manual Asset Engine. Mereka yang tahu format sumber dan mereka yang melakukan konversi ke UDS.

## 7.2 Schema Database Lengkap

```sql
-- ===================================
-- USERS & AUTH
-- ===================================

CREATE TABLE users (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email               BYTEA NOT NULL UNIQUE,  -- encrypted dengan pgcrypto
  email_hash          VARCHAR(64) NOT NULL UNIQUE,  -- sha256 untuk lookup
  name                VARCHAR(100),
  password_hash       VARCHAR(255) NOT NULL,
  is_email_verified   BOOLEAN DEFAULT FALSE,
  mfa_enabled         BOOLEAN DEFAULT FALSE,
  mfa_secret_ref      UUID,  -- reference ke vault, bukan secret-nya
  status              VARCHAR(20) DEFAULT 'active',  -- active, suspended, deleted
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  last_login_at       TIMESTAMPTZ
);

CREATE TABLE email_verifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(64) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ
);

CREATE TABLE sessions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash  VARCHAR(64) NOT NULL,
  device_fingerprint  VARCHAR(255),
  ip_address          INET,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  last_used_at        TIMESTAMPTZ DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL,
  revoked_at          TIMESTAMPTZ
);

CREATE TABLE mfa_recovery_codes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash   VARCHAR(64) NOT NULL,
  used_at     TIMESTAMPTZ
);

CREATE TABLE consent_log (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type    VARCHAR(100) NOT NULL,  -- 'analytics', 'marketing', dll
  granted         BOOLEAN NOT NULL,
  policy_version  VARCHAR(20) NOT NULL,
  ip_address      INET,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- TENANT & WORKSPACE (Phase 4 multi-user)
-- ===================================

CREATE TABLE tenants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  owner_id    UUID NOT NULL REFERENCES users(id),
  plan_id     UUID,  -- FK ke plans, added after plans table
  status      VARCHAR(20) DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 1: setiap user otomatis punya 1 tenant (personal tenant)
-- Phase 4: tenant bisa punya multiple users via workspace

-- ===================================
-- CONNECTORS
-- ===================================

CREATE TABLE connectors (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connector_type      VARCHAR(50) NOT NULL,  -- 'binance', 'bybit', 'indodax', dll
  connector_tier      VARCHAR(20) NOT NULL,  -- 'TIER_1', 'TIER_2', 'TIER_3', 'COMMUNITY'
  connector_class     VARCHAR(20) NOT NULL,  -- 'OFFICIAL_API', 'PARTNERSHIP', 'COMMUNITY', 'DEPRECATED'
  credential_ref      UUID NOT NULL,  -- reference ke vault entry
  status              VARCHAR(20) DEFAULT 'active',  -- active, error, paused, revoked
  last_sync_at        TIMESTAMPTZ,
  last_sync_status    VARCHAR(20),  -- 'success', 'partial', 'failed'
  last_sync_error     TEXT,
  sync_interval_sec   INTEGER DEFAULT 300,  -- 5 menit default
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, connector_type)  -- satu user hanya bisa punya 1 connector per exchange
);

CREATE TABLE connector_holdings (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connector_id        UUID NOT NULL REFERENCES connectors(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_identifier    VARCHAR(50) NOT NULL,  -- 'BTC', 'ETH', 'BBCA', dll
  asset_category      VARCHAR(50) NOT NULL,  -- 'CRYPTO', 'STOCKS', dll
  quantity            DECIMAL(30, 18) NOT NULL,
  avg_buy_price       DECIMAL(30, 8),  -- null jika tidak tersedia
  avg_buy_currency    CHAR(3),         -- currency dari avg_buy_price (biasanya 'IDR' atau 'USDT')
  synced_at           TIMESTAMPTZ NOT NULL,
  raw_data            JSONB,  -- data asli dari exchange sebelum normalisasi
  
  INDEX (user_id, asset_category),
  INDEX (connector_id, asset_identifier)
);

CREATE TABLE sync_log (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connector_id      UUID NOT NULL REFERENCES connectors(id),
  started_at        TIMESTAMPTZ NOT NULL,
  completed_at      TIMESTAMPTZ,
  status            VARCHAR(20) NOT NULL,
  assets_synced     INTEGER DEFAULT 0,
  error_code        VARCHAR(50),
  error_message     TEXT,
  duration_ms       INTEGER
) PARTITION BY RANGE (started_at);

-- ===================================
-- MANUAL ASSETS
-- ===================================

CREATE TABLE manual_assets (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category            VARCHAR(50) NOT NULL,
  asset_identifier    VARCHAR(50),  -- 'EMAS', 'BBCA', 'BTC', dll
  label               VARCHAR(200),  -- nama custom user untuk aset ini
  quantity            DECIMAL(30, 18) NOT NULL,
  unit                VARCHAR(20),  -- 'gram', 'lot', 'lembar', 'unit', dll
  avg_buy_price       DECIMAL(30, 8),
  avg_buy_price_currency CHAR(3) DEFAULT 'IDR',
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX (user_id, category)
);

-- ===================================
-- CURRENCY WALLET
-- ===================================

CREATE TABLE currency_holdings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency_code   CHAR(3) NOT NULL,
  amount          DECIMAL(20, 8) NOT NULL,
  label           VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, currency_code, label)
);

-- ===================================
-- PRICE DATA
-- ===================================

-- TimescaleDB hypertable
CREATE TABLE price_snapshots (
  ts                  TIMESTAMPTZ NOT NULL,
  asset_identifier    VARCHAR(50) NOT NULL,
  asset_category      VARCHAR(50) NOT NULL,
  price_idr           DECIMAL(30, 8),  -- nullable jika tidak langsung IDR
  price_usd           DECIMAL(30, 8),  -- nullable
  price_currency      CHAR(3) NOT NULL,  -- native currency of the price
  price_native        DECIMAL(30, 8) NOT NULL,
  source              VARCHAR(50) NOT NULL,  -- 'coingecko', 'rti', 'bi', dll
  delay_minutes       INTEGER DEFAULT 0,  -- 0=real-time, 15=delayed 15 mnt
  
  PRIMARY KEY (ts, asset_identifier, asset_category)
);

SELECT create_hypertable('price_snapshots', 'ts', chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_price_snapshots_lookup 
  ON price_snapshots (asset_identifier, asset_category, ts DESC);

-- Latest price view (for performance)
CREATE VIEW latest_prices AS
  SELECT DISTINCT ON (asset_identifier, asset_category)
    asset_identifier, asset_category, price_idr, price_usd, 
    price_native, price_currency, source, delay_minutes, ts
  FROM price_snapshots
  ORDER BY asset_identifier, asset_category, ts DESC;

-- ===================================
-- PORTFOLIO
-- ===================================

CREATE TABLE portfolio_snapshots (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  computed_at           TIMESTAMPTZ NOT NULL,
  total_net_worth_idr   DECIMAL(30, 8),
  total_net_worth_usd   DECIMAL(30, 8),
  unrealized_pl_idr     DECIMAL(30, 8),
  unrealized_pl_pct     DECIMAL(10, 4),
  breakdown_by_category JSONB,  -- {"CRYPTO": amount_idr, "STOCKS": amount_idr, ...}
  data_quality_score    DECIMAL(5, 2),  -- 0-100, berapa % aset datanya fresh
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Hanya simpan 1 snapshot per jam per user (cukup untuk chart history)
CREATE INDEX idx_portfolio_snapshots_user_time 
  ON portfolio_snapshots (user_id, computed_at DESC);

-- ===================================
-- SUBSCRIPTION & BILLING
-- ===================================

CREATE TABLE plans (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  VARCHAR(50) NOT NULL,  -- 'free', 'starter', 'pro', 'business'
  display_name          VARCHAR(100) NOT NULL,
  price_monthly_idr     DECIMAL(15, 2) DEFAULT 0,
  price_yearly_idr      DECIMAL(15, 2) DEFAULT 0,
  is_active             BOOLEAN DEFAULT TRUE,
  sort_order            INTEGER DEFAULT 0,
  
  -- Limits (null = unlimited)
  max_connectors        INTEGER,
  max_manual_assets     INTEGER,
  api_quota_hourly      INTEGER,
  api_quota_daily       INTEGER,
  portfolio_history_days INTEGER,
  
  -- Feature flags (JSON untuk fleksibilitas)
  features              JSONB NOT NULL DEFAULT '{}',
  -- Contoh features JSON:
  -- {
  --   "webhook": true,
  --   "data_export": true,
  --   "push_notification": true,
  --   "priority_support": false,
  --   "risk_engine": false,
  --   "multi_user_workspace": false,
  --   "audit_log_export": false,
  --   "custom_category": false
  -- }
  
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id               UUID NOT NULL REFERENCES plans(id),
  status                VARCHAR(20) NOT NULL,  -- active, past_due, cancelled, trial
  current_period_start  TIMESTAMPTZ NOT NULL,
  current_period_end    TIMESTAMPTZ NOT NULL,
  cancel_at_period_end  BOOLEAN DEFAULT FALSE,
  payment_method_ref    VARCHAR(255),  -- tokenized payment method dari gateway
  gateway_subscription_id VARCHAR(255),  -- ID di Midtrans/Xendit
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id       UUID NOT NULL REFERENCES subscriptions(id),
  user_id               UUID NOT NULL REFERENCES users(id),
  amount_idr            DECIMAL(15, 2) NOT NULL,
  status                VARCHAR(20) NOT NULL,  -- pending, paid, failed, void
  issued_at             TIMESTAMPTZ NOT NULL,
  paid_at               TIMESTAMPTZ,
  due_at                TIMESTAMPTZ,
  gateway_invoice_id    VARCHAR(255),
  pdf_url               TEXT,
  metadata              JSONB
);

CREATE TABLE usage_meters (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id),
  metric_name     VARCHAR(50) NOT NULL,
  -- Metric names: 'connectors_active', 'manual_assets_total', 
  --               'api_calls_hourly', 'api_calls_daily'
  current_value   INTEGER NOT NULL DEFAULT 0,
  period_start    TIMESTAMPTZ NOT NULL,
  period_end      TIMESTAMPTZ NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE (user_id, metric_name, period_start)
);

-- ===================================
-- DEVELOPER API
-- ===================================

CREATE TABLE oauth_clients (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  client_id       VARCHAR(100) NOT NULL UNIQUE,
  client_secret_hash VARCHAR(255) NOT NULL,
  redirect_uris   TEXT[] NOT NULL,
  allowed_scopes  TEXT[] NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE oauth_authorization_codes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id   VARCHAR(100) NOT NULL,
  user_id     UUID NOT NULL REFERENCES users(id),
  code_hash   VARCHAR(64) NOT NULL,
  scope       TEXT[] NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  redirect_uri TEXT NOT NULL
);

CREATE TABLE api_keys (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id       UUID REFERENCES oauth_clients(id),
  key_hash        VARCHAR(64) NOT NULL UNIQUE,
  key_prefix      VARCHAR(10) NOT NULL,  -- untuk display (mis. "jc_prod_***")
  environment     VARCHAR(20) NOT NULL,  -- 'sandbox', 'production'
  allowed_scopes  TEXT[],
  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- AUDIT LOG (APPEND-ONLY)
-- ===================================

CREATE TABLE audit_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ts          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id    UUID,
  actor_type  VARCHAR(20) NOT NULL DEFAULT 'user',
  action      VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id   UUID,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,
  
  -- Baris ini tidak boleh diubah setelah insert
) PARTITION BY RANGE (ts);

-- Trigger untuk enforce append-only
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only. Modifications are not permitted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_audit_append_only
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
```

## 7.3 UDS: Canonical Asset Object

Format standar untuk semua aset yang beredar di internal sistem:

```typescript
interface CanonicalAsset {
  // Identifikasi
  asset_id: string;          // UUID internal
  user_id: string;           // UUID user pemilik
  source: AssetSource;       // Dari mana aset ini berasal
  
  // Identifikasi aset
  asset_identifier: string;  // 'BTC', 'BBCA', 'EMAS', 'USD', dll
  asset_category: AssetCategory;
  display_name: string;      // "Bitcoin", "Bank BCA Tbk", "Emas Antam", dll
  
  // Kepemilikan
  quantity: string;          // String untuk presisi tinggi (bukan float!)
  unit: string;              // 'coin', 'lot', 'gram', 'unit', dll
  
  // Harga beli (opsional)
  avg_buy_price?: string;    // String untuk presisi
  avg_buy_price_currency?: string;  // 'IDR', 'USDT', dll
  
  // Harga pasar (dari Price Intelligence Service)
  current_price?: CurrentPrice;
  
  // Nilai dalam IDR (computed)
  value_idr?: string;        // null jika tidak bisa dihitung
  unrealized_pl_idr?: string;  // null jika tidak ada buy price
  unrealized_pl_pct?: string;  // null jika tidak ada buy price
  
  // Data quality
  last_updated_at: string;   // ISO 8601
  data_freshness: DataFreshness;  // 'live', 'delayed_15m', 'delayed_1h', 'stale', 'manual'
  
  // Metadata
  synced_at?: string;        // Kapan terakhir di-sync dari sumber
  connector_id?: string;     // UUID connector jika dari exchange
  
  // Provenance (transparansi sumber data)
  price_source?: string;     // 'coingecko', 'rti_business', 'antam', 'manual'
  price_delay_minutes?: number;  // 0 = real-time
}

type AssetSource = 'connector' | 'manual' | 'currency_wallet';
type AssetCategory = 'CRYPTO' | 'STOCKS' | 'PRECIOUS_METALS' | 'MUTUAL_FUNDS' | 
                     'CURRENCY' | 'PROPERTY' | 'OTHER';
type DataFreshness = 'live' | 'delayed_15m' | 'delayed_1h' | 'stale' | 'manual';

interface CurrentPrice {
  price_native: string;
  price_currency: string;
  price_idr: string;
  price_usd?: string;
  source: string;
  fetched_at: string;
  delay_minutes: number;
}
```

## 7.4 UDS: Canonical Price Object

```typescript
interface CanonicalPrice {
  asset_identifier: string;
  asset_category: AssetCategory;
  
  // Harga dalam berbagai denominasi
  price_idr: string;      // Selalu ada, hasil konversi
  price_usd?: string;     // Jika tersedia dari provider
  price_native: string;   // Harga dalam currency asli provider
  price_currency: string; // Currency dari price_native
  
  // Metadata
  source: string;
  fetched_at: string;
  delay_minutes: number;
  confidence: 'high' | 'medium' | 'low';
  
  // Untuk saham: info tambahan
  market_status?: 'open' | 'closed' | 'pre_market';
  
  // Provider fallback info
  is_fallback: boolean;
  fallback_from?: string;  // Provider utama yang gagal
}
```

## 7.5 UDS: Portfolio Snapshot Object

```typescript
interface PortfolioSnapshot {
  user_id: string;
  computed_at: string;
  
  // Total
  total_net_worth_idr: string;
  total_net_worth_usd?: string;
  
  // P/L (hanya untuk aset yang ada buy price)
  unrealized_pl_idr?: string;
  unrealized_pl_pct?: string;
  
  // Breakdown per kategori
  breakdown: {
    [category: string]: {
      total_value_idr: string;
      allocation_pct: string;
      asset_count: number;
      has_unavailable_prices: boolean;
    }
  };
  
  // Data quality
  data_quality: {
    score: number;  // 0-100
    total_assets: number;
    assets_with_live_price: number;
    assets_with_delayed_price: number;
    assets_with_stale_price: number;
    assets_with_manual_price: number;
    connectors_online: number;
    connectors_total: number;
    oldest_data_timestamp?: string;
  };
  
  // List of all assets
  assets: CanonicalAsset[];
}
```

## 7.6 Data Versioning & Migration Policy

### Prisma Migration Rules

1. **Setiap perubahan schema = satu migration file** — tidak ada manual ALTER TABLE di production
2. **Migration wajib reversible** — setiap `migrate up` harus ada pasangannya `migrate down`
3. **No destructive changes without data check** — sebelum DROP COLUMN atau NOT NULL tanpa default, pastikan kolom memang kosong/tidak dipakai
4. **Migration naming convention:** `YYYYMMDD_HHMM_deskripsi_singkat.sql`
5. **Staging test wajib sebelum production** — jalankan migration di staging, verifikasi data, baru ke production

### API Versioning

```
API versioning strategy:
├── v1: Phase 1-2 (stable, committed for 2+ years)
├── v2: Phase 3+ (breaking changes dari v1 jika perlu)
└── Deprecation: 12 bulan notice sebelum versi lama dimatikan

URL pattern:
├── /api/v1/portfolio
├── /api/v2/portfolio  (ketika v2 ada)
└── /api/v1/portfolio masih aktif selama deprecation window

Versioning tidak menggunakan header-based versioning (terlalu susah buat developer)
Gunakan URL path versioning — lebih eksplisit dan mudah di-cache.
```

---

# BAGIAN 8 — PRODUCT FEATURES DETAIL

## 8.1 Dashboard Portfolio

### Halaman Utama (`/dashboard`)

**Layout Desktop (1280px+):**

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Joben Connect    [Notifikasi] [Setting] [Profil]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  NET WORTH TOTAL                                             │
│  Rp 1.234.567.890                                            │
│  +Rp 12.345.678 (+1.01%) hari ini  ▲                        │
│  Data: 5/5 connector aktif | Updated 2 mnt lalu             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  BREAKDOWN ALOKASI          │  CHART NET WORTH 30 HARI       │
│                              │                               │
│  ● Kripto    45%  Rp 556M   │  [Line chart]                 │
│  ● Saham IDX 30%  Rp 370M   │                               │
│  ● Emas      15%  Rp 185M   │                               │
│  ● Cash/FX   10%  Rp 124M   │                               │
│                              │                               │
├─────────────────────────────────────────────────────────────┤
│  DAFTAR ASET                                                 │
│                                                              │
│  Filter: [Semua ▼] [Urutkan: Nilai ▼]                       │
│                                                              │
│  KRIPTO                                            556M      │
│  ─────────────────────────────────────────────────          │
│  [BTC icon] Bitcoin (BTC)                                    │
│  0.5 BTC                         Rp 325.000.000   +2.3%     │
│  Harga: Rp 650.000.000/BTC       Sumber: CoinGecko ● Live  │
│                                                              │
│  [ETH icon] Ethereum (ETH)                                   │
│  2.5 ETH                         Rp 115.000.000   -0.5%     │
│  ...                                                         │
│                                                              │
│  SAHAM IDX                                         370M      │
│  ─────────────────────────────────────────────────          │
│  [BBCA] Bank BCA Tbk (BBCA)                                  │
│  10 lot (1.000 lembar)           Rp 87.500.000    +0.8%     │
│  Harga: Rp 8.750/lembar          Sumber: RTI ⏱ 15 mnt lalu │
│  ...                                                         │
│                                                              │
│  EMAS                                              185M      │
│  ─────────────────────────────────────────────────          │
│  [Gold icon] Emas Antam (manual)                             │
│  500 gram                        Rp 185.000.000             │
│  Harga: Rp 370.000/gram          Sumber: Antam, 1 jam lalu  │
│  (P/L tidak tersedia — harga beli tidak diisi)               │
│                                                              │
│  MATA UANG / CASH                                  124M      │
│  ─────────────────────────────────────────────────          │
│  🇺🇸 USD                                                      │
│  USD 5.000                       Rp 81.750.000              │
│  Kurs: USD 1 = Rp 16.350 (BI, hari ini)                    │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Quality Indicator

Di bagian net worth total, ada indikator kecil yang menunjukkan kualitas data:
- 🟢 Semua data segar (semua connector live, semua harga <1 jam)
- 🟡 Sebagian data delayed (ada connector yang belum sync, atau harga delayed)
- 🔴 Data ada yang stale atau connector offline
- Klik indikator → detail: connector mana yang bermasalah, harga mana yang stale

### Halaman Detail Aset (`/dashboard/asset/:id`)

- Chart harga historis (30 hari, 90 hari, 1 tahun)
- Riwayat transaksi (dari connector, jika tersedia)
- Detail holding: quantity, avg buy price, current value, P/L
- Link ke exchange/broker asal

## 8.2 Connector Management

### Halaman Connectors (`/connectors`)

Daftar semua connector yang tersedia (tidak hanya yang sudah dihubungkan):

```
Connector Store:
├── Tab: "Terhubung" — connector yang sudah aktif
├── Tab: "Tersedia" — semua connector yang bisa ditambah
│   ├── Filter: Kripto / Saham / Emas / Lainnya
│   ├── Filter: Official / Community
│   └── Search
└── Tab: "Status" — health status semua connector

Untuk setiap connector card:
- Nama + logo
- Tier badge (Tier 1/2/3/Community)
- Status (Connected / Not Connected)
- Uptime 30 hari (jika Official)
- Disclaimer notice (jika Community)
- Tombol: "Hubungkan" atau "Kelola"
```

### Flow Menambah Connector

```
User klik "Hubungkan" di card Binance
          │
          ▼
[Step 1/4] Penjelasan: Apa yang akan diakses Joben Connect
  - "Joben Connect akan membaca saldo dan posisi akun kamu"
  - "Joben Connect TIDAK akan bisa melakukan trading atau withdraw"
  - "Cara membuat API Key read-only di Binance: [link panduan]"
          │
          ▼
[Step 2/4] Input API Key
  - Field: API Key (required)
  - Field: API Secret (required, masked)
  - Link: "Cara membuat API key read-only →"
          │
          ▼
[Step 3/4] MFA Verification
  - "Untuk keamanan, masukkan kode dari authenticator app kamu"
  - Input: 6-digit TOTP
  (jika belum setup MFA → prompt untuk setup MFA dulu)
          │
          ▼
[Step 4/4] Validasi & Simpan
  - Loading: "Memvalidasi API key..."
  - Jika gagal: pesan error spesifik + solusi
    ✗ "API key tidak valid" → Cek copy-paste, coba lagi
    ✗ "API key punya permission trade/withdraw" → Instruksi buat ulang dengan read-only
    ✗ "Koneksi ke Binance gagal" → Coba lagi, atau lihat status Binance
  - Jika berhasil: 
    ✓ "Connector terhubung! Sinkronisasi pertama akan selesai dalam 1 menit."
    → Redirect ke halaman connector detail
```

### Halaman Connector Detail (`/connectors/:id`)

- Status sinkronisasi terakhir (waktu, durasi, jumlah aset)
- Daftar aset yang terhubung dari connector ini
- Riwayat sync (sukses, gagal, partial)
- Tombol: "Sync Sekarang", "Edit", "Hapus Connector"
- Hapus Connector → MFA → konfirmasi → hapus

## 8.3 Manual Asset Engine

### Tambah Aset Manual

**Emas (contoh):**

```
[Tambah Aset Manual]

Kategori: [Emas ▼]

Jenis Emas:
● Emas Antam (24K)  ○ Emas UBS (24K)  ○ Emas Perhiasan  ○ Lainnya

Jumlah: [500] gram

Harga Beli Rata-rata (opsional):
[340.000] IDR per gram
(jika diisi, sistem akan menghitung P/L)

Label (opsional):
[Emas Tabungan Menikah]

Preview:
Nilai saat ini: 500g × Rp 370.000 = Rp 185.000.000
(Harga Antam: Rp 370.000/gram — update 1 jam lalu)

P/L: +Rp 15.000.000 (+8.82%)
(berdasarkan harga beli Rp 340.000/gram yang kamu input)

[Batal] [Simpan]
```

**Saham IDX (contoh):**

```
[Tambah Saham IDX]

Kode Saham: [BBCA]
(autocomplete dari daftar saham IDX)
→ "Bank Central Asia Tbk" ✓

Jumlah: [10] lot
= 1.000 lembar (1 lot = 100 lembar)

Harga Beli Rata-rata (opsional):
[8.250] IDR per lembar

Preview:
Nilai saat ini: 1.000 lembar × Rp 8.750 = Rp 8.750.000
(Harga BBCA: Rp 8.750/lembar — RTI, 15 mnt lalu)

P/L: +Rp 500.000 (+6.06%)

[Batal] [Simpan]
```

### Fitur Manual Asset Engine

- **Duplikasi warning:** Jika user sudah punya BBCA dari connector Ajaib dan menambah BBCA manual → tampilkan warning "Kamu mungkin sudah memiliki BBCA melalui connector Ajaib. Apakah kamu yakin ingin menambah entri terpisah?"
- **Bulk import (Phase 2):** Upload CSV/Excel untuk import banyak aset sekaligus
- **Update quantity:** Untuk aset yang tidak ada connector, user bisa update quantity kapan saja
- **Riwayat perubahan:** Log setiap perubahan quantity/harga beli (untuk audit pribadi)

## 8.4 Currency Wallet

### Halaman Currency Wallet

```
DOMPET MATA UANG

Total Nilai: Rp 124.000.000 (≈ USD 7.584)

┌─────────────────────────────────────────────────────┐
│ 🇺🇸 US Dollar (USD)                                  │
│ USD 5.000                           Rp 81.750.000   │
│ Kurs: 1 USD = Rp 16.350             Update: 09:00   │
│ Sumber: Bank Indonesia              BI Kurs Tengah  │
│ Label: "Tabungan USD BCA"                           │
│ [Edit] [Hapus]                                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🇸🇬 Singapore Dollar (SGD)                           │
│ SGD 2.500                           Rp 30.275.000   │
│ Kurs: 1 SGD = Rp 12.110             Update: 09:00   │
│ [Edit] [Hapus]                                      │
└─────────────────────────────────────────────────────┘

[+ Tambah Mata Uang Lain]
```

### Tambah Mata Uang

```
[Tambah Mata Uang]

Pilih Mata Uang:
[Search atau pilih...] → dropdown dengan semua ISO 4217 major

Jumlah: [5000]

Label (opsional): [Tabungan USD BCA]

Preview:
USD 5.000 = Rp 81.750.000
(Kurs: 1 USD = Rp 16.350, sumber: BI Kurs Tengah, hari ini 09:00)

[Batal] [Simpan]
```

## 8.5 Price Intelligence Layer

### Bagaimana Harga Dikompute

```
Request harga BTC/IDR:

1. Cek Redis cache
   └── Cache hit? → Return harga + metadata (sumber, waktu fetch, delay)
   └── Cache miss? → Lanjut ke step 2

2. Fetch dari provider utama (CoinGecko)
   └── Berhasil? → Simpan ke cache, return harga
   └── Gagal? → Lanjut ke step 3

3. Fallback ke provider backup (CoinMarketCap)
   └── Berhasil? → Simpan ke cache (TTL lebih pendek), return harga + "fallback" flag
   └── Gagal? → Lanjut ke step 4

4. Cek database untuk harga terakhir yang valid
   └── Ada data dalam 2 jam? → Return harga + "stale" flag + timestamp
   └── Tidak ada? → Return null + error "harga tidak tersedia"

Di setiap return: selalu sertakan metadata (sumber, waktu, delay, is_fallback)
```

### Price Provider Priority Matrix

```yaml
crypto:
  tier_1:  # Top 100 crypto by market cap
    primary: coingecko_pro
    fallback_1: coinmarketcap_pro
    fallback_2: binance_websocket  # Untuk BTC/ETH/BNB pair utama saja
    cache_ttl: 60s
  tier_2:  # Other crypto
    primary: coingecko_pro
    fallback_1: coinmarketcap_pro
    cache_ttl: 300s

stocks_idx:
  primary: rti_business
  fallback_1: idx_official  # EOD only
  cache_ttl: 900s  # 15 menit (market hours), 3600s (after close)
  market_hours: "09:00-11:30,13:30-16:00 WIB Mon-Fri"

precious_metals:
  emas_antam:
    primary: antam_official
    fallback_1: pegadaian_official
    cache_ttl: 3600s  # 1 jam
  
currency_rates:
  primary: bank_indonesia_official
  fallback_1: open_exchange_rates
  fallback_2: frankfurter_ecb
  cache_ttl: 3600s  # 1 jam (hari kerja), 86400s (weekend)
  
mutual_funds:
  primary: bareksa_api  # Phase 3
  fallback_1: ksei_data
  cache_ttl: 86400s  # 1 hari (NAB update harian)
```

## 8.6 Portfolio Engine Detail

### Kalkulasi Net Worth

```typescript
async function calculateNetWorth(userId: string): Promise<PortfolioSnapshot> {
  // 1. Ambil semua holdings (connector + manual + currency)
  const connectorHoldings = await getConnectorHoldings(userId);
  const manualAssets = await getManualAssets(userId);
  const currencyHoldings = await getCurrencyHoldings(userId);
  
  // 2. Ambil harga terkini untuk semua aset
  const allAssetIds = [
    ...connectorHoldings.map(h => h.asset_identifier),
    ...manualAssets.map(a => a.asset_identifier).filter(Boolean),
  ];
  const prices = await getPricesForAssets(allAssetIds);
  
  // 3. Hitung nilai setiap aset dalam IDR
  const assetValues = [
    ...calculateHoldingValues(connectorHoldings, prices),
    ...calculateManualAssetValues(manualAssets, prices),
    ...calculateCurrencyValues(currencyHoldings, await getCurrencyRates()),
  ];
  
  // 4. Hitung total dan breakdown
  const totalNetWorth = assetValues.reduce((sum, av) => 
    sum + (av.value_idr ?? 0), BigDecimal(0)
  );
  
  const breakdown = groupBy(assetValues, 'category').reduce((acc, group) => ({
    ...acc,
    [group.key]: {
      total_value_idr: sum(group.items, 'value_idr'),
      allocation_pct: percentage(sum(group.items, 'value_idr'), totalNetWorth),
      asset_count: group.items.length,
      has_unavailable_prices: group.items.some(i => i.value_idr === null),
    }
  }), {});
  
  // 5. Data quality score
  const dataQuality = calculateDataQualityScore(assetValues);
  
  // 6. Simpan snapshot
  await savePortfolioSnapshot({ userId, totalNetWorth, breakdown, dataQuality });
  
  return buildPortfolioSnapshotObject({ totalNetWorth, breakdown, assetValues, dataQuality });
}
```

### Portfolio History Chart

- Data diambil dari tabel `portfolio_snapshots` (satu per jam)
- Timeframes: 24 jam, 7 hari, 30 hari, 90 hari, 1 tahun, All-time
- Kenaikan/penurunan dibandingkan titik awal timeframe yang dipilih
- Catatan jika ada gap data (mis. connector pernah offline)

## 8.7 Risk & Analytics Engine (Phase 3)

### Fitur Risk Engine Phase 3 (Minimal Viable)

**1. Concentration Risk**
- Identifikasi aset tunggal yang nilainya >30% dari total portfolio
- Tampilkan sebagai peringatan: "BTC mewakili 45% portofolio kamu. Konsentrasi tinggi meningkatkan risiko volatilitas."
- Bukan rekomendasi investasi — hanya observasi data

**2. Category Allocation**
- Breakdown % per kategori vs "target allocation" yang bisa user set sendiri
- Deviation indicator: "Kripto: 45% (target: 30%) — overweight 15%"
- Chart donut yang bisa interaktif

**3. Volatility Indicator (sederhana)**
- Berdasarkan perubahan net worth 30 hari
- Label: "Portofolio kamu bergerak rata-rata X% per hari dalam 30 hari terakhir"
- Bukan forward-looking risk, hanya historical observation

**Yang TIDAK ada di Risk Engine Phase 3:**
- Rekomendasi buy/sell
- Saran portfolio optimization
- Comparison dengan benchmark (IHSG, dll) — terlalu mirip investment advice
- VaR (Value at Risk) — terlalu kompleks dan misleading untuk retail

## 8.8 Notification System

### Jenis Notifikasi

| Event | Default | Bisa dimatikan? | Channel |
|---|---|---|---|
| Connector sync gagal | ON | ✅ | Email + In-app |
| Connector kembali online | OFF | ✅ | In-app |
| Mendekati batas kuota (80%) | ON | ❌ (wajib) | Email + In-app |
| Kena batas kuota (100%) | ON | ❌ (wajib) | Email + In-app |
| Invoice baru | ON | ❌ (wajib) | Email |
| Renewal dalam 7 hari | ON | ✅ | Email |
| Payment gagal | ON | ❌ (wajib) | Email |
| Perubahan harga signifikan | OFF | ✅ | In-app + Push |
| Login dari device baru | ON | ❌ (security) | Email |
| API key digunakan | OFF | ✅ | Email |

### Konfigurasi Price Alert

User bisa set alert untuk aset spesifik:
- "Beritahu saya saat BTC naik/turun X%"
- "Beritahu saya saat harga BTC melewati Rp X"
- Maksimum 10 alert aktif (Free/Starter), 50 alert (Pro)

### Delivery Priority

```
Priority queue untuk Notification Service:
1. Security alerts (login baru, MFA failed) → immediate
2. Billing critical (payment failed) → immediate
3. Connector down → dalam 5 menit
4. Quota warning → dalam 15 menit
5. Price alerts → dalam 5 menit
6. General (billing reminder, sync restored) → dalam 1 jam batch
```

## 8.9 Data Export

### Format yang Tersedia (Pro tier+)

- **Portfolio Snapshot (JSON/CSV):** Semua aset, nilai, P/L pada timestamp tertentu
- **Transaction History (CSV):** Semua transaksi dari connector yang support (Phase 2)
- **Net Worth History (CSV):** Data historis net worth per hari
- **Full Data Export (JSON):** Semua data user — untuk right-to-portability

### Export untuk Tax Reporting (Phase 3)

Format khusus yang menunjukkan:
- Total aset yang dimiliki per tanggal
- Nilai dalam IDR (untuk reporting pajak)
- *Bukan* perhitungan pajak — ini untuk user serahkan ke tax consultant

## 8.10 Developer Platform & Public API

*(Detail di Bagian 10, Phase 2)*

### API Endpoints (v1)

```
Authentication:
POST   /oauth/token                  — Token exchange
POST   /oauth/revoke                 — Revoke token

Portfolio:
GET    /v1/portfolio                 — Portfolio snapshot terkini
GET    /v1/portfolio/history         — Net worth history
GET    /v1/portfolio/assets          — Daftar semua aset
GET    /v1/portfolio/assets/:id      — Detail satu aset

Categories:
GET    /v1/assets/crypto             — Crypto holdings
GET    /v1/assets/stocks             — Stock holdings
GET    /v1/assets/precious-metals    — Precious metals holdings
GET    /v1/assets/currency           — Currency wallet

Prices:
GET    /v1/prices/:identifier        — Harga terkini satu aset
GET    /v1/prices/batch              — Harga banyak aset sekaligus

Webhooks:
GET    /v1/webhooks                  — Daftar webhook
POST   /v1/webhooks                  — Daftarkan webhook baru
DELETE /v1/webhooks/:id              — Hapus webhook

User:
GET    /v1/me                        — Profil user

Meta:
GET    /v1/connectors                — Daftar connector yang tersedia
GET    /v1/health                    — API health check
```

### Response Format Standard

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-08-01T10:00:00.000Z",
    "version": "1.0"
  }
}

// Error format:
{
  "success": false,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "API quota habis. Upgrade plan atau tunggu reset.",
    "details": {
      "quota_used": 1000,
      "quota_limit": 1000,
      "resets_at": "2026-08-01T11:00:00.000Z"
    }
  },
  "meta": { ... }
}
```

## 8.11 Connector Marketplace (Phase 2+)

### Untuk Connector Builders

```
Developer flow untuk submit connector:

1. Fork template SDK dari GitHub Joben Connect
2. Implementasi ConnectorInterface (TypeScript)
3. Tulis contract tests
4. Buat Connector Manifest (YAML):
   - Nama, deskripsi, kategori
   - Domain yang diizinkan untuk akses jaringan
   - Permission yang dibutuhkan
   - Changelog
5. Submit pull request ke connector-registry repo
6. Review otomatis: linting, test coverage, security scan
7. Review manual oleh tim Joben (1-5 hari kerja)
8. Jika disetujui: deployed ke Tier 3 atau Community tier
9. Monitoring: jika maintain baik selama 3 bulan → bisa naik ke Tier 2
```

### Revenue Share Model

Untuk connector di marketplace yang monetisasi (Phase 3+):
- User membayar untuk mengakses connector premium pihak ketiga
- Joben Connect: 30% (platform fee)
- Connector builder: 70%
- Pembayaran: monthly via transfer bank atau gateway

## 8.12 AI Agent Access (Phase 3+)

*(Detail di Bagian 11)*

---

# BAGIAN 9 — SUBSCRIPTION & BILLING SYSTEM

## 9.1 Filosofi Model Subscription

**Prinsip P7 berlaku di sini:** Seluruh subscription system dikontrol dari backend. Frontend hanya membaca state. Tidak ada single hardcoded value di frontend.

Ini penting karena:
1. **A/B testing pricing** — Bisa test harga berbeda untuk segment user berbeda
2. **Custom deals** — Bisa beri diskon ke user/enterprise tertentu tanpa deploy
3. **Iterasi cepat** — Ubah limit atau feature flag tanpa release
4. **Emergency response** — Jika ada bug di feature tertentu, bisa disable di semua tier tanpa deploy

## 9.2 Tier Definition & Limits

### Free Tier

**Target:** User baru yang ingin mencoba, atau investor casual dengan portfolio sederhana

| Limit | Value |
|---|---|
| Connector aktif | 2 |
| Manual asset entries | 15 |
| Currency wallet entries | 5 mata uang |
| Portfolio history | 30 hari |
| API access | ❌ Tidak ada |
| Webhook | ❌ Tidak ada |
| Data export | ❌ Tidak ada |
| Price alert | ❌ Tidak ada |
| Sync frequency (crypto) | Setiap 15 menit |
| Sync frequency (saham) | Setiap 60 menit |
| Notifikasi email | ✅ |
| Notifikasi push | ❌ |
| Support | Community forum |

### Starter Tier

**Target:** Investor aktif dengan beberapa exchange dan aset

| Limit | Value |
|---|---|
| Connector aktif | 5 |
| Manual asset entries | 50 |
| Currency wallet entries | 20 mata uang |
| Portfolio history | 90 hari |
| API access | ❌ Tidak ada |
| Webhook | ❌ Tidak ada |
| Data export | CSV saja |
| Price alert | 10 aktif |
| Sync frequency (crypto) | Setiap 5 menit |
| Sync frequency (saham) | Setiap 30 menit |
| Notifikasi email | ✅ |
| Notifikasi push | ✅ |
| Support | Email (response dalam 2 hari kerja) |

### Pro Tier

**Target:** Power user, investor multi-aset, developer yang butuh API

| Limit | Value |
|---|---|
| Connector aktif | 20 |
| Manual asset entries | 500 |
| Currency wallet entries | Semua ISO 4217 |
| Portfolio history | Unlimited |
| API access (hourly) | 10.000 call/jam |
| API access (daily) | 100.000 call/hari |
| Webhook | ✅ (10 endpoint) |
| Data export | CSV + JSON + Full export |
| Price alert | 50 aktif |
| Sync frequency (crypto) | Setiap 1 menit |
| Sync frequency (saham) | Real-time (market hours) |
| Custom category | ✅ |
| Risk Engine | ✅ (Phase 3) |
| Notifikasi email + push | ✅ |
| Support | Priority (response dalam 4 jam) |

### Business Tier (Phase 4 — hanya setelah demand nyata terbukti)

**Target:** Tim kecil, wealth advisor, organisasi

| Limit | Value |
|---|---|
| Multi-user workspace | ✅ (hingga 10 user) |
| RBAC | ✅ |
| Semua limit Pro × 3 | ✅ |
| API access | 500.000 call/hari |
| Audit log export | ✅ |
| SLA dasar | 99.9% uptime |
| Dedicated support | Account manager |
| Onboarding | 1:1 onboarding session |

## 9.3 Backend-Driven Feature Flags

Ini adalah inti dari sistem subscription yang fleksibel.

### Feature Flag Architecture

```typescript
// Di database: tabel plans.features (JSONB)
{
  "webhook": { "enabled": true, "max_endpoints": 10 },
  "data_export": { "enabled": true, "formats": ["csv", "json"] },
  "push_notification": { "enabled": true },
  "priority_support": { "enabled": false },
  "risk_engine": { "enabled": true },
  "price_alerts": { "enabled": true, "max_active": 50 },
  "custom_category": { "enabled": true },
  "multi_user_workspace": { "enabled": false },
  "audit_log_export": { "enabled": false },
  "api_access": {
    "enabled": true,
    "quota_hourly": 10000,
    "quota_daily": 100000
  },
  "sync_frequency": {
    "crypto_seconds": 60,
    "stocks_seconds": 60
  },
  "limits": {
    "max_connectors": 20,
    "max_manual_assets": 500,
    "max_currency_entries": null,  // null = unlimited
    "portfolio_history_days": null  // null = unlimited
  }
}
```

### Cara Frontend Membaca Feature Flags

```typescript
// API endpoint: GET /v1/me/subscription
{
  "plan": {
    "id": "uuid",
    "name": "pro",
    "display_name": "Pro",
    "features": { ... semua feature flags ... }
  },
  "subscription": {
    "status": "active",
    "current_period_end": "2026-09-01T00:00:00Z"
  },
  "usage": {
    "connectors_active": 8,
    "manual_assets_total": 45,
    "api_calls_today": 1250
  }
}
```

Frontend logic:
```typescript
// Bukan hardcode:
// if (userPlan === 'pro') { showWebhookButton() }

// Yang benar:
const { features, usage } = useSubscription();

if (features.webhook.enabled) {
  renderWebhookSettings(features.webhook);
}

if (usage.connectors_active >= plan.limits.max_connectors) {
  showUpgradePrompt('connector_limit_reached');
}
```

### Kemampuan Admin (Backend)

Admin Joben bisa melakukan tanpa deploy:
- Override limit untuk user spesifik (custom deal)
- Aktifkan/nonaktifkan fitur per tier
- Ubah harga per tier
- Beri trial Pro gratis untuk user tertentu (promotional)
- Extend subscription untuk retention

```sql
-- Tabel override per user (untuk custom deals)
CREATE TABLE subscription_overrides (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id),
  override_key VARCHAR(100) NOT NULL,  -- 'max_connectors', 'webhook.enabled', dll
  override_value JSONB NOT NULL,
  reason      TEXT NOT NULL,
  expires_at  TIMESTAMPTZ,  -- null = permanent
  created_by  UUID NOT NULL,  -- admin user
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

## 9.4 Pricing (Indikatif)

*Catatan: Harga final ditetapkan berdasarkan market research dan A/B testing. Ini hanya panduan internal.*

| Tier | Bulanan | Tahunan (discount ~20%) | Catatan |
|---|---|---|---|
| Free | Rp 0 | Rp 0 | Forever free — bukan trial |
| Starter | Rp 49.000 | Rp 470.000 | ~Rp 39.000/bulan |
| Pro | Rp 149.000 | Rp 1.430.000 | ~Rp 119.000/bulan |
| Business | Rp 499.000 | Rp 4.790.000 | Per workspace |

**Pertimbangan pricing:**
- Harga dalam IDR (bukan USD) — lebih accessible untuk pasar Indonesia
- Bayar dengan QRIS, transfer bank, kartu kredit via Midtrans/Xendit
- Tidak ada free trial untuk Starter/Pro — tapi Free tier yang generous sudah cukup untuk evaluasi

## 9.5 Halaman Langganan (Frontend)

### `/settings/billing`

**Section 1: Plan Aktif**

```
Plan Aktif: PRO
Renewal: 1 September 2026 (31 hari lagi)
Rp 149.000/bulan

[Ubah Plan] [Batalkan Langganan]
```

**Section 2: Usage Meter (real-time)**

```
Pemakaian Bulan Ini:

Connector         ████████░░  8/20 (40%)
Manual Assets     ████░░░░░░  45/500 (9%)
API Calls (hari ini)  ██░░░░░  1.250/100.000 (1.25%)
Price Alerts      ████████░░  8/50 (16%)
```

Progress bar berubah warna:
- 0-79%: Hijau
- 80-94%: Kuning (+ notifikasi "Anda mendekati batas")
- 95-100%: Merah (+ notifikasi "Anda hampir di batas")

**Section 3: Perbandingan Plan**

```
                Free       Starter     Pro ★     Business
                ────────   ────────    ──────    ────────
Connector       2          5           20         60
Manual Assets   15         50          500        1.500
API Access      ✗          ✗           ✓           ✓
Webhook         ✗          ✗           ✓           ✓
History         30 hari    90 hari     Unlimited   Unlimited
Support         Community  Email       Priority    Dedicated

                           Rp 49rb     Rp 149rb    Rp 499rb
                           [Pilih]     AKTIF       [Pilih]
```

**Section 4: Riwayat Invoice**

```
Tanggal         Deskripsi           Jumlah    Status    
─────────────   ─────────────────   ──────────────────
1 Agu 2026      Pro — Agustus 2026  Rp 149.000  ✅ Lunas  [PDF]
1 Jul 2026      Pro — Juli 2026     Rp 149.000  ✅ Lunas  [PDF]
1 Jun 2026      Pro — Juni 2026     Rp 149.000  ✅ Lunas  [PDF]
```

**Section 5: Metode Pembayaran**

```
Metode Pembayaran Tersimpan:
Visa **** 4242  (Exp: 12/28)  [Default] [Hapus]

[Tambah Metode Pembayaran]

Catatan: Data kartu dikelola oleh Midtrans, bukan disimpan di server Joben Connect.
```

## 9.6 Upgrade/Downgrade Flow

### Upgrade Flow

```
User klik "Upgrade ke Pro"
          │
          ▼
Modal: Preview perubahan
  "Kamu akan upgrade dari Starter ke Pro"
  - Mulai hari ini
  - Biaya hari ini: prorated (sisa hari × (Pro - Starter) / 30)
  - Mulai bulan depan: Rp 149.000/bulan
  [Lanjut ke Pembayaran] [Batal]
          │
          ▼
Billing Service: buat payment session di Midtrans/Xendit
          │
          ▼
User selesaikan pembayaran
          │
          ▼
Webhook dari gateway → Billing Service
  - Update subscriptions.plan_id = pro_plan_id
  - Update subscriptions.status = 'active'
  - Publish event: 'plan_changed' ke BullMQ
          │
          ▼
Event consumer: update usage_meters limits,
                update API Gateway quota cache,
                unlock fitur yang baru tersedia
          │
          ▼
User kembali ke app: semua fitur Pro langsung tersedia
```

### Downgrade Flow

```
User klik "Downgrade ke Starter"
          │
          ▼
Sistem cek: apakah user akan melebihi limit Starter?
  - Connector aktif: 8 (Starter max: 5)
  - Warning: "Kamu punya 8 connector aktif. Starter hanya mengizinkan 5."
          │
          ▼
Jika ada konflik, tampilkan pilihan:
  "Pilih 5 connector yang tetap aktif setelah downgrade:"
  [✓] Binance
  [✓] Bybit
  [✓] Indodax
  [✓] OKX
  [ ] Tokocrypto  
  [ ] Gate.io  ← 3 ini akan di-pause
  [ ] Bitget
  [ ] Kucoin
          │
          ▼
Konfirmasi:
  "Downgrade ke Starter akan aktif pada 1 September 2026 (akhir periode billing).
   3 connector yang tidak dipilih akan di-pause mulai 1 September."
  [Konfirmasi Downgrade] [Batal]
          │
          ▼
Sistem set: subscriptions.cancel_at_period_end = false (bukan cancel, tapi downgrade)
           simpan pending_downgrade_to = starter_plan_id
          │
          ▼
Pada tanggal renewal:
  - Downgrade dieksekusi
  - Connector yang di-pause dihentikan sync-nya
  - User diberi tahu via email
```

## 9.7 Quota Enforcement Architecture

### Di mana Quota Dicek?

**Di API Gateway layer — satu titik pemeriksaan.**

```typescript
// API Gateway middleware (pseudocode)
async function quotaEnforcementMiddleware(req, res, next) {
  const userId = req.auth.userId;
  
  // 1. Ambil quota dari cache (Redis) — sangat cepat
  const quotaStatus = await getQuotaFromCache(userId);
  
  if (!quotaStatus) {
    // Cache miss: fetch dari database
    const quotaStatus = await getQuotaFromDB(userId);
    await setQuotaCache(userId, quotaStatus, TTL_5_MINUTES);
  }
  
  // 2. Cek apakah aksi ini membutuhkan quota check
  const requiredCheck = getQuotaCheckForEndpoint(req.path, req.method);
  
  if (requiredCheck) {
    const { metric, limit } = requiredCheck;
    
    if (quotaStatus[metric].current >= quotaStatus[metric].limit) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'QUOTA_EXCEEDED',
          message: `Batas ${metric} tercapai. Upgrade plan untuk melanjutkan.`,
          details: {
            quota_used: quotaStatus[metric].current,
            quota_limit: quotaStatus[metric].limit,
            upgrade_url: '/settings/billing'
          }
        }
      });
    }
  }
  
  next();
}
```

### Quota Check Matrix

| Aksi | Quota yang Dicek |
|---|---|
| Add connector | `connectors_active` < `max_connectors` |
| Add manual asset | `manual_assets_total` < `max_manual_assets` |
| API call | `api_calls_hourly` < `api_quota_hourly` AND `api_calls_daily` < `api_quota_daily` |
| Add webhook | `webhooks_count` < `max_webhooks` |
| Add price alert | `price_alerts_active` < `max_price_alerts` |

### Quota Warning Notification

Saat usage meter mencapai 80% dari limit:
- In-app notification: banner kuning di halaman yang relevan
- Email notification (sekali per metric per periode billing)
- Dashboard billing: progress bar berubah kuning

## 9.8 Payment Gateway Integration

### Provider: Midtrans (Primary) + Xendit (Backup)

**Alasan Midtrans primary:**
- Sudah lama di Indonesia, trust yang tinggi
- Support QRIS, virtual account semua bank, kartu kredit, GoPay, OVO, dll
- Rekurring payment support (untuk subscription)
- Invoice generation built-in
- PCI DSS compliant

**Xendit sebagai backup:**
- Jika Midtrans mengalami downtime, fallback ke Xendit
- Xendit juga punya coverage yang baik untuk Indonesia

### Payment Methods yang Didukung

```
Metode Pembayaran yang disupport:
├── Kartu Kredit/Debit (Visa, Mastercard, JCB)
├── QRIS (scan dari semua e-wallet yang support QRIS)
├── Virtual Account (semua bank major: BCA, BNI, BRI, Mandiri, dll)
├── GoPay
├── OVO
├── ShopeePay
├── LinkAja
└── Alfamart/Indomaret (untuk payment satu kali)
```

**Catatan:** Rekurring payment otomatis hanya tersedia untuk kartu kredit dan beberapa metode tertentu. Untuk metode lain (QRIS, VA), user akan mendapat reminder dan harus bayar manual setiap bulan.

### Webhook Handling

```
Midtrans Webhook Flow:

Midtrans kirim webhook POST ke: /billing/webhook/midtrans
          │
          ▼
Verifikasi signature (HMAC) — tolak jika signature salah
          │
          ▼
Parse event type:
  - payment.success → update invoice status, activate subscription
  - payment.failed  → retry logic, notify user
  - subscription.renewed → extend subscription period
  - subscription.cancelled → mark for end-of-period cancellation
          │
          ▼
Publish event ke BullMQ → semua service yang perlu tahu
```

## 9.9 Invoice & Billing Data

Semua invoice tersimpan di database dengan referensi ke gateway invoice ID. User bisa download PDF dari halaman billing. PDF di-generate oleh Midtrans/Xendit atau oleh service Joben sendiri.

Invoice wajib menyertakan:
- Nomor invoice unik
- Nama dan email user
- Deskripsi item (mis. "Joben Connect Pro — Agustus 2026")
- Jumlah dan pajak (jika applicable)
- Metode pembayaran (tanpa detail sensitif)
- Status pembayaran

**Retensi invoice:** 10 tahun (kewajiban perpajakan Indonesia).

## 9.10 Usage Metering

Usage meter di-update di dua titik:
1. **Real-time counter** di Redis (increment saat event terjadi)
2. **Database sync** setiap 5 menit (Redis → PostgreSQL)

```typescript
// Saat user tambah connector:
await redis.incr(`usage:${userId}:connectors_active`);
await updateUsageMeterDB(userId, 'connectors_active', +1);

// Saat user hapus connector:
await redis.decr(`usage:${userId}:connectors_active`);
await updateUsageMeterDB(userId, 'connectors_active', -1);

// Saat API call:
await redis.incr(`usage:${userId}:api_calls_hourly`);
await redis.incr(`usage:${userId}:api_calls_daily`);
// (dengan TTL yang di-set: hourly reset setiap jam, daily reset tengah malam WIB)
```

---

# BAGIAN 10 — FASE PEMBANGUNAN LENGKAP

## 10.1 Phase 0 — Legal + Infra Baseline

**Durasi:** 6-8 minggu  
**Tim:** 1 Backend Lead, 1 DevOps/Infra, 1 Legal Advisor (part-time)

### Milestone & Deliverables

**Minggu 1-2: Legal Foundation**

- [ ] Tunjuk legal advisor / konsultan hukum yang familiar dengan UU PDP dan fintech Indonesia
- [ ] Draft Terms of Service v1 — fokus ke scope layanan, disclaimer akurasi data, liability
- [ ] Draft Privacy Policy v1 — data apa yang dikumpulkan, bagaimana dipakai, hak user
- [ ] Legal opinion dari advisor: apakah Joben Connect perlu izin OJK/BI dalam scope Phase 1?
- [ ] Draft Data Processing Agreement (DPA) template untuk B2B (dipakai Phase 2)

**Minggu 1-3: Infrastructure Setup**

- [ ] Pilih cloud provider (rekomendasi: AWS ap-southeast-3 Jakarta)
- [ ] Setup VPC, subnet, security groups (private subnet untuk database, vault)
- [ ] Setup PostgreSQL 16 dengan TimescaleDB extension
- [ ] Setup Redis cluster
- [ ] Setup HashiCorp Vault (development mode dulu, production setup Minggu 3-4)
- [ ] Setup domain + SSL certificate
- [ ] Setup monitoring stack: Prometheus + Grafana + Loki
- [ ] Setup secret management untuk environment variables (tidak di .env file plain)

**Minggu 2-4: Code Foundation**

- [ ] Buat monorepo structure (semua service dalam satu repo dengan workspaces)
- [ ] Setup TypeScript config yang konsisten
- [ ] Setup ESLint + Prettier dengan rules yang strict
- [ ] Setup Jest untuk testing
- [ ] Database schema awal (migration Prisma untuk: users, sessions, connectors, manual_assets)
- [ ] Auth Service: registrasi, login, JWT issue, refresh token, email verification
- [ ] API Gateway skeleton: routing, auth middleware, rate limiting, Zod validation
- [ ] Setup CI/CD pipeline (GitHub Actions): lint → test → build → deploy ke staging

**Minggu 4-6: Security Baseline**

- [ ] Implement envelope encryption untuk credential vault
- [ ] Setup mTLS antar service internal
- [ ] Implement audit_log table dengan append-only trigger
- [ ] Security headers via helmet.js
- [ ] Rate limiting dengan Redis backend
- [ ] Automated npm audit di CI (fail on high/critical)
- [ ] Basic SAST scan di CI

**Minggu 6-8: Verification**

- [ ] Auth flow end-to-end test
- [ ] Database migration tested (up + down)
- [ ] Staging environment fully functional
- [ ] Legal documents reviewed dan siap untuk Phase 1 launch
- [ ] Basic monitoring dashboard setup

**Exit Criteria Phase 0:**
✅ User bisa registrasi dan login  
✅ Database migration pipeline berjalan  
✅ CI/CD pipeline jalan otomatis  
✅ Legal dokumen siap (bukan harus final — tapi cukup untuk launch terbatas)  
✅ Vault encrypt/decrypt credential berfungsi  
✅ Staging environment up dan stable

---

## 10.2 Phase 1 — MVP Core

**Durasi:** 10-12 minggu setelah Phase 0  
**Tim:** 2 Backend, 1 Frontend, 1 QA (bisa merangkap backend)

### Goals

User pertama bisa menghubungkan exchange crypto, input saham IDX dan emas secara manual, melihat portofolio gabungan dengan net worth total dan P/L.

### Deliverables

**Minggu 1-3: Price Intelligence Service**

- [ ] Setup provider integrations: CoinGecko Pro, RTI Business, BI Kurs, Antam
- [ ] Price caching di Redis dengan TTL per kategori
- [ ] Price snapshot ke TimescaleDB
- [ ] Fallback logic antar provider
- [ ] Price Intelligence API (internal): `GET /internal/prices/:identifier`
- [ ] Contract testing untuk setiap price provider
- [ ] Monitoring: price freshness alert jika provider gagal

**Minggu 2-4: Connector Service (Crypto)**

- [ ] ConnectorInterface TypeScript
- [ ] BinanceAdapter: validate credentials, fetch holdings, health check
- [ ] BybitAdapter: sama
- [ ] IndodaxAdapter: sama
- [ ] Credential vault integration (simpan + retrieve)
- [ ] Read-only permission validation untuk setiap exchange
- [ ] BullMQ sync scheduler: setiap 5 menit per connector
- [ ] Sync hasil → connector_holdings table
- [ ] Error handling: retry logic, dead letter queue untuk permanent failures
- [ ] Connector Health Monitoring: probe setiap 1 menit untuk Tier 1

**Minggu 3-5: Manual Asset Engine**

- [ ] CRUD API untuk manual assets (semua kategori)
- [ ] Currency Wallet CRUD
- [ ] Currency rate fetching + caching + konversi ke IDR
- [ ] Duplikasi detection logic
- [ ] Input validation strict (Zod)

**Minggu 4-6: Portfolio Engine**

- [ ] Kalkulasi net worth total (crypto connector + manual + currency)
- [ ] Kalkulasi P/L unrealized
- [ ] Breakdown per kategori
- [ ] Data quality score
- [ ] Portfolio snapshot: simpan setiap jam ke portfolio_snapshots
- [ ] Portfolio history API
- [ ] Event-driven recalculation: saat sync selesai atau harga berubah signifikan

**Minggu 5-8: Frontend (Web App)**

- [ ] Stack: React (atau Next.js) + TypeScript + Tailwind CSS
- [ ] Authentication pages: Login, Register, Email verification, Password reset
- [ ] Dashboard utama: net worth, breakdown, asset list
- [ ] Add Connector flow (step-by-step wizard)
- [ ] Manual Asset pages: list, add, edit, delete
- [ ] Currency Wallet pages
- [ ] Connector management: list, health status, remove
- [ ] MFA setup flow (TOTP)
- [ ] Responsive design: mobile (320px+) dan desktop (1280px+)
- [ ] Data freshness indicators di setiap angka

**Minggu 7-9: Notification Service**

- [ ] Email notifications: via SendGrid
- [ ] Event consumers: connector sync failed, approaching quota limit
- [ ] Email templates: welcome, sync failed, security alerts
- [ ] Notification preferences page

**Minggu 9-11: Testing & Hardening**

- [ ] Unit tests: >70% coverage untuk business logic
- [ ] Integration tests: semua API endpoints
- [ ] E2E tests: critical user flows (register → add connector → lihat dashboard)
- [ ] Load test: simulasi 100 concurrent users
- [ ] Security review: manual code review untuk auth, vault, connector flows
- [ ] Community Connector disclaimer implementation
- [ ] Pentest awal (scope: auth + connector flows, bukan full pentest)

**Minggu 11-12: Launch Preparation**

- [ ] Final legal review ToS + Privacy Policy
- [ ] Staging → Production deploy
- [ ] Connector Health Dashboard publik live (`status.jobenconnect.id`)
- [ ] Onboarding: email welcome flow, tooltip onboarding di app
- [ ] Analytics dasar: pageview, conversion funnel (register → add connector → view dashboard)

**Exit Criteria Phase 1:**
✅ User bisa daftar, login, MFA  
✅ User bisa hubungkan Binance/Bybit/Indodax  
✅ User bisa input emas dan saham manual  
✅ User bisa lihat total net worth yang akurat dengan breakdown  
✅ Currency wallet berfungsi (input USD/SGD → auto konversi ke IDR)  
✅ Data freshness indicator terlihat di setiap angka  
✅ Retensi mingguan terukur: >40% dari user Phase 1 kembali minggu berikutnya  
✅ Tidak ada critical security issue dari pentest

---

## 10.3 Phase 2 — Developer Platform + Billing

**Durasi:** 10-12 minggu setelah Phase 1  
**Tim:** 2 Backend, 1 Frontend, 1 Product/Design (untuk billing UI), 1 QA

### Goals

Monetisasi dimulai. Developer bisa pakai API. Billing berjalan penuh.

### Deliverables

**Minggu 1-4: Billing/Subscription Service**

- [ ] Plan management (CRUD untuk admin)
- [ ] Subscription lifecycle (create, upgrade, downgrade, cancel)
- [ ] Midtrans integration: payment, recurring, webhook
- [ ] Invoice generation (PDF)
- [ ] Usage metering (Redis counter + DB sync)
- [ ] Quota enforcement middleware di API Gateway
- [ ] Plan override system untuk admin
- [ ] Billing page frontend: usage meter, invoice history, upgrade flow
- [ ] Downgrade flow dengan conflict resolution (pilih connector yang dipertahankan)
- [ ] Email notifikasi billing: invoice baru, payment failed, renewal reminder

**Minggu 3-6: Public API v1**

- [ ] OAuth2 Authorization Server (client credentials + auth code flow)
- [ ] API key management (generate, rotate, revoke)
- [ ] Sandbox environment (isolated dari production data)
- [ ] API endpoints v1 (portfolio, assets, prices — sesuai spec Bagian 8.10)
- [ ] Rate limiting per API key
- [ ] API quota tracking (hourly + daily)
- [ ] Response format standardization
- [ ] API documentation: OpenAPI 3.0 spec + developer docs site

**Minggu 5-8: Developer Platform**

- [ ] Developer dashboard (`developer.jobenconnect.id`)
- [ ] OAuth2 App management: buat, edit, delete apps
- [ ] API key management UI
- [ ] Usage analytics: berapa call per hari, error rate
- [ ] Sandbox testing environment
- [ ] Webhook management: add, test, view delivery logs
- [ ] SDK JavaScript/TypeScript (thin wrapper atas REST API)
- [ ] SDK Python (thin wrapper)

**Minggu 7-9: Connector Marketplace Foundation**

- [ ] Connector Registry: database daftar semua connector yang tersedia
- [ ] Marketplace UI: browse connector, filter, search
- [ ] Connector submission process (GitHub PR flow)
- [ ] Review dan approval workflow (admin)
- [ ] Connector versioning
- [ ] Tier 3 connector deployment pipeline

**Minggu 9-11: Testing & Launch**

- [ ] Billing integration test end-to-end (sign up → upgrade → charge → invoice)
- [ ] API v1 testing: semua endpoint, error cases, rate limiting
- [ ] Security review: OAuth2 implementation, API key storage
- [ ] Pentest kedua: scope termasuk billing dan public API
- [ ] Webhook testing: delivery, retry, signature validation

**Exit Criteria Phase 2:**
✅ Minimal 1 user upgrade dari Free ke tier berbayar  
✅ Billing cycle berjalan penuh (charge → invoice → renewal) tanpa intervensi manual  
✅ Minimal 1 developer eksternal berhasil integrate dengan Public API  
✅ Connector marketplace punya minimal 5 connector (internal + community)

---

## 10.4 Phase 3 — Ekspansi Kategori + Risk Engine

**Durasi:** 14-16 minggu setelah Phase 2  
**Tim:** 2 Backend, 1 Backend tambahan (kategori baru), 1 Frontend, 1 QA

### Goals

Lebih banyak kategori aset. Risk engine ringan. Connector lebih banyak.

### Deliverables

**Kategori Baru:**

- [ ] Reksa Dana: CRUD manual entry, integrasi NAB dari Bareksa/KSEI
- [ ] Emas Fisik: CRUD dengan satuan gram, harga Antam/Pegadaian
- [ ] Properti: CRUD manual entry, input estimasi harga pasar manual (update berkala)
- [ ] Saham Foreign (manual): input jumlah lot + harga dalam USD/SGD, auto konversi IDR

**Connector Baru:**

- [ ] OKX (Tier 1 crypto)
- [ ] Tokocrypto (Tier 1 — Indonesia)
- [ ] Pintu (Tier 1 — Indonesia)
- [ ] Gate.io (Tier 2 crypto)
- [ ] Solana wallet address (via Moralis — on-chain)
- [ ] BNB Chain address (via Moralis — on-chain)
- [ ] 2-3 connector saham IDX (tergantung API availability — Partnership negosiasi)

**Risk Engine v1:**

- [ ] Concentration Risk: detect aset tunggal >30% portfolio, tampilkan warning
- [ ] Category Allocation view: breakdown % vs target yang user set
- [ ] Volatility Indicator: perubahan net worth 30 hari
- [ ] Risk Dashboard section di portfolio
- [ ] Data untuk Risk Engine: ambil dari portfolio_snapshots (tidak ada model ML)

**AI Agent Readiness (Foundation):**

- [ ] API response sudah structured dan semantic (setiap field punya meaning yang jelas)
- [ ] Permission scoping untuk agent access (sub-scope dari oauth)
- [ ] Documentation: "Menggunakan Joben Connect dengan AI Agent" (panduan untuk developer)
- [ ] Rate limiting yang berbeda untuk agent access vs human access

**Compliance:**

- [ ] Full UU PDP compliance audit oleh konsultan eksternal
- [ ] Data processing agreements untuk semua provider pihak ketiga
- [ ] Pentest independen #3 (full scope)
- [ ] Bug bounty program launch (HackerOne/Bugcrowd)

**Exit Criteria Phase 3:**
✅ User aktif menggunakan minimal 2 kategori baru (bukan hanya tersedia tapi tidak dipakai)  
✅ Risk Engine menampilkan data yang akurat  
✅ Compliance audit selesai tanpa critical findings  
✅ Bug bounty berjalan, minimal 5 valid submissions dalam bulan pertama

---

## 10.5 Phase 4 — Marketplace + Scale + Agent Access

**Durasi:** 20-24 minggu setelah Phase 3  
**Tim:** 3 Backend (termasuk 1 platform engineer), 1 Frontend, 1 Security Engineer, 1 QA

**Syarat masuk Phase 4:** Revenue B2B awal sudah tervalidasi, ada demand nyata untuk Business tier dan Developer Marketplace.

### Deliverables

**Connector Marketplace Matang:**

- [ ] SDK publik untuk third-party connector builders
- [ ] Connector sandbox: Docker container per execution (terisolasi)
- [ ] Automated security review pipeline untuk connector submissions
- [ ] Revenue share system (billing untuk connector premium)
- [ ] Connector analytics: berapa user pakai, uptime, error rate
- [ ] Program sertifikasi connector (Tier 2 upgrade path)

**Business Tier:**

- [ ] Multi-user workspace dengan RBAC
- [ ] Workspace management: invite, roles, permissions
- [ ] Audit log export (CSV/JSON untuk compliance B2B)
- [ ] SLA monitoring dashboard untuk Business customer
- [ ] Dedicated support flow

**AI Agent Access (MCP-style):**

- [ ] MCP-compatible tool interface untuk portfolio data
- [ ] Consent flow untuk agent access: granular permission per data type
- [ ] Agent access audit trail (log setiap akses agent)
- [ ] Token scope yang spesifik untuk agent (lebih restricted dari human)
- [ ] Developer documentation: cara integrasi dengan Claude, GPT, agent frameworks
- [ ] Rate limiting yang dioptimasi untuk agent pattern (batch request vs conversational)

**Scale & Performance:**

- [ ] Database sharding strategy (jika diperlukan)
- [ ] CDN optimization untuk dashboard
- [ ] Auto-scaling untuk Connector Service (padat saat market open)
- [ ] SOC 2 Type I preparation

**Exit Criteria Phase 4:**
✅ Minimal 1 connector pihak ketiga live di marketplace dari luar tim internal  
✅ Minimal 1 Business tier customer aktif  
✅ AI agent bisa mengakses portfolio data via MCP-style interface  
✅ SOC 2 Type I audit dimulai

---

## 10.6 Fase 5+ — Post-Scale (10-Tahun Horizon)

Fase ini tidak direncanakan detail sekarang — terlalu banyak yang berubah. Yang perlu **dirancang sekarang** adalah fondasi yang tidak menghalangi pilihan Fase 5+:

**Potensi arah Fase 5+:**

1. **Internasionalisasi SEA** — Malaysia, Thailand, Vietnam, Filipina. Ini butuh: multi-currency base (bukan hanya IDR), lokalisasi UI, partnership dengan exchange/broker lokal masing-masing negara.

2. **Bank/Rekening Integration** — Melalui SNAP BI jika regulasi sudah jelas. Ini product initiative terpisah dengan compliance pathway tersendiri.

3. **Data Intelligence** — Anonymized aggregate data insights untuk institusi keuangan. "Berapa persen investor Indonesia yang hold BTC lebih dari 1 tahun?" Ini potensi revenue stream baru — dengan consent ketat dari user.

4. **Embedded Finance** — API yang memungkinkan aplikasi lain embed portfolio view Joben Connect langsung di dalam app mereka (white-label component).

5. **Enterprise/Private Deployment** — Untuk bank atau wealth manager yang ingin deployment sendiri. Ini cloud-agnostic architecture dari awal penting.

**Yang harus dijaga agar Fase 5+ tidak mahal:**
- API versioning yang bersih (tidak ada breaking changes tanpa notice panjang)
- Database schema yang extensible (no rigidly coupled assumptions)
- Multi-currency dari awal (IDR-centric tapi tidak IDR-only)
- i18n-ready UI dari awal (string dalam resource file, bukan hardcode)

## 10.7 Dependency Map Antar Fase

```
Phase 0 ──────────────────────────────────────────────────────┐
  └── Auth, Infra, Legal baseline (BLOCKER untuk semua fase)   │
                                                               │
Phase 1 ──────────────── (Needs Phase 0) ─────────────────────┤
  └── Connector crypto + manual asset + portfolio view         │
      (BLOCKER untuk Phase 2 — perlu user aktif dulu)         │
                                                               │
Phase 2 ──────────────── (Needs Phase 1) ─────────────────────┤
  └── Billing + Public API                                     │
      (BLOCKER untuk Phase 4 Business tier)                    │
      (ENABLES: developer ecosystem tumbuh)                    │
                                                               │
Phase 3 ──────────────── (Needs Phase 1) ─────────────────────┤
  ├── Dapat dimulai paralel dengan Phase 2 (kategori baru)     │
  └── Risk engine needs portfolio engine dari Phase 1          │
                                                               │
Phase 4 ──────────────── (Needs Phase 2 + Phase 3) ───────────┘
  └── Marketplace, Agent Access, Business tier
```

## 10.8 Tim per Fase

### Phase 0 (2 bulan)

| Role | Jumlah | Deskripsi |
|---|---|---|
| Backend Lead | 1 | Architect + implementor utama |
| DevOps/Infra | 1 | Cloud setup, CI/CD, security infra |
| Legal Advisor | Part-time | 1-2 hari/minggu, konsultan |

### Phase 1 (3 bulan)

| Role | Jumlah | Deskripsi |
|---|---|---|
| Backend Engineer | 2 | Service implementation |
| Frontend Engineer | 1 | Web app |
| QA Engineer | 1 | Testing (bisa merangkap backend light work) |

### Phase 2 (3 bulan)

| Role | Jumlah | Deskripsi |
|---|---|---|
| Backend Engineer | 2 | Billing service, Public API |
| Frontend Engineer | 1 | Billing UI, Developer Dashboard |
| Product/Design | 1 | UX untuk billing, developer onboarding |
| QA Engineer | 1 | |

### Phase 3 (4 bulan)

| Role | Jumlah | Deskripsi |
|---|---|---|
| Backend Engineer | 3 | +1 untuk kategori baru |
| Frontend Engineer | 1 | |
| QA Engineer | 1 | |

### Phase 4 (6 bulan)

| Role | Jumlah | Deskripsi |
|---|---|---|
| Backend Engineer | 3 | +1 platform engineer |
| Frontend Engineer | 2 | Marketplace UI, Business tier |
| Security Engineer | 1 | Marketplace security, SOC 2 |
| QA Engineer | 1 | |
| Product Manager | 1 | Full-time PM (justified di fase ini) |

---

# BAGIAN 11 — AI & AGENT READINESS

## 11.1 Mengapa Ini Penting untuk 10 Tahun

Pada 2026, AI assistant sudah mulai dipakai untuk berbagai tugas keuangan personal. Dalam 5-10 tahun ke depan, kemungkinan besar sebagian besar "consumption" data finansial personal akan terjadi lewat AI agent, bukan melalui UI langsung.

Bayangkan:
- User bertanya ke Claude/ChatGPT: "Berapa total kripto saya hari ini?"
- AI agent mengakses Joben Connect API (dengan consent user)
- AI menjawab: "BTC kamu di Binance senilai Rp 325 juta, plus ETH Rp 115 juta. Total kripto Rp 440 juta."

Atau yang lebih kompleks:
- "Berapa unrealized P/L portofolio saya bulan ini?"
- "Aset mana yang paling besar nilainya sekarang?"
- "Persiapkan laporan portofolio untuk tax consultant saya"

**Platform yang tidak siap untuk ini akan tertinggal.** Yang perlu dilakukan sekarang adalah **mendesain dengan benar**, bukan harus mengimplementasikan MCP sekarang.

## 11.2 Desain API yang Agent-Compatible

### Prinsip

API yang agent-compatible sebenarnya adalah API yang well-designed secara umum:

1. **Semantic naming** — Field names harus jelas artinya tanpa dokumentasi tambahan
2. **Consistent response shapes** — Agent tidak suka surprise di format response
3. **Machine-readable errors** — Error codes yang konsisten dan bisa di-handle programatically
4. **Pagination yang predictable** — Cursor-based pagination lebih baik daripada offset
5. **Timestamps yang selalu ada** — Agent perlu tahu data ini fresh atau tidak
6. **Units yang eksplisit** — Bukan hanya `amount: 5000`, tapi `amount_idr: 5000000` atau `amount: {value: 5000, currency: "USD"}`

### Contoh: Response yang Agent-Friendly

```json
// GET /v1/portfolio — response yang agent-friendly
{
  "success": true,
  "data": {
    "net_worth": {
      "amount": "1234567890",
      "currency": "IDR",
      "as_of": "2026-08-01T10:00:00Z",
      "data_quality": {
        "score": 95,
        "connectors_online": 5,
        "connectors_total": 5,
        "oldest_data_age_minutes": 3
      }
    },
    "breakdown": [
      {
        "category": "CRYPTO",
        "category_label": "Kripto",
        "value_idr": "555677890",
        "allocation_percentage": "45.0",
        "asset_count": 3
      },
      ...
    ],
    "unrealized_pl": {
      "amount_idr": "123456789",
      "percentage": "11.11",
      "note": "Hanya untuk aset yang memiliki harga beli tercatat"
    }
  }
}
```

Setiap angka disimpan sebagai **string** (bukan float) untuk menghindari floating-point imprecision yang bisa mengacaukan kalkulasi financial.

## 11.3 Scoped Consent untuk Agent Access

Ini adalah perbedaan terpenting antara akses human dan akses agent:

**Human access:** User sendiri yang menggunakan app. Consent sudah diberikan saat registrasi.

**Agent access:** Sebuah AI (Claude, GPT, agent custom) mengakses atas nama user. User harus:
1. Secara eksplisit menyadari bahwa AI ini akan punya akses ke data mereka
2. Memilih scope apa yang boleh diakses (tidak harus full access)
3. Bisa mencabut akses agent kapan saja dari settings

```
Consent screen saat user izinkan AI agent:

"[Nama AI App] ingin mengakses:"

● Portfolio net worth (read)
● Daftar aset dan nilai (read)
○ Riwayat transaksi (read) [tidak diminta]
○ Data profil lengkap [tidak diminta]
✗ Trade atau transaksi apapun [tidak pernah diizinkan]

"Data ini akan diakses setiap kali kamu bertanya kepada [Nama AI App].
Akses bisa dicabut kapan saja dari Settings > Aplikasi Terhubung."

[Izinkan] [Tolak]
```

## 11.4 MCP-style Interface (Phase 4)

MCP (Model Context Protocol, atau protocol sejenis) adalah cara standar AI agent mengakses tools dan data. Joben Connect di Phase 4 akan expose interface yang kompatibel:

```typescript
// Tools yang di-expose ke AI agent:

const jobenConnectTools = [
  {
    name: "get_portfolio_summary",
    description: "Ambil ringkasan portofolio user: total net worth, breakdown per kategori, dan P/L unrealized.",
    parameters: {
      currency: { type: "string", enum: ["IDR", "USD", "SGD"], default: "IDR" }
    }
  },
  {
    name: "get_asset_list",
    description: "Daftar semua aset milik user dengan nilai terkini.",
    parameters: {
      category: { type: "string", enum: ["CRYPTO", "STOCKS", "ALL"], default: "ALL" },
      sort_by: { type: "string", enum: ["value", "name", "change"], default: "value" }
    }
  },
  {
    name: "get_price",
    description: "Cek harga terkini untuk aset tertentu.",
    parameters: {
      identifier: { type: "string", description: "Ticker symbol, mis: BTC, BBCA, EMAS" }
    }
  },
  {
    name: "get_portfolio_history",
    description: "Lihat perubahan net worth dalam periode waktu tertentu.",
    parameters: {
      period: { type: "string", enum: ["7d", "30d", "90d", "1y"], default: "30d" }
    }
  }
];
```

## 11.5 Keamanan: Agent vs Human Access

Perbedaan penting dalam konteks keamanan:

| Aspek | Human Access | Agent Access |
|---|---|---|
| Scope | Full user scope | Hanya scope yang di-grant secara eksplisit |
| Rate limit | Higher (interactive use) | Lower (agent bisa overload jika tidak dibatasi) |
| Token lifetime | Refresh token 30 hari | Access token saja, 1 jam, tidak ada refresh |
| Audit log | Ya | Ya, dengan label "agent_access" |
| Data yang bisa diakses | Sesuai plan | Subset dari apa yang plan izinkan |
| Can create/modify data | Ya (sesuai permission) | Read-only ALWAYS untuk agent access |

**Prinsip untuk agent access: read-only by design.** Agent tidak pernah diizinkan untuk membuat, mengubah, atau menghapus data melalui akses ini — bahkan jika OAuth scope memungkinkannya secara teknis. Ini enforce di level middleware, bukan hanya di dokumentasi.

---

# BAGIAN 12 — SUCCESS METRICS & ANALYTICS

## 12.1 North Star Metric: AUA

**Assets Under Aggregation (AUA)** = Total nilai IDR dari semua aset yang diagregasi platform pada waktu tertentu.

Mengapa AUA sebagai North Star:
- Mengukur **nilai nyata** yang diberikan ke user, bukan hanya aktivitas
- Jujur ke investor dan regulator (konsisten dengan posisi "never hold money")
- Korelasi tinggi dengan retention: user yang punya banyak aset di platform cenderung tidak pergi
- Bisa di-benchmark dengan kompetitor secara meaningful

**Formula:**
```
AUA = Σ (nilai_idr dari semua aset semua user aktif pada snapshot terakhir)
```

*User aktif = user yang login dalam 30 hari terakhir*

## 12.2 Metrics per Fase

### Phase 1 Success Metrics

| Metric | Target | Cara Ukur |
|---|---|---|
| MAU (Monthly Active User) | 1.000 | Login dalam 30 hari |
| AUA | Rp 1 Triliun | Sum portfolio values |
| Connector Success Rate | >95% | Sync jobs succeeded / total |
| Weekly Retention | >40% | Cohort yang kembali W+1 |
| Net Worth Accuracy | User tidak report ketidakakuratan major | Support tickets |
| Time to First Portfolio | <10 menit | Registrasi → pertama lihat net worth |

### Phase 2 Success Metrics

| Metric | Target | Cara Ukur |
|---|---|---|
| Paid Conversion Rate | >5% | Paid users / total users |
| MRR | Rp 50 juta | Monthly Recurring Revenue |
| API DAU | >100 | Developer API daily active |
| Churn Rate | <5% per bulan | Cancelled subscriptions |
| Billing Cycle Automation | 100% | Invoice tergenerate tanpa intervensi |

### Phase 3 Success Metrics

| Metric | Target | Cara Ukur |
|---|---|---|
| MAU | 25.000 | |
| AUA | Rp 100 Triliun | |
| MRR | Rp 250 juta | |
| Categories Used per User | >2 rata-rata | Mix kategori per user |
| B2B API Customers | >10 | |

### Phase 4 Success Metrics

| Metric | Target | Cara Ukur |
|---|---|---|
| MAU | 100.000 | |
| AUA | Rp 1.000 Triliun | |
| MRR | Rp 1,5 miliar | |
| Third-party Connectors Live | >5 | Di marketplace |
| Business Tier Customers | >5 | |

## 12.3 Health Metrics Platform

Metrics yang diukur setiap hari untuk memastikan platform sehat:

| Metric | Target | Alert Threshold |
|---|---|---|
| API P99 Latency | <500ms | >1.000ms |
| API Error Rate | <0.1% | >1% |
| Sync Success Rate | >99% (Tier 1) | <95% |
| Price Data Freshness | >99% aset fresh | >5% stale |
| Vault Service Uptime | 99.99% | Setiap downtime |
| Database Connection Pool | <70% utilized | >90% |
| Queue Depth | <100 jobs pending | >500 |

## 12.4 Business Metrics

Metrics yang dilaporkan mingguan ke stakeholders:

- **ARR** (Annual Recurring Revenue): MRR × 12
- **LTV** (Lifetime Value) per cohort
- **CAC** (Customer Acquisition Cost) per channel
- **NPS** (Net Promoter Score): survey kuartalan
- **AUA Growth Rate**: MoM growth
- **API Usage Growth**: API calls MoM
- **Connector Reliability**: uptime per connector per bulan

## 12.5 Anti-Metrics (yang Tidak Diukur)

Hal-hal yang **tidak** dijadikan target utama karena bisa menyesatkan:

- **Pageviews / DAU tanpa konteks** — user yang buka app tapi tidak lihat data portfolio tidak memberikan nilai
- **Total registered users** — retention lebih penting dari registrasi
- **Jumlah connector tersedia** — kualitas dan reliability connector lebih penting dari kuantitas
- **Total API calls** — API calls tanpa converted value (active developer menggunakannya) tidak meaningful

---

# BAGIAN 13 — RISK REGISTER & MITIGASI

## 13.1 Risiko Regulasi

| Risiko | Probability | Impact | Mitigasi |
|---|---|---|---|
| OJK memerlukan izin untuk aggregator data finansial | Medium | High | Monitor regulasi, konsultasi rutin dengan advisor, siap adjust model bisnis |
| UU PDP dengan turunan yang lebih ketat dari perkiraan | Medium | Medium | Build lebih dari minimum compliance dari awal |
| Data residency requirement berubah (lebih ketat) | Low | Medium | Selalu gunakan provider Indonesia untuk data sensitif |
| Partner exchange/broker melanggar regulasi | Low | High | Due diligence sebelum integrasi, monitoring berita regulasi |
| SNAP BI scope diperluas ke aggregator (bukan hanya bank) | Low | Medium | Monitor perkembangan regulasi BI |

## 13.2 Risiko Teknis

| Risiko | Probability | Impact | Mitigasi |
|---|---|---|---|
| Exchange ganti API tanpa notice | High | Medium | Contract testing setiap 1 jam, monitoring otomatis, on-call engineer |
| Price provider down atau raise price drastis | Medium | High | Minimal 2 fallback per kategori, contract review tahunan |
| Database corruption atau data loss | Low | Critical | Daily backup, point-in-time recovery, regular restore test |
| Redis data loss (queue hilang) | Low | Medium | BullMQ idempotent job design, WAL-enabled Redis (RDB+AOF) |
| Credential vault compromised | Very Low | Critical | Envelope encryption, mTLS, least-privilege access, 24/7 monitoring |
| TimescaleDB performance degradation | Low | Medium | Retention policy (hapus data >2 tahun), regular VACUUM, read replica |

## 13.3 Risiko Bisnis

| Risiko | Probability | Impact | Mitigasi |
|---|---|---|---|
| Kompetitor global masuk (CoinStats, Kubera, dll) | Medium | Medium | Fokus moat lokal (broker IDX, connector lokal), move fast di differentiator |
| Churn tinggi setelah free trial habis | Medium | High | Free tier yang generous, value harus terasa sebelum paywall |
| Exchange IDX broker belum buka API resmi | High | Medium | Community Connector sebagai fallback, Partnership negosiasi aktif |
| Key person dependency (1 engineer tahu semua) | Medium | High | Dokumentasi wajib, code review yang melibatkan >1 orang untuk setiap service |
| Funding habis sebelum Phase 2 | Medium | Critical | Phase 1 harus bisa validate revenue potential, expense yang lean |

## 13.4 Risiko Keamanan

| Risiko | Probability | Impact | Mitigasi |
|---|---|---|---|
| Credential stuffing attack (mass login attempt) | High | Medium | Rate limiting ketat, CAPTCHA jika anomali, device fingerprinting |
| XSS via third-party script | Medium | High | CSP headers ketat, tidak muat script dari domain yang tidak terdaftar |
| Supply chain attack via npm package | Medium | High | Lockfile, npm audit di CI, dependency pinning |
| Phishing impersonating Joben Connect | Medium | Medium | User education, DMARC/DKIM untuk email, report phishing flow |
| Insider data access | Low | High | Least-privilege DB access, audit log semua akses admin ke data user |

## 13.5 Risiko Ekosistem (Provider Pihak Ketiga)

| Risiko | Probability | Impact | Mitigasi |
|---|---|---|---|
| CoinGecko raise price 10x | Low | High | 2 fallback provider, contract lock-in untuk price |
| RTI Business tutup atau stop service IDX | Low | High | Punya 1 fallback (IDX langsung), evaluasi provider alternatif rutin |
| Midtrans outage saat masa billing | Low | Medium | Xendit sebagai backup, retry logic, komunikasi ke user |
| AWS Jakarta region outage | Very Low | Critical | Multi-AZ deployment, disaster recovery plan |
| HashiCorp Vault pricing change (setelah BSL license) | Medium | Low | Evaluasi OpenBao (open-source fork) sebagai alternatif |

---

# BAGIAN 14 — OPEN QUESTIONS & KEPUTUSAN TERTUNDA

## Keputusan yang Sudah Diambil (Log)

| Tanggal | Keputusan | Alasan |
|---|---|---|
| Agu 2026 | Tidak ada koneksi rekening bank di Phase 1-4 | Compliance SNAP BI kompleks, bukan differentiator utama |
| Agu 2026 | Community Connector dengan disclaimer eksplisit diizinkan | Membantu user dengan broker tanpa API resmi, tapi user harus sadar risiko |
| Agu 2026 | Subscription sepenuhnya dikontrol backend | Fleksibilitas A/B test, custom deal, tanpa deploy |
| Agu 2026 | Stack: Node.js + Fastify + PostgreSQL + TimescaleDB + Redis | Proven, async-first, data residency Indonesia |
| Agu 2026 | Build vs Partner: broker lokal in-house, blockchain data via partner | Resource efficiency, focus on differentiator |
| Agu 2026 | Currency wallet input manual (bukan rekening) | Sederhana, tidak butuh banking license |

## Open Questions yang Perlu Dijawab Sebelum Phase 1 Launch

1. **Cloud provider final:** AWS vs GCP vs Alibaba Cloud untuk infrastructure Indonesia?

2. **Branding:** Nama domain, warna brand, logo — belum ada di PRD ini, perlu di-lock sebelum launch.

3. **Pricing final:** Rp 49rb/149rb/499rb adalah indikatif. Perlu market research (survey ke target user, benchmark kompetitor).

4. **MFA wajib atau opsional untuk login biasa?** PRD saat ini: MFA opsional untuk login biasa tapi wajib untuk aksi sensitif. Apakah ini sudah cukup, atau perlu MFA wajib untuk semua akun?

5. **Analytics provider:** Google Analytics vs Mixpanel vs Amplitude vs self-hosted (Plausible)? Pilihan ini mempengaruhi compliance UU PDP karena masing-masing punya data residency berbeda.

6. **Language support Phase 1:** Hanya Bahasa Indonesia, atau juga English? Indonesia-first sangat direkomendasikan untuk MVP.

7. **Mobile app di Phase berapa?** PRD ini hanya cover web app. Mobile app (React Native atau Flutter) butuh resource tambahan — di fase berapa ini masuk?

## Open Questions untuk Fase Berikutnya

8. **Kapan Partnership dengan broker IDX dimulai?** Negosiasi dengan Ajaib, Stockbit, dll butuh waktu lama — perlu mulai dari Phase 1 agar bisa launch di Phase 3.

9. **Data Intelligence revenue stream:** Apakah ada minat untuk memonetisasi agregat data anonim ke institusi keuangan? Ini perlu consent model yang lebih granular dari user.

10. **White-label API untuk wealth manager:** Beberapa wealth manager mungkin ingin embed Joben Connect di dalam platform mereka. Ini butuh arsitektur multi-tenant yang berbeda. Kapan ini dievaluasi?

11. **Crypto tax integration:** Apakah mau ada partnership dengan aplikasi pajak kripto (mis. Koinly) untuk eksport data transaksi? Ini could be a B2B revenue stream.

---

# APPENDIX A — GLOSSARY

| Term | Definisi |
|---|---|
| AUA | Assets Under Aggregation — total nilai aset yang diagregasi oleh platform |
| Connector | Integrasi otomatis ke exchange/broker untuk sync data aset |
| UDS | Universal Data Standard — format kanonik internal untuk data aset |
| Envelope Encryption | Skema enkripsi berlapis: data dienkripsi dengan data key, data key dienkripsi dengan master key |
| mTLS | Mutual TLS — kedua pihak dalam komunikasi saling verifikasi sertifikat |
| TOTP | Time-based One-Time Password — standar MFA berbasis waktu (Google Authenticator) |
| SNAP BI | Standar Nasional Open API Pembayaran dari Bank Indonesia |
| UU PDP | Undang-Undang Perlindungan Data Pribadi (UU No. 27/2022) |
| Tier 1/2/3 | Klasifikasi connector berdasarkan SLA dan kualitas |
| Community Connector | Connector tidak resmi dengan disclaimer eksplisit |
| BullMQ | Library job queue berbasis Redis untuk Node.js |
| TimescaleDB | Ekstensi PostgreSQL untuk data time-series |
| Rate Limit | Pembatasan jumlah request dalam periode waktu tertentu |
| Feature Flag | Toggle fitur yang dikontrol dari backend tanpa deploy |
| Contract Test | Test yang memverifikasi bahwa API pihak ketiga masih sesuai ekspektasi |

---

# APPENDIX B — DECISION LOG TEMPLATE

Setiap keputusan arsitektur atau produk yang signifikan harus dicatat:

```markdown
## [DECISION-XXX] Judul Keputusan

**Tanggal:** YYYY-MM-DD  
**Pengambil Keputusan:** Nama + role  
**Status:** ACCEPTED / SUPERSEDED / DEPRECATED

### Konteks
[Apa yang mendorong keputusan ini perlu dibuat?]

### Pilihan yang Dipertimbangkan
1. Pilihan A — Pro: ... Kontra: ...
2. Pilihan B — Pro: ... Kontra: ...

### Keputusan
[Pilihan mana yang dipilih dan mengapa]

### Konsekuensi
[Apa implikasi dari keputusan ini? Ada yang harus diubah di tempat lain?]

### Review Date
[Kapan keputusan ini perlu di-review ulang?]
```

---

# APPENDIX C — CONNECTOR DEVELOPMENT GUIDE (Ringkasan)

Panduan lengkap untuk tim yang membangun connector baru:

### Checklist Connector Baru

**Sebelum mulai:**
- [ ] Verifikasi API documentation tersedia dan up-to-date
- [ ] Test buat API key read-only di exchange target
- [ ] Identifikasi semua permission yang dibutuhkan (minimal)
- [ ] Identifikasi rate limit API target
- [ ] Tentukan tier connector (1/2/3/Community)

**Implementasi:**
- [ ] Implement `ConnectorInterface` TypeScript
- [ ] `validateCredentials()` — cek read-only permission
- [ ] `fetchHoldings()` — return `AssetHolding[]` dalam format UDS
- [ ] `healthCheck()` — tanpa credential, cek apakah API hidup
- [ ] Error handling untuk semua kemungkinan error (rate limit, invalid key, network error, dll)
- [ ] Retry logic dengan exponential backoff
- [ ] Rate limit respect (jangan exceed limit exchange)

**Testing:**
- [ ] Unit test untuk setiap method
- [ ] Contract test: verifikasi shape response API target
- [ ] Integration test dengan test account (jika tersedia)
- [ ] Test skenario error: invalid key, expired key, rate limit, timeout

**Documentation:**
- [ ] Connector manifest YAML
- [ ] Panduan setup untuk user (cara buat API key read-only)
- [ ] Known limitations
- [ ] Changelog

---

*Dokumen ini adalah living document. Setiap perubahan signifikan harus dicatat di Decision Log dan version history. Versi ini (1.0.0) adalah baseline untuk Phase 0–4.*

*Last updated: 1 Agustus 2026*
*Next review: Sebelum Phase 1 launch*
